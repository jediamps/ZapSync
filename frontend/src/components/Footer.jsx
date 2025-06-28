const Footer = () => {
    return (
      <footer className="bg-white border-t border-gray-200 py-4 px-6">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="text-gray-600 text-sm mb-2 md:mb-0">
            © {new Date().getFullYear()} ZapSync. All rights reserved.
          </div>
          <div className="flex space-x-4">
            <a href="#" className="text-gray-600 hover:text-blue-600 text-sm">Terms</a>
            <a href="#" className="text-gray-600 hover:text-blue-600 text-sm">Privacy</a>
            <a href="#" className="text-gray-600 hover:text-blue-600 text-sm">Help</a>
          </div>
        </div>
      </footer>
    );
  };
  
  export default Footer;