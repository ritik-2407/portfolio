import Link from "next/link";
import { getSortedBlogsData } from "@/lib/markdown";
import { format, parseISO } from "date-fns";

export default function BlogsPage() {
  const blogs = getSortedBlogsData();

  return (
    <div className="space-y-12">
      <div className="space-y-4">
        <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl">
          Writings
        </h1>
        <p className="text-lg opacity-70 font-medium">
          Thoughts, learnings, and experiences.
        </p>
      </div>

      <div className="grid gap-6 sm:grid-cols-2">
        {blogs.map(({ slug, frontmatter }) => (
          <Link href={`/blogs/${slug}`} key={slug} className="group block focus:outline-none">
            <div 
              className="flex flex-col h-full rounded-2xl border transition-all duration-300 group-hover:-translate-y-1 group-focus:-translate-y-1 p-6"
              style={{
                borderColor: "var(--blog-border, currentColor)",
                backgroundColor: "var(--blog-card-bg, transparent)"
              }}
            >
              <h3 className="text-2xl font-bold tracking-tight mb-2 group-hover:underline underline-offset-4 decoration-2">
                {frontmatter.title}
              </h3>
              <time className="text-sm font-medium mb-4 opacity-60">
                {format(parseISO(frontmatter.date), "LLLL d, yyyy")}
              </time>
              <p className="opacity-80 leading-relaxed max-w-prose line-clamp-3">
                {frontmatter.description}
              </p>
            </div>
          </Link>
        ))}
        {blogs.length === 0 && (
          <div className="col-span-full py-20 text-center opacity-60">
            <p className="text-lg font-medium">No blogs published yet.</p>
          </div>
        )}
      </div>
    </div>
  );
}
