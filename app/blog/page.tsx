import { POSTS } from '@/lib/content';
import BlogClient from '@/components/BlogClient';

export default function BlogPage() {
  return <BlogClient posts={POSTS} />;
}
