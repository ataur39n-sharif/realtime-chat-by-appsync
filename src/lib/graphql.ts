// GraphQL queries
export const listTeamMessages = /* GraphQL */ `
  query ListTeamMessages(
    $filter: TableTeamMessageFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listTeamMessages(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        id
        boardId
        senderId
        message
        files
        seenBy
        createdAt
        updatedAt
      }
      nextToken
    }
  }
`;

export const getTeamMessage = /* GraphQL */ `
  query GetTeamMessage($id: ID!) {
    getTeamMessage(id: $id) {
      id
      boardId
      senderId
      message
      files
      seenBy
      createdAt
      updatedAt
    }
  }
`;

// GraphQL mutations
export const createTeamMessage = /* GraphQL */ `
  mutation CreateTeamMessage($input: CreateTeamMessageInput!) {
    createTeamMessage(input: $input) {
      id
      boardId
      senderId
      message
      files
      seenBy
      createdAt
      updatedAt
    }
  }
`;

export const updateTeamMessage = /* GraphQL */ `
  mutation UpdateTeamMessage($input: UpdateTeamMessageInput!) {
    updateTeamMessage(input: $input) {
      id
      boardId
      senderId
      message
      files
      seenBy
      createdAt
      updatedAt
    }
  }
`;

export const deleteTeamMessage = /* GraphQL */ `
  mutation DeleteTeamMessage($input: DeleteTeamMessageInput!) {
    deleteTeamMessage(input: $input) {
      id
      boardId
      senderId
      message
      files
      seenBy
      createdAt
      updatedAt
    }
  }
`;

// GraphQL subscriptions
export const onCreateTeamMessage = /* GraphQL */ `
  subscription OnCreateTeamMessage {
    onCreateTeamMessage {
      id
      boardId
      senderId
      message
      files
      seenBy
      createdAt
      updatedAt
    }
  }
`;

export const onUpdateTeamMessage = /* GraphQL */ `
  subscription OnUpdateTeamMessage {
    onUpdateTeamMessage {
      id
      boardId
      senderId
      message
      files
      seenBy
      createdAt
      updatedAt
    }
  }
`;

export const onDeleteTeamMessage = /* GraphQL */ `
  subscription OnDeleteTeamMessage {
    onDeleteTeamMessage {
      id
      boardId
      senderId
      message
      files
      seenBy
      createdAt
      updatedAt
    }
  }
`;