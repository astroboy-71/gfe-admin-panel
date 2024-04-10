import BreadCrumb from "@/components/breadcrumb";
import NewBlogForm from "@/components/forms/new-blog-form";

const breadcrumbItems = [
  { title: "Blogs & News", link: "/dashboard/blogs-and-news" },
  { title: "Create", link: "/post" },
];
export default function page() {
  return (
    <>
      <div className="container flex-1 space-y-4 p-4 md:p-8 pt-6">
        <BreadCrumb items={breadcrumbItems} />
        <NewBlogForm />
      </div>
    </>
  );
}
