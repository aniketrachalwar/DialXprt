import React, { useState, useEffect } from 'react';
import { Crown, Users, Store, Map } from 'lucide-react';
import { UserRoleAssignment, fetchUserRoles, grantUserRole } from '../lib/adminApi';
import { Vendor } from '../types';
import { SiteMapTowers } from './SiteMapTowers';

interface AdminPanelViewProps {
  vendors?: Vendor[];
  onUpdateVendorStatus?: (vendorId: string, status: "approved" | "pending" | "rejected", volunteerName: string, notes: string) => void;
  onExportCSV?: () => void;
}

export const AdminPanelView: React.FC<AdminPanelViewProps> = ({ vendors = [], onUpdateVendorStatus, onExportCSV }) => {
  const [activeTab, setActiveTab] = useState<'vendors' | 'roles' | 'sitemap'>('sitemap');
  
  // Data State
  const [roles, setRoles] = useState<UserRoleAssignment[]>([]);
  const [loading, setLoading] = useState(true);

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
    setLoading(false);
  };

  const handleGrantRole = async () => {
    if (!newEmail) return;
    await grantUserRole(newEmail, newRole);
    setNewEmail('');
    loadData();
    alert('Role updated successfully!');
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
    const rows = vendors.map((v) => [
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


  if (loading) return <div className="p-10 text-center font-bold text-gray-500">Loading Admin Data...</div>;

  return (
    <div className="max-w-5xl mx-auto space-y-6 pb-24">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-800 to-indigo-900 rounded-3xl p-6 sm:p-8 text-white shadow-lg mt-4">
        <div className="flex items-center gap-4">
          <div className="bg-white/20 p-3 rounded-2xl">
            <Crown className="w-8 h-8 text-amber-400" />
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-black">Super Admin Control Panel</h1>
            <p className="text-purple-200 font-medium mt-1">Manage global site settings, users, and marketplace data.</p>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex gap-2 overflow-x-auto bg-white p-2 rounded-2xl shadow-sm border border-gray-100 no-scrollbar">
        <button onClick={() => setActiveTab('sitemap')} className={`flex items-center gap-2 px-5 py-3 rounded-xl font-bold transition-colors whitespace-nowrap ${activeTab === 'sitemap' ? 'bg-purple-100 text-purple-700' : 'hover:bg-gray-50 text-gray-600'}`}>
          <Map className="w-5 h-5" /> Site Map (Errors)
        </button>
        <button onClick={() => setActiveTab('vendors')} className={`flex items-center gap-2 px-5 py-3 rounded-xl font-bold transition-colors whitespace-nowrap ${activeTab === 'vendors' ? 'bg-purple-100 text-purple-700' : 'hover:bg-gray-50 text-gray-600'}`}>
          <Store className="w-5 h-5" /> Vendor Leads & Data
        </button>
        <button onClick={() => setActiveTab('roles')} className={`flex items-center gap-2 px-5 py-3 rounded-xl font-bold transition-colors whitespace-nowrap ${activeTab === 'roles' ? 'bg-purple-100 text-purple-700' : 'hover:bg-gray-50 text-gray-600'}`}>
          <Users className="w-5 h-5" /> User Roles & Volunteers
        </button>
      </div>

      {/* Main Content Area */}
      <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-200">
        
        {/* SITEMAP TAB */}
        {activeTab === 'sitemap' && (
          <SiteMapTowers />
        )}

        {/* VENDORS TAB */}
        {activeTab === 'vendors' && (
          <div className="space-y-8">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <h2 className="text-xl font-bold text-gray-900">Manage Vendor Leads ({vendors.length})</h2>
              <div className="flex gap-2">
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
                    <th className="px-4 py-3 font-bold text-gray-600 text-sm">Status</th>
                    <th className="px-4 py-3 font-bold text-gray-600 text-sm">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {vendors.map((v, i) => (
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
                        <span className={`px-2.5 py-1 rounded-md text-xs font-bold uppercase ${
                          v.status === 'approved' ? 'bg-green-100 text-green-700' :
                          v.status === 'pending' ? 'bg-amber-100 text-amber-700' : 'bg-red-100 text-red-700'
                        }`}>
                          {v.status}
                        </span>
                      </td>
                      <td className="px-4 py-3 flex gap-2">
                        {v.status !== 'approved' && (
                          <button onClick={() => onUpdateVendorStatus && onUpdateVendorStatus(v.id, 'approved', 'Super Admin', 'Approved via Admin Panel')} className="text-xs bg-green-100 hover:bg-green-200 text-green-700 font-bold px-3 py-1.5 rounded-lg transition-colors">
                            Approve
                          </button>
                        )}
                        {v.status !== 'rejected' && (
                          <button onClick={() => onUpdateVendorStatus && onUpdateVendorStatus(v.id, 'rejected', 'Super Admin', 'Rejected via Admin Panel')} className="text-xs bg-red-100 hover:bg-red-200 text-red-700 font-bold px-3 py-1.5 rounded-lg transition-colors">
                            Reject
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

        {/* ROLES TAB */}
        {activeTab === 'roles' && (
          <div className="space-y-8">
            <div>
              <h2 className="text-xl font-bold text-gray-900 mb-4">Grant Role Access</h2>
              <div className="flex flex-col md:flex-row gap-3">
                <input 
                  type="email" 
                  value={newEmail}
                  onChange={(e) => setNewEmail(e.target.value)}
                  placeholder="user@example.com"
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
                      <th className="px-4 py-3 font-bold text-gray-600 text-sm">Email Address</th>
                      <th className="px-4 py-3 font-bold text-gray-600 text-sm">Role</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {roles.map((r, i) => (
                      <tr key={i} className="hover:bg-gray-50">
                        <td className="px-4 py-3 font-medium text-gray-900">{r.email}</td>
                        <td className="px-4 py-3">
                          <span className={`px-2.5 py-1 rounded-md text-xs font-bold uppercase ${
                            r.role === 'admin' ? 'bg-purple-100 text-purple-700' :
                            r.role === 'volunteer' ? 'bg-amber-100 text-amber-700' : 'bg-gray-100 text-gray-700'
                          }`}>
                            {r.role}
                          </span>
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
