import React from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { ArrowLeft, MoreHorizontal, Pencil, Settings, UserPlus } from 'lucide-react';
import { UserProfile } from '../types/user-profile.types';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Skeleton } from '@/components/ui/skeleton';

interface UserProfileHeaderProps {
  profile: UserProfile | null;
  isCurrentUser: boolean;
  activeTab?: string;
  onTabChange?: (tab: string) => void;
  onEditProfile?: () => void;
  onMessage?: () => void;
  onFollow?: () => void;
  className?: string;
  isLoading?: boolean;
}

export const UserProfileHeader: React.FC<UserProfileHeaderProps> = ({
  profile,
  isCurrentUser,
  activeTab = 'posts',
  onTabChange,
  onEditProfile,
  onMessage,
  onFollow,
  className,
  isLoading = false,
}) => {
  const router = useRouter();

  if (isLoading || !profile) {
    return <UserProfileHeaderSkeleton />;
  }

  // Get user initials for avatar fallback
  const getInitials = () => {
    if (profile.displayName) {
      return profile.displayName
        .split(' ')
        .map((n) => n[0])
        .join('')
        .toUpperCase();
    }
    return profile.email.substring(0, 2).toUpperCase();
  };

  return (
    <div className={className}>
      {/* Header with back button and actions */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => router.back()}
            className="rounded-full"
          >
            <ArrowLeft className="h-5 w-5" />
            <span className="sr-only">Back</span>
          </Button>
          <div>
            <h1 className="text-xl font-bold">{profile.displayName || profile.email}</h1>
            <p className="text-sm text-muted-foreground">
              {profile.postsCount || 0} posts • {profile.followersCount || 0} followers • {profile.followingCount || 0} following
            </p>
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          {isCurrentUser ? (
            <>
              <Button variant="outline" size="sm" onClick={onEditProfile}>
                <Pencil className="mr-2 h-4 w-4" />
                Edit Profile
              </Button>
              <Button variant="ghost" size="icon">
                <Settings className="h-5 w-5" />
                <span className="sr-only">Settings</span>
              </Button>
            </>
          ) : (
            <>
              <Button variant="outline" size="sm" onClick={onMessage}>
                Message
              </Button>
              <Button variant="default" size="sm" onClick={onFollow}>
                <UserPlus className="mr-2 h-4 w-4" />
                Follow
              </Button>
              <Button variant="ghost" size="icon">
                <MoreHorizontal className="h-5 w-5" />
                <span className="sr-only">More options</span>
              </Button>
            </>
          )}
        </div>
      </div>

      {/* Profile info */}
      <div className="flex flex-col md:flex-row gap-6 mb-6">
        <div className="flex-shrink-0 flex justify-center">
          <Avatar className="h-32 w-32 border">
            <AvatarImage src={profile.avatarUrl || ''} alt={profile.displayName || profile.email} />
            <AvatarFallback className="text-2xl font-semibold">
              {getInitials()}
            </AvatarFallback>
          </Avatar>
        </div>
        
        <div className="flex-1">
          <div className="flex flex-col space-y-4">
            <div>
              <h2 className="text-2xl font-bold">{profile.displayName || profile.email}</h2>
              <p className="text-muted-foreground">@{profile.username || profile.email.split('@')[0]}</p>
            </div>
            
            {profile.bio && (
              <p className="whitespace-pre-line">{profile.bio}</p>
            )}
            
            <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-muted-foreground">
              {profile.location && (
                <div className="flex items-center">
                  <span className="inline-block w-4 h-4 mr-1">📍</span>
                  {profile.location}
                </div>
              )}
              
              {profile.website && (
                <a 
                  href={profile.website.startsWith('http') ? profile.website : `https://${profile.website}`}
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center text-primary hover:underline"
                >
                  <span className="inline-block w-4 h-4 mr-1">🌐</span>
                  {profile.website.replace(/^https?:\/\//, '').split('/')[0]}
                </a>
              )}
              
              {profile.joinDate && (
                <div className="flex items-center">
                  <span className="inline-block w-4 h-4 mr-1">📅</span>
                  Joined {profile.joinDate}
                </div>
              )}
            </div>
            
            {profile.followedBy && profile.followedBy.length > 0 && (
              <div className="flex items-center text-sm text-muted-foreground">
                <div className="flex -space-x-2 mr-2">
                  {profile.followedBy.slice(0, 3).map((follower, idx) => (
                    <Avatar key={follower.id} className="h-6 w-6 border-2 border-background">
                      <AvatarImage src={follower.avatarUrl} alt={follower.name} />
                      <AvatarFallback className="text-xs">
                        {follower.name.substring(0, 2).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                  ))}
                </div>
                <span>Followed by {profile.followedBy[0].name} and {profile.followedBy.length - 1} others</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={onTabChange}>
        <TabsList className="w-full justify-start rounded-none border-b bg-transparent p-0">
          <TabsTrigger 
            value="posts" 
            className="relative h-12 rounded-none border-b-2 border-transparent bg-transparent px-4 pb-4 pt-2 font-semibold text-muted-foreground shadow-none transition-none data-[state=active]:border-primary data-[state=active]:text-foreground data-[state=active]:shadow-none"
          >
            Posts
          </TabsTrigger>
          <TabsTrigger 
            value="about" 
            className="relative h-12 rounded-none border-b-2 border-transparent bg-transparent px-4 pb-4 pt-2 font-semibold text-muted-foreground shadow-none transition-none data-[state=active]:border-primary data-[state=active]:text-foreground data-[state=active]:shadow-none"
          >
            About
          </TabsTrigger>
          <TabsTrigger 
            value="photos" 
            className="relative h-12 rounded-none border-b-2 border-transparent bg-transparent px-4 pb-4 pt-2 font-semibold text-muted-foreground shadow-none transition-none data-[state=active]:border-primary data-[state=active]:text-foreground data-[state=active]:shadow-none"
          >
            Photos
          </TabsTrigger>
          <TabsTrigger 
            value="friends" 
            className="relative h-12 rounded-none border-b-2 border-transparent bg-transparent px-4 pb-4 pt-2 font-semibold text-muted-foreground shadow-none transition-none data-[state=active]:border-primary data-[state=active]:text-foreground data-[state=active]:shadow-none"
          >
            Friends
          </TabsTrigger>
        </TabsList>
      </Tabs>
    </div>
  );
};

// Skeleton loader for the profile header
export const UserProfileHeaderSkeleton: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Skeleton className="h-10 w-10 rounded-full" />
          <div>
            <Skeleton className="h-5 w-32 mb-1" />
            <Skeleton className="h-4 w-48" />
          </div>
        </div>
        <div className="flex space-x-2">
          <Skeleton className="h-9 w-24" />
          <Skeleton className="h-9 w-9 rounded-full" />
        </div>
      </div>
      
      <div className="flex flex-col md:flex-row gap-6">
        <div className="flex-shrink-0 flex justify-center">
          <Skeleton className="h-32 w-32 rounded-full" />
        </div>
        
        <div className="flex-1 space-y-4">
          <div className="space-y-2">
            <Skeleton className="h-7 w-48" />
            <Skeleton className="h-4 w-32" />
          </div>
          
          <Skeleton className="h-4 w-3/4" />
          <Skeleton className="h-4 w-1/2" />
          
          <div className="flex flex-wrap gap-4">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-4 w-28" />
          </div>
          
          <div className="flex items-center">
            <div className="flex -space-x-2 mr-2">
              {[1, 2, 3].map((i) => (
                <Skeleton key={i} className="h-6 w-6 rounded-full" />
              ))}
            </div>
            <Skeleton className="h-4 w-48" />
          </div>
        </div>
      </div>
      
      <div className="flex space-x-4 border-b">
        <Skeleton className="h-12 w-20" />
        <Skeleton className="h-12 w-20" />
        <Skeleton className="h-12 w-20" />
        <Skeleton className="h-12 w-20" />
      </div>
    </div>
  );
};
