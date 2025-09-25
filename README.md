# Real-time Team Chat with AWS AppSync

A modern, responsive team messaging application built with Next.js, TypeScript, and AWS AppSync for real-time communication. Features a beautiful UI powered by Shadcn UI components and Tailwind CSS with comprehensive authentication and board management. Optimized with board-specific GraphQL subscriptions for efficient real-time messaging.

## 🚀 Features

- **Real-time Messaging**: Powered by AWS AppSync GraphQL subscriptions with board-specific filtering
- **Multi-Board Support**: Create and manage different project boards
- **User Authentication**: Secure login system with JWT token management
- **Board Management**: Dynamic board creation, navigation, and type-based organization
- **Sender Information**: Messages display sender details including name and avatar
- **Modern UI**: Built with Shadcn UI components and Tailwind CSS
- **Responsive Design**: Mobile-first approach with seamless desktop experience
- **TypeScript**: Full type safety throughout the application
- **Real-time Status**: Connection status indicators
- **Message Persistence**: Messages are stored and retrieved from AWS AppSync
- **Dynamic Routing**: Board-specific URLs with type parameters
- **Error Handling**: Comprehensive error handling and retry mechanisms
- **Optimized Subscriptions**: Server-side filtered GraphQL subscriptions for improved performance

## 🛠️ Tech Stack

- **Frontend**: Next.js 14, React 18, TypeScript
- **Styling**: Tailwind CSS, Shadcn UI Components
- **Backend**: AWS AppSync (GraphQL)
- **Authentication**: JWT tokens with cookie-based storage
- **State Management**: React hooks and context
- **Icons**: Lucide React
- **Package Manager**: pnpm
- **Routing**: Next.js App Router with dynamic routes

