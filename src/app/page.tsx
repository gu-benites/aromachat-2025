import Link from 'next/link';

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4">
      <div className="max-w-2xl mx-auto text-center">
        <h1 className="text-4xl font-bold mb-6">Welcome to AromaChat 2025</h1>
        <p className="text-lg mb-8">Next generation chat application</p>
        <div className="space-x-4">
          <Link 
            href="/dashboard" 
            className="px-6 py-3 bg-primary text-white rounded-md hover:bg-primary/90 transition-colors"
          >
            Launch App
          </Link>
        </div>
      </div>
    </div>
  );
}