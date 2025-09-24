import { Board, TeamMember } from '../lib/types';

export const board: Board = {
  id: 'board-1',
  name: 'Project Alpha Team',
  description: 'Main communication channel for Project Alpha development team'
};

export const teamMembers: TeamMember[] = [
  {
    id: 'user-1',
    name: 'Alice Johnson',
    email: 'alice.johnson@company.com',
    profilePicture: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Alice&size=150'
  },
  {
    id: 'user-2',
    name: 'Bob Smith',
    email: 'bob.smith@company.com',
    profilePicture: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Bob&size=150'
  },
  {
    id: 'user-3',
    name: 'Carol Davis',
    email: 'carol.davis@company.com',
    profilePicture: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Carol&size=150'
  },
  {
    id: 'user-4',
    name: 'David Wilson',
    email: 'david.wilson@company.com',
    profilePicture: 'https://api.dicebear.com/7.x/avataaars/svg?seed=David&size=150'
  },
  {
    id: 'user-5',
    name: 'Emma Brown',
    email: 'emma.brown@company.com',
    profilePicture: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Emma&size=150'
  }
];

// Current user for demo purposes (can be changed)
export const currentUser = teamMembers[0];

// Helper function to get team member by ID
export const getTeamMemberById = (id: string): TeamMember | undefined => {
  return teamMembers.find(member => member.id === id);
};