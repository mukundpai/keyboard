import type { Metadata } from 'next';
import ProfileClient from './ProfileClient';

export const metadata: Metadata = { title: 'Profile — KeyMaster Pro' };

export default function ProfilePage() {
  return <ProfileClient />;
}

