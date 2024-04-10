"use client";

import BreadCrumb from "@/components/breadcrumb";
import { FeedbackClient } from "@/components/tables/feedback-tables/client";

const breadcrumbItems = [{ title: "Feedbacks", link: "/dashboard/feedbacks" }];
export default function page() {
  return (
    <>
      <div className="flex-1 space-y-4  p-4 md:p-8 pt-6">
        <BreadCrumb items={breadcrumbItems} />
        <FeedbackClient />
      </div>
    </>
  );
}
