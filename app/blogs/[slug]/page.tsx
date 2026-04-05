import { getBlogData } from "@/lib/markdown";
import { notFound } from "next/navigation";
import { format, parseISO } from "date-fns";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const postData = getBlogData(slug);

  if (!postData) {
    notFound();
  }

  return (
    <article className="pb-20">
      <header className="mb-12 space-y-6 text-center">
        <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl">
          {postData.frontmatter.title}
        </h1>
        <div className="flex items-center justify-center space-x-2 text-sm font-medium opacity-70">
          <time dateTime={postData.frontmatter.date}>
            {format(parseISO(postData.frontmatter.date), "LLLL d, yyyy")}
          </time>
          {postData.frontmatter.description && (
            <>
              <span>•</span>
              <span>{Math.ceil(postData.content.length / 1000)} min read</span>
            </>
          )}
        </div>
      </header>

      {/* The `prose` class relies on Tailwind Typography.
          We use custom CSS in our BlogThemeProvider to switch between light/dark prose dynamically. */}
      <div
        className="prose prose-lg mx-auto w-full max-w-none break-words blog-prose-dynamic"
      >
        <ReactMarkdown 
          remarkPlugins={[remarkGfm]} 
          rehypePlugins={[rehypeRaw]}
        >
          {postData.content}
        </ReactMarkdown>
      </div>
    </article>
  );
}
