import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import AdminSidebar from "@/components/admin/AdminSidebar";
import { Toaster } from "@/components/ui/toaster";

export const metadata = {
  title: { default: "Admin", template: "%s | Admin Parapharmacie" },
  robots: { index: false, follow: false },
};

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const cookieStore = await cookies();
  const adminSession = cookieStore.get("admin-session");

  if (!adminSession) {
    redirect("/admin/login");
  }

  return (
    <div className="lg:flex min-h-screen bg-gray-50">
      <AdminSidebar />
      <main className="flex-1 min-w-0 overflow-x-hidden">
        <div className="p-4 sm:p-6 md:p-8">{children}</div>
      </main>
      <Toaster />
    </div>
  );
}
