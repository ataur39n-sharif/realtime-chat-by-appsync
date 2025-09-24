import { redirect } from 'next/navigation';
import { getCurrentUser, isAuthenticated } from '@/lib/auth-actions';
import { getMyBoards } from '@/lib/board-actions';
import BoardsList from '@/components/boards-list';
import { User } from 'lucide-react';
import LogoutButton from '@/components/logout-button';
import RetryButton from '@/components/retry-button';

// Force dynamic rendering to allow cookie usage
export const dynamic = 'force-dynamic';

export default async function BoardsPage() {
  // Check authentication
  const authenticated = await isAuthenticated();
  if (!authenticated) {
    redirect('/login');
  }

  // Get current user
  const currentUser = await getCurrentUser();
  if (!currentUser) {
    redirect('/login');
  }

  // Fetch user's boards
  const boardsResult = await getMyBoards(currentUser.sub);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-gray-900">My Boards</h1>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <User className="h-5 w-5 text-gray-500" />
                <span className="text-sm text-gray-700">{currentUser.name || currentUser.email}</span>
              </div>
              <LogoutButton />
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <div className="mb-6">
          <h2 className="text-lg font-medium text-gray-900 mb-2">
            Welcome back, {currentUser.name || 'User'}!
          </h2>
          <p className="text-gray-600">
            Here are your boards where you can collaborate with your team.
          </p>
        </div>

        {boardsResult.success ? (
          <BoardsList boards={boardsResult.data || []} />
        ) : (
          <div className="text-center py-12">
            <div className="text-red-600 mb-4">
              <p className="text-lg font-medium">Failed to load boards</p>
              <p className="text-sm">{boardsResult.message}</p>
            </div>
            <RetryButton />
          </div>
        )}
      </main>
    </div>
  );
}