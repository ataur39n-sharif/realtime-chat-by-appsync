import { redirect } from 'next/navigation';
import { getCurrentUser } from '@/lib/auth-actions';
import { getBoardMembers, isBoardMember, getBoardById } from '@/lib/board-actions';
import BoardChatInterface from '@/components/board-chat-interface';

// Force dynamic rendering to allow cookie usage
export const dynamic = 'force-dynamic';

interface BoardPageProps {
  params: {
    boardId: string;
  };
  searchParams: {
    type?: string;
  };
}

export default async function BoardPage({ params, searchParams }: BoardPageProps) {
  const { boardId } = params;
  const { type: boardType } = searchParams;
  
  // Redirect if board type is missing
  if (!boardType) {
    redirect('/boards');
  }
  
  // Check if user is authenticated
  const user = await getCurrentUser();
  if (!user) {
    redirect('/login');
  }

  // Check if user is a member of this board
  const isUserMember = await isBoardMember(boardId, user.email);
  if (!isUserMember) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center space-y-4">
          <h1 className="text-2xl font-bold text-gray-900">Access Denied</h1>
          <p className="text-gray-600">You are not a member of this board.</p>
          <a 
            href="/boards" 
            className="inline-block px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
          >
            Back to Boards
          </a>
        </div>
      </div>
    );
  }

  // Get board members for the chat interface
  const boardMembers = await getBoardMembers(boardId);
  
  // Get board details using getBoardById with board type
  const boardDetails = await getBoardById(boardId, boardType);
  const boardName = boardDetails?.name || `Board ${boardId.slice(-6)}`;

  return (
    <BoardChatInterface 
      boardId={boardId}
      currentUser={user}
      boardMembers={boardMembers}
      boardName={boardName}
    />
  );
}