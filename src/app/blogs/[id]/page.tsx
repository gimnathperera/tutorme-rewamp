"use client";

import { useParams, useRouter } from "next/navigation";
import {
  useFetchBlogByIdQuery,
  useFetchBlogsQuery,
} from "@/store/api/splits/blogs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { useAuthContext } from "@/contexts";
import Link from "next/link";

export default function ViewBlogPage() {
  const params = useParams();
  const blogId = params?.id as string;
  const { data: blog, isLoading, error } = useFetchBlogByIdQuery(blogId);
  const { data: allBlogs } = useFetchBlogsQuery({});

  const { user } = useAuthContext();
  function decodeHtml(html: string) {
    const txt = document.createElement("textarea");
    txt.innerHTML = html;
    return txt.value;
  }

  const relatedArticles =
    allBlogs?.results.filter((b) =>
      blog?.relatedArticles?.some((ra) => ra === b.id)
    ) || [];

  const router = useRouter();

  if (isLoading) return <p>Loading...</p>;
  if (error || !blog) return <p>Blog not found.</p>;

  const paragraphContent = blog.content.find(
    (c): c is { type: "paragraph"; text: string } => c.type === "paragraph"
  )?.text;
  const headingContent = blog.content.find(
    (c): c is { type: "heading"; text: string; level: number } => c.type === "heading"
  )?.text;
  const imageContent = blog.content.find(
    (c): c is { type: "image"; src: string; caption?: string } => c.type === "image"
  );
  function capitalizeWords(str: string) {
    return str.replace(/\b\w/g, (char) => char.toUpperCase());
  }

  return (
    <div className="max-w-7xl mx-auto">
      <div className="space-y-5">
        {imageContent?.src && (
          <div className="mt-4">
            <img
              src={imageContent.src}
              alt={imageContent.caption || blog.title}
              className="rounded-md w-full h-96 object-cover"
            />
          </div>
        )}
      </div>
      <div className="flex mt-4 items-center space-x-2">
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
      <div className="mt-6">
        <div className="font-bold text-4xl py-2">
          {capitalizeWords(blog.title)}
        </div>

        {/* Related Articles as badges */}
        <div className="flex flex-wrap gap-2 mt-2">
          {relatedArticles.map((rel) => (
            <Badge
              key={rel.id}
              variant="outline"
              className="cursor-pointer bg-gray-200"
              onClick={() => router.push(`/blogs/${rel.id}`)}
            >
              # {rel.title}
            </Badge>
          ))}
        </div>
      </div>
      <div>
        {headingContent && (
          <h2 className="text-xl mt-4 font-semibold">{headingContent}</h2>
        )}
        {paragraphContent && (
          <div
            className="prose dark:prose-invert my-4 text-justify"
            dangerouslySetInnerHTML={{ __html: decodeHtml(paragraphContent) }}
          />
        )}
      </div>
      <div className="my-10">
        {blog.author.name === user?.name ? (
          <>
            <Link
              className="px-8 py-4 bg-black text-white rounded-lg"
              href={`/blogs/components/edit-blog/${blog.id}`}
            >
              Edit Blog
            </Link>
          </>
        ) : (
          <></>
        )}
      </div>
    </div>
  );
}
