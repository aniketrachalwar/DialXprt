import React from 'react';
import { Bell, CheckCircle2, X, Clock, ShieldCheck } from 'lucide-react';
import { NotificationItem } from '../types';
import { AppLanguage, getTranslation } from '../lib/translations';

interface NotificationToastProps {
  notifications: NotificationItem[];
  onCloseNotification: (id: string) => void;
  isOpenModal: boolean;
  onCloseModal: () => void;
  currentLang?: AppLanguage;
}

export const NotificationToast: React.FC<NotificationToastProps> = ({
  notifications,
  onCloseNotification,
  isOpenModal,
  onCloseModal,
  currentLang = 'en',
}) => {
  const t = (key: string) => getTranslation(currentLang, key);

  return (
    <>
      {/* Floating Active Toast Container */}
      <div className="fixed top-16 right-3 left-3 sm:left-auto sm:w-96 z-50 space-y-2 pointer-events-none">
        {notifications.filter((n) => !n.read).slice(0, 2).map((n) => (
          <div
            key={n.id}
            className="pointer-events-auto bg-gray-900 text-white rounded-2xl p-3.5 shadow-2xl border border-indigo-500/40 flex items-start gap-3 animate-fade-in"
          >
            <div className="w-8 h-8 rounded-full bg-emerald-500 text-gray-900 flex items-center justify-center shrink-0 mt-0.5 font-bold">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <div className="flex-1 text-xs">
              <h4 className="font-bold text-amber-400 text-sm leading-tight">{n.title}</h4>
              <p className="text-gray-200 mt-0.5">{n.message}</p>
              <span className="text-[10px] text-gray-400 mt-1 block">{t('realtimeSync')}</span>
            </div>
            <button
              onClick={() => onCloseNotification(n.id)}
              className="text-gray-400 hover:text-white p-1"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>

      {/* Notifications History Modal */}
      {isOpenModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[80vh]">
            <div className="bg-[#1A237E] text-white p-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Bell className="w-5 h-5 text-[#F57C00]" />
                <h2 className="font-bold text-base">{t('platformAlerts')}</h2>
              </div>
              <button onClick={onCloseModal} className="text-indigo-200 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-4 overflow-y-auto space-y-3 divide-y divide-gray-100 flex-1">
              {notifications.length === 0 ? (
                <div className="text-center py-8 text-gray-500 text-xs">
                  {t('noNotificationsYet')}
                </div>
              ) : (
                notifications.map((item) => (
                  <div key={item.id} className="pt-3 first:pt-0 space-y-1">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-bold text-gray-900">{item.title}</span>
                      <span className="text-[10px] text-gray-400">
                        {new Date(item.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                    <p className="text-xs text-gray-600">{item.message}</p>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};
