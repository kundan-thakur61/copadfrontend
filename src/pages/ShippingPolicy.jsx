import { Link } from 'react-router-dom';
import SEO from '../components/SEO';

const ShippingPolicy = () => {
  return (
    <>
      <SEO
        title="Shipping Policy | Cover Ghar"
        description="Check our shipping policy for delivery timelines, charges, and courier partners."
        url="/shipping-policy"
      />

      <div className="max-w-4xl mx-auto px-4 py-8 space-y-8">
        <div>
          <h3 className="text-xl font-bold mb-2">📦 Shipping Policy</h3>
          <p className="text-gray-700">
            Welcome to Cover Ghar. We aim to deliver your products safely and on time.
            Please read our shipping policy carefully.
          </p>
        </div>

        <div>
          <h3 className="text-xl font-bold mb-2">🚚 Shipping Locations</h3>
          <p className="text-gray-700">
            We ship across India to most serviceable PIN codes.
            Delivery to remote locations may take additional time.
          </p>
        </div>

        <div>
          <h3 className="text-xl font-bold mb-2">⏱️ Order Processing Time</h3>
          <ol className="list-decimal list-inside text-gray-700 space-y-1">
            <li>Orders are processed within 1–2 business days.</li>
            <li>Delay may occur during festivals or sales.</li>
          </ol>
        </div>

        <div>
          <h3 className="text-xl font-bold mb-2">💰 Shipping Charges</h3>
          <p className="text-gray-700">
            Shipping charges depend on order value and location.
            Final charges are shown at checkout.
          </p>
        </div>

        <div>
          <h3 className="text-xl font-bold mb-2">📦 Courier Partners</h3>
          <p className="text-gray-700">
            We use Delhivery, Ecom Express, Blue Dart, or other trusted partners.
          </p>
        </div>

        <div>
          <h3 className="text-xl font-bold mb-2">🔍 Order Tracking</h3>
          <p className="text-gray-700">
            Tracking details are sent via SMS or Email after shipping.
          </p>
        </div>

        <div>
          <h3 className="text-xl font-bold mb-2">❌ Delivery Delays</h3>
          <p className="text-gray-700">
            Delays due to courier, weather, or wrong address are not our responsibility,
            but we will help as much as possible.
          </p>
        </div>

        <div>
          <h3 className="text-xl font-bold mb-2">🏠 Incorrect Address</h3>
          <p className="text-gray-700">
            Please enter the correct address.
            Re-delivery may cost extra if the address is wrong.
          </p>
        </div>

        <div>
          <h3 className="text-xl font-bold mb-2">📞 Contact Us</h3>
          <p className="text-gray-700">
            Email: coverghar@gmail.com
          </p>
        </div>
      </div>
    </>
  );
};

export default ShippingPolicy;
