import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import { INITIAL_VENDORS, INITIAL_CATEGORIES, HYDERABAD_NEIGHBORHOODS } from './src/data/mockVendors';
import { calculateDistanceKm } from './src/lib/supabase';

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // Memory store initialized with seed vendors
  let vendors = [...INITIAL_VENDORS];
  let categories = [...INITIAL_CATEGORIES];

  // 1. Health check
  app.get('/api/health', (req, res) => {
    res.json({
      status: 'ok',
      service: 'DialXprt Hyderabad Engine',
      timestamp: new Date().toISOString(),
      activeVendors: vendors.filter((v) => v.status === 'approved').length,
      pendingVerifications: vendors.filter((v) => v.status === 'pending').length,
    });
  });

  // 2. Fetch Nearby Vendors (PostGIS style search endpoint)
  app.get('/api/vendors', (req, res) => {
    const lat = parseFloat((req.query.lat as string) || '17.4483'); // Default Madhapur
    const lng = parseFloat((req.query.lng as string) || '78.3915');
    const category = ((req.query.category as string) || '').toLowerCase();
    const query = ((req.query.q as string) || '').toLowerCase();
    const includePending = req.query.includePending === 'true';

    let result = vendors.filter((v) => {
      if (!includePending && v.status !== 'approved') return false;
      if (category && category !== 'all' && v.categorySlug.toLowerCase() !== category) return false;
      if (query) {
        const matchesName = v.name.toLowerCase().includes(query);
        const matchesCat = v.category.toLowerCase().includes(query) || v.categorySlug.toLowerCase().includes(query);
        const matchesLoc = v.neighborhood.toLowerCase().includes(query) || v.address.toLowerCase().includes(query);
        return matchesName || matchesCat || matchesLoc;
      }
      return true;
    });

    // Calculate distance for each vendor
    const mapped = result
      .map((v) => {
        const dist = calculateDistanceKm(lat, lng, v.lat, v.lng);
        return { ...v, distanceKm: dist };
      })
      .sort((a, b) => a.distanceKm - b.distanceKm);

    res.json({
      success: true,
      count: mapped.length,
      userLocation: { lat, lng },
      data: mapped,
    });
  });

  // 3. Register Vendor Store Profile (Volunteer Verification Queue)
  app.post('/api/vendors/register', (req, res) => {
    const body = req.body;
    if (!body.name || !body.phone || !body.category) {
      res.status(400).json({ error: 'Missing required vendor details (Name, Phone, Category).' });
      return;
    }

    const slug = `${body.name.toLowerCase().replace(/[^a-z0-9]+/g, '-')}-${(body.neighborhood || 'hyderabad').toLowerCase()}-${Date.now().toString().slice(-4)}`;
    const newVendor = {
      id: `v-${Date.now()}`,
      slug,
      name: body.name,
      category: body.category,
      categorySlug: body.categorySlug || body.category.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      ownerName: body.ownerName || body.name,
      phone: body.phone,
      whatsapp: body.whatsapp || body.phone,
      address: body.address || 'Hyderabad',
      neighborhood: body.neighborhood || 'Madhapur',
      city: 'Hyderabad',
      pincode: body.pincode || '500081',
      lat: body.lat ? parseFloat(body.lat) : 17.4483,
      lng: body.lng ? parseFloat(body.lng) : 78.3915,
      imageUrl: body.imageUrl || 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&q=80&w=600',
      isVerified: false,
      status: 'pending' as const,
      rating: 4.8,
      reviewsCount: 1,
      description: body.description || '',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      viewsCount: 0,
      callsCount: 0,
      whatsappClicksCount: 0,
    };

    vendors.unshift(newVendor);

    res.json({
      success: true,
      message: 'Store registered successfully! Our volunteer will verify your physical store offline shortly.',
      vendor: newVendor,
    });
  });

  // 4. Update Vendor Status (Volunteer/Admin Action)
  app.put('/api/admin/vendors/:id/status', (req, res) => {
    const { id } = req.params;
    const { status, volunteerName, notes } = req.body;

    const vendorIndex = vendors.findIndex((v) => v.id === id || v.slug === id);
    if (vendorIndex === -1) {
      res.status(404).json({ error: 'Vendor not found.' });
      return;
    }

    vendors[vendorIndex] = {
      ...vendors[vendorIndex],
      status: status || 'approved',
      isVerified: status === 'approved',
      verifiedByVolunteer: volunteerName || 'Volunteer Admin',
      volunteerNotes: notes || 'Verified physical shop identity & contact numbers.',
      updatedAt: new Date().toISOString(),
    };

    res.json({
      success: true,
      message: `Store ${vendors[vendorIndex].name} is now ${status}!`,
      vendor: vendors[vendorIndex],
    });
  });

  // 5. CSV Export Endpoint
  app.get('/api/export/csv', (req, res) => {
    const headers = 'ID,Name,Category,Phone,Neighborhood,Status,Verified,Calls,WhatsAppClicks,CreatedAt\n';
    const rows = vendors
      .map(
        (v) =>
          `"${v.id}","${v.name.replace(/"/g, '""')}","${v.category}","${v.phone}","${v.neighborhood}","${v.status}","${v.isVerified}","${v.callsCount || 0}","${v.whatsappClicksCount || 0}","${v.createdAt}"`
      )
      .join('\n');

    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename=dialxprt-vendors-report.csv');
    res.send(headers + rows);
  });

  // Vite development middleware vs production bundle
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);

    // Fallback for SPA routing in dev mode
    app.use('*', async (req, res, next) => {
      try {
        const fs = await import('fs');
        let template = fs.readFileSync(path.resolve(process.cwd(), 'index.html'), 'utf-8');
        template = await vite.transformIndexHtml(req.originalUrl, template);
        res.status(200).set({ 'Content-Type': 'text/html' }).end(template);
      } catch (e: any) {
        vite.ssrFixStacktrace(e);
        next(e);
      }
    });
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 DialXprt Hyderabad Full-Stack Engine active on http://0.0.0.0:${PORT}`);
  });
}

startServer();
