'use client';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Textarea } from '@/components/ui/textarea';
import { client } from '@/lib/appsync';
import { createTeamMessage, queryTeamMessagesByBoardIdIndex, onCreateTeamMessage } from '@/lib/graphql';
import { CreateTeamMessageInput, TeamMessage } from '@/lib/types';
import { ArrowLeft, Building2, Menu, Send, Settings, Users, Wifi, WifiOff } from 'lucide-react';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import LogoutButton from './logout-button';

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

interface CurrentUser {
  sub: string;
  email: string;
  name?: string;
  given_name?: string;
  family_name?: string;
  picture?: string;
}

interface BoardChatInterfaceProps {
  boardId: string;
  currentUser: CurrentUser;
  boardMembers: BoardMember[];
  boardName: string;
}

export default function BoardChatInterface({
  boardId,
  currentUser,
  boardMembers,
  boardName: initialBoardName
}: BoardChatInterfaceProps) {
  const router = useRouter();
  const [messages, setMessages] = useState<TeamMessage[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [isConnected, setIsConnected] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSending, setIsSending] = useState(false);
  const [boardName, setBoardName] = useState(initialBoardName);



  // Check if current user is a board member
  const currentUserMember = boardMembers.find(
    member => member.email === currentUser.email || member.id === currentUser.sub
  );
  const isUserBoardMember = currentUserMember && currentUserMember.status === 'joined';

  // Get active members (joined status)
  const activeMembers = boardMembers.filter(member => member.status === 'joined');
  const onlineCount = activeMembers.length; // For now, assume all active members are online

  // If user is not a board member, show access denied
  if (!isUserBoardMember) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="w-full max-w-md mx-4">
          <CardHeader className="text-center">
            <CardTitle className="flex items-center justify-center gap-2 text-destructive">
              <Users className="h-6 w-6" />
              Access Denied
            </CardTitle>
          </CardHeader>
          <CardContent className="text-center space-y-4">
            <p className="text-muted-foreground">
              You are not a member of this board or your membership is pending approval.
            </p>
            <div className="space-y-2">
              <Button
                onClick={() => router.push('/boards')}
                className="w-full"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Boards
              </Button>
              <LogoutButton className="w-full" variant="outline" />
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Load initial messages
  useEffect(() => {
    loadMessages();
  }, [boardId]);

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
              if (newMessage.boardId === boardId) {
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
  }, [boardId]);

  const loadMessages = async () => {
    try {
      setIsLoading(true);
      console.log('Loading messages for board:', boardId);

      const response = await client.graphql({
        query: queryTeamMessagesByBoardIdIndex,
        variables: {
          boardId: boardId,
          first: 50
        }
      }) as any;

      console.log('Messages response:', response);

      if (response.data?.queryTeamMessagesByBoardIdIndex?.items) {
        const boardMessages = response.data.queryTeamMessagesByBoardIdIndex.items;
        console.log('Board messages:', boardMessages);
        setMessages(boardMessages.sort(
          (a: any, b: any) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
        ));
      }
    } catch (error: any) {
      console.error('Error loading messages:', error);
      console.error('Load messages error details:', {
        message: error.message,
        errors: error.errors,
        data: error.data,
        networkError: error.networkError,
        graphQLErrors: error.graphQLErrors
      });
    } finally {
      setIsLoading(false);
    }
  };

  const sendMessage = async () => {
    if (!newMessage.trim() || isSending) return;

    // Validate required fields
    if (!boardId) {
      console.error('Board ID is missing');
      return;
    }

    if (!currentUser?.sub) {
      console.error('Current user ID is missing');
      return;
    }

    if (!currentUser?.email) {
      console.error('Current user email is missing');
      return;
    }

    try {
      setIsSending(true);
      const now = new Date().toISOString();
      const messageId = `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

      const messageInput: CreateTeamMessageInput = {
        boardId: boardId,
        senderId: currentUser.sub,
        senderInfo: {
          id: currentUser.sub,
          name: currentUser.name || currentUser.given_name,
          email: currentUser.email,
          picture: currentUser.picture
        },
        message: newMessage.trim(),
        createdAt: now,
        updatedAt: now
      };

      console.log('Sending message with input:', messageInput);
      console.log('BoardId:', boardId);
      console.log('SenderId:', currentUser.sub);
      console.log('AppSync endpoint:', process.env.NEXT_PUBLIC_APPSYNC_HTTPS_MESSAGE_API_ENDPOINT);
      console.log('API Key available:', !!process.env.NEXT_PUBLIC_APPSYNC_API_KEY);

      const result = await client.graphql({
        query: createTeamMessage,
        variables: { input: messageInput }
      }) as any;

      console.log('Message sent successfully:', result);
      setNewMessage('');
    } catch (error: any) {
      console.error('Error sending message:', error);
      console.error('Full error object:', JSON.stringify(error, null, 2));

      // Check if it's a network error
      if (error.networkError) {
        console.error('Network Error:', error.networkError);
        console.error('Network Error Status:', error.networkError.statusCode);
        console.error('Network Error Body:', error.networkError.bodyText);
      }

      // Show user-friendly error message
      if (error.errors && error.errors.length > 0) {
        console.error('GraphQL Errors Details:');
        error.errors.forEach((err: any, index: number) => {
          console.error(`Error ${index + 1}:`, err);
          console.error(`Error ${index + 1} stringified:`, JSON.stringify(err, null, 2));
        });
      }
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

  const getUserDisplayName = (senderId: string) => {
    if (senderId === currentUser.sub) {
      return currentUser.name || currentUser.given_name || 'You';
    }

    const member = boardMembers.find(m => m.email === senderId || m.id === senderId);
    return member?.name || member?.email || 'Unknown User';
  };

  const getUserAvatar = (senderId: string) => {
    if (senderId === currentUser.sub) {
      return currentUser.name?.split(' ').map(n => n[0]).join('').toUpperCase() || 'U';
    }

    const member = boardMembers.find(m => m.email === senderId || m.id === senderId);
    if (member?.name) {
      return member.name.split(' ').map(n => n[0]).join('').toUpperCase();
    }
    return member?.email?.substring(0, 2).toUpperCase() || 'U';
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
                {boardName}
              </CardTitle>
            </CardHeader>
            <CardContent className="flex-1 p-0">
              <div className="p-4 space-y-4">
                <div className="flex items-center gap-2">
                  <Avatar className="h-8 w-8">
                    <AvatarFallback>
                      {currentUser.name?.split(' ').map(n => n[0]).join('').toUpperCase() || 'U'}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">
                      {currentUser.name || currentUser.given_name || 'User'}
                    </p>
                    <p className="text-xs text-muted-foreground truncate">{currentUser.email}</p>
                  </div>
                </div>
                <Separator />
                <div className="space-y-2">
                  <h4 className="text-sm font-medium">Board Members</h4>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <div className="h-2 w-2 bg-green-500 rounded-full"></div>
                      <span className="text-sm">{onlineCount} members online</span>
                    </div>
                    <div className="space-y-1 max-h-40 overflow-y-auto">
                      {activeMembers.map((member) => (
                        <div key={member.id} className="flex items-center gap-2 text-sm">
                          <Avatar className="h-6 w-6">
                            <AvatarFallback className="text-xs">
                              {member.name?.split(' ').map(n => n[0]).join('').toUpperCase() ||
                                member.email.substring(0, 2).toUpperCase()}
                            </AvatarFallback>
                          </Avatar>
                          <span className="truncate">{member.name || member.email}</span>
                          {member.role === 'owner' && (
                            <Badge variant="secondary" className="text-xs">Owner</Badge>
                          )}
                          {member.role === 'admin' && (
                            <Badge variant="outline" className="text-xs">Admin</Badge>
                          )}
                        </div>
                      ))}
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
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1">
                  {/* Back Button */}
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => router.push('/boards')}
                    className="flex-shrink-0"
                  >
                    <ArrowLeft className="h-5 w-5" />
                  </Button>

                  {/* Mobile Menu */}
                  <Sheet>
                    <SheetTrigger asChild>
                      <Button variant="ghost" size="icon" className="lg:hidden flex-shrink-0">
                        <Menu className="h-5 w-5" />
                      </Button>
                    </SheetTrigger>
                    <SheetContent side="left" className="w-80">
                      <SheetHeader>
                        <SheetTitle className="flex items-center gap-2">
                          <Building2 className="h-5 w-5" />
                          {boardName}
                        </SheetTitle>
                      </SheetHeader>
                      <div className="mt-6 space-y-4">
                        <div className="flex items-center gap-2">
                          <Avatar className="h-8 w-8">
                            <AvatarFallback>
                              {currentUser.name?.split(' ').map(n => n[0]).join('').toUpperCase() || 'U'}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium truncate">
                              {currentUser.name || currentUser.given_name || 'User'}
                            </p>
                            <p className="text-xs text-muted-foreground truncate">{currentUser.email}</p>
                          </div>
                        </div>
                        <Separator />
                        <div className="space-y-2">
                          <h4 className="text-sm font-medium">Board Members</h4>
                          <div className="space-y-2">
                            <div className="flex items-center gap-2">
                              <div className="h-2 w-2 bg-green-500 rounded-full"></div>
                              <span className="text-sm">{onlineCount} members online</span>
                            </div>
                            <div className="space-y-1 max-h-40 overflow-y-auto">
                              {activeMembers.map((member) => (
                                <div key={member.id} className="flex items-center gap-2 text-sm">
                                  <Avatar className="h-6 w-6">
                                    <AvatarFallback className="text-xs">
                                      {member.name?.split(' ').map(n => n[0]).join('').toUpperCase() ||
                                        member.email.substring(0, 2).toUpperCase()}
                                    </AvatarFallback>
                                  </Avatar>
                                  <span className="truncate">{member.name || member.email}</span>
                                  {member.role === 'owner' && (
                                    <Badge variant="secondary" className="text-xs">Owner</Badge>
                                  )}
                                  {member.role === 'admin' && (
                                    <Badge variant="outline" className="text-xs">Admin</Badge>
                                  )}
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>
                    </SheetContent>
                  </Sheet>

                  <div className="flex items-center gap-2 min-w-0 flex-1">
                    <Building2 className="h-5 w-5 text-primary flex-shrink-0" />
                    <h1 className="text-base sm:text-lg lg:text-xl font-semibold truncate">{boardName}</h1>
                  </div>
                </div>

                <div className="flex items-center gap-1 sm:gap-2 flex-shrink-0">
                  <Badge variant={isConnected ? "default" : "destructive"} className="flex items-center gap-1 text-xs">
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
                      <Button variant="ghost" size="icon" className="hidden sm:flex h-8 w-8">
                        <Settings className="h-4 w-4" />
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Board Settings</DialogTitle>
                        <DialogDescription>
                          Manage board preferences and notifications.
                        </DialogDescription>
                      </DialogHeader>
                      <div className="space-y-4">
                        <p className="text-sm text-muted-foreground">Settings panel coming soon...</p>
                      </div>
                    </DialogContent>
                  </Dialog>

                  <LogoutButton variant="ghost" size="icon" className="hidden sm:flex h-8 w-8" />
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
                messages.map((message) => {
                  const senderName = message.senderInfo?.name || message.senderInfo?.email || 'Unknown User';
                  const senderInitials = message.senderInfo?.name 
                    ? message.senderInfo.name.split(' ').map(n => n[0]).join('').toUpperCase()
                    : message.senderInfo?.email?.substring(0, 2).toUpperCase() || 'U';
                  const isCurrentUser = message.senderId === currentUser.sub;
                  
                  return (
                    <div
                      key={message.id}
                      className={`flex items-start gap-3 max-w-full ${isCurrentUser ? 'flex-row-reverse' : ''}`}
                    >
                      <Avatar className="h-8 w-8 flex-shrink-0">
                        {message.senderInfo?.picture ? (
                          <AvatarImage src={message.senderInfo.picture} alt={senderName} />
                        ) : (
                          <AvatarImage src={`https://api.dicebear.com/7.x/initials/svg?seed=${message.senderId}`} />
                        )}
                        <AvatarFallback className="text-xs">
                          {senderInitials}
                        </AvatarFallback>
                      </Avatar>
                      <Card className={`max-w-[85%] sm:max-w-md lg:max-w-lg transition-all duration-200 ${
                        isCurrentUser
                          ? 'bg-primary text-primary-foreground'
                          : 'bg-card hover:bg-accent/50'
                      }`}>
                        <CardContent className="p-3">
                          {!isCurrentUser && (
                            <p className="text-xs font-medium mb-1 opacity-70">
                              {senderName}
                            </p>
                          )}
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
                  );
                })
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