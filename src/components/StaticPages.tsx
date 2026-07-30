import React from 'react';

const pageData: Record<string, { title: string, content: string }> = {
  'about': {
    title: 'About Us',
    content: 'DialXprt is your one-stop solution for finding the best local services across Hyderabad. We connect you with trusted professionals quickly and securely.'
  },
  'investor-relations': {
    title: 'Investor Relations',
    content: 'Interested in partnering with DialXprt? Contact our corporate team to learn more about our growth, financials, and future expansion plans.'
  },
  'careers': {
    title: 'Careers at DialXprt',
    content: 'Join our dynamic team! We are always looking for passionate engineers, designers, and customer support specialists.'
  },
  'contact': {
    title: 'Contact Us',
    content: 'Need help? Reach out to our 24/7 support team via email at support@dialxprt.com or call our toll-free number.'
  },
  'free-listing': {
    title: 'Free Business Listing',
    content: 'Are you a service provider? Register your business on DialXprt for free and get access to thousands of daily customers in your area.'
  },
  'privacy': {
    title: 'Privacy Policy',
    content: 'We take your privacy seriously. Your data is encrypted and never sold to third parties. Read our full privacy commitments here.'
  },
  'terms': {
    title: 'Terms of Service',
    content: 'By using DialXprt, you agree to our standard terms and conditions. We ensure a safe and fair marketplace for all users.'
  }
};

export const StaticPage = ({ route }: { route: string }) => {
  const data = pageData[route] || { title: 'Page Not Found', content: 'The page you are looking for does not exist.' };
  
  return (
    <div className="bg-white border border-gray-200 rounded-3xl p-8 md:p-12 max-w-4xl mx-auto shadow-sm my-8">
      <h1 className="text-3xl font-extrabold text-gray-900 mb-6">{data.title}</h1>
      <div className="prose prose-blue max-w-none text-gray-600 leading-relaxed">
        <p className="text-lg">{data.content}</p>
        <p className="mt-8 text-sm text-gray-400">
          Note: This is a placeholder page for SEO and structural purposes. In production, this would contain full legal or corporate text.
        </p>
      </div>
    </div>
  );
};
