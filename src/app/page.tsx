'use client';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Textarea } from '@/components/ui/textarea';
import { client } from '@/lib/appsync';
import { createTeamMessage, listTeamMessages, onCreateTeamMessage } from '@/lib/graphql';
import { CreateTeamMessageInput, TeamMessage } from '@/lib/types';
import { Building2, Hash, Menu, Send, Settings, Users, Wifi, WifiOff } from 'lucide-react';
import React, { useEffect, useState } from 'react';

// Predefined test users
const testUsers = [
  {
    id: 'user-1',
    name: 'Alice Johnson',
    email: 'alice@company.com',
    avatar: 'AJ'
  },
  {
    id: 'user-2',
    name: 'Bob Smith',
    email: 'bob@company.com',
    avatar: 'BS'
  },
  {
    id: 'user-3',
    name: 'Carol Davis',
    email: 'carol@company.com',
    avatar: 'CD'
  },
  {
    id: 'user-4',
    name: 'David Wilson',
    email: 'david@company.com',
    avatar: 'DW'
  }
];

// Predefined boards/teams
const testBoards = [
  {
    id: 'development-team',
    name: 'Development Team',
    description: 'Frontend & Backend developers',
    icon: 'code',
    color: 'bg-blue-500'
  },
  {
    id: 'design-team',
    name: 'Design Team',
    description: 'UI/UX designers and creatives',
    icon: 'palette',
    color: 'bg-purple-500'
  },
  {
    id: 'marketing-team',
    name: 'Marketing Team',
    description: 'Marketing and growth team',
    icon: 'megaphone',
    color: 'bg-green-500'
  },
  {
    id: 'general',
    name: 'General',
    description: 'General discussions',
    icon: 'hash',
    color: 'bg-gray-500'
  }
];

