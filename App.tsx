
import React from 'react';
import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Explore from './pages/Explore';
import Donate from './pages/Donate';
import Impact from './pages/Impact';
import Volunteer from './pages/Volunteer';

const App: React.FC = () => {
  return (
    <Router>
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/explore" element={<Explore />} />
            <Route path="/donate" element={<Donate />} />
            <Route path="/impact" element={<Impact />} />
            <Route path="/volunteer" element={<Volunteer />} />
          </Routes>
        </main>
        
        {/* Footer */}
        <footer className="bg-white border-t border-slate-200 py-12 px-4">
          <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
            <div className="col-span-2">
              <div className="flex items-center gap-2 mb-6">
                <div className="bg-emerald-600 p-2 rounded-lg">
                  <div className="w-4 h-4 bg-white rounded-full flex items-center justify-center">
                    <div className="w-2 h-2 bg-emerald-600 rounded-full" />
                  </div>
                </div>
                <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-emerald-600 to-teal-700">
                  FoodForAll
                </span>
              </div>
              <p className="text-slate-500 max-w-sm">
                Empowering communities to end hunger and reduce waste through collective action and intelligent technology.
              </p>
            </div>
            <div>
              <h4 className="font-bold mb-4">Platform</h4>
              <ul className="space-y-2 text-slate-500 text-sm">
                <li><a href="#" className="hover:text-emerald-600 transition-colors">How it Works</a></li>
                <li><a href="#" className="hover:text-emerald-600 transition-colors">Safety Guidelines</a></li>
                <li><a href="#" className="hover:text-emerald-600 transition-colors">NGO Directory</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-4">Company</h4>
              <ul className="space-y-2 text-slate-500 text-sm">
                <li><a href="#" className="hover:text-emerald-600 transition-colors">About Us</a></li>
                <li><a href="#" className="hover:text-emerald-600 transition-colors">Contact</a></li>
                <li><a href="#" className="hover:text-emerald-600 transition-colors">Privacy Policy</a></li>
              </ul>
            </div>
          </div>
          <div className="max-w-7xl mx-auto pt-8 border-t border-slate-100 flex flex-col md:flex-row justify-between items-center gap-4 text-slate-400 text-sm">
            <p>© 2024 FoodForAll. All rights reserved.</p>
            <div className="flex gap-6">
              <a href="#" className="hover:text-slate-600 transition-colors">Twitter</a>
              <a href="#" className="hover:text-slate-600 transition-colors">Instagram</a>
              <a href="#" className="hover:text-slate-600 transition-colors">LinkedIn</a>
            </div>
          </div>
        </footer>
      </div>
    </Router>
  );
};

export default App;
