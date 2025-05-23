import React from 'react';
import { Skeleton } from '@/components/ui/skeleton';

export const UserProfileSkeleton: React.FC = () => {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex items-center space-x-4">
          <Skeleton className="h-10 w-10 rounded-full" />
          <div>
            <Skeleton className="h-5 w-32 mb-1" />
            <Skeleton className="h-4 w-48" />
          </div>
        </div>
        <div className="flex space-x-2 w-full sm:w-auto">
          <Skeleton className="h-9 w-24" />
          <Skeleton className="h-9 w-24" />
        </div>
      </div>

      {/* Cover Photo */}
      <Skeleton className="h-48 w-full rounded-lg" />

      {/* Profile Info */}
      <div className="flex flex-col sm:flex-row gap-6">
        <div className="flex-shrink-0 -mt-16 sm:-mt-20 flex justify-center sm:justify-start">
          <Skeleton className="h-32 w-32 sm:h-40 sm:w-40 rounded-full border-4 border-background" />
        </div>
        
        <div className="flex-1 space-y-4">
          <div className="space-y-2">
            <Skeleton className="h-7 w-48" />
            <Skeleton className="h-4 w-32" />
          </div>
          
          <div className="space-y-2">
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-4 w-1/2" />
          </div>
          
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
      
      {/* Tabs */}
      <div className="flex space-x-4 border-b">
        {['Posts', 'About', 'Photos', 'Friends'].map((tab) => (
          <div key={tab} className="relative pb-3">
            <Skeleton className="h-8 w-20" />
          </div>
        ))}
      </div>
      
      {/* Content */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="md:col-span-2 space-y-6">
          {/* Create Post Skeleton */}
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <Skeleton className="h-10 w-10 rounded-full" />
              <Skeleton className="h-10 flex-1" />
            </div>
            <div className="flex justify-between">
              <Skeleton className="h-9 w-24" />
              <Skeleton className="h-9 w-24" />
            </div>
          </div>
          
          {/* Posts */}
          {[1, 2, 3].map((i) => (
            <div key={i} className="space-y-4 p-4 border rounded-lg">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <Skeleton className="h-10 w-10 rounded-full" />
                  <div>
                    <Skeleton className="h-4 w-24 mb-1" />
                    <Skeleton className="h-3 w-32" />
                  </div>
                </div>
                <Skeleton className="h-4 w-4" />
              </div>
              
              <div className="space-y-2">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-5/6" />
                <Skeleton className="h-4 w-4/5" />
              </div>
              
              <Skeleton className="h-48 w-full rounded-lg" />
              
              <div className="flex justify-between pt-2">
                <Skeleton className="h-4 w-16" />
                <div className="flex space-x-4">
                  <Skeleton className="h-4 w-16" />
                  <Skeleton className="h-4 w-16" />
                </div>
              </div>
              
              <div className="flex border-t pt-2 justify-between">
                <Skeleton className="h-9 w-1/3" />
                <Skeleton className="h-9 w-1/3" />
                <Skeleton className="h-9 w-1/3" />
              </div>
            </div>
          ))}
        </div>
        
        {/* Sidebar */}
        <div className="space-y-6">
          {/* About Card */}
          <div className="space-y-4 p-4 border rounded-lg">
            <Skeleton className="h-6 w-24 mb-2" />
            <div className="space-y-3">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="flex">
                  <Skeleton className="h-4 w-20" />
                  <Skeleton className="h-4 flex-1 ml-4" />
                </div>
              ))}
            </div>
          </div>
          
          {/* Photos Card */}
          <div className="space-y-4 p-4 border rounded-lg">
            <div className="flex justify-between items-center">
              <Skeleton className="h-6 w-24" />
              <Skeleton className="h-4 w-16" />
            </div>
            <div className="grid grid-cols-3 gap-2">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <Skeleton key={i} className="aspect-square" />
              ))}
            </div>
          </div>
          
          {/* Friends Card */}
          <div className="space-y-4 p-4 border rounded-lg">
            <div className="flex justify-between items-center">
              <Skeleton className="h-6 w-24" />
              <Skeleton className="h-4 w-16" />
            </div>
            <div className="grid grid-cols-3 gap-2">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="space-y-2">
                  <Skeleton className="aspect-square rounded-lg" />
                  <Skeleton className="h-3 w-full" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
