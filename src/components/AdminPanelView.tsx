import React, { useState, useEffect } from 'react';
import { Crown, Plus, Users, LayoutDashboard, Store } from 'lucide-react';
import { UserRoleAssignment, fetchUserRoles, grantUserRole, fetchCategories, addCategory, fetchB2BProducts, addB2BProduct, B2BProduct } from '../lib/adminApi';
import { Category } from '../types';

export const AdminPanelView: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'roles' | 'categories' | 'products'>('roles');
  
  // Data State
  const [roles, setRoles] = useState<UserRoleAssignment[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [products, setProducts] = useState<B2BProduct[]>([]);
  const [loading, setLoading] = useState(true);

  // Form State
  const [newEmail, setNewEmail] = useState('');
  const [newRole, setNewRole] = useState<'volunteer' | 'vendor' | 'customer' | 'admin'>('volunteer');
  
  const [newCatName, setNewCatName] = useState('');
  const [newCatSlug, setNewCatSlug] = useState('');
  const [newCatIcon, setNewCatIcon] = useState('Box');
  const [newCatDesc, setNewCatDesc] = useState('');
  
  const [newProdName, setNewProdName] = useState('');
  const [newProdSlug, setNewProdSlug] = useState('sports');
  const [newProdImage, setNewProdImage] = useState('');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    const [fetchedRoles, fetchedCats, fetchedProds] = await Promise.all([
      fetchUserRoles(),
      fetchCategories(),
      fetchB2BProducts()
    ]);
    setRoles(fetchedRoles);
    setCategories(fetchedCats);
    setProducts(fetchedProds);
    setLoading(false);
  };

  const handleGrantRole = async () => {
    if (!newEmail) return;
    await grantUserRole(newEmail, newRole);
    setNewEmail('');
    loadData();
    alert('Role updated successfully!');
  };

  const handleAddCategory = async () => {
    if (!newCatName || !newCatSlug) return;
    await addCategory({
      id: Math.random().toString(),
      name: newCatName,
      slug: newCatSlug,
      iconName: newCatIcon as any,
      description: newCatDesc,
      activeProvidersCount: 0,
      popularSearch: false
    });
    setNewCatName('');
    setNewCatSlug('');
    setNewCatDesc('');
    loadData();
    alert('Category added successfully!');
  };

  const handleAddProduct = async () => {
    if (!newProdName || !newProdImage) return;
    await addB2BProduct({
      name: newProdName,
      category_slug: newProdSlug,
      image_url: newProdImage
    });
    setNewProdName('');
    setNewProdImage('');
    loadData();
    alert('Product added successfully!');
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
        <button onClick={() => setActiveTab('roles')} className={`flex items-center gap-2 px-5 py-3 rounded-xl font-bold transition-colors whitespace-nowrap ${activeTab === 'roles' ? 'bg-purple-100 text-purple-700' : 'hover:bg-gray-50 text-gray-600'}`}>
          <Users className="w-5 h-5" /> User Roles & Volunteers
        </button>
        <button onClick={() => setActiveTab('categories')} className={`flex items-center gap-2 px-5 py-3 rounded-xl font-bold transition-colors whitespace-nowrap ${activeTab === 'categories' ? 'bg-purple-100 text-purple-700' : 'hover:bg-gray-50 text-gray-600'}`}>
          <LayoutDashboard className="w-5 h-5" /> Global Categories
        </button>
        <button onClick={() => setActiveTab('products')} className={`flex items-center gap-2 px-5 py-3 rounded-xl font-bold transition-colors whitespace-nowrap ${activeTab === 'products' ? 'bg-purple-100 text-purple-700' : 'hover:bg-gray-50 text-gray-600'}`}>
          <Store className="w-5 h-5" /> B2B Products
        </button>
      </div>

      {/* Main Content Area */}
      <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-200">
        
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

        {/* CATEGORIES TAB */}
        {activeTab === 'categories' && (
          <div className="space-y-8">
            <div>
              <h2 className="text-xl font-bold text-gray-900 mb-4">Add Global Category</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input type="text" value={newCatName} onChange={e => setNewCatName(e.target.value)} placeholder="Category Name (e.g., HVAC Repair)" className="bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 font-medium outline-none focus:border-purple-500" />
                <input type="text" value={newCatSlug} onChange={e => setNewCatSlug(e.target.value)} placeholder="Slug (e.g., hvac-repair)" className="bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 font-medium outline-none focus:border-purple-500" />
                <input type="text" value={newCatIcon} onChange={e => setNewCatIcon(e.target.value)} placeholder="Icon Name (e.g., Wind)" className="bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 font-medium outline-none focus:border-purple-500" />
                <input type="text" value={newCatDesc} onChange={e => setNewCatDesc(e.target.value)} placeholder="Short Description" className="bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 font-medium outline-none focus:border-purple-500" />
              </div>
              <button onClick={handleAddCategory} className="mt-4 bg-purple-600 hover:bg-purple-700 text-white font-bold px-6 py-3 rounded-xl transition-colors flex items-center gap-2">
                <Plus className="w-5 h-5" /> Add Category
              </button>
            </div>

            <div>
              <h2 className="text-xl font-bold text-gray-900 mb-4">Live Categories ({categories.length})</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {categories.map((c, i) => (
                  <div key={i} className="border border-gray-200 rounded-xl p-4 flex flex-col bg-gray-50">
                    <span className="font-bold text-gray-900">{c.name}</span>
                    <span className="text-xs text-gray-500 mt-1">Slug: {c.slug} | Icon: {c.iconName}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* B2B PRODUCTS TAB */}
        {activeTab === 'products' && (
          <div className="space-y-8">
            <div>
              <h2 className="text-xl font-bold text-gray-900 mb-4">Add B2B Product to Showcase</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <input type="text" value={newProdName} onChange={e => setNewProdName(e.target.value)} placeholder="Product Name" className="bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 font-medium outline-none focus:border-purple-500" />
                <input type="text" value={newProdSlug} onChange={e => setNewProdSlug(e.target.value)} placeholder="Category (e.g., sports, electronics)" className="bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 font-medium outline-none focus:border-purple-500" />
                <input type="text" value={newProdImage} onChange={e => setNewProdImage(e.target.value)} placeholder="Image URL" className="bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 font-medium outline-none focus:border-purple-500" />
              </div>
              <button onClick={handleAddProduct} className="mt-4 bg-purple-600 hover:bg-purple-700 text-white font-bold px-6 py-3 rounded-xl transition-colors flex items-center gap-2">
                <Plus className="w-5 h-5" /> Add Product
              </button>
            </div>

            <div>
              <h2 className="text-xl font-bold text-gray-900 mb-4">Live B2B Products ({products.length})</h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                {products.map((p, i) => (
                  <div key={i} className="border border-gray-200 bg-gray-50 rounded-xl p-3 flex flex-col items-center text-center">
                    <img src={p.image_url} alt={p.name} className="w-full h-24 object-cover rounded-lg mb-2 bg-white" />
                    <span className="font-bold text-gray-900 text-sm line-clamp-2 mt-auto">{p.name}</span>
                    <span className="text-xs text-purple-600 font-bold mt-1 bg-purple-100 px-2 py-0.5 rounded-md">{p.category_slug}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
