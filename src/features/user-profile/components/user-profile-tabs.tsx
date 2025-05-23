import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { UserProfile } from '../types/user-profile.types';
import { UserProfilePosts } from './user-profile-posts';
import { UserProfileAbout } from './user-profile-about';
import { UserProfilePhotos } from './user-profile-photos';
import { UserProfileFriends } from './user-profile-friends';

interface UserProfileTabsProps {
  userId: string;
  isCurrentUser: boolean;
  profile: UserProfile;
  className?: string;
}

export const UserProfileTabs: React.FC<UserProfileTabsProps> = ({
  userId,
  isCurrentUser,
  profile,
  className,
}) => {
  return (
    <Tabs defaultValue="posts" className={className}>
      <TabsList className="grid w-full grid-cols-4">
        <TabsTrigger value="posts">Posts</TabsTrigger>
        <TabsTrigger value="about">About</TabsTrigger>
        <TabsTrigger value="photos">Photos</TabsTrigger>
        <TabsTrigger value="friends">Friends</TabsTrigger>
      </TabsList>

      <TabsContent value="posts" className="mt-6">
        <UserProfilePosts userId={userId} isCurrentUser={isCurrentUser} />
      </TabsContent>

      <TabsContent value="about" className="mt-6">
        <UserProfileAbout profile={profile} isCurrentUser={isCurrentUser} />
      </TabsContent>

      <TabsContent value="photos" className="mt-6">
        <UserProfilePhotos userId={userId} isCurrentUser={isCurrentUser} />
      </TabsContent>

      <TabsContent value="friends" className="mt-6">
        <UserProfileFriends userId={userId} isCurrentUser={isCurrentUser} />
      </TabsContent>
    </Tabs>
  );
};