export default function TeamChatPage() {
  const [messages, setMessages] = useState<TeamMessage[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [isConnected, setIsConnected] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSending, setIsSending] = useState(false);
  const [currentUser, setCurrentUser] = useState(testUsers[0]);
  const [currentBoard, setCurrentBoard] = useState(testBoards[0]);

  // Load initial messages
  useEffect(() => {
    loadMessages();
  }, [currentBoard.id]);

  // Set up real-time subscription
  useEffect(() => {
    let subscription: any;

    const setupSubscription = async () => {
      try {
        setIsConnected(false);
        
        // Use the correct Amplify v6 subscription syntax
        subscription = (client.graphql({
          query: onCreateTeamMessage
        }) as any).subscribe({
          next: ({ data }: any) => {
            if (data?.onCreateTeamMessage) {
              const newMessage = data.onCreateTeamMessage;
              // Only add messages for the current board
              if (newMessage.boardId === currentBoard.id) {
                setMessages(prev => [...prev, newMessage]);
              }
            }
          },
          error: (error: any) => {
            console.error('Subscription error:', error);
            setIsConnected(false);
          }
        });

        setIsConnected(true);
      } catch (error) {
        console.error('Failed to setup subscription:', error);
        setIsConnected(false);
      }
    };

    setupSubscription();

    return () => {
      if (subscription) {
        subscription.unsubscribe();
      }
    };
  }, [currentBoard.id]);

  const loadMessages = async () => {
    try {
      setIsLoading(true);
      const response = await client.graphql({
        query: listTeamMessages,
        variables: {
          limit: 50
        }
      }) as any;

      if (response.data?.listTeamMessages?.items) {
        // Filter messages by current board
        const boardMessages = response.data.listTeamMessages.items.filter(
          (message: any) => message.boardId === currentBoard.id
        );
        setMessages(boardMessages.sort(
          (a: any, b: any) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
        ));
      }
    } catch (error) {
      console.error('Error loading messages:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleBoardSwitch = (boardId: string) => {
    const selectedBoard = testBoards.find(board => board.id === boardId);
    if (selectedBoard) {
      setCurrentBoard(selectedBoard);
      setMessages([]); // Clear current messages
    }
  };

  const sendMessage = async () => {
    if (!newMessage.trim() || isSending) return;

    try {
      setIsSending(true);
      const messageInput: CreateTeamMessageInput = {
        boardId: currentBoard.id,
        senderId: currentUser.id,
        message: newMessage.trim(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      await client.graphql({
        query: createTeamMessage,
        variables: { input: messageInput }
      }) as any;

      setNewMessage('');
    } catch (error) {
      console.error('Error sending message:', error);
    } finally {
      setIsSending(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Mobile-First Layout */}
      <div className="flex h-screen max-w-7xl mx-auto">
        {/* Sidebar - Hidden on mobile, visible on desktop */}
        <div className="hidden lg:flex lg:w-80 lg:flex-col lg:border-r">
          <Card className="h-full rounded-none border-0">
            <CardHeader className="border-b">
              <CardTitle className="flex items-center gap-2">
                <Building2 className="h-5 w-5" />
                {currentBoard.name}
              </CardTitle>
            </CardHeader>
            <CardContent className="flex-1 p-0">
              <div className="p-4 space-y-4">
                <div className="flex items-center gap-2">
                  <Avatar className="h-8 w-8">
                    <AvatarFallback>{currentUser.avatar}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{currentUser.name}</p>
                    <p className="text-xs text-muted-foreground truncate">{currentUser.email}</p>
                  </div>
                </div>
                <Separator />
                <div className="space-y-2">
                  <h4 className="text-sm font-medium">Online Members</h4>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <div className="h-2 w-2 bg-green-500 rounded-full"></div>
                      <span className="text-sm">3 members online</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Chat Area */}
        <div className="flex-1 flex flex-col">
          {/* Header */}
          <Card className="rounded-none border-0 border-b">
            <CardHeader className="px-4 py-3 sm:px-6 sm:py-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  {/* Mobile Menu */}
                  <Sheet>
                    <SheetTrigger asChild>
                      <Button variant="ghost" size="icon" className="lg:hidden">
                        <Menu className="h-5 w-5" />
                      </Button>
                    </SheetTrigger>
                    <SheetContent side="left" className="w-80">
                      <SheetHeader>
                        <SheetTitle className="flex items-center gap-2">
                          <Building2 className="h-5 w-5" />
                          {currentBoard.name}
                        </SheetTitle>
                      </SheetHeader>
                      <div className="mt-6 space-y-4">
                        <div className="flex items-center gap-2">
                          <Avatar className="h-8 w-8">
                            <AvatarFallback>{currentUser.avatar}</AvatarFallback>
                          </Avatar>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium truncate">{currentUser.name}</p>
                            <p className="text-xs text-muted-foreground truncate">{currentUser.email}</p>
                          </div>
                        </div>
                        <Separator />
                        <div className="space-y-2">
                          <h4 className="text-sm font-medium">Online Members</h4>
                          <div className="space-y-2">
                            <div className="flex items-center gap-2">
                              <div className="h-2 w-2 bg-green-500 rounded-full"></div>
                              <span className="text-sm">3 members online</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </SheetContent>
                  </Sheet>

                  <div className="flex items-center gap-2">
                    <Building2 className="h-5 w-5 text-primary" />
                    <h1 className="text-lg sm:text-xl font-semibold">{currentBoard.name}</h1>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {/* Board Switch Dropdown */}
                  <Select value={currentBoard.id} onValueChange={handleBoardSwitch}>
                    <SelectTrigger className="w-auto min-w-[120px] h-8">
                      <div className="flex items-center gap-2">
                        <div className={`h-3 w-3 rounded-full ${currentBoard.color}`}></div>
                        <span className="text-sm font-medium hidden sm:inline">{currentBoard.name}</span>
                        <span className="text-sm font-medium sm:hidden">
                          {currentBoard.icon === 'hash' ? <Hash className="h-3 w-3" /> :
                            currentBoard.icon === 'code' ? '💻' :
                              currentBoard.icon === 'palette' ? '🎨' :
                                currentBoard.icon === 'megaphone' ? '📢' : <Hash className="h-3 w-3" />}
                        </span>
                      </div>
                    </SelectTrigger>
                    <SelectContent>
                      {testBoards.map((board) => (
                        <SelectItem key={board.id} value={board.id}>
                          <div className="flex items-center gap-2">
                            <div className={`h-3 w-3 rounded-full ${board.color}`}></div>
                            <div className="flex flex-col">
                              <span className="text-sm font-medium">{board.name}</span>
                              <span className="text-xs text-muted-foreground">{board.description}</span>
                            </div>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  {/* User Switch Dropdown */}
                  <Select value={currentUser.id} onValueChange={(userId) => {
                    const selectedUser = testUsers.find(user => user.id === userId);
                    if (selectedUser) {
                      setCurrentUser(selectedUser);
                    }
                  }}>
                    <SelectTrigger className="w-auto min-w-[140px] h-8">
                      <div className="flex items-center gap-2">
                        <Avatar className="h-5 w-5">
                          <AvatarFallback className="text-xs">{currentUser.avatar}</AvatarFallback>
                        </Avatar>
                        <span className="text-sm font-medium hidden sm:inline">{currentUser.name}</span>
                        <span className="text-sm font-medium sm:hidden">{currentUser.avatar}</span>
                      </div>
                    </SelectTrigger>
                    <SelectContent>
                      {testUsers.map((user) => (
                        <SelectItem key={user.id} value={user.id}>
                          <div className="flex items-center gap-2">
                            <Avatar className="h-5 w-5">
                              <AvatarFallback className="text-xs">{user.avatar}</AvatarFallback>
                            </Avatar>
                            <div className="flex flex-col">
                              <span className="text-sm font-medium">{user.name}</span>
                              <span className="text-xs text-muted-foreground">{user.email}</span>
                            </div>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  <Badge variant={isConnected ? "default" : "destructive"} className="flex items-center gap-1">
                    {isConnected ? (
                      <>
                        <Wifi className="h-3 w-3" />
                        <span className="hidden sm:inline">Connected</span>
                      </>
                    ) : (
                      <>
                        <WifiOff className="h-3 w-3" />
                        <span className="hidden sm:inline">Disconnected</span>
                      </>
                    )}
                  </Badge>

                  <Dialog>
                    <DialogTrigger asChild>
                      <Button variant="ghost" size="icon" className="hidden sm:flex">
                        <Settings className="h-4 w-4" />
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Chat Settings</DialogTitle>
                        <DialogDescription>
                          Manage your chat preferences and notifications.
                        </DialogDescription>
                      </DialogHeader>
                      <div className="space-y-4">
                        <p className="text-sm text-muted-foreground">Settings panel coming soon...</p>
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>
              </div>
            </CardHeader>
          </Card>

          {/* Messages Area */}
          <ScrollArea className="flex-1">
            <div className="p-4 sm:p-6 space-y-4 max-w-4xl mx-auto">
              {isLoading ? (
                <div className="flex justify-center items-center h-64">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                </div>
              ) : messages.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-64 text-muted-foreground">
                  <Users className="h-12 w-12 mb-4" />
                  <p className="text-lg font-medium">No messages yet</p>
                  <p className="text-sm">Start the conversation!</p>
                </div>
              ) : (
                messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex items-start gap-3 max-w-full ${message.senderId === currentUser.id ? 'flex-row-reverse' : ''
                      }`}
                  >
                    <Avatar className="h-8 w-8 flex-shrink-0">
                      <AvatarImage src={`https://api.dicebear.com/7.x/initials/svg?seed=${message.senderId}`} />
                      <AvatarFallback className="text-xs">
                        {(() => {
                          const user = testUsers.find(u => u.id === message.senderId);
                          return user ? user.avatar : message.senderId.slice(-2).toUpperCase();
                        })()}
                      </AvatarFallback>
                    </Avatar>
                    <Card className={`max-w-[85%] sm:max-w-md lg:max-w-lg transition-all duration-200 ${message.senderId === currentUser.id
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-card hover:bg-accent/50'
                      }`}>
                      <CardContent className="p-3">
                        <p className="text-sm leading-relaxed break-words">{message.message}</p>
                        <p className="text-xs mt-2 opacity-70">
                          {new Date(message.createdAt).toLocaleTimeString([], {
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </p>
                      </CardContent>
                    </Card>
                  </div>
                ))
              )}
            </div>
          </ScrollArea>

          {/* Message Input */}
          <Card className="rounded-none border-0 border-t">
            <CardContent className="p-4 sm:p-6">
              <div className="max-w-4xl mx-auto">
                <div className="flex gap-3">
                  <div className="flex-1">
                    <Textarea
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      onKeyPress={handleKeyPress}
                      placeholder="Type a message..."
                      className="min-h-[44px] max-h-32 resize-none"
                      disabled={isSending}
                      rows={1}
                    />
                  </div>
                  <Button
                    onClick={sendMessage}
                    disabled={!newMessage.trim() || isSending}
                    size="icon"
                    className="h-11 w-11 flex-shrink-0"
                  >
                    {isSending ? (
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current"></div>
                    ) : (
                      <Send className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}