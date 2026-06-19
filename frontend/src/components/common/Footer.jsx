import React from 'react';

/**
 * Footer Component
 */
const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-white border-t border-gray-200 mt-12">
      <div className="container mx-auto px-4 py-6">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="text-sm text-gray-500">
            © {currentYear} Transaction Data Validator
          </div>
          <div className="flex items-center space-x-6 mt-2 md:mt-0">
            <span className="text-sm text-gray-500">
              Built for Xeno Internship Drive 2026
            </span>
            <span className="text-sm text-gray-400">|</span>
            <a
              href="https://xeno.in"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-blue-600 hover:text-blue-800"
            >
              Xeno
            </a>
            <a
              href="/about"
              className="text-sm text-gray-500 hover:text-gray-700"
            >
              About
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;