'use client';

import Image from 'next/image';
import { JSX, useEffect, useState } from 'react';

import { useLogin } from '@/hooks/useAuth';
import { useRouter } from '@/i18n/routing';
import { useAuthStore } from '@/store/useAuthStore';
import { type LoginFormValues, loginSchema } from '@/types/auth';
import { zodResolver } from '@hookform/resolvers/zod';
import { Eye, EyeSlash } from 'iconsax-react';
import { Loader2 } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export default function SignInPage(): JSX.Element {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);

  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const user = useAuthStore((s) => s.user);
  const loginMutation = useLogin();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      identifier: '',
      password: '',
    },
  });

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated && user) {
      const dest = user.role === 'ADMIN' ? '/dashboard/admin' : '/dashboard/doctors';
      router.replace(dest);
    }
  }, [isAuthenticated, user, router]);

  const onSubmit = (data: LoginFormValues) => {
    loginMutation.mutate(data, {
      onSuccess: (response) => {
        toast.success(`Welcome back, ${response.user.name}!`);
        const dest = response.user.role === 'ADMIN' ? '/dashboard/admin' : '/dashboard/doctors';
        router.push(dest);
      },
      onError: (error) => {
        const message = error.response?.data?.message ?? 'Something went wrong. Please try again.';
        const errorText = Array.isArray(message) ? message.join(', ') : message;
        toast.error(errorText);
      },
    });
  };

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

          <form onSubmit={handleSubmit(onSubmit)}>
            <CardContent className="space-y-4 px-6">
              {/* Identifier (email or username) */}
              <div className="space-y-2">
                <Label htmlFor="identifier" className="text-sm font-medium">
                  Email or Username
                </Label>
                <Input
                  id="identifier"
                  type="text"
                  placeholder="user@example.com"
                  className="h-11"
                  autoComplete="username"
                  disabled={loginMutation.isPending}
                  aria-invalid={!!errors.identifier}
                  {...register('identifier')}
                />
                {errors.identifier && (
                  <p className="text-destructive text-sm">{errors.identifier.message}</p>
                )}
              </div>

              {/* Password */}
              <div className="space-y-2">
                <Label htmlFor="password" className="text-sm font-medium">
                  Password
                </Label>

                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Enter your password"
                    className="h-11 pr-12"
                    autoComplete="current-password"
                    disabled={loginMutation.isPending}
                    aria-invalid={!!errors.password}
                    {...register('password')}
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
                {errors.password && (
                  <p className="text-destructive text-sm">{errors.password.message}</p>
                )}
              </div>
            </CardContent>

            <CardFooter className="px-6 pb-6">
              <Button
                type="submit"
                className="h-11 w-full font-semibold"
                size="lg"
                disabled={loginMutation.isPending}
              >
                {loginMutation.isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Signing in…
                  </>
                ) : (
                  'Sign In'
                )}
              </Button>
            </CardFooter>
          </form>
        </Card>
      </div>
    </div>
  );
}
