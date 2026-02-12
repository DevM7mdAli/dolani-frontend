'use client';

import Image from 'next/image';
import { JSX, useState } from 'react';

import { useRouter } from '@/i18n/routing';
import { Eye, EyeSlash } from 'iconsax-react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export default function SignInPage(): JSX.Element {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 px-4 py-12">
      <div className="w-full max-w-md space-y-8">
        {/* Logo/Brand Area */}
        <div className="text-center">
          <div className="mx-auto mb-6 flex h-40 w-40 items-center justify-center drop-shadow-md">
            <Image src="/dolani.svg" alt="Dolani Logo" width={200} height={200} />
          </div>
          <h1 className="foreground text-3xl font-bold tracking-tight">Welcome Back</h1>
          <p className="text-muted-foreground mt-2 text-sm">Sign in to access your dashboard</p>
        </div>

        {/* Sign In Card */}
        <Card className="border-border/40 shadow-lg">
          <CardHeader className="space-y-1 pb-4">
            <h2 className="text-center text-xl font-semibold">Sign In</h2>
          </CardHeader>

          <CardContent className="space-y-4 px-6">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-sm font-medium">
                Email Address
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="user@example.com"
                className="h-11"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password" className="text-sm font-medium">
                  Password
                </Label>
              </div>

              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Enter your password"
                  className="h-11"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />

                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                  aria-pressed={showPassword}
                  title={showPassword ? 'Hide password' : 'Show password'}
                  className="text-muted-foreground hover:text-foreground absolute inset-y-0 right-2 flex cursor-pointer items-center border-0 bg-transparent p-2 focus:ring-0 focus:outline-none active:scale-95"
                >
                  {showPassword ? (
                    <EyeSlash color="#555555" size={20} />
                  ) : (
                    <Eye color="#555555" size={20} />
                  )}
                </button>
              </div>
            </div>
          </CardContent>

          <CardFooter className="px-6 pb-6">
            <Button
              className="h-11 w-full font-semibold"
              size="lg"
              onClick={() => router.push('/dashboard')}
            >
              Sign In
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
