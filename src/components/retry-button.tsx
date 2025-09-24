'use client';

import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';

export default function RetryButton() {
  const router = useRouter();

  const handleRetry = () => {
    router.refresh();
  };

  return (
    <Button onClick={handleRetry}>
      Try Again
    </Button>
  );
}