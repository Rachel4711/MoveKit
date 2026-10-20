import { AdminDashboard } from "@/components/admin-dashboard";
import { getAllOrders } from "@/db/orders";
import { getProducts } from "@/db/products";
import { requireAdmin } from "@/lib/admin";

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  const user = await requireAdmin();
  const [products, orders] = await Promise.all([getProducts(), getAllOrders()]);
  return <main className="admin-page"><header><span className="eyebrow">Authorized access</span><h1>Store control.</h1><p>Signed in as {user.email}</p></header><AdminDashboard products={products} orders={orders} /></main>;
}
