import BasePages from '@/components/shared/base-pages';

export default function DashboardMainPage() {
  return (
    <BasePages pageHead="Dashboard Overview">
      <div className="mt-6 space-y-4">
        <h1 className="text-xl font-semibold">Dashboard Overview</h1>
        <p className="text-sm text-muted-foreground">
          Welcome to Carstore management dashboard. Use the sidebar to navigate
          through Product, Inventory and Sales CRUD sections.
        </p>
      </div>
    </BasePages>
  );
}
