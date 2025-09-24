export interface TeamMessage {
  id: string;
  boardId: string;
  senderId: string;
  message: string;
  files?: string[];
  seenBy?: string[];
  createdAt: string;
  updatedAt: string;
}

export interface TeamMember {
  id: string;
  name: string;
  email: string;
  profilePicture: string;
}

export interface Board {
  id: string;
  name: string;
  description: string;
}

export interface CreateTeamMessageInput {
  boardId: string;
  senderId: string;
  message: string;
  files?: string[];
  seenBy?: string[];
  createdAt: string;
  updatedAt: string;
}

export interface UpdateTeamMessageInput {
  id: string;
  boardId?: string;
  senderId?: string;
  message?: string;
  files?: string[];
  seenBy?: string[];
  createdAt?: string;
  updatedAt?: string;
}

export interface DeleteTeamMessageInput {
  id: string;
}

export interface TeamMessageConnection {
  items: TeamMessage[];
  nextToken?: string;
}