# Real-time Team Chat with AWS AppSync

A modern, responsive team messaging application built with Next.js, TypeScript, and AWS AppSync for real-time communication. Features a beautiful UI powered by Shadcn UI components and Tailwind CSS.

## 🚀 Features

- **Real-time Messaging**: Powered by AWS AppSync GraphQL subscriptions
- **Multi-Team Support**: Switch between different teams/boards
- **User Management**: Switch between different users for testing
- **Modern UI**: Built with Shadcn UI components and Tailwind CSS
- **Responsive Design**: Mobile-first approach with seamless desktop experience
- **TypeScript**: Full type safety throughout the application
- **Real-time Status**: Connection status indicators
- **Message Persistence**: Messages are stored and retrieved from AWS AppSync

## 🛠️ Tech Stack

- **Frontend**: Next.js 14, React 18, TypeScript
- **Styling**: Tailwind CSS, Shadcn UI Components
- **Backend**: AWS AppSync (GraphQL)
- **State Management**: Zustand
- **Icons**: Lucide React
- **Package Manager**: pnpm

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

### Switching Users
Use the user dropdown in the header to switch between different test users:
- Alice Johnson
- Bob Smith
- Carol Davis
- David Wilson

### Switching Teams/Boards
Use the team dropdown to switch between different teams:
- Development
- Design
- Marketing
- General

### Sending Messages
1. Type your message in the input field at the bottom
2. Press Enter or click the Send button
3. Messages appear in real-time for all users in the same team

## 🏗️ Project Structure

```
src/
├── app/
│   ├── globals.css          # Global styles and Tailwind CSS
│   ├── layout.tsx           # Root layout component
│   └── page.tsx             # Main chat page component
├── components/
│   └── ui/                  # Shadcn UI components
├── data/
│   └── dummy-data.ts        # Test data for users and teams
├── lib/
│   ├── appsync.ts          # AWS AppSync configuration
│   ├── graphql.ts          # GraphQL queries and mutations
│   ├── types.ts            # TypeScript type definitions
│   └── utils.ts            # Utility functions
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

- **GraphQL API**: Type-safe API operations
- **Real-time Subscriptions**: Live message updates
- **Offline Support**: Built-in caching and sync
- **Authentication**: API key-based authentication

### GraphQL Operations

- `listMessages` - Fetch existing messages
- `createMessage` - Send new messages
- `onCreateMessage` - Subscribe to new messages

## 📱 Responsive Design

The application is fully responsive with:

- **Mobile-first approach**: Optimized for mobile devices
- **Breakpoint system**: Tailored layouts for different screen sizes
- **Touch-friendly**: Large touch targets and smooth interactions
- **Adaptive navigation**: Collapsible sidebar on mobile

## 🔒 Environment Variables

Required environment variables for AWS AppSync:

| Variable | Description |
|----------|-------------|
| `NEXT_PUBLIC_APPSYNC_GRAPHQL_ENDPOINT` | Your AppSync GraphQL endpoint |
| `NEXT_PUBLIC_APPSYNC_REGION` | AWS region (e.g., us-east-1) |
| `NEXT_PUBLIC_APPSYNC_AUTHENTICATION_TYPE` | Authentication type (API_KEY) |
| `NEXT_PUBLIC_APPSYNC_API_KEY` | Your AppSync API key |

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
