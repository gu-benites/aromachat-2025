import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Calendar, Mail, MapPin, Smartphone, User, Globe, Cake, Users, Briefcase, BookOpen, Heart } from 'lucide-react';
import { format } from 'date-fns';
import { Button } from '@/components/ui/button';
import { UserProfile } from '../types/user-profile.types';
import { Skeleton } from '@/components/ui/skeleton';

interface UserProfileAboutProps {
  profile: UserProfile;
  isCurrentUser: boolean;
  className?: string;
}

export const UserProfileAbout: React.FC<UserProfileAboutProps> = ({
  profile,
  isCurrentUser,
  className,
}) => {
  // Format date of birth if available
  const formattedDateOfBirth = profile.dateOfBirth
    ? format(new Date(profile.dateOfBirth), 'MMMM d, yyyy')
    : null;

  // Format join date if available
  const formattedJoinDate = profile.createdAt
    ? format(new Date(profile.createdAt), 'MMMM yyyy')
    : null;

  // Check if any about info exists
  const hasAboutInfo = [
    profile.bio,
    profile.location,
    profile.dateOfBirth,
    profile.website,
    profile.phoneNumber,
  ].some(Boolean);

  if (!hasAboutInfo && !isCurrentUser) {
    return (
      <Card className={className}>
        <CardContent className="pt-6 text-center text-muted-foreground">
          <p>No information to display</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className={className}>
      {/* Basic Information */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Basic Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {profile.bio && (
            <div className="flex">
              <div className="w-1/4 text-muted-foreground flex items-start">
                <User className="h-4 w-4 mr-2 mt-1" />
                <span>Bio</span>
              </div>
              <div className="w-3/4">
                <p className="whitespace-pre-line">{profile.bio}</p>
              </div>
            </div>
          )}
          
          {profile.location && (
            <div className="flex">
              <div className="w-1/4 text-muted-foreground flex items-start">
                <MapPin className="h-4 w-4 mr-2 mt-1" />
                <span>Location</span>
              </div>
              <div className="w-3/4">
                <p>{profile.location}</p>
              </div>
            </div>
          )}
          
          {formattedDateOfBirth && (
            <div className="flex">
              <div className="w-1/4 text-muted-foreground flex items-start">
                <Cake className="h-4 w-4 mr-2 mt-1" />
                <span>Birthday</span>
              </div>
              <div className="w-3/4">
                <p>{formattedDateOfBirth}</p>
              </div>
            </div>
          )}
          
          {formattedJoinDate && (
            <div className="flex">
              <div className="w-1/4 text-muted-foreground flex items-start">
                <Calendar className="h-4 w-4 mr-2 mt-1" />
                <span>Joined</span>
              </div>
              <div className="w-3/4">
                <p>{formattedJoinDate}</p>
              </div>
            </div>
          )}
          
          {isCurrentUser && profile.email && (
            <div className="flex">
              <div className="w-1/4 text-muted-foreground flex items-start">
                <Mail className="h-4 w-4 mr-2 mt-1" />
                <span>Email</span>
              </div>
              <div className="w-3/4">
                <p>{profile.email}</p>
              </div>
            </div>
          )}
          
          {isCurrentUser && profile.phoneNumber && (
            <div className="flex">
              <div className="w-1/4 text-muted-foreground flex items-start">
                <Smartphone className="h-4 w-4 mr-2 mt-1" />
                <span>Phone</span>
              </div>
              <div className="w-3/4">
                <p>{profile.phoneNumber}</p>
              </div>
            </div>
          )}
          
          {profile.website && (
            <div className="flex">
              <div className="w-1/4 text-muted-foreground flex items-start">
                <Globe className="h-4 w-4 mr-2 mt-1" />
                <span>Website</span>
              </div>
              <div className="w-3/4">
                <a 
                  href={profile.website.startsWith('http') ? profile.website : `https://${profile.website}`}
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-primary hover:underline"
                >
                  {profile.website.replace(/^https?:\/\//, '')}
                </a>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Interests */}
      {profile.interests && profile.interests.length > 0 && (
        <Card className="mt-6">
          <CardHeader>
            <CardTitle className="text-lg">Interests</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {profile.interests.map((interest) => (
                <div 
                  key={interest} 
                  className="px-3 py-1.5 bg-secondary text-secondary-foreground rounded-full text-sm flex items-center"
                >
                  <Heart className="h-3.5 w-3.5 mr-1.5" />
                  {interest}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Social Links */}
      {profile.socialLinks && Object.values(profile.socialLinks).some(Boolean) && (
        <Card className="mt-6">
          <CardHeader>
            <CardTitle className="text-lg">Social Links</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {profile.socialLinks.twitter && (
              <div className="flex items-center">
                <span className="w-24 text-muted-foreground">Twitter</span>
                <a 
                  href={profile.socialLinks.twitter.startsWith('http') ? profile.socialLinks.twitter : `https://${profile.socialLinks.twitter}`}
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-primary hover:underline"
                >
                  @{profile.socialLinks.twitter.split('/').pop()?.replace('@', '')}
                </a>
              </div>
            )}
            {profile.socialLinks.github && (
              <div className="flex items-center">
                <span className="w-24 text-muted-foreground">GitHub</span>
                <a 
                  href={profile.socialLinks.github.startsWith('http') ? profile.socialLinks.github : `https://${profile.socialLinks.github}`}
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-primary hover:underline"
                >
                  {profile.socialLinks.github.split('/').pop()}
                </a>
              </div>
            )}
            {profile.socialLinks.linkedin && (
              <div className="flex items-center">
                <span className="w-24 text-muted-foreground">LinkedIn</span>
                <a 
                  href={profile.socialLinks.linkedin.startsWith('http') ? profile.socialLinks.linkedin : `https://${profile.socialLinks.linkedin}`}
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-primary hover:underline"
                >
                  {profile.socialLinks.linkedin.split('/').pop()?.replace(/in\//, '')}
                </a>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {isCurrentUser && (
        <div className="mt-6 flex justify-end">
          <Button variant="outline">
            Edit Profile
          </Button>
        </div>
      )}
    </div>
  );
};

// Skeleton loader for the about section
export const UserProfileAboutSkeleton: React.FC = () => {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <Skeleton className="h-6 w-32" />
        </CardHeader>
        <CardContent className="space-y-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="flex">
              <div className="w-1/4">
                <Skeleton className="h-4 w-20" />
              </div>
              <div className="w-3/4">
                <Skeleton className="h-4 w-48" />
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <Skeleton className="h-6 w-24" />
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {[1, 2, 3, 4].map((i) => (
              <Skeleton key={i} className="h-8 w-24 rounded-full" />
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
