"use client";

import BreadCrumb from "@/components/breadcrumb";
import { SubDAORequestClient } from "@/components/tables/subdao-request-tables/client";

const breadcrumbItems = [
  { title: "SubDAO Requests", link: "/dashboard/subdao-requests" },
];
export default function page() {
  return (
    <>
      <div className="flex-1 space-y-4  p-4 md:p-8 pt-6">
        <BreadCrumb items={breadcrumbItems} />
        <SubDAORequestClient />
      </div>
    </>
  );
}
