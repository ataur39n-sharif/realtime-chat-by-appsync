'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Users, Calendar, Crown, Shield, User } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface BoardInfo {
  name: string;
  description?: string;
  ownerId: string;
  memberCount: number;
  createdAt: string;
  updatedAt: string;
  inviteCode?: string;
  coverImage?: string;
  boardImage?: string;
  boardStatus: 'ACTIVE' | 'INACTIVE' | 'ARCHIVED' | 'PENDING' | 'REJECTED';
  boardType: 'PUBLIC' | 'COMMUNITY' | 'PRIVATE' | 'SPONSORED';
}

interface MyBoardData {
  id: string;
  role: 'owner' | 'member' | 'admin';
  status: 'invited' | 'joined' | 'requested';
  createdAt: string;
  updatedAt: string;
  boardId: string;
  boardInfo: BoardInfo;
}

interface BoardsListProps {
  boards: MyBoardData[];
}

function getRoleIcon(role: string) {
  switch (role) {
    case 'owner':
      return <Crown className="h-4 w-4" />;
    case 'admin':
      return <Shield className="h-4 w-4" />;
    default:
      return <User className="h-4 w-4" />;
  }
}

function getRoleColor(role: string) {
  switch (role) {
    case 'owner':
      return 'bg-yellow-100 text-yellow-800';
    case 'admin':
      return 'bg-blue-100 text-blue-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
}

function getStatusColor(status: string) {
  switch (status) {
    case 'joined':
      return 'bg-green-100 text-green-800';
    case 'invited':
      return 'bg-orange-100 text-orange-800';
    case 'requested':
      return 'bg-purple-100 text-purple-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
}

function getBoardTypeColor(type: string) {
  switch (type) {
    case 'PUBLIC':
      return 'bg-green-100 text-green-800';
    case 'PRIVATE':
      return 'bg-red-100 text-red-800';
    case 'COMMUNITY':
      return 'bg-blue-100 text-blue-800';
    case 'SPONSORED':
      return 'bg-purple-100 text-purple-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
}

export default function BoardsList({ boards }: BoardsListProps) {
  const router = useRouter();

  const handleBoardClick = (boardId: string, boardType: string) => {
    router.push(`/board/${boardId}?type=${boardType}`);
  };

  if (boards.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-gray-500 mb-4">
          <Users className="h-12 w-12 mx-auto mb-4" />
          <p className="text-lg font-medium">No boards found</p>
          <p className="text-sm">You haven't joined any boards yet.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {boards.map((board) => (
        <Card 
          key={board.id} 
          className="hover:shadow-lg transition-shadow cursor-pointer"
          onClick={() => handleBoardClick(board.boardId, board.boardInfo.boardType)}
        >
          <CardHeader className="pb-3">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <CardTitle className="text-lg font-semibold text-gray-900 mb-1">
                  {board.boardInfo.name}
                </CardTitle>
                <CardDescription className="text-sm text-gray-600 line-clamp-2">
                  {board.boardInfo.description || 'No description available'}
                </CardDescription>
              </div>
            </div>
            
            <div className="flex flex-wrap gap-2 mt-3">
              <Badge className={`${getRoleColor(board.role)} flex items-center gap-1`}>
                {getRoleIcon(board.role)}
                {board.role}
              </Badge>
              
              <Badge className={getStatusColor(board.status)}>
                {board.status}
              </Badge>
              
              <Badge className={getBoardTypeColor(board.boardInfo.boardType)}>
                {board.boardInfo.boardType.toLowerCase()}
              </Badge>
            </div>
          </CardHeader>
          
          <CardContent className="pt-0">
            <div className="flex items-center justify-between text-sm text-gray-500">
              <div className="flex items-center gap-1">
                <Users className="h-4 w-4" />
                <span>{board.boardInfo.memberCount} members</span>
              </div>
              
              <div className="flex items-center gap-1">
                <Calendar className="h-4 w-4" />
                <span>
                  {new Date(board.boardInfo.createdAt).toLocaleDateString()}
                </span>
              </div>
            </div>
            
            <div className="mt-4">
              <Button 
                className="w-full" 
                variant={board.status === 'joined' ? 'default' : 'outline'}
                onClick={(e) => {
                  e.stopPropagation();
                  handleBoardClick(board.boardId, board.boardInfo.boardType);
                }}
              >
                {board.status === 'joined' ? 'Open Board' : 
                 board.status === 'invited' ? 'View Invitation' : 'View Request'}
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}