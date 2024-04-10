import BreadCrumb from "@/components/breadcrumb";
import { ProfileForm } from "@/components/forms/profile-form";
import { CreateProfileOne } from "@/components/forms/user-profile-stepper/create-profile";

const breadcrumbItems = [{ title: "Profile", link: "/dashboard/profile" }];
export default function page() {
  return (
    <>
      <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
        <BreadCrumb items={breadcrumbItems} />
        <ProfileForm />
      </div>
    </>
  );
}
