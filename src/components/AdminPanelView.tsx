import React, { useState, useEffect } from 'react';
import { Crown, Users, Store, Map, MessageSquare, Star } from 'lucide-react';
import { UserRoleAssignment, fetchUserRoles, grantUserRole, removeUserRole, fetchFeedback } from '../lib/adminApi';
import { Vendor, FeedbackEntry } from '../types';
import { fetchAllVendors } from '../lib/supabase';
import { SiteMapTowers } from './SiteMapTowers';

interface AdminPanelViewProps {
  vendors?: Vendor[];
  currentRole?: string;
  onUpdateVendorStatus?: (vendorId: string, status: "approved" | "pending" | "rejected", volunteerName: string, notes: string) => void;
  onOpenEditVendor?: (vendor: Vendor) => void;
  onDeleteVendor?: (vendorId: string) => void;
  onExportCSV?: () => void;
}

export const AdminPanelView: React.FC<AdminPanelViewProps> = ({ currentRole = "admin", onUpdateVendorStatus, onOpenEditVendor, onDeleteVendor }) => {
  const [activeTab, setActiveTab] = useState<'vendors' | 'roles' | 'sitemap' | 'feedback'>(currentRole === 'volunteer' ? 'vendors' : 'sitemap');
  
  // Data State
  const [roles, setRoles] = useState<UserRoleAssignment[]>([]);
  const [adminVendors, setAdminVendors] = useState<Vendor[]>([]);
  const [feedback, setFeedback] = useState<FeedbackEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [vendorSearchQuery, setVendorSearchQuery] = useState('');

  // Form State
  const [newEmail, setNewEmail] = useState('');
  const [newRole, setNewRole] = useState<'volunteer' | 'vendor' | 'customer' | 'admin'>('volunteer');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    const fetchedRoles = await fetchUserRoles();
    setRoles(fetchedRoles);
    
    // Fetch all vendors specifically for the admin panel so it is not filtered by the user's location/search
    const allVendorsData = await fetchAllVendors();
    setAdminVendors(allVendorsData);
    
    if (currentRole === 'admin') {
      const fbData = await fetchFeedback();
      setFeedback(fbData);
    }

    setLoading(false);
  };

  const handleGrantRole = async () => {
    if (!newEmail) return;
    await grantUserRole(newEmail, newRole);
    setNewEmail('');
    loadData();
    alert('Role updated successfully!');
  };

  const handleRemoveRole = async (email: string) => {
    if (window.confirm(`Are you sure you want to revoke access for ${email}?`)) {
      await removeUserRole(email);
      loadData();
    }
  };

  const handleEditRole = async (email: string, role: any) => {
    await grantUserRole(email, role);
    loadData();
  };

  const handleStatusChange = async (vendorId: string, status: "approved" | "pending" | "rejected") => {
    if (onUpdateVendorStatus) {
      onUpdateVendorStatus(vendorId, status, 'Super Admin', `Status changed to ${status} via Admin Panel`);
      // Update local state immediately for fast feedback
      setAdminVendors(prev => prev.map(v => v.id === vendorId ? { ...v, status, isVerified: status === 'approved' } : v));
      // Then re-fetch to ensure sync
      const allVendorsData = await fetchAllVendors();
      setAdminVendors(allVendorsData);
    }
  };

  const handleDeleteClick = async (vendorId: string, vendorName: string) => {
    if (onDeleteVendor && window.confirm(`Are you sure you want to permanently delete the vendor "${vendorName}"?`)) {
      onDeleteVendor(vendorId);
      setAdminVendors(prev => prev.filter(v => v.id !== vendorId));
    }
  };

  const handleExportUsers = () => {
    const headers = ["Email", "Role"];
    const rows = roles.map((r) => [`"${r.email}"`, `"${r.role}"`]);
    const csvContent = [headers.join(","), ...rows.map(e => e.join(","))].join("\n");
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `DialXprt_Users_Export_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleExportVendors = () => {
    const headers = [
      "ID", "Name", "Category", "Owner", "Phone", "WhatsApp", 
      "Address", "Neighborhood", "City", "Pincode", "Latitude", "Longitude", 
      "Experience", "Status", "Verified"
    ];
    const rows = adminVendors.map((v) => [
      v.id,
      `"${v.name}"`,
      `"${v.category}"`,
      `"${v.ownerName}"`,
      v.phone,
      v.whatsapp,
      `"${v.address}"`,
      `"${v.neighborhood}"`,
      `"${v.city}"`,
      v.pincode,
      v.lat,
      v.lng,
      `"${v.experience}"`,
      v.status,
      v.isVerified ? "Yes" : "No",
    ]);

    const csvContent = [headers.join(","), ...rows.map(e => e.join(","))].join("\n");
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `DialXprt_Detailed_Vendors_Export_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const filteredAdminVendors = adminVendors.filter(v => 
    !vendorSearchQuery || 
    (v.name && v.name.toLowerCase().includes(vendorSearchQuery.toLowerCase())) || 
    (v.category && v.category.toLowerCase().includes(vendorSearchQuery.toLowerCase())) || 
    (v.ownerName && v.ownerName.toLowerCase().includes(vendorSearchQuery.toLowerCase())) || 
    (v.phone && v.phone.includes(vendorSearchQuery)) || 
    (v.neighborhood && v.neighborhood.toLowerCase().includes(vendorSearchQuery.toLowerCase()))
  );

  if (loading) return <div className="p-10 text-center font-bold text-gray-500">Loading Admin Data...</div>;

  return (
    <div className="max-w-5xl mx-auto space-y-6 pb-24 px-3 sm:px-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-800 to-indigo-900 rounded-3xl p-6 sm:p-8 text-white shadow-lg mt-4">
        <div className="flex items-center gap-4">
          <div className="bg-white/20 p-3 rounded-2xl">
            {currentRole === 'admin' ? <Crown className="w-8 h-8 text-amber-400" /> : <Store className="w-8 h-8 text-amber-400" />}
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-black">{currentRole === 'admin' ? 'Super Admin Control Panel' : 'Volunteer Verification Panel'}</h1>
            <p className="text-purple-200 font-medium mt-1">
              {currentRole === 'admin' ? 'Manage global site settings, users, and marketplace data.' : 'Review and verify newly registered vendors in your area.'}
            </p>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex gap-2 overflow-x-auto bg-white p-2 rounded-2xl shadow-sm border border-gray-100 no-scrollbar">
        {currentRole === 'admin' && (
          <button onClick={() => setActiveTab('sitemap')} className={`flex items-center gap-2 px-5 py-3 rounded-xl font-bold transition-colors whitespace-nowrap ${activeTab === 'sitemap' ? 'bg-purple-100 text-purple-700' : 'hover:bg-gray-50 text-gray-600'}`}>
            <Map className="w-5 h-5" /> Site Map (Errors)
          </button>
        )}
        <button onClick={() => setActiveTab('vendors')} className={`flex items-center gap-2 px-5 py-3 rounded-xl font-bold transition-colors whitespace-nowrap ${activeTab === 'vendors' ? 'bg-purple-100 text-purple-700' : 'hover:bg-gray-50 text-gray-600'}`}>
          <Store className="w-5 h-5" /> Vendor Leads & Data
        </button>
        {currentRole === 'admin' && (
          <button onClick={() => setActiveTab('roles')} className={`flex items-center gap-2 px-5 py-3 rounded-xl font-bold transition-colors whitespace-nowrap ${activeTab === 'roles' ? 'bg-purple-100 text-purple-700' : 'hover:bg-gray-50 text-gray-600'}`}>
            <Users className="w-5 h-5" /> User Roles & Volunteers
          </button>
        )}
        {currentRole === 'admin' && (
          <button onClick={() => setActiveTab('feedback')} className={`flex items-center gap-2 px-5 py-3 rounded-xl font-bold transition-colors whitespace-nowrap ${activeTab === 'feedback' ? 'bg-purple-100 text-purple-700' : 'hover:bg-gray-50 text-gray-600'}`}>
            <MessageSquare className="w-5 h-5" /> User Feedback
          </button>
        )}
      </div>

      {/* Main Content Area */}
      <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-200">
        
        {/* FEEDBACK TAB */}
        {activeTab === 'feedback' && currentRole === 'admin' && (
          <div className="space-y-6 animate-fade-in">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-black text-gray-900">User Feedback & Bug Reports</h2>
            </div>
            
            {feedback.length === 0 ? (
              <div className="text-center py-10 bg-gray-50 rounded-2xl border border-gray-100">
                <p className="text-gray-500 font-medium">No feedback received yet.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {feedback.map(fb => (
                  <div key={fb.id} className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm space-y-3">
                    <div className="flex justify-between items-start">
                      <span className={`px-2.5 py-1 text-xs font-bold rounded-lg ${
                        fb.type === 'bug' ? 'bg-rose-100 text-rose-700' : 
                        fb.type === 'feature' ? 'bg-purple-100 text-purple-700' : 'bg-gray-100 text-gray-700'
                      }`}>
                        {fb.type === 'bug' ? '🐛 Bug' : fb.type === 'feature' ? '💡 Feature' : '💬 Other'}
                      </span>
                      <span className="text-xs text-gray-400 font-medium">{new Date(fb.createdAt).toLocaleDateString()}</span>
                    </div>
                    
                    <div className="flex items-center gap-1">
                      {[1, 2, 3, 4, 5].map(star => (
                        <Star key={star} className={`w-4 h-4 ${star <= fb.rating ? 'fill-amber-400 text-amber-400' : 'fill-gray-100 text-gray-200'}`} />
                      ))}
                    </div>
                    
                    <p className="text-gray-700 text-sm leading-relaxed">{fb.message}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* SITEMAP TAB */}
        {activeTab === 'sitemap' && (
          <SiteMapTowers />
        )}

        {/* VENDORS TAB */}
        {activeTab === 'vendors' && (
          <div className="space-y-8">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 w-full">
              <h2 className="text-xl font-bold text-gray-900">Manage Vendor Leads ({filteredAdminVendors.length})</h2>
              <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
                <input 
                  type="text"
                  placeholder="Search businesses, owners, phones..."
                  value={vendorSearchQuery}
                  onChange={(e) => setVendorSearchQuery(e.target.value)}
                  className="bg-gray-50 border border-gray-200 rounded-xl px-4 py-2 font-medium outline-none focus:border-purple-500 text-sm w-full sm:w-auto"
                />
                <button onClick={handleExportVendors} className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-xl text-sm font-bold transition-colors">
                  Export Detailed Vendors CSV
                </button>
                <button onClick={handleExportUsers} className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-xl text-sm font-bold transition-colors">
                  Export Users CSV
                </button>
              </div>
            </div>

            <div className="border border-gray-200 rounded-xl overflow-hidden overflow-x-auto">
              <table className="w-full text-left min-w-[800px]">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-4 py-3 font-bold text-gray-600 text-sm">Business Info</th>
                    <th className="px-4 py-3 font-bold text-gray-600 text-sm">Owner & Contact</th>
                    <th className="px-4 py-3 font-bold text-gray-600 text-sm">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {filteredAdminVendors.map((v, i) => (
                    <tr key={i} className="hover:bg-gray-50">
                      <td className="px-4 py-3">
                        <div className="font-bold text-gray-900">{v.name}</div>
                        <div className="text-xs text-gray-500">{v.category} • {v.neighborhood}</div>
                      </td>
                      <td className="px-4 py-3">
                        <div className="font-medium text-gray-800">{v.ownerName}</div>
                        <div className="text-xs text-gray-500">{v.phone}</div>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <div className="relative inline-block">
                            <select 
                              value={v.status}
                              onChange={(e) => handleStatusChange(v.id, e.target.value as any)}
                              className={`px-3 py-1.5 rounded-lg text-xs font-bold uppercase cursor-pointer appearance-none border shadow-sm outline-none transition-colors ${
                                v.status === 'approved' ? 'bg-green-50 hover:bg-green-100 text-green-700 border-green-200' :
                                v.status === 'pending' ? 'bg-amber-50 hover:bg-amber-100 text-amber-700 border-amber-200' : 'bg-red-50 hover:bg-red-100 text-red-700 border-red-200'
                              }`}
                            >
                              <option value="pending" className="bg-white text-amber-700 font-bold">PENDING</option>
                              <option value="approved" className="bg-white text-green-700 font-bold">APPROVED</option>
                              <option value="rejected" className="bg-white text-red-700 font-bold">REJECTED</option>
                            </select>
                            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-500">
                              <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
                            </div>
                          </div>
                          
                          {onOpenEditVendor && (
                            <button
                              onClick={() => onOpenEditVendor(v)}
                              className="px-3 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-bold rounded-lg border border-gray-200 transition-colors"
                            >
                              EDIT
                            </button>
                          )}
                          {onDeleteVendor && (
                            <button
                              onClick={() => handleDeleteClick(v.id, v.name)}
                              className="px-3 py-1.5 bg-red-50 hover:bg-red-100 text-red-600 text-xs font-bold rounded-lg border border-red-200 transition-colors ml-1"
                            >
                              DELETE
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ROLES TAB */}
        {activeTab === 'roles' && (
          <div className="space-y-8">
            <div>
              <h2 className="text-xl font-bold text-gray-900 mb-4">Grant Role Access</h2>
              <div className="flex flex-col md:flex-row gap-3">
                <input 
                  type="text" 
                  value={newEmail}
                  onChange={(e) => setNewEmail(e.target.value)}
                  placeholder="user@example.com or +919876543210"
                  className="flex-1 bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 font-medium outline-none focus:border-purple-500"
                />
                <select 
                  value={newRole}
                  onChange={(e) => setNewRole(e.target.value as any)}
                  className="bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 font-bold outline-none focus:border-purple-500"
                >
                  <option value="volunteer">Volunteer (Verify Stores)</option>
                  <option value="admin">Super Admin</option>
                  <option value="vendor">Vendor</option>
                  <option value="customer">Customer</option>
                </select>
                <button 
                  onClick={handleGrantRole}
                  className="bg-purple-600 hover:bg-purple-700 text-white font-bold px-6 py-3 rounded-xl transition-colors whitespace-nowrap"
                >
                  Grant Role
                </button>
              </div>
            </div>

            <div>
              <h2 className="text-xl font-bold text-gray-900 mb-4">Current Role Assignments</h2>
              <div className="border border-gray-200 rounded-xl overflow-hidden overflow-x-auto">
                <table className="w-full text-left min-w-[500px]">
                  <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                      <th className="px-4 py-3 font-bold text-gray-600 text-sm">Email / Mobile Number</th>
                      <th className="px-4 py-3 font-bold text-gray-600 text-sm">Role</th>
                      <th className="px-4 py-3 font-bold text-gray-600 text-sm text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {roles.map((r, i) => (
                      <tr key={i} className="hover:bg-gray-50">
                        <td className="px-4 py-3 font-medium text-gray-900">{r.email}</td>
                        <td className="px-4 py-3">
                          <select 
                            value={r.role}
                            onChange={(e) => handleEditRole(r.email, e.target.value)}
                            className={`px-2.5 py-1 rounded-md text-xs font-bold uppercase outline-none cursor-pointer border-none ${
                              r.role === 'admin' ? 'bg-purple-100 text-purple-700' :
                              r.role === 'volunteer' ? 'bg-amber-100 text-amber-700' : 'bg-gray-100 text-gray-700'
                            }`}
                          >
                            <option value="volunteer">VOLUNTEER</option>
                            <option value="admin">ADMIN</option>
                            <option value="vendor">VENDOR</option>
                            <option value="customer">CUSTOMER</option>
                          </select>
                        </td>
                        <td className="px-4 py-3 text-right">
                          <button
                            onClick={() => handleRemoveRole(r.email)}
                            className="text-red-500 hover:text-red-700 text-xs font-bold px-3 py-1.5 bg-red-50 rounded-md hover:bg-red-100 transition-colors"
                          >
                            Remove
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}


      </div>
    </div>
  );
};





