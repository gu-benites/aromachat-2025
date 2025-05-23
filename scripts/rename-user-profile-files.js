const fs = require('fs');
const path = require('path');

const componentsDir = path.join(__dirname, '../src/features/user-profile/components');

// Map of current filenames to new kebab-case filenames
const fileMap = {
  'UserProfileView.tsx': 'user-profile-view.tsx',
  'UserProfileTabs.tsx': 'user-profile-tabs.tsx',
  'UserProfileAbout.tsx': 'user-profile-about.tsx',
  'UserProfilePosts.tsx': 'user-profile-posts.tsx',
  'UserProfilePhotos.tsx': 'user-profile-photos.tsx',
  'UserProfileFriends.tsx': 'user-profile-friends.tsx',
  'UserProfileHeader.tsx': 'user-profile-header.tsx',
  'UserProfileSkeleton.tsx': 'user-profile-skeleton.tsx',
  'index.ts': 'index.ts',
};

// Rename files
Object.entries(fileMap).forEach(([oldName, newName]) => {
  const oldPath = path.join(componentsDir, oldName);
  const newPath = path.join(componentsDir, newName);
  
  if (fs.existsSync(oldPath) && oldName !== newName) {
    fs.renameSync(oldPath, newPath);
    console.log(`Renamed: ${oldName} -> ${newName}`);
  }
});

console.log('File renaming complete!');
