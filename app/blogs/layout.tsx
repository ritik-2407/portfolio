import { BlogThemeProvider } from "@/components/blog-theme-provider";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Blogs | Ritik",
  description: "Writings and thoughts.",
};

export default function BlogsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // We wrap the blogs with their own theme provider.
  // This will cover everything rendered within /blogs/...
  return (
    <div className="min-h-screen w-full">
      <BlogThemeProvider>{children}</BlogThemeProvider>
    </div>
  );
}
