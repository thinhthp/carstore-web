import BasePages from '@/components/shared/base-pages';
import { useEffect, useState } from 'react';
import BaseRequest from '@/config/axios.config';
import { useDebounce } from '@/hooks/debounce';

interface Customer {
  id: string;
  fullName?: string | null;
  phone?: string | null;
  email?: string | null;
}

export default function CustomersPage() {
  const [data, setData] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [newFullName, setNewFullName] = useState('');
  const [newPhone, setNewPhone] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [creating, setCreating] = useState(false);

  const fetchCustomers = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await BaseRequest.Get('/api/sales/api/customers');
      const payload = res?.data;
      if (Array.isArray(payload)) {
        setData(payload);
      } else {
        console.warn('Unexpected response format:', payload);
        setData([]);
      }
    } catch (e: any) {
      const errorMsg =
        e?.data?.message || e?.message || 'Failed to fetch customers';
      console.error('Fetch customers error:', errorMsg);
      setError(errorMsg);
      setData([]);
    } finally {
      setLoading(false);
    }
  };

  const searchCustomers = async (term: string) => {
    if (!term.trim()) {
      return fetchCustomers();
    }
    setLoading(true);
    setError(null);
    try {
      const res = await BaseRequest.Get(
        `/api/sales/api/customers/search?term=${encodeURIComponent(term)}`
      );
      const payload = res?.data;
      if (Array.isArray(payload)) {
        setData(payload);
      } else {
        console.warn('Unexpected response format:', payload);
        setData([]);
      }
    } catch (e: any) {
      const errorMsg =
        e?.data?.message || e?.message || 'Failed to search customers';
      console.error('Search customers error:', errorMsg);
      setError(errorMsg);
      setData([]);
    } finally {
      setLoading(false);
    }
  };

  const [searchTerm, setSearchTerm] = useState('');
  const debouncedSearch = useDebounce(searchTerm, 400);

  useEffect(() => {
    fetchCustomers();
  }, []);

  useEffect(() => {
    searchCustomers(debouncedSearch);
  }, [debouncedSearch]);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newFullName.trim()) return;
    setCreating(true);
    setError(null);
    try {
      await BaseRequest.Post('/api/sales/api/customers', {
        fullName: newFullName.trim(),
        phone: newPhone.trim() || null,
        email: newEmail.trim() || null
      });
      setNewFullName('');
      setNewPhone('');
      setNewEmail('');
      await fetchCustomers();
      setSearchTerm(''); // Clear search after creating
    } catch (err: any) {
      const errorMsg =
        err?.data?.message || err?.message || 'Failed to create customer';
      console.error('Create customer error:', errorMsg);
      setError(errorMsg);
    } finally {
      setCreating(false);
    }
  };

  return (
    <BasePages pageHead="Customers">
      <div className="mt-6 space-y-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Customers</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Manage customer information and contacts
          </p>
        </div>

        {/* Create Form Card */}
        <div className="rounded-lg border bg-white p-6 shadow-sm">
          <h2 className="mb-4 text-lg font-semibold">Add New Customer</h2>
          <form
            onSubmit={handleCreate}
            className="grid grid-cols-1 gap-3 md:grid-cols-3"
          >
            <div className="flex flex-col">
              <label className="mb-1.5 text-sm font-medium">Full Name *</label>
              <input
                className="rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-transparent focus:outline-none focus:ring-2 focus:ring-primary"
                value={newFullName}
                onChange={(e) => setNewFullName(e.target.value)}
                placeholder="Customer name"
                required
              />
            </div>
            <div className="flex flex-col">
              <label className="mb-1.5 text-sm font-medium">Phone</label>
              <input
                className="rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-transparent focus:outline-none focus:ring-2 focus:ring-primary"
                value={newPhone}
                onChange={(e) => setNewPhone(e.target.value)}
                placeholder="e.g. +123456789"
                type="tel"
              />
            </div>
            <div className="flex flex-col">
              <label className="mb-1.5 text-sm font-medium">Email</label>
              <input
                className="rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-transparent focus:outline-none focus:ring-2 focus:ring-primary"
                value={newEmail}
                onChange={(e) => setNewEmail(e.target.value)}
                type="email"
                placeholder="email@example.com"
              />
            </div>
            <div className="md:col-span-3">
              <button
                type="submit"
                disabled={creating || !newFullName.trim()}
                className="rounded-md bg-primary px-6 py-2 text-sm font-medium text-white transition-colors hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {creating ? (
                  <span className="flex items-center gap-2">
                    <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></span>
                    Creating...
                  </span>
                ) : (
                  '+ Add Customer'
                )}
              </button>
            </div>
          </form>
        </div>

        {/* Search Bar */}
        <div className="rounded-lg border bg-white p-4 shadow-sm">
          <div className="relative">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
              <span className="text-gray-400">🔍</span>
            </div>
            <input
              className="w-full rounded-md border border-gray-300 py-2 pl-10 pr-4 text-sm focus:border-transparent focus:outline-none focus:ring-2 focus:ring-primary"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by name, phone, or email..."
            />
          </div>
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

        {/* Customers List Card */}
        <div className="rounded-lg border bg-white shadow-sm">
          <div className="border-b px-6 py-4">
            <h2 className="text-lg font-semibold">All Customers</h2>
            {!loading && data.length > 0 && (
              <p className="mt-1 text-xs text-muted-foreground">
                {data.length} customer{data.length !== 1 ? 's' : ''} found
              </p>
            )}
          </div>
          <div className="p-6">
            {loading ? (
              <div className="flex items-center justify-center py-12">
                <div className="text-center">
                  <div className="mb-3 inline-block h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
                  <p className="text-sm text-muted-foreground">
                    Loading customers...
                  </p>
                </div>
              </div>
            ) : data.length === 0 ? (
              <div className="py-12 text-center">
                <div className="mb-3 text-4xl">👥</div>
                <p className="text-sm text-muted-foreground">
                  {searchTerm
                    ? `No customers found matching "${searchTerm}"`
                    : 'No customers found. Create your first customer above.'}
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                {data.map((c) => (
                  <div
                    key={c.id}
                    className="rounded-lg border p-4 transition-all hover:border-primary/50 hover:shadow-md"
                  >
                    <div className="mb-3 flex items-start justify-between">
                      <h3 className="text-base font-semibold">
                        {c.fullName || '(No Name)'}
                      </h3>
                      <div className="text-2xl">👤</div>
                    </div>
                    <div className="space-y-2">
                      {c.email && (
                        <div className="flex items-center gap-2 text-sm">
                          <span className="text-blue-500">📧</span>
                          <span className="truncate text-muted-foreground">
                            {c.email}
                          </span>
                        </div>
                      )}
                      {c.phone && (
                        <div className="flex items-center gap-2 text-sm">
                          <span className="text-green-500">📱</span>
                          <span className="text-muted-foreground">
                            {c.phone}
                          </span>
                        </div>
                      )}
                      <div className="border-t pt-2">
                        <p className="truncate text-xs text-muted-foreground">
                          ID: {c.id}
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
