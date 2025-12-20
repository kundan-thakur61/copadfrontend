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

  // Get recommended couriers
  const handleGetCouriers = async (skipShipmentCreation = false) => {
    if (loading && !skipShipmentCreation) return;
    
    try {
      setLoading(true);
      const result = await shiprocketAPI.getRecommendedCouriers(orderId, orderType);

      if (result.success && result.data.couriers) {
        setCouriers(result.data.couriers);
        setShipmentData(prev => ({ ...prev, shipmentId: result.data.shipmentId }));
        setShowCourierSelection(true);
        toast.success(`Found ${result.data.couriers.length} available couriers`);
      }
    } catch (error) {
      if (error.response?.status === 400 && error.response?.data?.message === 'Shipment not created yet' && !skipShipmentCreation) {
        toast.error('Please create shipment first using "Create Shipment" button');
      } else {
        toast.error(error.response?.data?.message || 'Failed to fetch couriers');
        console.error('Get couriers error:', error);
      }
    } finally {
      setLoading(false);
    }
  };

  // Create shipment
  const handleCreateShipment = async () => {
    if (loading) return;
    
    if (shipmentData?.shipmentId) {
      toast.info('Shipment already created for this order');
      return;
    }

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

        toast.info('Fetching available couriers...');
        await new Promise(resolve => setTimeout(resolve, 3000));
        await handleGetCouriers(true);

        if (onUpdate) onUpdate();
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to create shipment');
      console.error('Create shipment error:', error);
    } finally {
      setLoading(false);
    }
  };

  // Assign courier
  const handleAssignCourier = async (courierId = null) => {
    if (loading) return;
    
    try {
      setLoading(true);
      const result = await shiprocketAPI.assignCourier(orderId, orderType, courierId);

      if (result.success) {
        toast.success(`Courier assigned! AWB: ${result.data.awbCode}`);
        setShowCourierSelection(false);
        if (onUpdate) onUpdate();
      }
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to assign courier';
      toast.error(message);
      console.error('Assign courier error:', error);
    } finally {
      setLoading(false);
    }
  };

  // Request pickup
  const handleRequestPickup = async () => {
    if (loading) return;
    
    try {
      setLoading(true);
      const result = await shiprocketAPI.requestPickup(orderId, orderType);

      if (result.success) {
        toast.success('Pickup requested successfully!');
        if (onUpdate) onUpdate();
      }
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to request pickup';
      toast.error(message);
      console.error('Request pickup error:', error);
    } finally {
      setLoading(false);
    }
  };

  // Generate label
  const handleGenerateLabel = async () => {
    if (loading) return;
    
    try {
      setLoading(true);
      const result = await shiprocketAPI.generateLabel(orderId, orderType);

      if (result.success && result.data.labelUrl) {
        window.open(result.data.labelUrl, '_blank');
        toast.success('Label generated! Opening in new tab...');
      }
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to generate label';
      toast.error(message);
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
      // For cancel shipment, if shipment not created, just show the error
      // (doesn't make sense to create shipment just to cancel it)
      toast.error(error.response?.data?.message || 'Failed to cancel shipment');
      console.error('Cancel shipment error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow p-3 sm:p-6 mt-4">
      <h3 className="text-base sm:text-lg font-semibold mb-4 flex items-center gap-2">
        <span className="text-xl sm:text-2xl">🚚</span>
        <span className="truncate">Shiprocket Management</span>
      </h3>

      {/* Action Buttons */}
      <div className="grid grid-cols-2 sm:flex sm:flex-wrap gap-2 mb-4">
        <button
          onClick={handleCreateShipment}
          disabled={loading}
          className="px-3 py-2 sm:px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 text-xs sm:text-sm"
        >
          {loading ? '⏳' : '📦'} <span className="hidden sm:inline">Create</span> Shipment
        </button>

        <button
          onClick={() => handleAssignCourier()}
          disabled={loading}
          className="px-3 py-2 sm:px-4 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 text-xs sm:text-sm"
        >
          {loading ? '⏳' : '🚀'} <span className="hidden sm:inline">Auto-</span>Assign
        </button>

        <button
          onClick={handleGetCouriers}
          disabled={loading}
          className="px-3 py-2 sm:px-4 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 text-xs sm:text-sm"
        >
          {loading ? '⏳' : '📋'} <span className="hidden sm:inline">View</span> Couriers
        </button>

        <button
          onClick={handleRequestPickup}
          disabled={loading}
          className="px-3 py-2 sm:px-4 bg-orange-600 text-white rounded-lg hover:bg-orange-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 text-xs sm:text-sm"
        >
          {loading ? '⏳' : '📦'} <span className="hidden sm:inline">Request</span> Pickup
        </button>

        <button
          onClick={handleGenerateLabel}
          disabled={loading}
          className="px-3 py-2 sm:px-4 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 text-xs sm:text-sm"
        >
          {loading ? '⏳' : '🏷️'} <span className="hidden sm:inline">Generate</span> Label
        </button>

        <button
          onClick={handleCancelShipment}
          disabled={loading}
          className="px-3 py-2 sm:px-4 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 text-xs sm:text-sm col-span-2 sm:col-span-1"
        >
          {loading ? '⏳' : '❌'} Cancel
        </button>
      </div>

      {/* Courier Selection */}
      {showCourierSelection && couriers.length > 0 && (
        <div className="mt-6 border-t pt-4">
          <h4 className="font-semibold mb-3 text-sm sm:text-base">Select Courier:</h4>
          <div className="grid gap-2 sm:gap-3 max-h-80 overflow-y-auto">
            {couriers.map((courier) => (
              <div
                key={courier.id}
                className={`border rounded-lg p-3 sm:p-4 cursor-pointer hover:border-blue-500 transition ${
                  selectedCourier === courier.id ? 'border-blue-500 bg-blue-50' : ''
                }`}
                onClick={() => setSelectedCourier(courier.id)}
              >
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-2">
                  <div className="flex-1">
                    <h5 className="font-semibold text-sm sm:text-base">{courier.name}</h5>
                    <p className="text-xs sm:text-sm text-gray-600">
                      Delivery: {courier.estimatedDeliveryDays}
                      {courier.rating && ` • Rating: ${courier.rating}⭐`}
                    </p>
                  </div>
                  <div className="text-left sm:text-right">
                    <p className="font-bold text-base sm:text-lg">₹{courier.freight}</p>
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
            className="mt-4 w-full px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed font-medium text-sm sm:text-base"
          >
            {loading ? 'Assigning...' : 'Assign Selected Courier'}
          </button>
        </div>
      )}

      {/* Info */}
      <div className="mt-4 p-3 sm:p-4 bg-gray-50 rounded-lg text-xs sm:text-sm text-gray-600">
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
