import { useState, useEffect } from 'react';
import { trackShipment } from '../api/shiprocket';
import { toast } from 'react-toastify';

/**
 * Shipment Tracking Component
 * Displays real-time tracking information for users
 */
export default function ShipmentTracking({ orderId, orderType = 'regular', awbCode, courierName }) {
  const [trackingData, setTrackingData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (orderId && awbCode) {
      fetchTracking();
    }
  }, [orderId, awbCode]);

  const fetchTracking = async () => {
    try {
      setLoading(true);
      setError(null);
      const result = await trackShipment(orderId, orderType);
      
      if (result.success) {
        setTrackingData(result.data);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch tracking data');
      console.error('Tracking error:', err);
    } finally {
      setLoading(false);
    }
  };

  if (!awbCode) {
    return (
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
        <p className="text-yellow-800">
          📦 Shipment is being prepared. Tracking will be available once the courier is assigned.
        </p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-4 bg-gray-200 rounded w-1/4"></div>
          <div className="h-24 bg-gray-200 rounded"></div>
          <div className="h-24 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
        <p className="text-red-800">❌ {error}</p>
        <button
          onClick={fetchTracking}
          className="mt-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-bold">📦 Track Your Shipment</h3>
        <button
          onClick={fetchTracking}
          className="px-4 py-2 text-sm bg-gray-100 hover:bg-gray-200 rounded-lg"
        >
          🔄 Refresh
        </button>
      </div>

      {/* Tracking Info */}
      <div className="grid md:grid-cols-2 gap-4 mb-6">
        <div className="bg-gray-50 p-4 rounded-lg">
          <p className="text-sm text-gray-600">AWB Code</p>
          <p className="font-semibold text-lg">{awbCode || trackingData?.awbCode}</p>
        </div>
        <div className="bg-gray-50 p-4 rounded-lg">
          <p className="text-sm text-gray-600">Courier Partner</p>
          <p className="font-semibold text-lg">{courierName || trackingData?.courierName}</p>
        </div>
      </div>

      {/* Current Status */}
      {trackingData?.currentStatus && (
        <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <p className="text-sm text-blue-600 mb-1">Current Status</p>
          <p className="text-2xl font-bold text-blue-900">{trackingData.currentStatus}</p>
        </div>
      )}

      {/* Timeline */}
      {trackingData?.shipmentTrack && trackingData.shipmentTrack.length > 0 ? (
        <div className="relative">
          <h4 className="font-semibold mb-4">Tracking History</h4>
          <div className="space-y-4">
            {trackingData.shipmentTrack.map((track, index) => (
              <div key={index} className="flex gap-4">
                {/* Timeline indicator */}
                <div className="relative flex flex-col items-center">
                  <div
                    className={`w-4 h-4 rounded-full ${
                      index === 0 ? 'bg-green-500' : 'bg-gray-300'
                    }`}
                  ></div>
                  {index < trackingData.shipmentTrack.length - 1 && (
                    <div className="w-0.5 h-full bg-gray-300 mt-2"></div>
                  )}
                </div>

                {/* Content */}
                <div className="flex-1 pb-8">
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="font-semibold">{track.status || track.activity}</p>
                    {track.location && (
                      <p className="text-sm text-gray-600">📍 {track.location}</p>
                    )}
                    {track.date && (
                      <p className="text-xs text-gray-500 mt-1">
                        {new Date(track.date).toLocaleString()}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="text-center py-8 text-gray-500">
          <p>No tracking updates available yet</p>
          <p className="text-sm mt-2">Please check back later</p>
        </div>
      )}

      {/* External Tracking Link */}
      {awbCode && (
        <div className="mt-6 pt-6 border-t">
          <a
            href={`https://shiprocket.co/tracking/${awbCode}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Track on Shiprocket 🔗
          </a>
        </div>
      )}
    </div>
  );
}
