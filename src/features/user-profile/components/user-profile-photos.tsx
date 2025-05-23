import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

interface UserProfilePhotosProps {
  userId: string;
  isCurrentUser: boolean;
  className?: string;
}

export const UserProfilePhotos: React.FC<UserProfilePhotosProps> = ({
  userId,
  isCurrentUser,
  className,
}) => {
  // In a real app, you would fetch the user's photos here
  const photos = [];
  const isLoading = false;
  const error = null;

  if (isLoading) {
    return <UserProfilePhotosSkeleton />;
  }

  if (error) {
    return (
      <Card className={className}>
        <CardContent className="pt-6 text-center text-destructive">
          Failed to load photos. Please try again later.
        </CardContent>
      </Card>
    );
  }

  return (
    <div className={className}>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold">Photos</h2>
        {isCurrentUser && photos.length > 0 && (
          <Button variant="outline" size="sm">
            <Plus className="mr-2 h-4 w-4" />
            Add Photos
          </Button>
        )}
      </div>

      {photos.length === 0 ? (
        <Card>
          <CardContent className="pt-12 pb-16 text-center">
            <div className="mx-auto max-w-md">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-muted">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="h-6 w-6 text-muted-foreground"
                >
                  <path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z" />
                  <circle cx="12" cy="13" r="3" />
                </svg>
              </div>
              <h3 className="mt-4 text-lg font-medium">
                {isCurrentUser ? 'Share your photos' : 'No photos to show'}
              </h3>
              <p className="mt-2 text-sm text-muted-foreground">
                {isCurrentUser
                  ? 'Upload your favorite moments to share with your friends.'
                  : `When ${userId.split('@')[0]} shares photos, they'll appear here.`}
              </p>
              {isCurrentUser && (
                <div className="mt-6">
                  <Button>
                    <Plus className="mr-2 h-4 w-4" />
                    Upload photos
                  </Button>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2">
          {photos.map((photo) => (
            <div
              key={photo.id}
              className="aspect-square overflow-hidden rounded-lg bg-muted relative group"
            >
              <img
                src={photo.url}
                alt={photo.caption || 'User photo'}
                className="object-cover w-full h-full hover:opacity-90 transition-opacity"
              />
              {isCurrentUser && (
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                  <Button variant="ghost" size="sm" className="text-white">
                    Delete
                  </Button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

// Skeleton loader for the photos section
export const UserProfilePhotosSkeleton: React.FC = () => {
  return (
    <div className="space-y-4">
      <Skeleton className="h-6 w-24 mb-6" />
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <Skeleton key={i} className="aspect-square rounded-lg" />
        ))}
      </div>
    </div>
  );
};
