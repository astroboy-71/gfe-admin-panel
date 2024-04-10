"use client";

import BreadCrumb from "@/components/breadcrumb";
import { ProposalRequestClient } from "@/components/tables/proposal-request-tables/client";

const breadcrumbItems = [
  { title: "Proposal Requests", link: "/dashboard/proposal-requests" },
];
export default function page() {
  return (
    <>
      <div className="flex-1 space-y-4  p-4 md:p-8 pt-6">
        <BreadCrumb items={breadcrumbItems} />
        <ProposalRequestClient />
      </div>
    </>
  );
}
