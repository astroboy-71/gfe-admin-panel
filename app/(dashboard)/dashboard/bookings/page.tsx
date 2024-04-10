"use client";

import BreadCrumb from "@/components/breadcrumb";
import { BookingClient } from "@/components/tables/booking-tables/client";

const breadcrumbItems = [{ title: "Bookings", link: "/dashboard/bookings" }];
export default function page() {
  return (
    <>
      <div className="flex-1 space-y-4  p-4 md:p-8 pt-6">
        <BreadCrumb items={breadcrumbItems} />
        <BookingClient />
      </div>
    </>
  );
}
