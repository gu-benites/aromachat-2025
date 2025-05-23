import { execSync } from 'child_process';
import * as fs from 'fs';
import * as path from 'path';
import 'dotenv/config';

// Load environment variables from .env.local
const envPath = path.join(__dirname, '..', '.env.local');
if (fs.existsSync(envPath)) {
  require('dotenv').config({ path: envPath });
}

// Check for required environment variables
const requiredVars = [
  'HASURA_GRAPHQL_ENDPOINT',
  'HASURA_GRAPHQL_ADMIN_SECRET',
];

const missingVars = requiredVars.filter(varName => !process.env[varName]);

if (missingVars.length > 0) {
  console.error(`Error: Missing required environment variables: ${missingVars.join(', ')}`);
  console.error('Please set these variables in your .env.local file');
  process.exit(1);
}

// Create output directory if it doesn't exist
const outputDir = path.join(__dirname, '..', 'src', 'gql');
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

// Generate types using Hasura CLI
console.log('Generating TypeScript types from Hasura schema...');
try {
  const command = `npx graphqurl ${process.env.HASURA_GRAPHQL_ENDPOINT} \
    -H "x-hasura-admin-secret: ${process.env.HASURA_GRAPHQL_ADMIN_SECRET}" \
    --introspect \
    --format json \
    > ${path.join(outputDir, 'schema.json')}`;
  
  execSync(command, { stdio: 'inherit' });
  
  console.log('Types generated successfully!');
  console.log(`Output: ${path.join(outputDir, 'schema.json')}`);
} catch (error) {
  console.error('Error generating types:', error);
  process.exit(1);
}
