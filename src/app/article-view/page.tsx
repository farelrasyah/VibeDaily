import { redirect } from 'next/navigation';

export default function ArticleViewPage() {
  // Redirect to home if no article ID is provided
  redirect('/');
}