import BasePages from '@/components/shared/base-pages';
import { useEffect, useState } from 'react';
import BaseRequest from '@/config/axios.config';

interface Payment {
  id: string;
  orderId?: string;
  amount?: number;
  method?: string | null;
  paidAt?: string;
}

export default function PaymentsPage() {
  const [data, setData] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [newOrderId, setNewOrderId] = useState('');
  const [newAmount, setNewAmount] = useState('');
  const [newMethod, setNewMethod] = useState('');
  const [creating, setCreating] = useState(false);

  const fetchPayments = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await BaseRequest.Get('/api/sales/api/payments');
      const payload = res?.data;
      if (Array.isArray(payload)) {
        setData(payload);
      } else {
        console.warn('Unexpected response format:', payload);
        setData([]);
      }
    } catch (e: any) {
      const errorMsg =
        e?.data?.message || e?.message || 'Failed to fetch payments';
      console.error('Fetch payments error:', errorMsg);
      setError(errorMsg);
      setData([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPayments();
  }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newOrderId.trim() || !newAmount.trim()) return;

    setCreating(true);
    setError(null);
    try {
      await BaseRequest.Post('/api/sales/api/payments', {
        orderId: newOrderId.trim(),
        amount: Number(newAmount),
        method: newMethod.trim() || null
      });
      setNewOrderId('');
      setNewAmount('');
      setNewMethod('');
      await fetchPayments();
    } catch (err: any) {
      const errorMsg =
        err?.data?.message || err?.message || 'Failed to create payment';
      console.error('Create payment error:', errorMsg);
      setError(errorMsg);
    } finally {
      setCreating(false);
    }
  };

  return (
    <BasePages pageHead="Payments">
      <div className="mt-6 space-y-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Payments</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Process and track payment transactions
          </p>
        </div>

        {/* Create Form Card */}
        <div className="rounded-lg border bg-white p-6 shadow-sm">
          <h2 className="mb-4 text-lg font-semibold">Record New Payment</h2>
          <form
            onSubmit={handleCreate}
            className="grid grid-cols-1 gap-3 md:grid-cols-3"
          >
            <div className="flex flex-col">
              <label className="mb-1.5 text-sm font-medium">Order ID *</label>
              <input
                className="rounded-md border border-gray-300 px-3 py-2 font-mono text-sm focus:border-transparent focus:outline-none focus:ring-2 focus:ring-primary"
                value={newOrderId}
                onChange={(e) => setNewOrderId(e.target.value)}
                placeholder="Order UUID"
                required
              />
            </div>
            <div className="flex flex-col">
              <label className="mb-1.5 text-sm font-medium">Amount ($) *</label>
              <input
                className="rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-transparent focus:outline-none focus:ring-2 focus:ring-primary"
                value={newAmount}
                onChange={(e) => setNewAmount(e.target.value)}
                placeholder="e.g. 199.99"
                type="number"
                min={0}
                step="0.01"
                required
              />
            </div>
            <div className="flex flex-col">
              <label className="mb-1.5 text-sm font-medium">
                Payment Method
              </label>
              <select
                className="rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-transparent focus:outline-none focus:ring-2 focus:ring-primary"
                value={newMethod}
                onChange={(e) => setNewMethod(e.target.value)}
              >
                <option value="">Select method</option>
                <option value="CreditCard">Credit Card</option>
                <option value="DebitCard">Debit Card</option>
                <option value="Cash">Cash</option>
                <option value="BankTransfer">Bank Transfer</option>
                <option value="PayPal">PayPal</option>
                <option value="Other">Other</option>
              </select>
            </div>
            <div className="md:col-span-3">
              <button
                type="submit"
                disabled={creating || !newOrderId.trim() || !newAmount.trim()}
                className="rounded-md bg-primary px-6 py-2 text-sm font-medium text-white transition-colors hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {creating ? (
                  <span className="flex items-center gap-2">
                    <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></span>
                    Processing...
                  </span>
                ) : (
                  '+ Record Payment'
                )}
              </button>
            </div>
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

        {/* Payments List Card */}
        <div className="rounded-lg border bg-white shadow-sm">
          <div className="border-b px-6 py-4">
            <h2 className="text-lg font-semibold">Payment History</h2>
            {!loading && data.length > 0 && (
              <p className="mt-1 text-xs text-muted-foreground">
                {data.length} payment{data.length !== 1 ? 's' : ''} total
              </p>
            )}
          </div>
          <div className="p-6">
            {loading ? (
              <div className="flex items-center justify-center py-12">
                <div className="text-center">
                  <div className="mb-3 inline-block h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
                  <p className="text-sm text-muted-foreground">
                    Loading payments...
                  </p>
                </div>
              </div>
            ) : data.length === 0 ? (
              <div className="py-12 text-center">
                <div className="mb-3 text-4xl">💳</div>
                <p className="text-sm text-muted-foreground">
                  No payments found. Record your first payment above.
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {data.map((p) => (
                  <div
                    key={p.id}
                    className="rounded-lg border bg-gradient-to-r from-white to-green-50/30 p-4 transition-all hover:shadow-md"
                  >
                    <div className="mb-3 flex items-start justify-between">
                      <div className="flex-1">
                        <h3 className="text-base font-semibold">
                          Payment #{p.id.slice(0, 8)}...
                        </h3>
                        <p className="mt-1 truncate font-mono text-xs text-muted-foreground">
                          {p.id}
                        </p>
                      </div>
                      {p.amount !== undefined && (
                        <div className="rounded-md border border-green-200 bg-green-100 px-3 py-1">
                          <p className="text-xs font-medium text-green-600">
                            Amount
                          </p>
                          <p className="text-lg font-bold text-green-700">
                            ${p.amount.toLocaleString()}
                          </p>
                        </div>
                      )}
                    </div>
                    <div className="grid grid-cols-1 gap-3 text-sm md:grid-cols-3">
                      <div className="flex items-center gap-2">
                        <span>📄</span>
                        <span className="truncate text-xs text-muted-foreground">
                          Order: {p.orderId}
                        </span>
                      </div>
                      {p.method && (
                        <div className="flex items-center gap-2">
                          <span>💳</span>
                          <span className="font-medium">{p.method}</span>
                        </div>
                      )}
                      {p.paidAt && (
                        <div className="flex items-center gap-2">
                          <span>📅</span>
                          <span className="text-xs text-muted-foreground">
                            {new Date(p.paidAt).toLocaleString()}
                          </span>
                        </div>
                      )}
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
