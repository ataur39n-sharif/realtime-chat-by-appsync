import { redirect } from 'next/navigation';
import { getCurrentUser } from '@/lib/auth-actions';

// Force dynamic rendering to allow cookie usage
export const dynamic = 'force-dynamic';

export default async function HomePage() {
  const user = await getCurrentUser();
  
  if (user) {
    redirect('/boards');
  } else {
    redirect('/login');
  }
}