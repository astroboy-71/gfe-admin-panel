import BreadCrumb from "@/components/breadcrumb";
import EditBlogForm from "@/components/forms/edit-blog-form";
import dbConnect from "@/server/dbConnect";
import BlogNewsEvent from "@/server/model/blognewsevent.model";

async function getBlogDetail(blogId: string) {
  await dbConnect();

  const blog = await BlogNewsEvent.findOne({
    _id: blogId,
  });

  if (blog) {
    return {
      title: blog.title,
      subtitle: blog.subtitle,
      category: blog.category,
      content: blog.content,
      previewImage: blog.previewImage,
    };
  } else {
    return {};
  }
}

export default async function Page({ params }: { params: { blogId: string } }) {
  const breadcrumbItems = [
    { title: "Blogs & News", link: "/dashboard/blogs-and-news" },
    { title: "Edit", link: `/edit/${params.blogId}` },
    { title: params.blogId, link: `/edit/${params.blogId}` },
  ];

  const { title, subtitle, category, content, previewImage } =
    await getBlogDetail(params.blogId);

  return (
    <>
      <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
        <BreadCrumb items={breadcrumbItems} />
        <EditBlogForm
          id={params.blogId}
          title={title}
          subtitle={subtitle}
          category={category}
          content={content}
          previewImage={previewImage}
        />
      </div>
    </>
  );
}
