import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Calendar, Globe, MapPin, MessageSquare, User } from 'lucide-react';
import { format } from 'date-fns';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { UserProfile } from '../types/user-profile.types';
import { cn } from '@/lib/utils';

interface UserProfileViewProps {
  userId: string;
  isCurrentUser?: boolean;
  onEditProfile?: () => void;
  onMessage?: () => void;
  className?: string;
  profile?: UserProfile | null;
  isLoading?: boolean;
}

export const UserProfileView: React.FC<UserProfileViewProps> = ({
  userId,
  isCurrentUser = false,
  onEditProfile,
  onMessage,
  className,
  profile: profileProp,
  isLoading: isLoadingProp,
}) => {
  const { profile: fetchedProfile, isLoading: isLoadingProfile } = useUserProfile(userId);
  
  // Use the provided profile if available, otherwise use the fetched one
  const profile = profileProp || fetchedProfile;
  const isLoading = isLoadingProp || isLoadingProfile;

  if (isLoading) {
    return <UserProfileSkeleton />;
  }

  if (!profile) {
    return (
      <Card className={className}>
        <CardContent className="pt-6 text-center">
          <p className="text-muted-foreground">User not found</p>
        </CardContent>
      </Card>
    );
  }

  // Get initials from display name or email
  const getInitials = () => {
    if (profile.displayName) {
      return profile.displayName
        .split(' ')
        .map((n) => n[0])
        .join('')
        .toUpperCase()
        .substring(0, 2);
    }
    return profile.email.substring(0, 2).toUpperCase();
  };

  // Format join date
  const joinDate = profile.createdAt
    ? format(new Date(profile.createdAt), 'MMMM yyyy')
    : null;

  return (
    <Card className={cn('overflow-hidden', className)}>
      {/* Cover Photo */}
      <div className="h-32 bg-gradient-to-r from-blue-500 to-purple-600 relative">
        {profile.coverImageUrl && (
          <img
            src={profile.coverImageUrl}
            alt="Cover"
            className="w-full h-full object-cover"
          />
        )}
      </div>

      {/* Profile Header */}
      <div className="px-6 pb-6 relative">
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between -mt-12 mb-4">
          <div className="flex items-end space-x-4">
            <Avatar className="h-24 w-24 border-4 border-background">
              <AvatarImage src={profile.avatarUrl || undefined} alt={profile.displayName || profile.email} />
              <AvatarFallback className="text-xl font-semibold bg-primary/10">
                {getInitials()}
              </AvatarFallback>
            </Avatar>
            <div>
              <h1 className="text-2xl font-bold">
                {profile.displayName || profile.email.split('@')[0]}
              </h1>
              <p className="text-muted-foreground">@{profile.email.split('@')[0]}</p>
            </div>
          </div>
          
          <div className="flex space-x-2 mt-4 sm:mt-0">
            {isCurrentUser ? (
              <Button variant="outline" onClick={onEditProfile}>
                Edit Profile
              </Button>
            ) : (
              <>
                <Button variant="outline" onClick={onMessage}>
                  <MessageSquare className="mr-2 h-4 w-4" />
                  Message
                </Button>
                <Button variant="default">
                  Follow
                </Button>
              </>
            )}
          </div>
        </div>

        {/* Bio */}
        {profile.bio && (
          <p className="text-muted-foreground mb-4">{profile.bio}</p>
        )}

        {/* Meta Info */}
        <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
          {joinDate && (
            <div className="flex items-center">
              <Calendar className="mr-1 h-4 w-4" />
              <span>Joined {joinDate}</span>
            </div>
          )}
          
          {profile.location && (
            <div className="flex items-center">
              <MapPin className="mr-1 h-4 w-4" />
              <span>{profile.location}</span>
            </div>
          )}
          
          {profile.website && (
            <div className="flex items-center">
              <Globe className="mr-1 h-4 w-4" />
              <a 
                href={profile.website.startsWith('http') ? profile.website : `https://${profile.website}`}
                target="_blank" 
                rel="noopener noreferrer"
                className="text-primary hover:underline"
              >
                {profile.website.replace(/^https?:\/\//, '')}
              </a>
            </div>
          )}
        </div>

        {/* Stats */}
        <div className="flex space-x-6 mt-6 pt-6 border-t">
          <div className="text-center">
            <div className="text-2xl font-bold">1.2K</div>
            <div className="text-sm text-muted-foreground">Posts</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold">5.8K</div>
            <div className="text-sm text-muted-foreground">Followers</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold">342</div>
            <div className="text-sm text-muted-foreground">Following</div>
          </div>
        </div>

        {/* Tags/Skills */}
        {profile.interests && profile.interests.length > 0 && (
          <div className="mt-6">
            <h3 className="font-medium mb-2">Interests</h3>
            <div className="flex flex-wrap gap-2">
              {profile.interests.map((interest) => (
                <Badge key={interest} variant="secondary">
                  {interest}
                </Badge>
              ))}
            </div>
          </div>
        )}
      </div>
    </Card>
  );
};

// Skeleton loader for the profile view
export const UserProfileSkeleton: React.FC = () => {
  return (
    <Card className="overflow-hidden">
      <Skeleton className="h-32 w-full" />
      <div className="px-6 pb-6 relative">
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between -mt-12 mb-4">
          <div className="flex items-end space-x-4">
            <Skeleton className="h-24 w-24 rounded-full border-4 border-background" />
            <div className="space-y-2">
              <Skeleton className="h-6 w-48" />
              <Skeleton className="h-4 w-32" />
            </div>
          </div>
          <div className="flex space-x-2 mt-4 sm:mt-0">
            <Skeleton className="h-10 w-24" />
            <Skeleton className="h-10 w-24" />
          </div>
        </div>
        
        <Skeleton className="h-4 w-3/4 mb-4" />
        
        <div className="flex flex-wrap gap-4 mt-6">
          <Skeleton className="h-4 w-32" />
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-4 w-40" />
        </div>
        
        <div className="flex space-x-6 mt-6 pt-6 border-t">
          {[1, 2, 3].map((i) => (
            <div key={i} className="text-center">
              <Skeleton className="h-7 w-12 mx-auto mb-1" />
              <Skeleton className="h-4 w-16 mx-auto" />
            </div>
          ))}
        </div>
      </div>
    </Card>
  );
};
