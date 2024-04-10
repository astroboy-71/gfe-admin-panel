import Header from "@/components/layout/header";
import Sidebar from "@/components/layout/sidebar";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "GFE FOUNDATION | Dashboard",
  description: "GFE FOUNDATION ADMIN PANEL",
};

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Header />
      <div className="flex h-screen">
        <Sidebar />
        <main className="w-full mt-16">{children}</main>
      </div>
    </>
  );
}
