import React, { useState } from 'react';
import { X, Plus, FolderPlus, CheckCircle2 } from 'lucide-react';
import { Collection } from '../types';

interface CollectionsModalProps {
  isOpen: boolean;
  onClose: () => void;
  vendorId: string | null;
  collections: Collection[];
  onToggleVendor: (collectionId: string, vendorId: string) => void;
  onCreateCollection: (name: string) => void;
}

export const CollectionsModal: React.FC<CollectionsModalProps> = ({
  isOpen,
  onClose,
  vendorId,
  collections,
  onToggleVendor,
  onCreateCollection
}) => {
  const [newCollectionName, setNewCollectionName] = useState('');
  const [isCreating, setIsCreating] = useState(false);

  if (!isOpen || !vendorId) return null;

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (newCollectionName.trim()) {
      onCreateCollection(newCollectionName.trim());
      setNewCollectionName('');
      setIsCreating(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in" onClick={onClose}>
      <div 
        className="bg-white rounded-3xl w-full max-w-sm overflow-hidden shadow-2xl relative flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex justify-between items-center p-5 border-b border-gray-100 bg-gray-50/50">
          <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
            <FolderPlus className="w-5 h-5 text-indigo-500" />
            Save to Collection
          </h2>
          <button 
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors active:scale-95"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Collections List */}
        <div className="p-2 max-h-[60vh] overflow-y-auto">
          {collections.length === 0 ? (
            <div className="p-8 text-center text-gray-500 flex flex-col items-center gap-3">
              <div className="w-12 h-12 bg-indigo-50 rounded-full flex items-center justify-center">
                <FolderPlus className="w-6 h-6 text-indigo-300" />
              </div>
              <p className="text-sm">You haven't created any collections yet.</p>
            </div>
          ) : (
            <div className="space-y-1">
              {collections.map(col => {
                const isSelected = col.vendorIds.includes(vendorId);
                return (
                  <button
                    key={col.id}
                    onClick={() => onToggleVendor(col.id, vendorId)}
                    className="w-full flex items-center justify-between p-4 hover:bg-gray-50 rounded-xl transition-colors group active:scale-[0.98]"
                  >
                    <div className="flex flex-col items-start gap-1">
                      <span className="font-semibold text-gray-900 group-hover:text-indigo-600 transition-colors">
                        {col.name}
                      </span>
                      <span className="text-xs text-gray-500">
                        {col.vendorIds.length} {col.vendorIds.length === 1 ? 'business' : 'businesses'}
                      </span>
                    </div>
                    <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors ${isSelected ? 'bg-indigo-500 border-indigo-500' : 'border-gray-300 group-hover:border-indigo-400'}`}>
                      {isSelected && <CheckCircle2 className="w-4 h-4 text-white" />}
                    </div>
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Create New Collection Form */}
        <div className="p-4 border-t border-gray-100 bg-white">
          {isCreating ? (
            <form onSubmit={handleCreate} className="flex gap-2 animate-fade-in">
              <input
                type="text"
                autoFocus
                placeholder="Collection name..."
                value={newCollectionName}
                onChange={(e) => setNewCollectionName(e.target.value)}
                className="flex-1 border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              />
              <button
                type="submit"
                disabled={!newCollectionName.trim()}
                className="bg-indigo-600 text-white px-4 py-2.5 rounded-xl text-sm font-bold disabled:opacity-50 hover:bg-indigo-700 transition-colors active:scale-95"
              >
                Create
              </button>
            </form>
          ) : (
            <button
              onClick={() => setIsCreating(true)}
              className="w-full flex items-center justify-center gap-2 py-3 text-indigo-600 font-bold hover:bg-indigo-50 rounded-xl transition-colors active:scale-95"
            >
              <Plus className="w-5 h-5" />
              Create New Collection
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
