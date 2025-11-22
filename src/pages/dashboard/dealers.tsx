import BasePages from '@/components/shared/base-pages';
import { useEffect, useState } from 'react';
import BaseRequest from '@/config/axios.config';

interface Dealer {
  id: number;
  code?: string | null;
  name?: string | null;
  region?: string | null;
}

export default function DealersPage() {
  const [data, setData] = useState<Dealer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [newCode, setNewCode] = useState('');
  const [newName, setNewName] = useState('');
  const [newRegion, setNewRegion] = useState('');
  const [creating, setCreating] = useState(false);

  const fetchDealers = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await BaseRequest.Get('/api/inventory/api/Dealers');
      const payload = res?.data;
      if (Array.isArray(payload)) {
        setData(payload);
      } else {
        console.warn('Unexpected response format:', payload);
        setData([]);
      }
    } catch (e: any) {
      const errorMsg =
        e?.data?.message || e?.message || 'Failed to fetch dealers';
      console.error('Fetch dealers error:', errorMsg);
      setError(errorMsg);
      setData([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDealers();
  }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim()) return;
    setCreating(true);
    setError(null);
    try {
      await BaseRequest.Post('/api/inventory/api/Dealers', {
        code: newCode.trim() || null,
        name: newName.trim(),
        region: newRegion.trim() || null
      });
      setNewCode('');
      setNewName('');
      setNewRegion('');
      await fetchDealers();
    } catch (err: any) {
      const errorMsg =
        err?.data?.message || err?.message || 'Failed to create dealer';
      console.error('Create dealer error:', errorMsg);
      setError(errorMsg);
    } finally {
      setCreating(false);
    }
  };

  return (
    <BasePages pageHead="Dealers">
      <div className="mt-6 space-y-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Dealers</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Manage dealer network and locations
          </p>
        </div>

        {/* Create Form Card */}
        <div className="rounded-lg border bg-white p-6 shadow-sm">
          <h2 className="mb-4 text-lg font-semibold">Add New Dealer</h2>
          <form
            onSubmit={handleCreate}
            className="grid grid-cols-1 gap-3 md:grid-cols-3"
          >
            <div className="flex flex-col">
              <label className="mb-1.5 text-sm font-medium">Dealer Code</label>
              <input
                className="rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-transparent focus:outline-none focus:ring-2 focus:ring-primary"
                value={newCode}
                onChange={(e) => setNewCode(e.target.value)}
                placeholder="e.g. DL001, NYC-01"
              />
            </div>
            <div className="flex flex-col">
              <label className="mb-1.5 text-sm font-medium">
                Dealer Name *
              </label>
              <input
                className="rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-transparent focus:outline-none focus:ring-2 focus:ring-primary"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                placeholder="Dealer name"
                required
              />
            </div>
            <div className="flex flex-col">
              <label className="mb-1.5 text-sm font-medium">Region</label>
              <input
                className="rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-transparent focus:outline-none focus:ring-2 focus:ring-primary"
                value={newRegion}
                onChange={(e) => setNewRegion(e.target.value)}
                placeholder="e.g. North, East, West"
              />
            </div>
            <div className="md:col-span-3">
              <button
                type="submit"
                disabled={creating || !newName.trim()}
                className="rounded-md bg-primary px-6 py-2 text-sm font-medium text-white transition-colors hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {creating ? (
                  <span className="flex items-center gap-2">
                    <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></span>
                    Creating...
                  </span>
                ) : (
                  '+ Add Dealer'
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

        {/* Dealers List Card */}
        <div className="rounded-lg border bg-white shadow-sm">
          <div className="border-b px-6 py-4">
            <h2 className="text-lg font-semibold">All Dealers</h2>
            {!loading && data.length > 0 && (
              <p className="mt-1 text-xs text-muted-foreground">
                {data.length} dealer{data.length !== 1 ? 's' : ''} total
              </p>
            )}
          </div>
          <div className="p-6">
            {loading ? (
              <div className="flex items-center justify-center py-12">
                <div className="text-center">
                  <div className="mb-3 inline-block h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
                  <p className="text-sm text-muted-foreground">
                    Loading dealers...
                  </p>
                </div>
              </div>
            ) : data.length === 0 ? (
              <div className="py-12 text-center">
                <div className="mb-3 text-4xl">🏪</div>
                <p className="text-sm text-muted-foreground">
                  No dealers found. Create your first dealer above.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                {data.map((d) => (
                  <div
                    key={d.id}
                    className="rounded-lg border p-4 transition-all hover:border-primary/50 hover:shadow-md"
                  >
                    <div className="mb-3 flex items-start justify-between">
                      <div className="flex-1">
                        <h3 className="text-base font-semibold">
                          {d.name || '(Unnamed)'}
                        </h3>
                        {d.code && (
                          <span className="mt-1 inline-block rounded bg-blue-100 px-2 py-0.5 text-xs font-medium text-blue-700">
                            {d.code}
                          </span>
                        )}
                      </div>
                      <div className="text-2xl">📍</div>
                    </div>
                    <div className="space-y-1">
                      {d.region && (
                        <div className="flex items-center gap-2 text-sm">
                          <span className="text-green-500">🌍</span>
                          <span className="text-muted-foreground">
                            {d.region}
                          </span>
                        </div>
                      )}
                      <div className="border-t pt-2">
                        <p className="text-xs text-muted-foreground">
                          Dealer ID: <span className="font-medium">{d.id}</span>
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
