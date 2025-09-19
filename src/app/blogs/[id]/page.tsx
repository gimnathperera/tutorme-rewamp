"use client";

import { useParams, useRouter } from "next/navigation";
import {
  useFetchBlogByIdQuery,
  useFetchBlogsQuery,
} from "@/store/api/splits/blogs";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export default function ViewBlogPage() {
  const params = useParams();
  const blogId = params?.id as string;
  const { data: blog, isLoading, error } = useFetchBlogByIdQuery(blogId);
  const { data: allBlogs } = useFetchBlogsQuery({});

  const relatedArticles =
    allBlogs?.results.filter((b) => blog?.relatedArticles.includes(b.id)) || [];

  const router = useRouter();

  if (isLoading) return <p>Loading...</p>;
  if (error || !blog) return <p>Blog not found.</p>;

  const paragraphContent = blog.content.find(
    (c) => c.type === "paragraph"
  )?.text;
  const headingContent = blog.content.find((c) => c.type === "heading")?.text;
  const imageContent = blog.content.find((c) => c.type === "image");
  function capitalizeWords(str: string) {
    return str.replace(/\b\w/g, (char) => char.toUpperCase());
  }

  return (
    <div className="max-w-7xl mx-auto">
      <div>
        <div className="font-bold text-4xl py-4">
          {capitalizeWords(blog.title)}
        </div>
        <div className="flex items-center space-x-4">
          <Avatar>
            <AvatarImage src={blog.author.avatar} />
            <AvatarFallback>{blog.author.name[0]}</AvatarFallback>
          </Avatar>
          <div>
            <div>
              By {blog.author.name} - {blog.author.role}
            </div>
            <p className="text-sm text-gray-500">
              Created at: {new Date(blog.createdAt).toLocaleDateString()},{" "}
              {new Date(blog.createdAt).toLocaleTimeString()}
            </p>
          </div>
        </div>

        <div className="space-y-5 my-4">
          {imageContent?.src && (
            <div className="mt-4">
              <img
                src={imageContent.src}
                alt={imageContent.caption || blog.title}
                className="rounded-md w-full h-96 object-cover"
              />
              {imageContent.caption && (
                <p className="text-sm flex justify-end items-end text-gray-500 mt-1">
                  {imageContent.caption}
                </p>
              )}
            </div>
          )}
          {headingContent && (
            <h2 className="text-xl mt-2 font-semibold">{headingContent}</h2>
          )}
          {paragraphContent && <p>{paragraphContent}</p>}
        </div>
      </div>

      {/* Related Articles */}
      {relatedArticles.length > 0 && (
        <div className="mt-10">
          <h3 className="text-xl font-semibold mb-4">Related Articles</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {relatedArticles.map((rel) => (
              <Card
                key={rel.id}
                onClick={() => router.push(`/blogs/${rel.id}`)}
                className="cursor-pointer hover:shadow-lg transition-shadow"
              >
                <CardContent>
                  <CardTitle>{rel.title}</CardTitle>
                  <p>
                    {rel.content
                      .find((c) => c.type === "paragraph")
                      ?.text?.slice(0, 100)}
                    ...
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
