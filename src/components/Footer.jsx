import { Link } from 'react-router-dom';
import { FiFacebook, FiInstagram, FiYoutube } from 'react-icons/fi';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-secondary-900 text-white">
      <div className="max-w-7xl mx-auto px-4 py-12">

        {/* Top Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">

          {/* Brand */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 border-6 border-black-900 rounded-lg p-2 shadow-lg">
              <img
                src="https://res.cloudinary.com/dwmytphop/image/upload/v1766473299/ChatGPT_Image_Dec_23_2025_12_30_26_PM_oyeb3g.jpg"
                alt="Cover Ghar"
                className="w-8 h-8 rounded-lg"
              />
              <span className="text-xl font-bold">Cover Ghar</span>
            </div>

            <p className="text-gray-300 text-sm">
              Design your own custom mobile covers with premium quality
              and fast delivery.
            </p>

            <div className="flex gap-4">
              <a
                href="https://www.facebook.com/profile.php?id=61584778613908"
                target="_blank"
                rel="noreferrer"
              >
                <FiFacebook className="w-5 h-5 text-gray-400 hover:text-white" />
              </a>

              <a
                href="https://www.instagram.com/gharcover"
                target="_blank"
                rel="noreferrer"
              >
                <FiInstagram className="w-5 h-5 text-gray-400 hover:text-white" />
              </a>

              <a
                href="https://youtube.com/@coverghar"
                target="_blank"
                rel="noreferrer"
              >
                <FiYoutube className="w-5 h-5 text-gray-400 hover:text-white" />
              </a>
            </div>
          </div>

          {/* Support */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Support</h3>
            <ul className="space-y-2 text-sm text-gray-300">
              <li><Link to="/shipping-policy" className="hover:text-white">Shipping Policy</Link></li>
              <li><Link to="/privacy-policy" className="hover:text-white">Privacy Policy</Link></li>
              <li><Link to="/returns-refunds" className="hover:text-white">Returns & Refunds</Link></li>
              <li><Link to="/terms-conditions" className="hover:text-white">Terms & Conditions</Link></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Contact</h3>
            <div className="text-sm text-gray-300 space-y-3">
              <div>
                <p className="font-medium">Email</p>
                <a href="mailto:coverghar@gmail.com" className="hover:text-white">
                  coverghar@gmail.com
                </a>
              </div>
              <div>
                <p className="font-medium">Address</p>
                <p>Ranchi (JH) 825418</p>
              </div>
            </div>
          </div>

          <div className="hidden lg:block" />
        </div>

        {/* Bottom */}
        <div className="border-t border-gray-700 mt-10 pt-6 text-center">
          <p className="text-gray-400 text-sm">
            © {currentYear} Cover Ghar. All rights reserved.
          </p>
        </div>

      </div>
    </footer>
  );
};

export default Footer;
