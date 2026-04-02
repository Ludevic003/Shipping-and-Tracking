import React from 'react';
import { Box, Mail, Phone, MapPin, Facebook, Twitter, Linkedin, Instagram } from 'lucide-react';
import { Link } from 'react-router-dom';

const Footer = React.memo(() => {
  return (
    <footer className="bg-white border-t border-border/50 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-20">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12 text-center sm:text-left">
          
          <div className="flex flex-col items-center sm:items-start">
            <h3 className="text-sm font-semibold text-foreground tracking-wider uppercase mb-6">Quick Links</h3>
            <ul className="flex flex-col gap-4 items-center sm:items-start">
              <li>
                <Link to="/" className="text-sm text-muted-foreground hover:text-primary transition-colors duration-200">Home</Link>
              </li>
              <li>
                <Link to="/about" className="text-sm text-muted-foreground hover:text-primary transition-colors duration-200">About Us</Link>
              </li>
              <li>
                <Link to="/contact" className="text-sm text-muted-foreground hover:text-primary transition-colors duration-200">Contact Us</Link>
              </li>
              <li>
                <Link to="/#track" className="text-sm text-muted-foreground hover:text-primary transition-colors duration-200">Track Shipment</Link>
              </li>
              <li>
                <Link to="/complaint-submission" className="text-sm text-muted-foreground hover:text-primary transition-colors duration-200">Submit Complaint</Link>
              </li>
            </ul>
          </div>

          <div className="flex flex-col items-center sm:items-start">
            <h3 className="text-sm font-semibold text-foreground tracking-wider uppercase mb-6">Legal</h3>
            <ul className="flex flex-col gap-4 items-center sm:items-start">
              <li>
                <Link to="/privacy" className="text-sm text-muted-foreground hover:text-primary transition-colors duration-200">Privacy Policy</Link>
              </li>
              <li>
                <Link to="/terms" className="text-sm text-muted-foreground hover:text-primary transition-colors duration-200">Terms of Service</Link>
              </li>
              <li>
                <Link to="/insurance" className="text-sm text-muted-foreground hover:text-primary transition-colors duration-200">Insurance Policy</Link>
              </li>
              <li>
                <Link to="/live-animal-shipping" className="text-sm text-muted-foreground hover:text-primary transition-colors duration-200">Live Animal Shipping</Link>
              </li>
            </ul>
          </div>

          <div className="flex flex-col items-center sm:items-start">
            <h3 className="text-sm font-semibold text-foreground tracking-wider uppercase mb-6">Global Offices</h3>
            <ul className="flex flex-col gap-5 items-center sm:items-start">
              <li className="flex flex-col sm:flex-row items-center sm:items-start gap-2 sm:gap-3">
                <MapPin className="w-4 h-4 text-primary mt-0.5 shrink-0 hidden sm:block" />
                <div className="text-center sm:text-left">
                  <p className="text-sm font-medium text-foreground">Los Angeles, USA</p>
                  <p className="text-xs text-muted-foreground mt-1">Americas Hub</p>
                </div>
              </li>
              <li className="flex flex-col sm:flex-row items-center sm:items-start gap-2 sm:gap-3">
                <MapPin className="w-4 h-4 text-primary mt-0.5 shrink-0 hidden sm:block" />
                <div className="text-center sm:text-left">
                  <p className="text-sm font-medium text-foreground">Dubai, UAE</p>
                  <p className="text-xs text-muted-foreground mt-1">Middle East Hub</p>
                </div>
              </li>
              <li className="flex flex-col sm:flex-row items-center sm:items-start gap-2 sm:gap-3">
                <MapPin className="w-4 h-4 text-primary mt-0.5 shrink-0 hidden sm:block" />
                <div className="text-center sm:text-left">
                  <p className="text-sm font-medium text-foreground">Bangkok, Thailand</p>
                  <p className="text-xs text-muted-foreground mt-1">East Asia Hub</p>
                </div>
              </li>
              <li className="flex flex-col sm:flex-row items-center sm:items-start gap-2 sm:gap-3">
                <MapPin className="w-4 h-4 text-primary mt-0.5 shrink-0 hidden sm:block" />
                <div className="text-center sm:text-left">
                  <p className="text-sm font-medium text-foreground">Nairobi, Kenya</p>
                  <p className="text-xs text-muted-foreground mt-1">Africa Hub</p>
                </div>
              </li>
            </ul>
          </div>

          <div className="flex flex-col items-center sm:items-start">
            <Link to="/" className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center shadow-sm">
                <Box className="w-5 h-5 text-primary-foreground" />
              </div>
              <div className="flex flex-col text-left">
                <span className="text-lg font-bold text-foreground leading-none tracking-tight">US Box</span>
                <span className="text-xs font-medium text-muted-foreground leading-none mt-1 tracking-wide uppercase">Mail Services</span>
              </div>
            </Link>
            
            <ul className="flex flex-col gap-4 mb-8 items-center sm:items-start">
              <li className="flex items-center gap-3">
                <Phone className="w-4 h-4 text-muted-foreground shrink-0" />
                <span className="text-sm text-muted-foreground">+1 (310) 913-1570</span>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="w-4 h-4 text-muted-foreground shrink-0" />
                <span className="text-sm text-muted-foreground">support@usboxmail.com</span>
              </li>
            </ul>

            <div className="flex items-center justify-center sm:justify-start gap-4">
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" aria-label="Facebook" className="w-10 h-10 rounded-full border border-border/50 flex items-center justify-center text-muted-foreground hover:bg-primary hover:text-primary-foreground hover:border-primary transition-all duration-300">
                <Facebook className="w-4 h-4" />
              </a>
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" aria-label="Twitter" className="w-10 h-10 rounded-full border border-border/50 flex items-center justify-center text-muted-foreground hover:bg-primary hover:text-primary-foreground hover:border-primary transition-all duration-300">
                <Twitter className="w-4 h-4" />
              </a>
              <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn" className="w-10 h-10 rounded-full border border-border/50 flex items-center justify-center text-muted-foreground hover:bg-primary hover:text-primary-foreground hover:border-primary transition-all duration-300">
                <Linkedin className="w-4 h-4" />
              </a>
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" aria-label="Instagram" className="w-10 h-10 rounded-full border border-border/50 flex items-center justify-center text-muted-foreground hover:bg-primary hover:text-primary-foreground hover:border-primary transition-all duration-300">
                <Instagram className="w-4 h-4" />
              </a>
            </div>
          </div>

        </div>

        <div className="border-t border-border/50 mt-16 pt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-center md:text-left">
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} US Box Mail Services. All rights reserved.
          </p>
          <div className="flex flex-wrap justify-center items-center gap-4 sm:gap-6">
            <Link to="/privacy" className="text-sm text-muted-foreground hover:text-foreground transition-colors duration-200">
              Privacy Policy
            </Link>
            <Link to="/terms" className="text-sm text-muted-foreground hover:text-foreground transition-colors duration-200">
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
});

export default Footer;