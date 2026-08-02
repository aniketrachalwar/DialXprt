import React, { useEffect } from 'react';
import {
  X,
  Heart,
  Bookmark,
  User,
  Receipt,
  Globe,
  Bell,
  Headphones,
  UserCheck,
  Shield,
  MessageSquare,
  HelpCircle,
  LogOut,
  ChevronDown,
  Crown,
  Languages,
  Mail,
  TrendingUp,
  Megaphone,
  Handshake
} from 'lucide-react';

interface ProfileSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  userName: string;
  onLogout: () => void;
  onEditProfile: () => void;
  onChangeLanguage?: () => void;
  onOpenNotifications?: () => void;
  onNavigate?: (tab: string) => void;
  isAdmin?: boolean;
  currentRole?: string;
  onLogin?: () => void;
}

export const ProfileSidebar: React.FC<ProfileSidebarProps> = ({
  isOpen,
  onClose,
  userName,
  onLogout,
  onEditProfile,
  onChangeLanguage,
  onOpenNotifications,
  onNavigate,
  isAdmin,
  currentRole,
  onLogin
}) => {
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleAction = (action?: () => void) => {
    if (action) {
      action();
      onClose();
    }
  };

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm transition-opacity animate-fade-in"
        onClick={onClose}
      />
      
      {/* Sidebar Drawer */}
      <div 
        className="fixed right-0 top-0 bottom-0 w-80 max-w-[85vw] bg-white z-[60] shadow-2xl flex flex-col transform animate-slide-left overflow-hidden border-l border-gray-100"
      >
        {!userName ? (
          <>
            {/* Header - Not Logged In */}
            <div className="pt-6 pb-2 px-6 flex flex-col shrink-0 relative">
              <button 
                onClick={onClose}
                className="absolute top-4 left-4 p-1 text-gray-500 hover:text-gray-800 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
              
              <div className="flex items-center justify-between mt-12">
                <h2 
                  onClick={() => handleAction(onLogin)}
                  className="text-xl font-bold text-gray-900 leading-tight cursor-pointer hover:text-[#F36F21] transition-colors"
                >
                  Sign in
                </h2>
                <div className="w-12 h-12 rounded-full overflow-hidden shrink-0 bg-[#cbd5e1] flex items-center justify-center cursor-pointer hover:opacity-80 transition-opacity" onClick={() => handleAction(onLogin)}>
                   <User className="w-8 h-8 text-white mt-1" />
                </div>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto no-scrollbar">
              {/* Action Pills */}
              <div className="px-6 py-4 flex gap-2">
                <button 
                  onClick={() => handleAction(onLogin)}
                  className="px-4 py-1.5 text-xs text-gray-700 bg-white border border-gray-200 rounded-full hover:border-[#F36F21] hover:text-[#F36F21] transition-all"
                >
                  Saved
                </button>
                <button 
                  onClick={() => handleAction(onLogin)}
                  className="px-4 py-1.5 text-xs text-gray-700 bg-white border border-gray-200 rounded-full hover:border-[#F36F21] hover:text-[#F36F21] transition-all"
                >
                  Favorites
                </button>
                <button 
                  onClick={() => handleAction(onLogin)}
                  className="px-4 py-1.5 text-xs text-gray-700 bg-white border border-gray-200 rounded-full hover:border-[#F36F21] hover:text-[#F36F21] transition-all"
                >
                  Interests
                </button>
              </div>

              <div className="mt-2 space-y-1 pb-6">
                <button 
                  onClick={() => handleAction(onChangeLanguage)}
                  className="w-full flex items-center justify-between px-6 py-3.5 text-sm font-semibold text-gray-800 hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-9 h-9 rounded-full border border-gray-200 flex items-center justify-center shrink-0">
                      <Languages className="w-4 h-4 text-gray-600" />
                    </div>
                    <span className="text-[15px] font-semibold text-gray-800">English</span>
                  </div>
                  <span className="text-[11px] text-gray-500 font-normal">Change Language</span>
                </button>

                <button 
                  onClick={() => handleAction(onLogin)}
                  className="w-full flex items-center gap-4 px-6 py-3.5 text-sm font-semibold text-gray-800 hover:bg-gray-50 transition-colors"
                >
                  <div className="w-9 h-9 rounded-full border border-gray-200 flex items-center justify-center shrink-0">
                    <Mail className="w-4 h-4 text-gray-600" />
                  </div>
                  <span className="text-[15px] font-semibold text-gray-800">Leads</span>
                </button>

                <button 
                  onClick={() => handleAction(onLogin)}
                  className="w-full flex items-center gap-4 px-6 py-3.5 text-sm font-semibold text-gray-800 hover:bg-gray-50 transition-colors"
                >
                  <div className="w-9 h-9 rounded-full border border-gray-200 flex items-center justify-center shrink-0">
                    <TrendingUp className="w-4 h-4 text-gray-600" />
                  </div>
                  <span className="text-[15px] font-semibold text-gray-800">List your Business</span>
                  <span className="ml-1 px-1.5 py-0.5 bg-[#ef4444] text-white text-[10px] font-bold rounded shadow-sm leading-none">Free</span>
                </button>

                <button 
                  onClick={() => handleAction(onLogin)}
                  className="w-full flex items-center gap-4 px-6 py-3.5 text-sm font-semibold text-gray-800 hover:bg-gray-50 transition-colors"
                >
                  <div className="w-9 h-9 rounded-full border border-gray-200 flex items-center justify-center shrink-0">
                    <Megaphone className="w-4 h-4 text-gray-600" />
                  </div>
                  <span className="text-[15px] font-semibold text-gray-800">Advertise</span>
                </button>

                <button 
                  onClick={() => handleAction(onLogin)}
                  className="w-full flex items-center gap-4 px-6 py-3.5 text-sm font-semibold text-gray-800 hover:bg-gray-50 transition-colors"
                >
                  <div className="w-9 h-9 rounded-full border border-gray-200 flex items-center justify-center shrink-0">
                    <Receipt className="w-4 h-4 text-gray-600" />
                  </div>
                  <span className="text-[15px] font-semibold text-gray-800">My Transactions</span>
                </button>

                <button 
                  onClick={() => handleAction(() => onNavigate?.('customer_service'))}
                  className="w-full flex items-center gap-4 px-6 py-3.5 text-sm font-semibold text-gray-800 hover:bg-gray-50 transition-colors"
                >
                  <div className="w-9 h-9 rounded-full border border-gray-200 flex items-center justify-center shrink-0">
                    <HelpCircle className="w-4 h-4 text-gray-600" />
                  </div>
                  <span className="text-[15px] font-semibold text-gray-800">Customer Service</span>
                </button>

                <button 
                  onClick={() => handleAction(() => onNavigate?.('help'))}
                  className="w-full flex items-center gap-4 px-6 py-3.5 text-sm font-semibold text-gray-800 hover:bg-gray-50 transition-colors"
                >
                  <div className="w-9 h-9 rounded-full border border-gray-200 flex items-center justify-center shrink-0">
                    <Handshake className="w-4 h-4 text-gray-600" />
                  </div>
                  <span className="text-[15px] font-semibold text-gray-800">Help</span>
                </button>
              </div>
            </div>
          </>
        ) : (
          <>
            {/* Header */}
            <div className="pt-6 pb-4 px-6 border-b border-gray-100 flex flex-col shrink-0 relative">
              <button 
                onClick={onClose}
                className="absolute top-4 right-4 p-2 text-gray-500 hover:text-gray-800 hover:bg-gray-100 rounded-full transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
              
              <div className="flex items-center justify-between mt-2">
                <div>
                  <h2 className="text-xl font-bold text-gray-900 leading-tight truncate pr-4">
                    {userName || 'User Profile'}
                  </h2>
                  <button 
                    onClick={() => handleAction(onEditProfile)}
                    className="text-xs text-gray-500 hover:text-[#F36F21] mt-1 font-medium transition-colors"
                  >
                    Click to view profile
                  </button>
                </div>
                {/* Avatar Circle */}
                <div className="w-12 h-12 rounded-full overflow-hidden shrink-0 border border-gray-200 shadow-sm bg-gradient-to-tr from-orange-100 to-indigo-100 flex items-center justify-center">
                   <User className="w-6 h-6 text-gray-400" />
                </div>
              </div>
            </div>

            {/* Scrollable Content */}
            <div className="flex-1 overflow-y-auto no-scrollbar py-2">
              
              {/* Section 1 */}
              <div className="px-4 py-2 space-y-1">
                <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2 px-3">
                  My Activity
                </h3>
                
                {(isAdmin || currentRole === 'volunteer') && (
                  <button 
                    onClick={() => handleAction(() => onNavigate?.('admin'))}
                    className="w-full flex items-center justify-between p-3 rounded-xl hover:bg-purple-50 transition-colors group mb-2 border border-purple-100 bg-purple-50/30"
                  >
                    <div className="flex items-center gap-3">
                      <div className="bg-purple-100 p-2 rounded-lg group-hover:bg-purple-200 transition-colors">
                        <Crown className="w-5 h-5 text-purple-600" />
                      </div>
                      <span className="font-semibold text-gray-900 group-hover:text-purple-700 transition-colors">
                        {isAdmin ? 'Admin Control Panel' : 'Verification Panel'}
                      </span>
                    </div>
                  </button>
                )}
                <button 
                  onClick={() => handleAction(() => onNavigate?.('favorites'))}
                  className="w-full flex items-center gap-4 px-3 py-3 text-sm font-semibold text-gray-700 hover:bg-gray-50 hover:text-[#F36F21] rounded-xl transition-colors text-left"
                >
                  <Heart className="w-4 h-4 text-gray-500 shrink-0" />
                  <span>Favorites</span>
                </button>
                
                <button 
                  onClick={() => handleAction(() => onNavigate?.('saved'))}
                  className="w-full flex items-center gap-4 px-3 py-3 text-sm font-semibold text-gray-700 hover:bg-gray-50 hover:text-[#F36F21] rounded-xl transition-colors text-left"
                >
                  <Bookmark className="w-4 h-4 text-gray-500 shrink-0" />
                  <span>Saved</span>
                </button>
                
                <button 
                  onClick={() => handleAction(onEditProfile)}
                  className="w-full flex items-center gap-4 px-3 py-3 text-sm font-semibold text-gray-700 hover:bg-gray-50 hover:text-[#F36F21] rounded-xl transition-colors text-left"
                >
                  <User className="w-4 h-4 text-gray-500 shrink-0" />
                  <span>Edit Profile</span>
                </button>
                
                <button 
                  onClick={() => handleAction(() => onNavigate?.('transactions'))}
                  className="w-full flex items-center gap-4 px-3 py-3 text-sm font-semibold text-gray-700 hover:bg-gray-50 hover:text-[#F36F21] rounded-xl transition-colors text-left"
                >
                  <Receipt className="w-4 h-4 text-gray-500 shrink-0" />
                  <span>My Transaction</span>
                </button>

                <button 
                  onClick={() => handleAction(onChangeLanguage)}
                  className="w-full flex items-center justify-between px-3 py-3 text-sm font-semibold text-gray-700 hover:bg-gray-50 rounded-xl transition-colors text-left group"
                >
                  <div className="flex items-center gap-4 group-hover:text-[#F36F21] transition-colors">
                    <Globe className="w-4 h-4 text-gray-500 shrink-0" />
                    <span>Change language</span>
                  </div>
                  <div className="flex items-center gap-1 border border-gray-200 rounded-lg px-2 py-1 text-xs bg-white shadow-xs">
                    <span>English</span>
                    <ChevronDown className="w-3 h-3 text-gray-400" />
                  </div>
                </button>
              </div>

              <div className="w-full h-px bg-gray-100 my-2" />

              {/* Section 2 */}
              <div className="px-4 py-2 space-y-1">
                <button 
                  onClick={() => handleAction(onOpenNotifications)}
                  className="w-full flex items-center gap-4 px-3 py-3 text-sm font-semibold text-gray-700 hover:bg-gray-50 hover:text-[#F36F21] rounded-xl transition-colors text-left"
                >
                  <Bell className="w-4 h-4 text-gray-500 shrink-0" />
                  <span>Notifications</span>
                </button>
                
                <button 
                  onClick={() => handleAction(() => onNavigate?.('customer_service'))}
                  className="w-full flex items-center gap-4 px-3 py-3 text-sm font-semibold text-gray-700 hover:bg-gray-50 hover:text-[#F36F21] rounded-xl transition-colors text-left"
                >
                  <Headphones className="w-4 h-4 text-gray-500 shrink-0" />
                  <span>Customer Service</span>
                </button>
              </div>

              <div className="w-full h-px bg-gray-100 my-2" />

              {/* Section 3 */}
              <div className="px-4 py-2 space-y-1">
                <button 
                  onClick={() => handleAction(() => onNavigate?.('investor_relations'))}
                  className="w-full flex items-center gap-4 px-3 py-3 text-sm font-semibold text-gray-700 hover:bg-gray-50 hover:text-[#F36F21] rounded-xl transition-colors text-left"
                >
                  <UserCheck className="w-4 h-4 text-gray-500 shrink-0" />
                  <span>Investor Relations</span>
                </button>
              </div>

              <div className="w-full h-px bg-gray-100 my-2" />

              {/* Section 4 */}
              <div className="px-4 py-2 space-y-1 pb-10">
                <button 
                  onClick={() => handleAction(() => onNavigate?.('policy'))}
                  className="w-full flex items-center gap-4 px-3 py-3 text-sm font-semibold text-gray-700 hover:bg-gray-50 hover:text-[#F36F21] rounded-xl transition-colors text-left"
                >
                  <Shield className="w-4 h-4 text-gray-500 shrink-0" />
                  <span>Policy</span>
                </button>
                
                <button 
                  onClick={() => handleAction(() => onNavigate?.('feedback'))}
                  className="w-full flex items-center gap-4 px-3 py-3 text-sm font-semibold text-gray-700 hover:bg-gray-50 hover:text-[#F36F21] rounded-xl transition-colors text-left"
                >
                  <MessageSquare className="w-4 h-4 text-gray-500 shrink-0" />
                  <span>Feedback</span>
                </button>
                
                <button 
                  onClick={() => handleAction(() => onNavigate?.('help'))}
                  className="w-full flex items-center gap-4 px-3 py-3 text-sm font-semibold text-gray-700 hover:bg-gray-50 hover:text-[#F36F21] rounded-xl transition-colors text-left"
                >
                  <HelpCircle className="w-4 h-4 text-gray-500 shrink-0" />
                  <span>Help</span>
                </button>
                
                <button 
                  onClick={() => handleAction(onLogout)}
                  className="w-full flex items-center gap-4 px-3 py-3 text-sm font-semibold text-red-600 hover:bg-red-50 hover:text-red-700 rounded-xl transition-colors text-left mt-2"
                >
                  <LogOut className="w-4 h-4 shrink-0" />
                  <span>Logout</span>
                </button>
              </div>
              
            </div>
          </>
        )}
      </div>
    </>
  );
};

