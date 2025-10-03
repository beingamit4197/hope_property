import { Facebook, Twitter, Instagram, Linkedin } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-primary text-white relative overflow-hidden hidden md:block">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,rgba(152,193,217,0.1),transparent_50%)]"></div>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,rgba(201,184,224,0.1),transparent_50%)]"></div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 relative">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-2xl font-bold mb-4">Hope Livings</h3>
            <p className="text-white/80 mb-4">
              Your trusted partner in finding the perfect home. We're committed to making your real estate journey smooth and successful.
            </p>
            <div className="flex space-x-3">
              <a href="#" className="bg-white/10 p-2.5 rounded-full hover:bg-white/20 transition-all duration-300 hover:scale-110">
                <Facebook className="h-5 w-5" />
              </a>
              <a href="#" className="bg-white/10 p-2.5 rounded-full hover:bg-white/20 transition-all duration-300 hover:scale-110">
                <Twitter className="h-5 w-5" />
              </a>
              <a href="#" className="bg-white/10 p-2.5 rounded-full hover:bg-white/20 transition-all duration-300 hover:scale-110">
                <Instagram className="h-5 w-5" />
              </a>
              <a href="#" className="bg-white/10 p-2.5 rounded-full hover:bg-white/20 transition-all duration-300 hover:scale-110">
                <Linkedin className="h-5 w-5" />
              </a>
            </div>
          </div>
          
          <div>
            <h4 className="font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2 text-white/80">
              <li><a href="#home" className="hover:text-white transition-all duration-300 hover:translate-x-1 inline-block">Home</a></li>
              <li><a href="#properties" className="hover:text-white transition-all duration-300 hover:translate-x-1 inline-block">Properties</a></li>
              <li><a href="#about" className="hover:text-white transition-all duration-300 hover:translate-x-1 inline-block">About Us</a></li>
              <li><a href="#contact" className="hover:text-white transition-all duration-300 hover:translate-x-1 inline-block">Contact</a></li>
              <li><a href="#" className="hover:text-white transition-all duration-300 hover:translate-x-1 inline-block">Blog</a></li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-semibold mb-4">Services</h4>
            <ul className="space-y-2 text-white/80">
              <li><a href="#" className="hover:text-white transition-all duration-300 hover:translate-x-1 inline-block">Buy Property</a></li>
              <li><a href="#" className="hover:text-white transition-all duration-300 hover:translate-x-1 inline-block">Sell Property</a></li>
              <li><a href="#" className="hover:text-white transition-all duration-300 hover:translate-x-1 inline-block">Rent Property</a></li>
              <li><a href="#" className="hover:text-white transition-all duration-300 hover:translate-x-1 inline-block">Property Management</a></li>
              <li><a href="#" className="hover:text-white transition-all duration-300 hover:translate-x-1 inline-block">Investment Consulting</a></li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-semibold mb-4">Contact Info</h4>
            <div className="space-y-2 text-white/80">
              <p>123 Linking Road</p>
              <p>Bandra West, Mumbai 400050</p>
              <p>Phone: +91 98765 43210</p>
              <p>Email: info@hopelivings.com</p>
            </div>
          </div>
        </div>
        
        <div className="border-t border-white/20 mt-8 pt-8 text-center text-white/80">
          <p>&copy; 2025 Hope Livings. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}