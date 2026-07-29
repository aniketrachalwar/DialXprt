import React, { useState } from 'react';
import { ShieldCheck, CheckCircle, XCircle, Phone, MessageSquare, Download, FileText, Database, Users, Eye, BarChart2, Filter, Search, MapPin, RefreshCw } from 'lucide-react';
import { Vendor, VendorStatus, UserRole } from '../types';

interface VolunteerAdminDashboardProps {
  vendors: Vendor[];
  onUpdateStatus: (vendorId: string, status: VendorStatus, volunteerName: string, notes: string) => void;
  onRefreshData: () => void;
  currentRole: UserRole;
  onExportCSV: () => void;
}

export const VolunteerAdminDashboard: React.FC<VolunteerAdminDashboardProps> = ({
  vendors,
  onUpdateStatus,
  onRefreshData,
  currentRole,
  onExportCSV,
}) => {
  const [activeTab, setActiveTab] = useState<'pending' | 'all' | 'analytics' | 'sql'>('pending');
  const [volunteerName, setVolunteerName] = useState('Volunteer Aniket');
  const [notesInput, setNotesInput] = useState<Record<string, string>>({});
  const [searchFilter, setSearchFilter] = useState('');

  const pendingVendors = vendors.filter((v) => v.status === 'pending');
  const approvedVendors = vendors.filter((v) => v.status === 'approved');
  const rejectedVendors = vendors.filter((v) => v.status === 'rejected');

  const totalCalls = vendors.reduce((acc, curr) => acc + (curr.callsCount || 0), 0);
  const totalWhatsApp = vendors.reduce((acc, curr) => acc + (curr.whatsappClicksCount || 0), 0);
  const totalViews = vendors.reduce((acc, curr) => acc + (curr.viewsCount || 0), 0);

  const handleNoteChange = (id: string, text: string) => {
    setNotesInput((prev) => ({ ...prev, [id]: text }));
  };

  const filteredAllVendors = vendors.filter((v) => {
    if (!searchFilter) return true;
    const q = searchFilter.toLowerCase();
    return (
      v.name.toLowerCase().includes(q) ||
      v.category.toLowerCase().includes(q) ||
      v.neighborhood.toLowerCase().includes(q) ||
      v.phone.includes(q)
    );
  });

  const handlePrintPDF = () => {
    window.print();
  };

  return (
    <div className="max-w-7xl mx-auto px-3 sm:px-6 py-6 space-y-6">
      {/* Dashboard Top Header */}
      <div className="bg-gradient-to-r from-[#0F5C5C] to-indigo-900 text-white rounded-2xl p-4 sm:p-6 shadow-lg flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="bg-emerald-500 text-gray-900 text-xs font-black px-2.5 py-0.5 rounded-full uppercase tracking-wider">
              Offline Verification Portal
            </span>
            <span className="text-xs text-indigo-200">Hyderabad Field District</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-black mt-1">
            DialXprt Volunteer & Admin Dashboard
          </h1>
          <p className="text-xs sm:text-sm text-indigo-200 mt-0.5">
            Offline store verification, merchant onboarding approval & platform analytics
          </p>
        </div>

        {/* Top Action Controls */}
        <div className="flex items-center gap-2 w-full md:w-auto">
          <button
            onClick={onRefreshData}
            className="flex-1 md:flex-none bg-indigo-800 hover:bg-indigo-700 text-white text-xs font-bold px-3 py-2.5 rounded-xl flex items-center justify-center gap-1.5 transition-colors border border-indigo-500/30 min-h-[44px]"
          >
            <RefreshCw className="w-4 h-4 text-emerald-400" />
            <span>Sync Live</span>
          </button>

          <button
            onClick={onExportCSV}
            className="flex-1 md:flex-none bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold px-3 py-2.5 rounded-xl flex items-center justify-center gap-1.5 transition-colors shadow min-h-[44px]"
          >
            <Download className="w-4 h-4" />
            <span>Export CSV</span>
          </button>

          <button
            onClick={handlePrintPDF}
            className="flex-1 md:flex-none bg-[#F57C00] hover:bg-orange-600 text-white text-xs font-bold px-3 py-2.5 rounded-xl flex items-center justify-center gap-1.5 transition-colors shadow min-h-[44px]"
          >
            <FileText className="w-4 h-4" />
            <span>Print PDF</span>
          </button>
        </div>
      </div>

      {/* Analytics Counter Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
        <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm flex flex-col justify-between">
          <span className="text-xs font-semibold text-gray-500">Pending Review</span>
          <div className="flex items-baseline justify-between mt-1">
            <span className="text-2xl font-black text-amber-600">{pendingVendors.length}</span>
            <span className="text-[10px] bg-amber-100 text-amber-800 px-1.5 py-0.5 rounded font-bold">Action Needed</span>
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm flex flex-col justify-between">
          <span className="text-xs font-semibold text-gray-500">Verified Live Stores</span>
          <div className="flex items-baseline justify-between mt-1">
            <span className="text-2xl font-black text-emerald-600">{approvedVendors.length}</span>
            <span className="text-[10px] bg-emerald-100 text-emerald-800 px-1.5 py-0.5 rounded font-bold">Live</span>
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm flex flex-col justify-between">
          <span className="text-xs font-semibold text-gray-500">Phone Calls Leads</span>
          <div className="flex items-baseline justify-between mt-1">
            <span className="text-2xl font-black text-[#0F5C5C]">{totalCalls}</span>
            <span className="text-[10px] bg-indigo-100 text-[#0F5C5C] px-1.5 py-0.5 rounded font-bold">Direct Taps</span>
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm flex flex-col justify-between">
          <span className="text-xs font-semibold text-gray-500">WhatsApp Leads</span>
          <div className="flex items-baseline justify-between mt-1">
            <span className="text-2xl font-black text-[#25D366]">{totalWhatsApp}</span>
            <span className="text-[10px] bg-green-100 text-green-800 px-1.5 py-0.5 rounded font-bold">Chat Taps</span>
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm flex flex-col justify-between col-span-2 sm:col-span-1">
          <span className="text-xs font-semibold text-gray-500">Total Profile Views</span>
          <div className="flex items-baseline justify-between mt-1">
            <span className="text-2xl font-black text-gray-900">{totalViews}</span>
            <span className="text-[10px] bg-gray-100 text-gray-700 px-1.5 py-0.5 rounded font-bold">Impressions</span>
          </div>
        </div>
      </div>

      {/* Tabs Bar */}
      <div className="flex items-center gap-2 border-b border-gray-200 overflow-x-auto pb-1">
        <button
          onClick={() => setActiveTab('pending')}
          className={`px-4 py-2.5 font-bold text-xs sm:text-sm rounded-t-xl transition-all flex items-center gap-2 shrink-0 border-b-2 min-h-[44px] ${
            activeTab === 'pending'
              ? 'border-[#F57C00] text-[#0F5C5C] bg-indigo-50/50'
              : 'border-transparent text-gray-500 hover:text-gray-900'
          }`}
        >
          <ShieldCheck className="w-4 h-4 text-[#F57C00]" />
          <span>Pending Offline Verifications</span>
          <span className="bg-amber-500 text-gray-900 text-xs px-2 py-0.2 rounded-full font-black">
            {pendingVendors.length}
          </span>
        </button>

        <button
          onClick={() => setActiveTab('all')}
          className={`px-4 py-2.5 font-bold text-xs sm:text-sm rounded-t-xl transition-all flex items-center gap-2 shrink-0 border-b-2 min-h-[44px] ${
            activeTab === 'all'
              ? 'border-[#0F5C5C] text-[#0F5C5C] bg-indigo-50/50'
              : 'border-transparent text-gray-500 hover:text-gray-900'
          }`}
        >
          <Users className="w-4 h-4 text-[#0F5C5C]" />
          <span>All Vendor Directory ({vendors.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('analytics')}
          className={`px-4 py-2.5 font-bold text-xs sm:text-sm rounded-t-xl transition-all flex items-center gap-2 shrink-0 border-b-2 min-h-[44px] ${
            activeTab === 'analytics'
              ? 'border-[#0F5C5C] text-[#0F5C5C] bg-indigo-50/50'
              : 'border-transparent text-gray-500 hover:text-gray-900'
          }`}
        >
          <BarChart2 className="w-4 h-4 text-emerald-600" />
          <span>Real-Time Reports</span>
        </button>

        <button
          onClick={() => setActiveTab('sql')}
          className={`px-4 py-2.5 font-bold text-xs sm:text-sm rounded-t-xl transition-all flex items-center gap-2 shrink-0 border-b-2 min-h-[44px] ${
            activeTab === 'sql'
              ? 'border-[#0F5C5C] text-[#0F5C5C] bg-indigo-50/50'
              : 'border-transparent text-gray-500 hover:text-gray-900'
          }`}
        >
          <Database className="w-4 h-4 text-purple-600" />
          <span>PostGIS SQL Setup</span>
        </button>
      </div>

      {/* TAB 1: PENDING VERIFICATION QUEUE */}
      {activeTab === 'pending' && (
        <div className="space-y-4">
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-3.5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs text-amber-900">
            <div>
              <p className="font-bold text-sm">Offline Store Verification Protocol:</p>
              <p className="text-amber-800 mt-0.5">
                Volunteers call the shopkeeper or visit physical address in Hyderabad to verify Aadhaar/GST & store board before approving.
              </p>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <label className="font-bold text-gray-700 text-xs">Volunteer Badge Name:</label>
              <input
                type="text"
                value={volunteerName}
                onChange={(e) => setVolunteerName(e.target.value)}
                className="bg-white border border-amber-300 px-2 py-1 rounded text-xs font-semibold text-gray-900"
              />
            </div>
          </div>

          {pendingVendors.length === 0 ? (
            <div className="bg-white border border-gray-200 rounded-2xl p-8 text-center space-y-2">
              <CheckCircle className="w-12 h-12 text-emerald-500 mx-auto" />
              <h3 className="text-base font-bold text-gray-900">All Stores Verified!</h3>
              <p className="text-xs text-gray-500">There are no pending vendor registrations in the verification queue right now.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {pendingVendors.map((vendor) => (
                <div key={vendor.id} className="bg-white border border-amber-200 rounded-2xl p-4 shadow-sm space-y-3">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex gap-3">
                      <img
                        src={vendor.imageUrl}
                        alt={vendor.name}
                        className="w-16 h-16 rounded-xl object-cover shrink-0 border"
                      />
                      <div>
                        <span className="bg-amber-100 text-amber-800 text-[10px] font-extrabold px-2 py-0.5 rounded">
                          PENDING VERIFICATION
                        </span>
                        <h3 className="font-bold text-gray-900 text-base leading-tight mt-1">
                          {vendor.name}
                        </h3>
                        <p className="text-xs text-gray-600 font-medium">
                          {vendor.category} • Owner: <span className="font-semibold text-gray-900">{vendor.ownerName}</span>
                        </p>
                        <p className="text-xs text-gray-500 flex items-center gap-1 mt-0.5">
                          <MapPin className="w-3.5 h-3.5 text-gray-400" />
                          <span>{vendor.address}</span>
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-gray-50 rounded-xl p-2.5 text-xs space-y-1">
                    <p className="text-gray-700">
                      <strong>Submitted Phone:</strong> {vendor.phone}
                    </p>
                    <p className="text-gray-700">
                      <strong>WhatsApp:</strong> {vendor.whatsapp}
                    </p>
                    {vendor.description && (
                      <p className="text-gray-600 italic">"{vendor.description}"</p>
                    )}
                  </div>

                  {/* Verification Notes Input */}
                  <div>
                    <label className="block text-[11px] font-bold text-gray-700 mb-1">
                      Volunteer Verification Notes (Field Visit / Call outcome):
                    </label>
                    <input
                      type="text"
                      value={notesInput[vendor.id] || ''}
                      onChange={(e) => handleNoteChange(vendor.id, e.target.value)}
                      placeholder="e.g. Called shop owner. Confirmed location in Madhapur."
                      className="w-full text-xs border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-[#0F5C5C] focus:outline-none"
                    />
                  </div>

                  {/* Verification Call & Approval Action Buttons */}
                  <div className="grid grid-cols-3 gap-2 pt-1">
                    <a
                      href={`tel:+91${vendor.phone}`}
                      className="bg-indigo-50 hover:bg-indigo-100 text-[#0F5C5C] font-bold py-2 px-2 rounded-xl text-xs flex items-center justify-center gap-1 border border-indigo-200"
                    >
                      <Phone className="w-3.5 h-3.5" />
                      <span>Call Owner</span>
                    </a>

                    <button
                      onClick={() =>
                        onUpdateStatus(
                          vendor.id,
                          'approved',
                          volunteerName,
                          notesInput[vendor.id] || 'Verified store details via phone/offline check.'
                        )
                      }
                      className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-2 px-2 rounded-xl text-xs flex items-center justify-center gap-1 shadow"
                    >
                      <CheckCircle className="w-3.5 h-3.5" />
                      <span>Approve & Live</span>
                    </button>

                    <button
                      onClick={() =>
                        onUpdateStatus(
                          vendor.id,
                          'rejected',
                          volunteerName,
                          notesInput[vendor.id] || 'Store details unverified or invalid number.'
                        )
                      }
                      className="bg-red-50 hover:bg-red-100 text-red-700 font-bold py-2 px-2 rounded-xl text-xs flex items-center justify-center gap-1 border border-red-200"
                    >
                      <XCircle className="w-3.5 h-3.5" />
                      <span>Reject</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* TAB 2: ALL VENDOR DIRECTORY TABLE */}
      {activeTab === 'all' && (
        <div className="bg-white border border-gray-200 rounded-2xl p-4 shadow-sm space-y-4">
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
              <input
                type="text"
                value={searchFilter}
                onChange={(e) => setSearchFilter(e.target.value)}
                placeholder="Search by name, phone, neighborhood..."
                className="w-full pl-9 pr-3 py-2 text-xs border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#0F5C5C] focus:outline-none min-h-[40px]"
              />
            </div>
            <span className="text-xs font-semibold text-gray-500">
              Showing {filteredAllVendors.length} of {vendors.length} vendors
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-gray-50 text-gray-700 font-bold border-b border-gray-200">
                  <th className="p-2.5">Store & Owner</th>
                  <th className="p-2.5">Category</th>
                  <th className="p-2.5">Phone / WA</th>
                  <th className="p-2.5">Neighborhood</th>
                  <th className="p-2.5">Status</th>
                  <th className="p-2.5 text-center">Calls</th>
                  <th className="p-2.5 text-center">WA Taps</th>
                  <th className="p-2.5">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredAllVendors.map((v) => (
                  <tr key={v.id} className="hover:bg-gray-50 transition-colors">
                    <td className="p-2.5">
                      <div className="font-bold text-gray-900">{v.name}</div>
                      <div className="text-[11px] text-gray-500">{v.ownerName}</div>
                    </td>
                    <td className="p-2.5 font-medium text-gray-700">{v.category}</td>
                    <td className="p-2.5 font-semibold text-[#0F5C5C]">{v.phone}</td>
                    <td className="p-2.5 text-gray-600">{v.neighborhood}</td>
                    <td className="p-2.5">
                      {v.status === 'approved' ? (
                        <span className="bg-emerald-100 text-emerald-800 text-[10px] font-extrabold px-2 py-0.5 rounded-full">
                          APPROVED
                        </span>
                      ) : v.status === 'pending' ? (
                        <span className="bg-amber-100 text-amber-800 text-[10px] font-extrabold px-2 py-0.5 rounded-full">
                          PENDING
                        </span>
                      ) : (
                        <span className="bg-red-100 text-red-800 text-[10px] font-extrabold px-2 py-0.5 rounded-full">
                          REJECTED
                        </span>
                      )}
                    </td>
                    <td className="p-2.5 text-center font-bold text-gray-800">{v.callsCount || 0}</td>
                    <td className="p-2.5 text-center font-bold text-emerald-700">{v.whatsappClicksCount || 0}</td>
                    <td className="p-2.5">
                      {v.status !== 'approved' && (
                        <button
                          onClick={() => onUpdateStatus(v.id, 'approved', volunteerName, 'Verified by admin.')}
                          className="text-[11px] bg-emerald-600 text-white px-2 py-1 rounded font-bold hover:bg-emerald-700"
                        >
                          Approve
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 3: ANALYTICS & REPORTS */}
      {activeTab === 'analytics' && (
        <div className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm space-y-5">
          <h2 className="text-base font-bold text-gray-900">Platform Analytics Overview</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Lead Breakdown Chart Simulation */}
            <div className="border rounded-xl p-4 space-y-3 bg-gray-50">
              <h3 className="font-bold text-sm text-gray-800">Lead Conversion Distribution</h3>
              <div className="space-y-2 text-xs">
                <div>
                  <div className="flex justify-between font-semibold text-gray-700 mb-1">
                    <span>Direct Phone Calls</span>
                    <span>{totalCalls} leads ({Math.round((totalCalls / (totalCalls + totalWhatsApp || 1)) * 100)}%)</span>
                  </div>
                  <div className="w-full bg-gray-200 h-2.5 rounded-full overflow-hidden">
                    <div className="bg-[#0F5C5C] h-full rounded-full" style={{ width: `${Math.min(100, (totalCalls / (totalCalls + totalWhatsApp || 1)) * 100)}%` }}></div>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between font-semibold text-gray-700 mb-1">
                    <span>WhatsApp Direct Messages</span>
                    <span>{totalWhatsApp} leads ({Math.round((totalWhatsApp / (totalCalls + totalWhatsApp || 1)) * 100)}%)</span>
                  </div>
                  <div className="w-full bg-gray-200 h-2.5 rounded-full overflow-hidden">
                    <div className="bg-[#25D366] h-full rounded-full" style={{ width: `${Math.min(100, (totalWhatsApp / (totalCalls + totalWhatsApp || 1)) * 100)}%` }}></div>
                  </div>
                </div>
              </div>
            </div>

            {/* Top Categories Breakdown */}
            <div className="border rounded-xl p-4 space-y-2 bg-gray-50">
              <h3 className="font-bold text-sm text-gray-800">Top Service Demands in Hyderabad</h3>
              <ul className="text-xs space-y-1.5 text-gray-700">
                <li className="flex justify-between font-medium">
                  <span>⚡ Electrician & Home Wiring</span>
                  <span className="font-bold">42 Stores</span>
                </li>
                <li className="flex justify-between font-medium">
                  <span>🛍️ Kirana & Daily Grocery</span>
                  <span className="font-bold">65 Stores</span>
                </li>
                <li className="flex justify-between font-medium">
                  <span>🔧 Plumber & Tap Repair</span>
                  <span className="font-bold">38 Stores</span>
                </li>
                <li className="flex justify-between font-medium">
                  <span>❄️ AC Repair & Gas Filling</span>
                  <span className="font-bold">29 Stores</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: POSTGIS SQL SETUP INSTRUCTIONS */}
      {activeTab === 'sql' && (
        <div className="bg-gray-900 text-gray-100 rounded-2xl p-5 shadow-lg space-y-3 font-mono text-xs overflow-x-auto">
          <div className="flex items-center justify-between text-emerald-400 font-bold border-b border-gray-800 pb-2">
            <span>Supabase PostGIS SQL Schema Reference</span>
            <span className="text-[10px] bg-gray-800 px-2 py-1 rounded text-gray-300">get_nearby_vendors RPC</span>
          </div>
          <p className="text-gray-400">Run this SQL in your Supabase SQL Editor to initialize PostGIS spatial distance search:</p>
          <pre className="text-emerald-300 bg-black/60 p-3 rounded-xl overflow-x-auto leading-relaxed">
{`-- Enable PostGIS Spatial Extension
CREATE EXTENSION IF NOT EXISTS postgis;

-- Vendors Table with PostGIS Geography Point
CREATE TABLE IF NOT EXISTS public.vendors (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    slug TEXT NOT NULL UNIQUE,
    name TEXT NOT NULL,
    category_slug TEXT NOT NULL,
    phone VARCHAR(20) NOT NULL,
    whatsapp VARCHAR(20) NOT NULL,
    address TEXT NOT NULL,
    neighborhood VARCHAR(100) NOT NULL,
    lat DOUBLE PRECISION NOT NULL,
    lng DOUBLE PRECISION NOT NULL,
    location GEOGRAPHY(POINT, 4326) GENERATED ALWAYS AS (
        ST_SetSRID(ST_MakePoint(lng, lat), 4326)::geography
    ) STORED,
    status VARCHAR(20) DEFAULT 'pending'
);

-- Fast Spatial Index
CREATE INDEX idx_vendors_location ON public.vendors USING GIST (location);

-- Radius Distance Query Function
CREATE OR REPLACE FUNCTION get_nearby_vendors(user_lat float, user_lng float, radius_km float)
RETURNS TABLE(...) AS $$ ... $$ LANGUAGE plpgsql;`}
          </pre>
        </div>
      )}
    </div>
  );
};
