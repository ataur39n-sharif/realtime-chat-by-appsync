'use server';

import { getAccessToken } from './auth-actions';

// Types based on board.gql schema
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

interface MyBoardResponse {
  data: MyBoardData[];
  success: boolean;
  message: string;
}

interface BoardMember {
  id: string;
  boardId: string;
  email: string;
  role: 'owner' | 'member' | 'admin';
  status: 'invited' | 'joined' | 'requested';
  agreeTerms: boolean;
  name?: string;
  avatar?: string;
  createdAt: string;
  updatedAt: string;
}

// GraphQL queries
const GET_MY_BOARDS_QUERY = `
  query GetMyBoards($userId: String!) {
    getMyBoards(userId: $userId) {
      data {
        id
        role
        status
        createdAt
        updatedAt
        boardId
        boardInfo {
          name
          description
          ownerId
          memberCount
          createdAt
          updatedAt
          inviteCode
          coverImage
          boardImage
          boardStatus
          boardType
        }
      }
      success
      message
    }
  }
`;

const GET_BOARD_MEMBERS_QUERY = `
  query GetBoardMembers($boardId: ID!) {
    getBoardMembers(boardId: $boardId) {
      id
      boardId
      email
      role
      status
      agreeTerms
      name
      avatar
      createdAt
      updatedAt
    }
  }
`;

const GET_BOARD_DETAILS_QUERY = `
  query GetBoardDetails($boardId: ID!, $userId: String!) {
    getBoardDetails(boardId: $boardId, userId: $userId) {
      name
      description
      ownerId
      memberCount
      createdAt
      updatedAt
      inviteCode
      coverImage
      boardImage
      boardStatus
      boardType
    }
  }
`;

const GET_BOARDS_BY_ID_QUERY = `
  query GetBoardsById($boardId: ID!, $boardType: BoardType!) {
    getBoardsById(boardId: $boardId, boardType: $boardType) {
      data {
        id
        name
        slug
        description
        boardType
        boardStatus
        boardPriority
        boardCategory
        boardSubCategory
        boardTags
        boardLabels
        poolId
        ownerId
        memberCount
        memberLimit
        inviteCode
        coverImage
        boardImage
        termsAndConditions
        createdAt
        updatedAt
      }
      success
      message
    }
  }
`;

// Function to make GraphQL request to board endpoint
async function makeBoardRequest(query: string, variables: any): Promise<any> {
  const boardEndpoint = process.env.NEXT_PUBLIC_BOARD_ENDPOINT;
  const boardApiKey = process.env.NEXT_PUBLIC_BOARD_API_KEY;
  
  if (!boardEndpoint || !boardApiKey) {
    throw new Error('Board AppSync configuration is missing');
  }

  // Get access token for authenticated requests
  const accessToken = await getAccessToken();
  
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    'x-api-key': boardApiKey,
  };
  
  // Add authorization header if access token is available
  if (accessToken) {
    headers['Authorization'] = `Bearer ${accessToken}`;
  }

  const response = await fetch(boardEndpoint, {
    method: 'POST',
    headers,
    body: JSON.stringify({
      query,
      variables,
    }),
  });

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  const result = await response.json();
  
  if (result.errors) {
    throw new Error(result.errors[0]?.message || 'GraphQL error');
  }

  return result.data;
}

// Function to get user's boards
export async function getMyBoards(userId: string): Promise<MyBoardResponse> {
  try {
    const data = await makeBoardRequest(GET_MY_BOARDS_QUERY, { userId });
    return data.getMyBoards;
  } catch (error) {
    console.error('Error fetching boards:', error);
    return {
      data: [],
      success: false,
      message: error instanceof Error ? error.message : 'Failed to fetch boards',
    };
  }
}

// Function to get board members
export async function getBoardMembers(boardId: string): Promise<BoardMember[]> {
  try {
    const data = await makeBoardRequest(GET_BOARD_MEMBERS_QUERY, { boardId });
    return data.getBoardMembers || [];
  } catch (error) {
    console.error('Error fetching board members:', error);
    return [];
  }
}

// Function to check if user is a board member
export async function isBoardMember(boardId: string, userEmail: string): Promise<boolean> {
  try {
    const members = await getBoardMembers(boardId);
    return members.some(member => 
      member.email === userEmail && 
      member.status === 'joined'
    );
  } catch (error) {
    console.error('Error checking board membership:', error);
    return false;
  }
}

// Function to get board by ID using getBoardsById query
export async function getBoardById(boardId: string, boardType: string): Promise<any | null> {
  try {
    const data = await makeBoardRequest(GET_BOARDS_BY_ID_QUERY, { 
      boardId, 
      boardType: boardType.toUpperCase() 
    });
    return data.getBoardsById?.data || null;
  } catch (error) {
    console.error('Error fetching board by ID:', error);
    return null;
  }
}

// Function to get board details
export async function getBoardDetails(boardId: string, userId: string): Promise<BoardInfo | null> {
  try {
    // First try to get from user's boards (more efficient)
    const myBoards = await getMyBoards(userId);
    const board = myBoards.data.find(board => board.boardId === boardId);
    
    if (board?.boardInfo) {
      return board.boardInfo;
    }
    
    // If not found in user's boards, try direct board query
    try {
      const data = await makeBoardRequest(GET_BOARD_DETAILS_QUERY, { boardId, userId });
      return data.getBoardDetails || null;
    } catch (directQueryError) {
      // If direct query fails, return null (board might not exist or user has no access)
      console.warn('Direct board query failed:', directQueryError);
      return null;
    }
  } catch (error) {
    console.error('Error fetching board details:', error);
    return null;
  }
}