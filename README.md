# AromaChat 2025

<div align="center">
  <h1>🌟 AromaChat 2025 🌟</h1>
  <p>A modern, real-time chat application built with Next.js, TypeScript, Tailwind CSS, and Supabase.</p>
  
  [![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
  [![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=flat&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
  [![Next.js](https://img.shields.io/badge/Next.js-000000?style=flat&logo=next.js&logoColor=white)](https://nextjs.org/)
  [![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=flat&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
  [![Supabase](https://img.shields.io/badge/Supabase-181818?style=flat&logo=supabase&logoColor=white)](https://supabase.com/)
</div>

## 🚀 Features

- **Real-time Messaging**: Instant message delivery with WebSockets
- **User Authentication**: Secure sign-in/sign-up with email/password and OAuth providers
- **Responsive Design**: Works on desktop, tablet, and mobile devices
- **Dark/Light Mode**: Built-in theme support with system preference detection
- **Type Safety**: Full TypeScript support for better developer experience
- **Modern UI**: Built with shadcn/ui and Tailwind CSS for a polished look
- **Real-time Presence**: See who's online in real-time
- **Message Reactions**: React to messages with emojis
- **File Sharing**: Share images and files in conversations
- **End-to-End Encryption**: Secure messaging (coming soon)
- **Read Receipts**: See when messages are delivered and read
- **Message Search**: Find messages quickly with powerful search
- **Notifications**: Desktop and mobile notifications for new messages

## 🏗 Project Structure

This project follows a feature-based architecture for better scalability and maintainability:

```
src/
├── app/                    # Next.js 13+ App Router
│   ├── (auth)/            # Authentication routes (login, signup, etc.)
│   ├── (dashboard)/       # Protected dashboard routes
│   │   └── chat/         # Chat interface routes
│   ├── api/               # API routes
│   ├── layout.tsx         # Root layout
│   └── page.tsx           # Home page
│
├── components/           # Shared UI components
│   ├── common/           # Common components used across features
│   ├── layout/           # Layout components (headers, footers, etc.)
│   └── ui/               # Reusable UI components (from shadcn/ui)
│
├── features/             # Feature-based modules (self-contained features)
│   ├── auth/            # Authentication feature
│   │   ├── components/  # Auth-specific components
│   │   ├── hooks/       # Custom hooks for auth
│   │   ├── services/    # API services for auth
│   │   └── schemas/     # Validation schemas (Zod)
│   │
│   ├── chat/           # Chat feature
│   │   ├── components/  # Chat components
│   │   ├── hooks/       # Chat hooks
│   │   ├── services/    # Chat services
│   │   └── types/       # Chat-related types
│   │
│   └── user/          # User profile feature
│       └── ...
│
├── lib/                 # Core libraries and utilities
│   ├── clients/         # API clients (Supabase, etc.)
│   ├── config/         # App configuration
│   ├── constants/       # App-wide constants
│   ├── hooks/           # Global hooks
│   ├── styles/          # Global styles and themes
│   └── utils/           # Utility functions
│
├── providers/           # React context providers
│   ├── auth-provider/   # Auth context
│   └── theme-provider/  # Theme context
│
└── types/               # Global TypeScript types
    └── supabase.ts      # Generated Supabase types
```

## 🛠 Prerequisites

Before you begin, ensure you have the following installed:

- [Node.js](https://nodejs.org/) (v18.17.1 or later)
- [npm](https://www.npmjs.com/) (v9+ or [yarn](https://yarnpkg.com/) v1.22+)
- [Git](https://git-scm.com/)
- [Supabase](https://supabase.com/) account (for backend services)
- [Visual Studio Code](https://code.visualstudio.com/) (recommended) or any other code editor

## 🚀 Getting Started

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/aromachat-2025.git
   cd aromachat-2025
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn
   # or
   pnpm install
   ```

3. **Set up environment variables**
   - Copy `.env.example` to `.env.local`
   - Fill in the required environment variables (see [Configuration](#-configuration) section)

4. **Run the development server**
   ```bash
   npm run dev
   # or
   yarn dev
   # or
   pnpm dev
   ```

5. **Open [http://localhost:3000](http://localhost:3000) in your browser**

## 🔧 Configuration

### Environment Variables

Create a `.env.local` file in the root directory and add the following environment variables:

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-supabase-service-role-key

# NextAuth
NEXTAUTH_SECRET=your-nextauth-secret
NEXTAUTH_URL=http://localhost:3000

# OAuth Providers (optional)
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
GITHUB_CLIENT_ID=your-github-client-id
GITHUB_CLIENT_SECRET=your-github-client-secret
```

### Supabase Setup

1. Create a new project at [Supabase](https://supabase.com/)
2. Go to Project Settings > API to find your `SUPABASE_URL` and `SUPABASE_ANON_KEY`
3. Enable the following authentication providers in the Supabase dashboard:
   - Email/Password
   - Google (optional)
   - GitHub (optional)

## 🛠 Development

### Available Scripts

- `dev`: Start the development server
- `build`: Build the application for production
- `start`: Start the production server
- `lint`: Run ESLint
- `format`: Format code with Prettier
- `test`: Run tests
- `test:watch`: Run tests in watch mode
- `test:coverage`: Run tests with coverage report

### Code Style

This project uses:

- [ESLint](https://eslint.org/) for code linting
- [Prettier](https://prettier.io/) for code formatting
- [TypeScript](https://www.typescriptlang.org/) for type safety

Before committing, make sure to run:

```bash
npm run format
npm run lint
# or
yarn format
yarn lint
```

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a new branch (`git checkout -b feature/your-feature`)
3. Commit your changes (`git commit -am 'Add some feature'`)
4. Push to the branch (`git push origin feature/your-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [Next.js](https://nextjs.org/) - The React Framework for Production
- [TypeScript](https://www.typescriptlang.org/) - Typed JavaScript
- [Tailwind CSS](https://tailwindcss.com/) - A utility-first CSS framework
- [Supabase](https://supabase.com/) - The open source Firebase alternative
- [shadcn/ui](https://ui.shadcn.com/) - Beautifully designed components
- [React Query](https://tanstack.com/query) - Data fetching and caching
- [Zod](https://zod.dev/) - TypeScript-first schema validation

## 📞 Contact

Your Name - [@yourtwitter](https://twitter.com/yourtwitter) - your.email@example.com

Project Link: [https://github.com/yourusername/aromachat-2025](https://github.com/yourusername/aromachat-2025)

## 🚀 Getting Started

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/aromachat-2025.git
   cd aromachat-2025
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.local.example .env.local
   ```
   
   Then update the values in `.env.local` with your Supabase credentials:
   ```
   NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
   NEXTAUTH_SECRET=your-nextauth-secret
   NEXTAUTH_URL=http://localhost:3000
   ```

4. **Set up Supabase**
   - Create a new project in [Supabase](https://supabase.com/)
   - Enable Email/Password authentication in the Authentication settings
   - Create a `profiles` table with the following SQL:
     ```sql
     create table public.profiles (
       id uuid references auth.users on delete cascade not null primary key,
       username text,
       full_name text,
       avatar_url text,
       updated_at timestamp with time zone
     );

     -- Set up Row Level Security (RLS)
     alter table public.profiles enable row level security;

     -- Create policies for profiles
     create policy "Public profiles are viewable by everyone." 
       on profiles for select 
       using (true);

     create policy "Users can insert their own profile."
       on profiles for insert
       with check (auth.uid() = id);

     create policy "Users can update own profile."
       on profiles for update
       using (auth.uid() = id);
     ```

   - Create a `messages` table:
     ```sql
     create table public.messages (
       id uuid default gen_random_uuid() primary key,
       content text not null,
       channel_id text not null,
       user_id uuid references auth.users(id) not null,
       created_at timestamp with time zone default timezone('utc'::text, now()) not null,
       updated_at timestamp with time zone default timezone('utc'::text, now()) not null
     );

     -- Set up Row Level Security (RLS)
     alter table public.messages enable row level security;

     -- Create policies for messages
     create policy "Anyone can view messages"
       on messages for select
       using (true);

     create policy "Authenticated users can insert messages"
       on messages for insert
       with check (auth.role() = 'authenticated');

     create policy "Users can update their own messages"
       on messages for update
       using (auth.uid() = user_id);

     create policy "Users can delete their own messages"
       on messages for delete
       using (auth.uid() = user_id);
     ```

5. **Run the development server**
   ```bash
   npm run dev
   # or
   yarn dev
   ```

   Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## 🛠 Tech Stack

- **Frontend Framework**: [Next.js](https://nextjs.org/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **UI Components**: [shadcn/ui](https://ui.shadcn.com/)
- **State Management**: [React Query](https://tanstack.com/query/latest)
- **Authentication**: [Supabase Auth](https://supabase.com/auth)
- **Database**: [Supabase](https://supabase.com/)
- **Type Safety**: [TypeScript](https://www.typescriptlang.org/)

## 🧪 Testing

To run the test suite:

```bash
npm run test
# or
yarn test
```

## 📦 Deployment

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.
- [Supabase Documentation](https://supabase.com/docs) - learn about Supabase features and API.
   ```
   Update the values in `.env.local` with your configuration.

4. Run the development server:
   ```bash
   npm run dev
   # or
   yarn dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

## 🛠️ Built With

- [Next.js](https://nextjs.org/) - React framework
- [TypeScript](https://www.typescriptlang.org/) - Type checking
- [Tailwind CSS](https://tailwindcss.com/) - Styling
- [shadcn/ui](https://ui.shadcn.com/) - UI components
- [NextAuth.js](https://next-auth.js.org/) - Authentication
- [React Hook Form](https://react-hook-form.com/) - Form handling
- [Zod](https://zod.dev/) - Schema validation

## 📁 Project Structure

```
src/
├── app/                  # App router pages and layouts
├── components/           # Reusable UI components
│   ├── common/          # Common components (header, footer, etc.)
│   └── ui/              # shadcn/ui components
├── config/              # App configuration
├── features/            # Feature-based modules
├── hooks/               # Custom React hooks
├── lib/                 # Utility functions and libraries
├── providers/           # Context providers
├── styles/              # Global styles
└── types/               # TypeScript type definitions
```

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [Next.js Documentation](https://nextjs.org/docs)
- [shadcn/ui Documentation](https://ui.shadcn.com/docs)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
