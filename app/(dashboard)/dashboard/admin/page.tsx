"use client";

import BreadCrumb from "@/components/breadcrumb";
import { UserClient } from "@/components/tables/admin-tables/client";

const breadcrumbItems = [{ title: "Administrators", link: "/dashboard/admin" }];
export default function page() {
  return (
    <>
      <div className="flex-1 space-y-4  p-4 md:p-8 pt-6">
        <BreadCrumb items={breadcrumbItems} />
        <UserClient />
      </div>
    </>
  );
}
