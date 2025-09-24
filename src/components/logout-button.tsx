'use client';

import { Button } from '@/components/ui/button';
import { LogOut } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { logoutUser } from '@/lib/auth-actions';

interface LogoutButtonProps {
  variant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link';
  size?: 'default' | 'sm' | 'lg' | 'icon';
  className?: string;
}

export default function LogoutButton({ 
  variant = 'outline', 
  size = 'default',
  className = ''
}: LogoutButtonProps) {
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await logoutUser();
      toast.success('Logged out successfully');
      router.push('/login');
    } catch (error) {
      console.error('Logout error:', error);
      toast.error('Failed to logout');
    }
  };

  return (
    <Button 
      variant={variant} 
      size={size}
      className={className}
      onClick={handleLogout}
    >
      <LogOut className="h-4 w-4 mr-2" />
      Logout
    </Button>
  );
}