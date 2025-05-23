const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('Installing dependencies...');

// Install required dependencies
try {
  // Install peer dependencies first
  execSync('npm install --legacy-peer-deps react@18.2.0 react-dom@18.2.0', { stdio: 'inherit' });
  
  // Install required type definitions
  execSync('npm install --save-dev @types/node @types/react@18.2.0 @types/react-dom@18.2.0 @types/react-router-dom @types/uuid @types/zustand', { stdio: 'inherit' });
  
  // Install required packages
  execSync('npm install zustand @supabase/supabase-js @tanstack/react-query --legacy-peer-deps', { stdio: 'inherit' });
  
  console.log('Dependencies installed successfully!');
} catch (error) {
  console.error('Error installing dependencies:', error);
  process.exit(1);
}

// Create or update tsconfig.json to include necessary type definitions
console.log('Updating tsconfig.json...');
try {
  const tsConfigPath = path.join(process.cwd(), 'tsconfig.json');
  const tsConfig = require(tsConfigPath);
  
  // Ensure typeRoots includes @types
  if (!tsConfig.compilerOptions.typeRoots) {
    tsConfig.compilerOptions.typeRoots = [
      "./node_modules/@types",
      "./src/types"
    ];
  }
  
  // Add necessary type references
  if (!tsConfig.compilerOptions.types) {
    tsConfig.compilerOptions.types = ["node", "jest", "@testing-library/jest-dom"];
  }
  
  // Ensure paths are set up correctly
  if (!tsConfig.compilerOptions.paths) {
    tsConfig.compilerOptions.paths = {
      "@/*": ["./src/*"]
    };
  }
  
  fs.writeFileSync(tsConfigPath, JSON.stringify(tsConfig, null, 2));
  console.log('tsconfig.json updated successfully!');
} catch (error) {
  console.error('Error updating tsconfig.json:', error);
  process.exit(1);
}

console.log('Setup complete! Run `npm run check-types` to verify TypeScript types.');
