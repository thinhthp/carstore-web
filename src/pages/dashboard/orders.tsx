import BasePages from '@/components/shared/base-pages';
import { useEffect, useState } from 'react';
import BaseRequest from '@/config/axios.config';

interface OrderItem {
  variantId: string;
  quantity: number;
  unitPrice: number;
}

interface Order {
  id: string;
  status?: number;
  totalAmount?: number;
  customerId?: string;
  dealerId?: string;
  createdAt?: string;
}

export default function OrdersPage() {
  const [data, setData] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [creating, setCreating] = useState(false);
  const [newCustomerId, setNewCustomerId] = useState('');
  const [newDealerId, setNewDealerId] = useState('');
  const [newItemsJson, setNewItemsJson] = useState('');

  const fetchOrders = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await BaseRequest.Get('/api/sales/api/orders');
      const payload = res?.data;
      if (Array.isArray(payload)) {
        setData(payload);
      } else {
        console.warn('Unexpected response format:', payload);
        setData([]);
      }
    } catch (e: any) {
      const errorMsg =
        e?.data?.message || e?.message || 'Failed to fetch orders';
      console.error('Fetch orders error:', errorMsg);
      setError(errorMsg);
      setData([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCustomerId.trim() || !newDealerId.trim()) return;

    let items: OrderItem[] | null = null;
    if (newItemsJson.trim()) {
      try {
        const parsed = JSON.parse(newItemsJson);
        if (Array.isArray(parsed)) {
          items = parsed;
        } else {
          setError('Items must be a valid JSON array');
          return;
        }
      } catch (err) {
        setError('Invalid JSON format for items');
        return;
      }
    }

    setCreating(true);
    setError(null);
    try {
      await BaseRequest.Post('/api/sales/api/orders', {
        customerId: newCustomerId.trim(),
        dealerId: newDealerId.trim(),
        items
      });
      setNewCustomerId('');
      setNewDealerId('');
      setNewItemsJson('');
      await fetchOrders();
    } catch (err: any) {
      const errorMsg =
        err?.data?.message || err?.message || 'Failed to create order';
      console.error('Create order error:', errorMsg);
      setError(errorMsg);
    } finally {
      setCreating(false);
    }
  };

  const getStatusText = (status?: number) => {
    const statusMap: Record<number, string> = {
      0: 'Pending',
      1: 'Confirmed',
      2: 'Processing',
      3: 'Shipped',
      4: 'Delivered',
      5: 'Cancelled'
    };
    return status !== undefined
      ? statusMap[status] || `Status ${status}`
      : 'Unknown';
  };

  const getStatusColor = (status?: number) => {
    const colorMap: Record<number, string> = {
      0: 'bg-yellow-100 text-yellow-700 border-yellow-200',
      1: 'bg-blue-100 text-blue-700 border-blue-200',
      2: 'bg-purple-100 text-purple-700 border-purple-200',
      3: 'bg-indigo-100 text-indigo-700 border-indigo-200',
      4: 'bg-green-100 text-green-700 border-green-200',
      5: 'bg-red-100 text-red-700 border-red-200'
    };
    return status !== undefined
      ? colorMap[status] || 'bg-gray-100 text-gray-700 border-gray-200'
      : 'bg-gray-100 text-gray-700 border-gray-200';
  };

  return (
    <BasePages pageHead="Orders">
      <div className="mt-6 space-y-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Orders</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Track and manage customer orders
          </p>
        </div>

        {/* Create Form Card */}
        <div className="rounded-lg border bg-white p-6 shadow-sm">
          <h2 className="mb-4 text-lg font-semibold">Create New Order</h2>
          <form onSubmit={handleCreate} className="space-y-4">
            <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
              <div className="flex flex-col">
                <label className="mb-1.5 text-sm font-medium">
                  Customer ID *
                </label>
                <input
                  className="rounded-md border border-gray-300 px-3 py-2 font-mono text-sm focus:border-transparent focus:outline-none focus:ring-2 focus:ring-primary"
                  value={newCustomerId}
                  onChange={(e) => setNewCustomerId(e.target.value)}
                  placeholder="Customer UUID"
                  required
                />
              </div>
              <div className="flex flex-col">
                <label className="mb-1.5 text-sm font-medium">
                  Dealer ID *
                </label>
                <input
                  className="rounded-md border border-gray-300 px-3 py-2 font-mono text-sm focus:border-transparent focus:outline-none focus:ring-2 focus:ring-primary"
                  value={newDealerId}
                  onChange={(e) => setNewDealerId(e.target.value)}
                  placeholder="Dealer UUID"
                  required
                />
              </div>
            </div>
            <div className="flex flex-col">
              <label className="mb-1.5 text-sm font-medium">
                Order Items (Optional JSON)
              </label>
              <textarea
                className="h-24 rounded-md border border-gray-300 px-3 py-2 font-mono text-xs focus:border-transparent focus:outline-none focus:ring-2 focus:ring-primary"
                value={newItemsJson}
                onChange={(e) => setNewItemsJson(e.target.value)}
                placeholder='[{"variantId":"uuid","quantity":1,"unitPrice":199.99}]'
              />
              <p className="mt-1 text-xs text-muted-foreground">
                Array of items with variantId, quantity, and unitPrice
              </p>
            </div>
            <button
              type="submit"
              disabled={
                creating || !newCustomerId.trim() || !newDealerId.trim()
              }
              className="rounded-md bg-primary px-6 py-2 text-sm font-medium text-white transition-colors hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {creating ? (
                <span className="flex items-center gap-2">
                  <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></span>
                  Creating...
                </span>
              ) : (
                '+ Create Order'
              )}
            </button>
          </form>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="rounded-lg border border-red-200 bg-red-50 p-4">
            <div className="flex items-start gap-3">
              <span className="text-lg text-red-500">⚠️</span>
              <div>
                <h3 className="text-sm font-semibold text-red-800">Error</h3>
                <p className="mt-1 text-sm text-red-700">{error}</p>
              </div>
            </div>
          </div>
        )}

        {/* Orders List Card */}
        <div className="rounded-lg border bg-white shadow-sm">
          <div className="border-b px-6 py-4">
            <h2 className="text-lg font-semibold">All Orders</h2>
            {!loading && data.length > 0 && (
              <p className="mt-1 text-xs text-muted-foreground">
                {data.length} order{data.length !== 1 ? 's' : ''} total
              </p>
            )}
          </div>
          <div className="p-6">
            {loading ? (
              <div className="flex items-center justify-center py-12">
                <div className="text-center">
                  <div className="mb-3 inline-block h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
                  <p className="text-sm text-muted-foreground">
                    Loading orders...
                  </p>
                </div>
              </div>
            ) : data.length === 0 ? (
              <div className="py-12 text-center">
                <div className="mb-3 text-4xl">📝</div>
                <p className="text-sm text-muted-foreground">
                  No orders found. Create your first order above.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {data.map((o) => (
                  <div
                    key={o.id}
                    className="rounded-lg border p-4 transition-all hover:shadow-md"
                  >
                    <div className="mb-3 flex items-start justify-between">
                      <div>
                        <h3 className="text-base font-semibold">
                          Order #{o.id.slice(0, 8)}...
                        </h3>
                        <p className="mt-1 font-mono text-xs text-muted-foreground">
                          {o.id}
                        </p>
                      </div>
                      <span
                        className={`rounded-full border px-3 py-1 text-xs font-semibold ${getStatusColor(o.status)}`}
                      >
                        {getStatusText(o.status)}
                      </span>
                    </div>
                    <div className="grid grid-cols-1 gap-3 text-sm md:grid-cols-2">
                      {o.totalAmount !== undefined && (
                        <div className="flex items-center gap-2">
                          <span className="text-green-500">💵</span>
                          <span className="text-muted-foreground">Total:</span>
                          <span className="font-semibold">
                            ${o.totalAmount.toLocaleString()}
                          </span>
                        </div>
                      )}
                      {o.createdAt && (
                        <div className="flex items-center gap-2">
                          <span>📅</span>
                          <span className="text-muted-foreground">
                            {new Date(o.createdAt).toLocaleString()}
                          </span>
                        </div>
                      )}
                      <div className="flex items-center gap-2">
                        <span>👤</span>
                        <span className="truncate text-xs text-muted-foreground">
                          Customer: {o.customerId}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span>🏪</span>
                        <span className="truncate text-xs text-muted-foreground">
                          Dealer: {o.dealerId}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </BasePages>
  );
}
