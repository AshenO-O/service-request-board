'use client';

import { useRouter } from 'next/navigation';

export function useNavigation() {
  const router = useRouter();

  const navigateTo = (path: string) => {
    router.push(path);
  };

  const showNotification = () => {
    alert('Notifications feature coming soon!');
  };

  const showProfile = () => {
    alert('Profile feature coming soon!');
  };

  return { navigateTo, showNotification, showProfile };
}