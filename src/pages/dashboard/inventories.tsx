import BasePages from '@/components/shared/base-pages';
import { useEffect, useState } from 'react';
import BaseRequest from '@/config/axios.config';

interface Inventory {
  id: string;
  dealerId: string;
  variantId?: string | null;
  quantity?: number | null;
}

export default function InventoriesPage() {
  const [data, setData] = useState<Inventory[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [newDealerId, setNewDealerId] = useState('');
  const [newVariantId, setNewVariantId] = useState('');
  const [newQuantity, setNewQuantity] = useState('');
  const [creating, setCreating] = useState(false);

  const fetchInventories = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await BaseRequest.Get('/api/inventory/api/Inventories');
      const payload = res?.data;
      if (Array.isArray(payload)) {
        setData(payload);
      } else {
        console.warn('Unexpected response format:', payload);
        setData([]);
      }
    } catch (e: any) {
      const errorMsg =
        e?.data?.message || e?.message || 'Failed to fetch inventories';
      console.error('Fetch inventories error:', errorMsg);
      setError(errorMsg);
      setData([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInventories();
  }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDealerId.trim()) return;

    setCreating(true);
    setError(null);
    try {
      await BaseRequest.Post('/api/inventory/api/Inventories', {
        dealerId: newDealerId.trim(),
        variantId: newVariantId.trim() || null,
        quantity: newQuantity ? Number(newQuantity) : null
      });
      setNewDealerId('');
      setNewVariantId('');
      setNewQuantity('');
      await fetchInventories();
    } catch (err: any) {
      const errorMsg =
        err?.data?.message || err?.message || 'Failed to create inventory';
      console.error('Create inventory error:', errorMsg);
      setError(errorMsg);
    } finally {
      setCreating(false);
    }
  };

  return (
    <BasePages pageHead="Inventories">
      <div className="mt-6 space-y-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Inventories</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Track stock levels across dealers
          </p>
        </div>

        {/* Create Form Card */}
        <div className="rounded-lg border bg-white p-6 shadow-sm">
          <h2 className="mb-4 text-lg font-semibold">Add Inventory Record</h2>
          <form
            onSubmit={handleCreate}
            className="grid grid-cols-1 gap-3 md:grid-cols-3"
          >
            <div className="flex flex-col">
              <label className="mb-1.5 text-sm font-medium">Dealer ID *</label>
              <input
                className="rounded-md border border-gray-300 px-3 py-2 font-mono text-sm focus:border-transparent focus:outline-none focus:ring-2 focus:ring-primary"
                value={newDealerId}
                onChange={(e) => setNewDealerId(e.target.value)}
                placeholder="Dealer UUID"
                required
              />
            </div>
            <div className="flex flex-col">
              <label className="mb-1.5 text-sm font-medium">Variant ID</label>
              <input
                className="rounded-md border border-gray-300 px-3 py-2 font-mono text-sm focus:border-transparent focus:outline-none focus:ring-2 focus:ring-primary"
                value={newVariantId}
                onChange={(e) => setNewVariantId(e.target.value)}
                placeholder="Variant UUID"
              />
            </div>
            <div className="flex flex-col">
              <label className="mb-1.5 text-sm font-medium">Quantity</label>
              <input
                className="rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-transparent focus:outline-none focus:ring-2 focus:ring-primary"
                value={newQuantity}
                onChange={(e) => setNewQuantity(e.target.value)}
                placeholder="e.g. 50"
                type="number"
                min={0}
              />
            </div>
            <div className="md:col-span-3">
              <button
                type="submit"
                disabled={creating || !newDealerId.trim()}
                className="rounded-md bg-primary px-6 py-2 text-sm font-medium text-white transition-colors hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {creating ? (
                  <span className="flex items-center gap-2">
                    <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></span>
                    Creating...
                  </span>
                ) : (
                  '+ Add Inventory'
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

        {/* Inventories Table Card */}
        <div className="rounded-lg border bg-white shadow-sm">
          <div className="border-b px-6 py-4">
            <h2 className="text-lg font-semibold">Inventory Records</h2>
            {!loading && data.length > 0 && (
              <p className="mt-1 text-xs text-muted-foreground">
                {data.length} record{data.length !== 1 ? 's' : ''} total
              </p>
            )}
          </div>
          <div className="p-6">
            {loading ? (
              <div className="flex items-center justify-center py-12">
                <div className="text-center">
                  <div className="mb-3 inline-block h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
                  <p className="text-sm text-muted-foreground">
                    Loading inventories...
                  </p>
                </div>
              </div>
            ) : data.length === 0 ? (
              <div className="py-12 text-center">
                <div className="mb-3 text-4xl">📦</div>
                <p className="text-sm text-muted-foreground">
                  No inventory records found. Create one above.
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="border-b bg-gray-50">
                    <tr>
                      <th className="px-4 py-3 text-left font-semibold text-gray-700">
                        ID
                      </th>
                      <th className="px-4 py-3 text-left font-semibold text-gray-700">
                        Dealer ID
                      </th>
                      <th className="px-4 py-3 text-left font-semibold text-gray-700">
                        Variant ID
                      </th>
                      <th className="px-4 py-3 text-left font-semibold text-gray-700">
                        Quantity
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    {data.map((inv) => (
                      <tr
                        key={inv.id}
                        className="transition-colors hover:bg-gray-50"
                      >
                        <td className="px-4 py-3 font-medium">#{inv.id}</td>
                        <td className="px-4 py-3 text-muted-foreground">
                          {inv.dealerId}
                        </td>
                        <td className="px-4 py-3 text-muted-foreground">
                          {inv.variantId ?? 'N/A'}
                        </td>
                        <td className="px-4 py-3">
                          <span
                            className={`inline-block rounded-full px-3 py-1 text-xs font-semibold ${
                              (inv.quantity ?? 0) > 50
                                ? 'bg-green-100 text-green-700'
                                : (inv.quantity ?? 0) > 10
                                  ? 'bg-yellow-100 text-yellow-700'
                                  : 'bg-red-100 text-red-700'
                            }`}
                          >
                            {inv.quantity ?? 0} units
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
    </BasePages>
  );
}
