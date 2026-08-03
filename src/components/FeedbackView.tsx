import React, { useState } from 'react';
import { ArrowLeft, MessageSquare, CheckCircle2, Star } from 'lucide-react';
import { saveFeedback } from '../lib/adminApi';

interface FeedbackViewProps {
  onBack: () => void;
}

type FeedbackType = 'feature' | 'bug' | 'other';

export const FeedbackView: React.FC<FeedbackViewProps> = ({ onBack }) => {
  const [rating, setRating] = useState<number>(0);
  const [hoveredRating, setHoveredRating] = useState<number>(0);
  const [feedbackType, setFeedbackType] = useState<FeedbackType>('feature');
  const [message, setMessage] = useState('');
  const [formState, setFormState] = useState<'idle' | 'submitting' | 'success'>('idle');

  const adminEmail = 'dialxprt@gmail.com';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormState('submitting');
    
    await saveFeedback({
      rating,
      type: feedbackType,
      message
    });
    
    setFormState('success');
    setTimeout(() => {
      setFormState('idle');
      setMessage('');
      setRating(0);
    }, 5000);
  };

  return (
    <div className="bg-[#F4F7FA] min-h-screen pb-24">
      {/* Header */}
      <div className="bg-white sticky top-0 z-30 shadow-sm border-b border-gray-100">
        <div className="flex items-center px-4 py-4 max-w-lg mx-auto gap-3">
          <button 
            onClick={onBack}
            className="p-2 -ml-2 text-gray-500 hover:bg-gray-100 rounded-full transition-colors active:scale-95"
          >
            <ArrowLeft className="w-6 h-6" />
          </button>
          <h1 className="text-xl font-black text-gray-900 flex items-center gap-2">
            <MessageSquare className="w-5 h-5 text-purple-500" />
            Share Feedback
          </h1>
        </div>
      </div>

      <div className="max-w-lg mx-auto p-4 space-y-6 mt-2">
        {/* Intro */}
        <div className="text-center space-y-2 px-4">
          <p className="text-gray-600 text-sm leading-relaxed">
            We are constantly improving DialXprt for Hyderabad. Let us know what features you want to see next or if you found any bugs!
          </p>
        </div>

        {/* Feedback Form */}
        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-5">
          {formState === 'success' ? (
            <div className="bg-emerald-50 rounded-2xl p-6 text-center space-y-3 border border-emerald-100 animate-fade-in py-10">
              <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle2 className="w-8 h-8 text-emerald-600" />
              </div>
              <h3 className="text-xl font-black text-emerald-900">Thank You!</h3>
              <p className="text-sm text-emerald-700 leading-relaxed">
                Your feedback is invaluable to us. We will review your message carefully.
              </p>
              <button
                onClick={onBack}
                className="mt-4 px-6 py-2.5 bg-emerald-600 text-white font-bold rounded-xl active:scale-95 transition-all"
              >
                Go Back Home
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              
              {/* Star Rating */}
              <div className="space-y-3 text-center pt-2">
                <label className="block text-sm font-bold text-gray-900">Rate your experience</label>
                <div className="flex items-center justify-center gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setRating(star)}
                      onMouseEnter={() => setHoveredRating(star)}
                      onMouseLeave={() => setHoveredRating(0)}
                      className="p-1 transition-all active:scale-90 focus:outline-none"
                    >
                      <Star 
                        className={`w-9 h-9 transition-colors duration-200 ${
                          star <= (hoveredRating || rating)
                            ? 'fill-amber-400 text-amber-400' 
                            : 'fill-gray-100 text-gray-300'
                        }`} 
                      />
                    </button>
                  ))}
                </div>
              </div>

              <div className="h-px bg-gray-100 w-full" />

              {/* Feedback Type Toggle */}
              <div className="space-y-3">
                <label className="block text-sm font-bold text-gray-900 ml-1">What is this regarding?</label>
                <div className="flex bg-gray-50 p-1 rounded-xl border border-gray-200 overflow-hidden">
                  <button
                    type="button"
                    onClick={() => setFeedbackType('feature')}
                    className={`flex-1 py-2.5 text-xs font-bold rounded-lg transition-all ${feedbackType === 'feature' ? 'bg-white text-purple-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
                  >
                    💡 Suggestion
                  </button>
                  <button
                    type="button"
                    onClick={() => setFeedbackType('bug')}
                    className={`flex-1 py-2.5 text-xs font-bold rounded-lg transition-all ${feedbackType === 'bug' ? 'bg-white text-rose-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
                  >
                    🐛 Bug Report
                  </button>
                  <button
                    type="button"
                    onClick={() => setFeedbackType('other')}
                    className={`flex-1 py-2.5 text-xs font-bold rounded-lg transition-all ${feedbackType === 'other' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
                  >
                    💬 Other
                  </button>
                </div>
              </div>

              {/* Message */}
              <div className="space-y-2">
                <label className="block text-sm font-bold text-gray-900 ml-1">Your detailed feedback</label>
                <textarea 
                  required
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  rows={5}
                  placeholder={feedbackType === 'bug' ? 'Describe the bug you found...' : 'Tell us what features you want next...'}
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:bg-white transition-all resize-none"
                ></textarea>
              </div>

              <button 
                type="submit"
                disabled={formState === 'submitting'}
                className="w-full bg-purple-600 text-white font-bold py-3.5 rounded-xl hover:bg-purple-700 active:scale-95 transition-all shadow-md disabled:opacity-70 flex justify-center items-center h-[52px]"
              >
                {formState === 'submitting' ? (
                  <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                ) : (
                  'Submit Feedback'
                )}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
