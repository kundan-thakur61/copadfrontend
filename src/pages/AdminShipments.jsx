import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import orderAPI from '../api/orderAPI';
import AdminShiprocketManagement from '../components/AdminShiprocketManagement';
import ShipmentTracking from '../components/ShipmentTracking';
import { toast } from 'react-toastify';
import { resolveImageUrl } from '../utils/helpers';

/**
 * Admin Shipments Management Page
 * Manage Shiprocket shipments for all orders
 */
export default function AdminShipments() {
  const { user } = useSelector((state) => state.auth);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [filter, setFilter] = useState('all'); // all, pending, shipped, delivered

  useEffect(() => {
    fetchOrders();
  }, [filter]);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const response = await orderAPI.getAllOrders({ status: filter !== 'all' ? filter : undefined });
      setOrders(response.data?.orders || response.data?.data?.orders || []);
    } catch (error) {
      toast.error('Failed to load orders');
      console.error('Load orders error:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      pending: 'bg-yellow-100 text-yellow-800',
      confirmed: 'bg-blue-100 text-blue-800',
      processing: 'bg-indigo-100 text-indigo-800',
      shipped: 'bg-purple-100 text-purple-800',
      delivered: 'bg-green-100 text-green-800',
      cancelled: 'bg-red-100 text-red-800'
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  if (user?.role !== 'admin') {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
          <p className="text-red-800">⛔ Admin access required</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">🚚 Shipment Management</h1>
        <p className="text-gray-600">Manage Shiprocket shipments for all orders</p>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow p-4 mb-6">
        <div className="flex flex-wrap gap-2">
          {['all', 'pending', 'confirmed', 'processing', 'shipped', 'delivered'].map((status) => (
            <button
              key={status}
              onClick={() => setFilter(status)}
              className={`px-4 py-2 rounded-lg capitalize ${
                filter === status
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 hover:bg-gray-200'
              }`}
            >
              {status}
            </button>
          ))}
        </div>
      </div>

      {/* Orders List */}
      {loading ? (
        <div className="text-center py-12">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          <p className="mt-4 text-gray-600">Loading orders...</p>
        </div>
      ) : orders.length === 0 ? (
        <div className="bg-white rounded-lg shadow p-12 text-center">
          <p className="text-gray-600">No orders found</p>
        </div>
      ) : (
        <div className="space-y-6">
          {orders.map((order) => (
            <div key={order._id} className="bg-white rounded-lg shadow overflow-hidden">
              {/* Order Header */}
              <div
                className="p-6 cursor-pointer hover:bg-gray-50"
                onClick={() => setSelectedOrder(selectedOrder?._id === order._id ? null : order)}
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-bold text-lg">Order #{order._id.slice(-8).toUpperCase()}</h3>
                    <p className="text-sm text-gray-600 mt-1">
                      Customer: {order.shippingAddress?.name}
                    </p>
                    <p className="text-sm text-gray-600">
                      Total: ₹{order.total} • {order.items?.length || 0} item(s)
                    </p>
                  </div>
                  <div className="text-right">
                    <span className={`px-3 py-1 rounded-full text-sm ${getStatusColor(order.status)}`}>
                      {order.status}
                    </span>
                    {order.shiprocket?.awbCode && (
                      <p className="text-sm text-gray-600 mt-2">
                        AWB: {order.shiprocket.awbCode}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* Expanded Details */}
              {selectedOrder?._id === order._id && (
                <div className="border-t p-6 space-y-6 bg-gray-50">
                  {/* Shipping Address */}
                  <div>
                    <h4 className="font-semibold mb-2">Shipping Address</h4>
                    <div className="bg-white p-4 rounded-lg">
                      <p>{order.shippingAddress?.name}</p>
                      <p>{order.shippingAddress?.address1}</p>
                      {order.shippingAddress?.address2 && <p>{order.shippingAddress.address2}</p>}
                      <p>
                        {order.shippingAddress?.city}, {order.shippingAddress?.state} -{' '}
                        {order.shippingAddress?.postalCode}
                      </p>
                      <p>{order.shippingAddress?.country || 'India'}</p>
                      <p className="mt-2">📞 {order.shippingAddress?.phone}</p>
                    </div>
                  </div>

                  {/* Order Items */}
                  {order.items?.length > 0 && (
                    <div>
                      <h4 className="font-semibold mb-2">Items</h4>
                      <div className="bg-white p-4 rounded-lg divide-y">
                        {order.items.map((item, idx) => {
                          const imageUrl = resolveImageUrl(
                            item.image ||
                              item.productId?.design?.imgSrc ||
                              item.productId?.images?.[0]?.url ||
                              item.productId?.images?.[0]
                          );
                          return (
                            <div
                              key={`${order._id}-${item.variantId || idx}`}
                              className="py-3 flex gap-4 items-center"
                            >
                              <div className="w-16 h-16 rounded bg-gray-100 flex items-center justify-center overflow-hidden">
                                {imageUrl ? (
                                  <img
                                    src={imageUrl}
                                    alt={item.title || item.productId?.title || 'Item'}
                                    className="w-full h-full object-cover"
                                  />
                                ) : (
                                  <span className="text-xs text-gray-400">No image</span>
                                )}
                              </div>
                              <div className="flex-1">
                                <p className="font-semibold">
                                  {item.title || item.productId?.title || 'Item'}
                                </p>
                                <p className="text-sm text-gray-600">
                                  {item.model || item.productId?.model || ''}
                                  {item.color ? ` • ${item.color}` : ''}
                                </p>
                                <p className="text-sm text-gray-700">Qty {item.quantity} • ₹{item.price}</p>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {/* Shiprocket Status */}
                  {order.shiprocket?.shipmentId && (
                    <div>
                      <h4 className="font-semibold mb-2">Shiprocket Details</h4>
                      <div className="bg-white p-4 rounded-lg grid md:grid-cols-2 gap-4">
                        <div>
                          <p className="text-sm text-gray-600">Shipment ID</p>
                          <p className="font-semibold">{order.shiprocket.shipmentId}</p>
                        </div>
                        {order.shiprocket.awbCode && (
                          <div>
                            <p className="text-sm text-gray-600">AWB Code</p>
                            <p className="font-semibold">{order.shiprocket.awbCode}</p>
                          </div>
                        )}
                        {order.shiprocket.courierName && (
                          <div>
                            <p className="text-sm text-gray-600">Courier</p>
                            <p className="font-semibold">{order.shiprocket.courierName}</p>
                          </div>
                        )}
                        {order.shiprocket.status && (
                          <div>
                            <p className="text-sm text-gray-600">Shipment Status</p>
                            <p className="font-semibold capitalize">{order.shiprocket.status}</p>
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Tracking */}
                  {order.shiprocket?.awbCode && (
                    <ShipmentTracking
                      orderId={order._id}
                      orderType="regular"
                      awbCode={order.shiprocket.awbCode}
                      courierName={order.shiprocket.courierName}
                    />
                  )}

                  {/* Shiprocket Management */}
                  {order.payment?.status === 'paid' && (
                    <AdminShiprocketManagement
                      orderId={order._id}
                      orderType="regular"
                      onUpdate={fetchOrders}
                    />
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
