import BasePages from '@/components/shared/base-pages';
import { useEffect, useState } from 'react';
import BaseRequest from '@/config/axios.config';

interface Variant {
  id: string;
  name: string | null;
  rangeKm?: number | null;
  basePrice?: number | null;
  modelId?: string | null;
}

export default function VariantsPage() {
  const [data, setData] = useState<Variant[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [newName, setNewName] = useState('');
  const [newRangeKm, setNewRangeKm] = useState('');
  const [newBasePrice, setNewBasePrice] = useState('');
  const [newModelId, setNewModelId] = useState('');
  const [creating, setCreating] = useState(false);

  const fetchVariants = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await BaseRequest.Get('/api/products/api/variants');
      const payload = res?.data;
      if (Array.isArray(payload)) {
        setData(payload);
      } else {
        console.warn('Unexpected response format:', payload);
        setData([]);
      }
    } catch (e: any) {
      const errorMsg =
        e?.data?.message || e?.message || 'Failed to fetch variants';
      console.error('Fetch variants error:', errorMsg);
      setError(errorMsg);
      setData([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVariants();
  }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim() || !newModelId.trim()) return;

    setCreating(true);
    setError(null);
    try {
      await BaseRequest.Post('/api/products/api/variants', {
        name: newName.trim(),
        rangeKm: newRangeKm ? Number(newRangeKm) : null,
        basePrice: newBasePrice ? Number(newBasePrice) : null,
        modelId: newModelId.trim()
      });
      setNewName('');
      setNewRangeKm('');
      setNewBasePrice('');
      setNewModelId('');
      await fetchVariants();
    } catch (err: any) {
      const errorMsg =
        err?.data?.message || err?.message || 'Failed to create variant';
      console.error('Create variant error:', errorMsg);
      setError(errorMsg);
    } finally {
      setCreating(false);
    }
  };

  return (
    <BasePages pageHead="Variants">
      <div className="mt-6 space-y-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Variants</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Manage car variants with pricing and specifications
          </p>
        </div>

        {/* Create Form Card */}
        <div className="rounded-lg border bg-white p-6 shadow-sm">
          <h2 className="mb-4 text-lg font-semibold">Add New Variant</h2>
          <form
            onSubmit={handleCreate}
            className="grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-4"
          >
            <div className="flex flex-col">
              <label className="mb-1.5 text-sm font-medium">
                Variant Name *
              </label>
              <input
                className="rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-transparent focus:outline-none focus:ring-2 focus:ring-primary"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                placeholder="e.g. Long Range, Performance"
                required
              />
            </div>
            <div className="flex flex-col">
              <label className="mb-1.5 text-sm font-medium">Range (km)</label>
              <input
                className="rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-transparent focus:outline-none focus:ring-2 focus:ring-primary"
                value={newRangeKm}
                onChange={(e) => setNewRangeKm(e.target.value)}
                placeholder="e.g. 600"
                type="number"
                min={0}
              />
            </div>
            <div className="flex flex-col">
              <label className="mb-1.5 text-sm font-medium">
                Base Price ($)
              </label>
              <input
                className="rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-transparent focus:outline-none focus:ring-2 focus:ring-primary"
                value={newBasePrice}
                onChange={(e) => setNewBasePrice(e.target.value)}
                placeholder="e.g. 79999"
                type="number"
                min={0}
                step="0.01"
              />
            </div>
            <div className="flex flex-col">
              <label className="mb-1.5 text-sm font-medium">Model ID *</label>
              <input
                className="rounded-md border border-gray-300 px-3 py-2 font-mono text-sm focus:border-transparent focus:outline-none focus:ring-2 focus:ring-primary"
                value={newModelId}
                onChange={(e) => setNewModelId(e.target.value)}
                placeholder="Model UUID"
                required
              />
            </div>
            <div className="md:col-span-2 lg:col-span-4">
              <button
                type="submit"
                disabled={creating || !newName.trim() || !newModelId.trim()}
                className="rounded-md bg-primary px-6 py-2 text-sm font-medium text-white transition-colors hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {creating ? (
                  <span className="flex items-center gap-2">
                    <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></span>
                    Creating...
                  </span>
                ) : (
                  '+ Add Variant'
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

        {/* Variants List Card */}
        <div className="rounded-lg border bg-white shadow-sm">
          <div className="border-b px-6 py-4">
            <h2 className="text-lg font-semibold">All Variants</h2>
            {!loading && data.length > 0 && (
              <p className="mt-1 text-xs text-muted-foreground">
                {data.length} variant{data.length !== 1 ? 's' : ''} total
              </p>
            )}
          </div>
          <div className="p-6">
            {loading ? (
              <div className="flex items-center justify-center py-12">
                <div className="text-center">
                  <div className="mb-3 inline-block h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
                  <p className="text-sm text-muted-foreground">
                    Loading variants...
                  </p>
                </div>
              </div>
            ) : data.length === 0 ? (
              <div className="py-12 text-center">
                <div className="mb-3 text-4xl">⚡</div>
                <p className="text-sm text-muted-foreground">
                  No variants found. Create your first variant above.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                {data.map((v) => (
                  <div
                    key={v.id}
                    className="rounded-lg border bg-gradient-to-br from-white to-gray-50 p-4 transition-all hover:border-primary/50 hover:shadow-md"
                  >
                    <div className="mb-3 flex items-start justify-between">
                      <h3 className="text-base font-semibold">
                        {v.name || '(Unnamed)'}
                      </h3>
                      <div className="text-xl">✨</div>
                    </div>
                    <div className="space-y-2">
                      {v.basePrice !== null && v.basePrice !== undefined && (
                        <div className="rounded-md border border-green-200 bg-green-50 px-3 py-2">
                          <p className="text-xs font-medium text-green-600">
                            Price
                          </p>
                          <p className="text-lg font-bold text-green-700">
                            ${v.basePrice.toLocaleString()}
                          </p>
                        </div>
                      )}
                      {v.rangeKm !== null && v.rangeKm !== undefined && (
                        <div className="flex items-center gap-2 text-sm">
                          <span className="text-blue-500">🔋</span>
                          <span className="text-muted-foreground">
                            {v.rangeKm} km range
                          </span>
                        </div>
                      )}
                      <div className="border-t pt-2">
                        <p className="text-xs text-muted-foreground">
                          Model ID:{' '}
                          <span className="font-medium">{v.modelId}</span>
                        </p>
                        <p className="text-xs text-muted-foreground">
                          Variant ID:{' '}
                          <span className="font-medium">{v.id}</span>
                        </p>
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
