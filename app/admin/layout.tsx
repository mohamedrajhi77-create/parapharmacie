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
    <div className="flex min-h-screen bg-gray-50">
      <AdminSidebar />
      <div className="flex-1 overflow-auto">
        <div className="p-6 md:p-8">{children}</div>
      </div>
      <Toaster />
    </div>
  );
}