## 📦 Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/ataur39n-sharif/realtime-chat-by-appsync.git
   cd realtime-chat-by-appsync
   ```

2. **Install dependencies**
   ```bash
   pnpm install
   ```

3. **Environment Setup**
   Create a `.env.local` file in the root directory and add your AWS AppSync configuration:
   ```env
   NEXT_PUBLIC_APPSYNC_GRAPHQL_ENDPOINT=your_appsync_endpoint
   NEXT_PUBLIC_APPSYNC_REGION=your_aws_region
   NEXT_PUBLIC_APPSYNC_AUTHENTICATION_TYPE=API_KEY
   NEXT_PUBLIC_APPSYNC_API_KEY=your_api_key
   ```

4. **Run the development server**
   ```bash
   pnpm dev
   ```

5. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 🎯 Usage

### Authentication
1. Navigate to the login page
2. Enter your credentials to authenticate
3. The system will store your JWT token securely in cookies
4. Access boards and messaging features after authentication

### Board Management
- View all available boards on the main dashboard
- Click on a board to enter its chat interface
- Board URLs include the board type for proper navigation
- Each board maintains its own message history

### Messaging
1. Select a board from the dashboard
2. Type your message in the input field at the bottom
3. Press Enter or click the Send button
4. Messages appear in real-time with sender information (name and avatar)
5. All messages are persisted and retrieved from AWS AppSync

### Board Navigation
- Use the breadcrumb navigation to return to the boards list
- Board names are dynamically loaded and displayed
- Each board maintains its own conversation thread

## 🏗️ Project Structure

```
src/
├── app/
│   ├── auth/
│   │   └── page.tsx         # Authentication page
│   ├── board/
│   │   └── [id]/
│   │       └── page.tsx     # Dynamic board page
│   ├── boards/
│   │   └── page.tsx         # Boards dashboard
│   ├── globals.css          # Global styles and Tailwind CSS
│   ├── layout.tsx           # Root layout component
│   └── page.tsx             # Landing page
├── components/
│   ├── board-chat-interface.tsx  # Main chat interface component
│   └── ui/                  # Shadcn UI components
├── lib/
│   ├── actions/
│   │   └── auth-actions.ts  # Authentication actions
│   ├── appsync.ts          # AWS AppSync configuration
│   ├── graphql.ts          # GraphQL queries and mutations
│   ├── types.ts            # TypeScript type definitions
│   └── utils.ts            # Utility functions
├── graphql/
│   ├── board.gql           # Board-related GraphQL operations
│   └── message.gql         # Message-related GraphQL operations
```

## 🔧 Available Scripts

- `pnpm dev` - Start development server
- `pnpm build` - Build for production
- `pnpm start` - Start production server
- `pnpm lint` - Run ESLint
- `pnpm type-check` - Run TypeScript type checking
- `pnpm clean` - Clean build artifacts

## 🎨 UI Components

The application uses Shadcn UI components for a consistent and modern design:

- **Card**: Message containers and layout sections
- **Button**: Interactive elements and actions
- **Input/Textarea**: Message input fields
- **Avatar**: User profile pictures
- **ScrollArea**: Smooth scrolling message area
- **Badge**: Status indicators and labels
- **Select**: Dropdown menus for user and team switching
- **Separator**: Visual dividers
- **Sheet**: Mobile navigation drawer
- **Dialog**: Modal windows

## 🌐 AWS AppSync Integration

The application integrates with AWS AppSync for:

- **GraphQL API**: Type-safe API operations with comprehensive schema
- **Real-time Subscriptions**: Live message updates across all connected clients
- **Authentication**: JWT token-based authentication with secure cookie storage
- **Board Management**: Dynamic board creation, retrieval, and management
- **Message Persistence**: Complete message history with sender information
- **Offline Support**: Built-in caching and synchronization

### GraphQL Operations

#### Board Operations
- `getMyBoards` - Fetch user's accessible boards
- `getBoardsById` - Get specific board details by ID and type
- `createBoard` - Create new project boards

#### Message Operations
- `queryTeamMessagesByBoardIdIndex` - Fetch messages for a specific board
- `createMessage` - Send new messages with sender information
- `onCreateMessage` - Subscribe to real-time message updates

#### Authentication Operations
- `getCurrentUser` - Retrieve current authenticated user information
- JWT token validation and refresh mechanisms

## 📱 Responsive Design

The application is fully responsive with:

- **Mobile-first approach**: Optimized for mobile devices
- **Breakpoint system**: Tailored layouts for different screen sizes
- **Touch-friendly**: Large touch targets and smooth interactions
- **Adaptive navigation**: Collapsible sidebar on mobile

## 🔒 Environment Variables

Copy the `.env.example` file to `.env.local` and update with your API credentials:

```bash
cp .env.example .env.local
```

Required environment variables:

| Category | Variables |
|----------|-------------|
| **AWS Region** | `NEXT_PUBLIC_AWS_REGION` |
| **Authentication** | `JWT_SECRET`, `COOKIE_SECRET` |
| **Message API** | `NEXT_PUBLIC_APPSYNC_HTTPS_MESSAGE_API_ENDPOINT`, `NEXT_PUBLIC_APPSYNC_WS_MESSAGE_API_ENDPOINT`, `NEXT_PUBLIC_APPSYNC_API_KEY` |
| **Auth API** | `NEXT_PUBLIC_AUTH_APPSYNC_ENDPOINT`, `NEXT_PUBLIC_AUTH_APPSYNC_API_KEY` |
| **Board API** | `NEXT_PUBLIC_BOARD_ENDPOINT`, `NEXT_PUBLIC_BOARD_API_KEY` |

## 🔄 Recent Updates

### Version 2.1 (Current)
- **Optimized GraphQL Subscriptions**: Implemented board-specific subscriptions with server-side filtering
- **Improved Performance**: Reduced network traffic by eliminating client-side message filtering
- **Enhanced Scalability**: Better handling of high message volume across multiple boards

### Version 2.0
- **Enhanced Authentication**: Implemented JWT-based authentication system
- **Board Management**: Added ability to create and manage multiple boards
- **Dynamic Routing**: Implemented board-specific URLs with parameters
- **Sender Information**: Added user details to messages
- **Improved GraphQL Schema**: Restructured for better type safety
- **Error Handling**: Added comprehensive error handling and retry mechanisms
- **Real-time Updates**: Enhanced subscription management
- **Responsive UI**: Improved mobile and desktop user experience with better navigation

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [Next.js](https://nextjs.org/) - The React framework
- [AWS AppSync](https://aws.amazon.com/appsync/) - Real-time GraphQL API
- [Shadcn UI](https://ui.shadcn.com/) - Beautiful UI components
- [Tailwind CSS](https://tailwindcss.com/) - Utility-first CSS framework
- [Lucide React](https://lucide.dev/) - Beautiful icons
