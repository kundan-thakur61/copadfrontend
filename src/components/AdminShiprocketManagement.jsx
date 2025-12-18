import { useState } from 'react';
import { toast } from 'react-toastify';
import * as shiprocketAPI from '../api/shiprocket';

/**
 * Admin Shiprocket Management Component
 * Manage shipments for orders
 */
export default function AdminShiprocketManagement({ orderId, orderType = 'regular', onUpdate }) {
  const [loading, setLoading] = useState(false);
  const [shipmentData, setShipmentData] = useState(null);
  const [couriers, setCouriers] = useState([]);
  const [selectedCourier, setSelectedCourier] = useState(null);
  const [showCourierSelection, setShowCourierSelection] = useState(false);

  // Create shipment
  const handleCreateShipment = async () => {
    try {
      setLoading(true);
      const result = await shiprocketAPI.createShipment(orderId, orderType, {
        pickupLocation: 'Primary',
        dimensions: { length: 15, breadth: 10, height: 2 },
        weight: 0.15
      });
      
      if (result.success) {
        setShipmentData(result.data);
        toast.success('Shipment created successfully!');
        
        // Auto-fetch recommended couriers
        await handleGetCouriers();
        
        if (onUpdate) onUpdate();
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to create shipment');
      console.error('Create shipment error:', error);
    } finally {
      setLoading(false);
    }
  };

  // Get recommended couriers
  const handleGetCouriers = async () => {
    try {
      setLoading(true);
      const result = await shiprocketAPI.getRecommendedCouriers(orderId, orderType);
      
      if (result.success && result.data.couriers) {
        setCouriers(result.data.couriers);
        setShowCourierSelection(true);
        toast.success(`Found ${result.data.couriers.length} available couriers`);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to fetch couriers');
      console.error('Get couriers error:', error);
    } finally {
      setLoading(false);
    }
  };

  // Assign courier
  const handleAssignCourier = async (courierId = null) => {
    try {
      setLoading(true);
      const result = await shiprocketAPI.assignCourier(orderId, orderType, courierId);
      
      if (result.success) {
        toast.success(`Courier assigned! AWB: ${result.data.awbCode}`);
        setShowCourierSelection(false);
        if (onUpdate) onUpdate();
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to assign courier');
      console.error('Assign courier error:', error);
    } finally {
      setLoading(false);
    }
  };

  // Request pickup
  const handleRequestPickup = async () => {
    try {
      setLoading(true);
      const result = await shiprocketAPI.requestPickup(orderId, orderType);
      
      if (result.success) {
        toast.success('Pickup requested successfully!');
        if (onUpdate) onUpdate();
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to request pickup');
      console.error('Request pickup error:', error);
    } finally {
      setLoading(false);
    }
  };

  // Generate label
  const handleGenerateLabel = async () => {
    try {
      setLoading(true);
      const result = await shiprocketAPI.generateLabel(orderId, orderType);
      
      if (result.success && result.data.labelUrl) {
        window.open(result.data.labelUrl, '_blank');
        toast.success('Label generated! Opening in new tab...');
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to generate label');
      console.error('Generate label error:', error);
    } finally {
      setLoading(false);
    }
  };

  // Cancel shipment
  const handleCancelShipment = async () => {
    if (!confirm('Are you sure you want to cancel this shipment?')) return;
    
    try {
      setLoading(true);
      const result = await shiprocketAPI.cancelShipment(orderId, orderType);
      
      if (result.success) {
        toast.success('Shipment cancelled successfully');
        if (onUpdate) onUpdate();
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to cancel shipment');
      console.error('Cancel shipment error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow p-6 mt-4">
      <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
        <span className="text-2xl">🚚</span>
        Shiprocket Management
      </h3>

      {/* Action Buttons */}
      <div className="flex flex-wrap gap-2 mb-4">
        <button
          onClick={handleCreateShipment}
          disabled={loading}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
        >
          {loading ? '⏳' : '📦'} Create Shipment
        </button>

        <button
          onClick={() => handleAssignCourier()}
          disabled={loading}
          className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
        >
          {loading ? '⏳' : '🚀'} Auto-Assign Courier
        </button>

        <button
          onClick={handleGetCouriers}
          disabled={loading}
          className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
        >
          {loading ? '⏳' : '📋'} View Couriers
        </button>

        <button
          onClick={handleRequestPickup}
          disabled={loading}
          className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
        >
          {loading ? '⏳' : '📦'} Request Pickup
        </button>

        <button
          onClick={handleGenerateLabel}
          disabled={loading}
          className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
        >
          {loading ? '⏳' : '🏷️'} Generate Label
        </button>

        <button
          onClick={handleCancelShipment}
          disabled={loading}
          className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
        >
          {loading ? '⏳' : '❌'} Cancel Shipment
        </button>
      </div>

      {/* Courier Selection */}
      {showCourierSelection && couriers.length > 0 && (
        <div className="mt-6 border-t pt-4">
          <h4 className="font-semibold mb-3">Select Courier:</h4>
          <div className="grid gap-3 max-h-80 overflow-y-auto">
            {couriers.map((courier) => (
              <div
                key={courier.id}
                className={`border rounded-lg p-4 cursor-pointer hover:border-blue-500 transition ${
                  selectedCourier === courier.id ? 'border-blue-500 bg-blue-50' : ''
                }`}
                onClick={() => setSelectedCourier(courier.id)}
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h5 className="font-semibold">{courier.name}</h5>
                    <p className="text-sm text-gray-600">
                      Delivery: {courier.estimatedDeliveryDays}
                      {courier.rating && ` • Rating: ${courier.rating}⭐`}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-lg">₹{courier.freight}</p>
                    {courier.etd && (
                      <p className="text-xs text-gray-500">ETA: {courier.etd}</p>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          <button
            onClick={() => handleAssignCourier(selectedCourier)}
            disabled={!selectedCourier || loading}
            className="mt-4 w-full px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Assigning...' : 'Assign Selected Courier'}
          </button>
        </div>
      )}

      {/* Info */}
      <div className="mt-4 p-4 bg-gray-50 rounded-lg text-sm text-gray-600">
        <p className="font-semibold mb-2">Workflow:</p>
        <ol className="list-decimal list-inside space-y-1">
          <li>Create Shipment in Shiprocket</li>
          <li>Auto-assign cheapest courier OR select manually</li>
          <li>Generate shipping label (optional)</li>
          <li>Request pickup from courier</li>
        </ol>
      </div>
    </div>
  );
}
