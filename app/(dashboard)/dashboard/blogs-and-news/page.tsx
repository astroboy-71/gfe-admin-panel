import BreadCrumb from "@/components/breadcrumb";
import BlogSection from "@/components/sections/blog-section";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PlusCircle } from "lucide-react";
import Link from "next/link";

const breadcrumbItems = [
  { title: "Blogs & News", link: "/dashboard/blogs-and-news" },
];

export default function page() {
  return (
    <>
      <div className="flex flex-col gap-4 p-4 md:p-8 pt-6 justify-start items-start">
        <BreadCrumb items={breadcrumbItems} />
        <div className="relative w-full">
          <Button className="absolute top-0 right-0" asChild>
            <Link href="/post">
              <PlusCircle className="h-4 w-4 sm:mr-2" />
              <span className="hidden sm:block">Add</span>
            </Link>
          </Button>
          <Tabs
            defaultValue="blogs"
            className="w-full justify-start items-start"
          >
            <TabsList className="flex gap-3 w-fit">
              <TabsTrigger value="blogs">Blogs</TabsTrigger>
              <TabsTrigger value="news">News</TabsTrigger>
              <TabsTrigger value="events">Events</TabsTrigger>
            </TabsList>
            <TabsContent value="blogs" className="">
              <BlogSection category="blog" />
            </TabsContent>
            <TabsContent value="news">
              <BlogSection category="news" />
            </TabsContent>
            <TabsContent value="events">
              <BlogSection category="event" />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </>
  );
}
