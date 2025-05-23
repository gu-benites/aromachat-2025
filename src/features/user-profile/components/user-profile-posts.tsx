import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

interface UserProfilePostsProps {
  userId: string;
  isCurrentUser: boolean;
  className?: string;
}

export const UserProfilePosts: React.FC<UserProfilePostsProps> = ({
  userId,
  isCurrentUser,
  className,
}) => {
  // In a real app, you would fetch the user's posts here
  const posts = [];
  const isLoading = false;
  const error = null;

  if (isLoading) {
    return <UserProfilePostsSkeleton />;
  }

  if (error) {
    return (
      <Card className={className}>
        <CardContent className="pt-6 text-center text-destructive">
          Failed to load posts. Please try again later.
        </CardContent>
      </Card>
    );
  }

  return (
    <div className={className}>
      {isCurrentUser && (
        <div className="mb-6 flex justify-end">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Create Post
          </Button>
        </div>
      )}

      {posts.length === 0 ? (
        <Card>
          <CardContent className="pt-6 text-center text-muted-foreground">
            {isCurrentUser ? (
              <div className="space-y-2">
                <p>You haven't created any posts yet.</p>
                <Button size="sm">Create your first post</Button>
              </div>
            ) : (
              <p>No posts to display.</p>
            )}
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {posts.map((post) => (
            <Card key={post.id}>
              <CardHeader>
                <CardTitle>{post.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p>{post.content}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

// Skeleton loader for the posts section
export const UserProfilePostsSkeleton: React.FC = () => {
  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <Skeleton className="h-10 w-32" />
      </div>
      
      {[1, 2, 3].map((i) => (
        <Card key={i}>
          <CardHeader>
            <Skeleton className="h-6 w-3/4 mb-2" />
            <Skeleton className="h-4 w-1/2" />
          </CardHeader>
          <CardContent>
            <Skeleton className="h-4 w-full mb-2" />
            <Skeleton className="h-4 w-5/6" />
          </CardContent>
        </Card>
      ))}
    </div>
  );
};
