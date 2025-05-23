import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { UserPlus, Users } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Skeleton } from '@/components/ui/skeleton';

interface UserProfileFriendsProps {
  userId: string;
  isCurrentUser: boolean;
  className?: string;
}

interface Friend {
  id: string;
  name: string;
  username: string;
  avatarUrl?: string;
  mutualFriends?: number;
}

export const UserProfileFriends: React.FC<UserProfileFriendsProps> = ({
  userId,
  isCurrentUser,
  className,
}) => {
  // In a real app, you would fetch the user's friends here
  const friends: Friend[] = [];
  const friendCount = 0;
  const isLoading = false;
  const error = null;

  if (isLoading) {
    return <UserProfileFriendsSkeleton />;
  }

  if (error) {
    return (
      <Card className={className}>
        <CardContent className="pt-6 text-center text-destructive">
          Failed to load friends. Please try again later.
        </CardContent>
      </Card>
    );
  }

  return (
    <div className={className}>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold">
          Friends <span className="text-muted-foreground font-normal">• {friendCount}</span>
        </h2>
        {isCurrentUser && (
          <Button variant="outline" size="sm">
            <UserPlus className="mr-2 h-4 w-4" />
            Find Friends
          </Button>
        )}
      </div>

      {friends.length === 0 ? (
        <Card>
          <CardContent className="pt-12 pb-16 text-center">
            <div className="mx-auto max-w-md">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-muted">
                <Users className="h-6 w-6 text-muted-foreground" />
              </div>
              <h3 className="mt-4 text-lg font-medium">
                {isCurrentUser ? 'Add friends to get started' : 'No friends to show'}
              </h3>
              <p className="mt-2 text-sm text-muted-foreground">
                {isCurrentUser
                  ? 'Find and connect with people you know to see their updates here.'
                  : `When ${userId.split('@')[0]} adds friends, they'll appear here.`}
              </p>
              {isCurrentUser && (
                <div className="mt-6">
                  <Button>
                    <UserPlus className="mr-2 h-4 w-4" />
                    Find Friends
                  </Button>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {friends.map((friend) => (
            <Card key={friend.id} className="overflow-hidden">
              <div className="h-24 bg-muted">
                {/* Cover photo placeholder */}
              </div>
              <div className="relative px-4 pb-4 -mt-8">
                <Avatar className="h-16 w-16 border-4 border-background">
                  <AvatarImage src={friend.avatarUrl} alt={friend.name} />
                  <AvatarFallback>
                    {friend.name
                      .split(' ')
                      .map((n) => n[0])
                      .join('')
                      .toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div className="mt-2">
                  <h3 className="font-medium">{friend.name}</h3>
                  <p className="text-sm text-muted-foreground">@{friend.username}</p>
                  {friend.mutualFriends !== undefined && friend.mutualFriends > 0 && (
                    <p className="text-xs text-muted-foreground mt-1">
                      {friend.mutualFriends} mutual friend
                      {friend.mutualFriends !== 1 ? 's' : ''}
                    </p>
                  )}
                </div>
                <div className="mt-3">
                  <Button variant="outline" size="sm" className="w-full">
                    {isCurrentUser ? 'Remove' : 'Add Friend'}
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

// Skeleton loader for the friends section
export const UserProfileFriendsSkeleton: React.FC = () => {
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <Skeleton className="h-7 w-48" />
        <Skeleton className="h-9 w-28" />
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {[1, 2, 3].map((i) => (
          <Card key={i} className="overflow-hidden">
            <Skeleton className="h-24 w-full" />
            <div className="px-4 pb-4 -mt-8">
              <div className="flex items-end">
                <Skeleton className="h-16 w-16 rounded-full border-4 border-background" />
              </div>
              <div className="mt-2 space-y-2">
                <Skeleton className="h-5 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
                <Skeleton className="h-4 w-2/3" />
              </div>
              <Skeleton className="h-9 w-full mt-3" />
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};
