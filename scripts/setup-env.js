const fs = require('fs');
const path = require('path');
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const envPath = path.join(__dirname, '..', '.env.local');
const envExamplePath = path.join(__dirname, '..', '.env.example');

// Create .env.example if it doesn't exist
if (!fs.existsSync(envExamplePath)) {
  const exampleEnv = `# Supabase
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key

# App
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_API_URL=http://localhost:3000/api
NEXT_PUBLIC_ENABLE_ANALYTICS=false
NEXT_PUBLIC_MAINTENANCE_MODE=false
`;
  fs.writeFileSync(envExamplePath, exampleEnv);
  console.log('Created .env.example file');
}

// Check if .env.local exists
if (!fs.existsSync(envPath)) {
  console.log('.env.local not found. Creating from .env.example...');
  
  // Copy .env.example to .env.local
  if (fs.existsSync(envExamplePath)) {
    const envContent = fs.readFileSync(envExamplePath, 'utf8');
    fs.writeFileSync(envPath, envContent);
    console.log('Created .env.local from .env.example');
  } else {
    console.error('Error: .env.example not found. Please create it first.');
    process.exit(1);
  }
}

console.log('Please update the following environment variables in your .env.local file:');
console.log('1. NEXT_PUBLIC_SUPABASE_URL - Your Supabase project URL');
console.log('2. NEXT_PUBLIC_SUPABASE_ANON_KEY - Your Supabase anon/public key');
console.log('\nAfter updating the .env.local file, run:');
console.log('npx supabase gen types typescript --project-id your-project-ref > src/lib/database.types.ts');
console.log('\nReplace "your-project-ref" with your actual Supabase project reference.');

process.exit(0);
