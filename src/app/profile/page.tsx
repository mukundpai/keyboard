import type { Metadata } from 'next';
import { auth } from '@/auth';
import ProfileClient from './ProfileClient';

export const metadata: Metadata = { title: 'Profile — KeyMaster Pro' };

export default async function ProfilePage() {
  const session = await auth();
  return (
    <ProfileClient
      userName={session?.user?.name}
      userEmail={session?.user?.email}
    />
  );
}

