'use client';

import { useRouter } from 'next/navigation';
import { JSX } from 'react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export default function SignInPage(): JSX.Element {
  const router = useRouter();
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50/50 px-4">
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle className="text-2xl">Welcome </CardTitle>
        </CardHeader>

        <CardContent className="grid gap-4">
          <div className="grid gap-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" placeholder="admin@example.com" required />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="password">Password</Label>
            <Input id="password" type="password" required />
          </div>
        </CardContent>

        <CardFooter>
          <Button className="w-full" onClick={() => router.push('/dashboard')}>
            Sign in
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
