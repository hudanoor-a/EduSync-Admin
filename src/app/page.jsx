import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import { Logo } from '@/components/icons/Logo';

export default function HomePage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-background to-secondary/50 p-8 text-center">
      <div className="mb-12">
        <Logo className="h-20 w-auto text-primary dark:text-primary" />
      </div>
      <h1 className="text-4xl sm:text-5xl font-bold text-foreground mb-6">
        Welcome to EduCentral
      </h1>
      <p className="text-lg sm:text-xl text-muted-foreground mb-10 max-w-2xl">
        The all-in-one platform for modern university management. Streamline operations, enhance communication, and empower your institution.
      </p>
      <Button asChild size="lg" className="shadow-lg hover:shadow-primary/30 transition-shadow duration-300 group">
        <Link href="/admin">
          Go to Admin Dashboard
          <ArrowRight className="ml-2 h-5 w-5 transform transition-transform duration-300 group-hover:translate-x-1" />
        </Link>
      </Button>
      <p className="mt-16 text-sm text-muted-foreground">
        For demo purposes, you will be redirected to the admin panel.
      </p>
    </div>
  );
}