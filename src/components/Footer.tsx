import React from 'react';
import { Link } from 'react-router-dom';
import { Facebook, Twitter, Instagram, Linkedin, Youtube, Handshake, Truck, UtensilsCrossed, ChevronRight } from 'lucide-react';

export const Footer = () => {
  return (
    <footer className="bg-white border-t border-gray-200 mt-8 pt-10 pb-6 px-4 md:px-8 shadow-inner">
      <div className="max-w-7xl mx-auto">
        {/* Top Info Section */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 pb-8 border-[#1A9E9E] border-gray-100">
          <div className="md:col-span-2">
            <h2 className="text-xl font-bold text-gray-800 mb-4">DialXprt</h2>
            <p className="text-xs text-gray-500 leading-relaxed max-w-lg mb-6">
              Welcome to DialXprt, your 'one stop shop' where you are assisted with day-to-day and exclusive planning and purchasing activities. Our service extends from providing address and contact details of business establishments, to making orders and reservations for leisure, medical, financial, travel and domestic purposes.
            </p>
            <div className="flex items-center gap-4">
              <span className="font-bold text-gray-700 text-sm">Follow us on</span>
              <div className="flex gap-2">
                <SocialIcon icon={<Facebook className="w-4 h-4 text-white" />} bg="bg-[#3b5998]" />
                <SocialIcon icon={<Youtube className="w-4 h-4 text-white" />} bg="bg-[#ff0000]" />
                <SocialIcon icon={<Instagram className="w-4 h-4 text-white" />} bg="bg-gradient-to-tr from-yellow-400 via-pink-500 to-purple-500" />
                <SocialIcon icon={<Linkedin className="w-4 h-4 text-white" />} bg="bg-[#0077b5]" />
                <SocialIcon icon={<Twitter className="w-4 h-4 text-white" />} bg="bg-black" />
              </div>
            </div>
          </div>
          
          <div>
            <h3 className="font-bold text-gray-800 mb-4 uppercase text-xs tracking-wider">Corporate</h3>
            <ul className="space-y-2 text-xs text-gray-500">
              <li><Link to="/about" className="hover:text-[#1A9E9E] transition-colors">About Us</Link></li>
              <li><Link to="/investor-relations" className="hover:text-[#1A9E9E] transition-colors">Investor Relations</Link></li>
              <li><Link to="/careers" className="hover:text-[#1A9E9E] transition-colors">We're Hiring</Link></li>
              <li><Link to="/contact" className="hover:text-[#1A9E9E] transition-colors">Contact Us</Link></li>
              <li><Link to="/list-business" className="hover:text-[#1A9E9E] transition-colors">Free Listing</Link></li>
              <li><Link to="/privacy" className="hover:text-[#1A9E9E] transition-colors">Privacy Policy</Link></li>
              <li><Link to="/terms" className="hover:text-[#1A9E9E] transition-colors">Terms of Service</Link></li>
              <li><a href="/sitemap.html" className="hover:text-[#1A9E9E] transition-colors">HTML Site Map</a></li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-bold text-gray-800 mb-4 uppercase text-xs tracking-wider">DialXprt Verticals</h3>
            <ul className="space-y-2 text-xs text-gray-500">
              <li><Link to="/hyderabad/all/real-estate" className="hover:text-[#1A9E9E] transition-colors">Real Estate & Properties</Link></li>
              <li><Link to="/hyderabad/all/travel-agents" className="hover:text-[#1A9E9E] transition-colors">Travel & Bookings</Link></li>
              <li><Link to="/hyderabad/all/hospitals" className="hover:text-[#1A9E9E] transition-colors">Health & Medical</Link></li>
              <li><Link to="/hyderabad/all/electrician" className="hover:text-[#1A9E9E] transition-colors">Home Services</Link></li>
            </ul>
          </div>
        </div>

        {/* Mega Directory Links */}
        <div className="py-8">
          <div className="mb-6">
            <h3 className="font-bold text-gray-800 mb-3 text-sm flex items-center gap-1">
              Top Neighborhoods in Hyderabad
            </h3>
            <div className="flex flex-wrap gap-x-2 gap-y-1 text-xs text-gray-500">
              {['Madhapur', 'Gachibowli', 'Jubilee Hills', 'Banjara Hills', 'Kukatpally', 'Hitech City', 'Kondapur', 'Begumpet', 'Secunderabad', 'Miyapur', 'Ameerpet', 'Mehdipatnam', 'Manikonda', 'Dilsukhnagar', 'L.B. Nagar'].map((loc, i, arr) => (
                <React.Fragment key={loc}>
                  <Link to={`/hyderabad/${loc.toLowerCase()}/all`} className="hover:text-[#1A9E9E] transition-colors">{loc}</Link>
                  {i < arr.length - 1 && <span className="text-gray-300">|</span>}
                </React.Fragment>
              ))}
            </div>
          </div>

          <div>
            <h3 className="font-bold text-gray-800 mb-3 text-sm flex items-center gap-1">
              Trending Categories
            </h3>
            <div className="flex flex-wrap gap-x-2 gap-y-1 text-xs text-gray-500">
              {[
                { name: 'Plumbers', slug: 'plumber' },
                { name: 'Electricians', slug: 'electrician' },
                { name: 'Carpenters', slug: 'carpenter' },
                { name: 'AC Repair', slug: 'ac-repair' },
                { name: 'Pest Control', slug: 'pest-control' },
                { name: 'Real Estate Agents', slug: 'real-estate' },
                { name: 'Car Mechanics', slug: 'mechanic' },
                { name: 'Packers & Movers', slug: 'packers-movers' },
                { name: 'Interior Designers', slug: 'interior-designers' },
                { name: 'Caterers', slug: 'caterers' },
                { name: 'Event Organizers', slug: 'event-organizers' },
                { name: 'Hospitals', slug: 'hospitals' }
              ].map((cat, i, arr) => (
                <React.Fragment key={cat.slug}>
                  <Link to={`/hyderabad/all/${cat.slug}`} className="hover:text-[#1A9E9E] transition-colors">{cat.name}</Link>
                  {i < arr.length - 1 && <span className="text-gray-300">|</span>}
                </React.Fragment>
              ))}
            </div>
          </div>
        </div>

        <div className="pt-6 border-t border-gray-100 text-center text-xs text-gray-400">
          <p>Copyright © {new Date().getFullYear()} DialXprt. All Rights Reserved.</p>
        </div>
      </div>
    </footer>
  );
};

const SocialIcon = ({ icon, bg }: { icon: React.ReactNode, bg: string }) => (
  <div className={`w-7 h-7 rounded-full flex items-center justify-center cursor-pointer hover:opacity-80 transition-opacity ${bg}`}>
    {icon}
  </div>
);
