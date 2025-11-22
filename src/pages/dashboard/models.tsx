import BasePages from '@/components/shared/base-pages';
import { useEffect, useState } from 'react';
import BaseRequest from '@/config/axios.config';

interface Model {
  id: string;
  name: string | null;
  brandId: string;
}

export default function ModelsPage() {
  const [data, setData] = useState<Model[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [newName, setNewName] = useState('');
  const [newBrandId, setNewBrandId] = useState('');
  const [creating, setCreating] = useState(false);

  const fetchModels = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await BaseRequest.Get('/api/products/api/models');
      const payload = res?.data;
      if (Array.isArray(payload)) {
        setData(payload);
      } else {
        console.warn('Unexpected response format:', payload);
        setData([]);
      }
    } catch (e: any) {
      const errorMsg =
        e?.data?.message || e?.message || 'Failed to fetch models';
      console.error('Fetch models error:', errorMsg);
      setError(errorMsg);
      setData([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchModels();
  }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim() || !newBrandId.trim()) return;

    setCreating(true);
    setError(null);
    try {
      await BaseRequest.Post('/api/products/api/models', {
        name: newName.trim(),
        brandId: newBrandId.trim()
      });
      setNewName('');
      setNewBrandId('');
      await fetchModels();
    } catch (err: any) {
      const errorMsg =
        err?.data?.message || err?.message || 'Failed to create model';
      console.error('Create model error:', errorMsg);
      setError(errorMsg);
    } finally {
      setCreating(false);
    }
  };

  return (
    <BasePages pageHead="Models">
      <div className="mt-6 space-y-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Models</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Manage car models across different brands
          </p>
        </div>

        {/* Create Form Card */}
        <div className="rounded-lg border bg-white p-6 shadow-sm">
          <h2 className="mb-4 text-lg font-semibold">Add New Model</h2>
          <form
            onSubmit={handleCreate}
            className="flex flex-wrap items-end gap-3"
          >
            <div className="flex min-w-[200px] flex-1 flex-col">
              <label className="mb-1.5 text-sm font-medium">Model Name *</label>
              <input
                className="rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-transparent focus:outline-none focus:ring-2 focus:ring-primary"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                placeholder="e.g. Model S, X5, Camry"
                required
              />
            </div>
            <div className="flex min-w-[150px] flex-col">
              <label className="mb-1.5 text-sm font-medium">Brand ID *</label>
              <input
                className="rounded-md border border-gray-300 px-3 py-2 font-mono text-sm focus:border-transparent focus:outline-none focus:ring-2 focus:ring-primary"
                value={newBrandId}
                onChange={(e) => setNewBrandId(e.target.value)}
                placeholder="Brand UUID"
                required
              />
            </div>
            <button
              type="submit"
              disabled={creating || !newName.trim() || !newBrandId.trim()}
              className="rounded-md bg-primary px-6 py-2 text-sm font-medium text-white transition-colors hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {creating ? (
                <span className="flex items-center gap-2">
                  <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></span>
                  Creating...
                </span>
              ) : (
                '+ Add Model'
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

        {/* Models List Card */}
        <div className="rounded-lg border bg-white shadow-sm">
          <div className="border-b px-6 py-4">
            <h2 className="text-lg font-semibold">All Models</h2>
            {!loading && data.length > 0 && (
              <p className="mt-1 text-xs text-muted-foreground">
                {data.length} model{data.length !== 1 ? 's' : ''} total
              </p>
            )}
          </div>
          <div className="p-6">
            {loading ? (
              <div className="flex items-center justify-center py-12">
                <div className="text-center">
                  <div className="mb-3 inline-block h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
                  <p className="text-sm text-muted-foreground">
                    Loading models...
                  </p>
                </div>
              </div>
            ) : data.length === 0 ? (
              <div className="py-12 text-center">
                <div className="mb-3 text-4xl">🚙</div>
                <p className="text-sm text-muted-foreground">
                  No models found. Create your first model above.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-3">
                {data.map((m) => (
                  <div
                    key={m.id}
                    className="rounded-lg border p-4 transition-all hover:border-primary/50 hover:shadow-md"
                  >
                    <div className="mb-2 flex items-start justify-between">
                      <h3 className="text-base font-semibold">
                        {m.name || '(Unnamed)'}
                      </h3>
                      <div className="text-xl">🏎️</div>
                    </div>
                    <div className="space-y-1">
                      <p className="text-xs text-muted-foreground">
                        <span className="font-medium">Brand ID:</span>{' '}
                        {m.brandId}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        <span className="font-medium">Model ID:</span> {m.id}
                      </p>
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
