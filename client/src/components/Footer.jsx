import React from 'react';
import { Link } from 'react-router-dom';
import { PawPrint, Heart, Shield, AlertTriangle, PhoneCall, ExternalLink } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-sand-900 text-sand-200 pt-16 pb-12 mt-20 border-t border-sand-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 pb-12 border-b border-sand-800">
          
          {/* Mission & Brand */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-brand-500 flex items-center justify-center text-white">
                <PawPrint className="w-4 h-4 fill-white" />
              </div>
              <span className="font-extrabold text-lg text-white tracking-tight">
                PawMatch India
              </span>
            </div>
            <p className="text-sm text-sand-300 leading-relaxed">
              Empowering urban Indian pet adopters through transparent, explainable lifestyle compatibility.
              We champion resilient indigenous Indie breeds and responsible 10-15 year commitments.
            </p>
            <div className="flex items-center gap-2 text-xs text-brand-400 font-medium">
              <Heart className="w-3.5 h-3.5 fill-brand-400" />
              <span>Proudly promoting Indian Pariah Dogs & Cats</span>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white text-sm font-bold uppercase tracking-wider mb-4">Explore</h4>
            <ul className="space-y-2.5 text-sm text-sand-300">
              <li>
                <Link to="/about" className="hover:text-brand-400 transition-colors">About Us</Link>
              </li>
              <li>
                <Link to="/quiz" className="hover:text-brand-400 transition-colors">Compatibility Quiz</Link>
              </li>
              <li>
                <Link to="/pets" className="hover:text-brand-400 transition-colors">Pet Breed Directory</Link>
              </li>
              <li>
                <Link to="/adopt" className="hover:text-brand-400 transition-colors">Adoptable Animals</Link>
              </li>
              <li>
                <Link to="/foster" className="hover:text-brand-400 transition-colors">Self-Managed Foster Trials</Link>
              </li>
              <li>
                <Link to="/first-30-days" className="hover:text-brand-400 transition-colors">First 30 Days (3-3-3 Rule)</Link>
              </li>
              <li>
                <Link to="/advisor" className="hover:text-brand-400 transition-colors">AI Pet Advisor</Link>
              </li>
            </ul>
          </div>

          {/* Legal Rights & Indian Welfare Context */}
          <div>
            <h4 className="text-white text-sm font-bold uppercase tracking-wider mb-4 flex items-center gap-1.5">
              <Shield className="w-4 h-4 text-emerald-400" />
              <span>Adopter Rights (AWBI)</span>
            </h4>
            <p className="text-xs text-sand-300 leading-relaxed mb-3">
              Under statutory guidelines issued by the <strong>Animal Welfare Board of India (AWBI)</strong>, Resident Welfare Associations (RWAs) and apartment societies cannot legally ban companion pets or mandate breed restrictions.
            </p>
            <p className="text-xs text-sand-300 leading-relaxed">
              Always request written landlord permission and register your pet with your local municipal corporation.
            </p>
          </div>

          {/* Prototype & Medical Disclaimer */}
          <div>
            <h4 className="text-white text-sm font-bold uppercase tracking-wider mb-4 flex items-center gap-1.5">
              <AlertTriangle className="w-4 h-4 text-amber-400" />
              <span>Veterinary Disclaimer</span>
            </h4>
            <div className="bg-sand-800/80 p-3.5 rounded-xl border border-sand-700/60 text-xs text-sand-300 leading-relaxed space-y-2">
              <p>
                <strong>PawMatch AI Advisor</strong> is an educational lifestyle matching tool and does not provide veterinary medical diagnoses, treatment, or drug prescriptions.
              </p>
              <p className="text-amber-300/90 font-medium">
                In acute emergencies (poisoning, severe vomiting, heat distress), take your pet to a licensed 24x7 animal hospital immediately.
              </p>
            </div>
          </div>

        </div>

        {/* Bottom bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-sand-400 gap-4">
          <p>© {new Date().getFullYear()} PawMatch India. Open Prototype for Urban Animal Welfare.</p>
          <div className="flex items-center gap-6">
            <span>Free Tier & Zero Paid Services</span>
            <span className="text-emerald-400 font-medium flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              All Systems Operational
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
