import { useState } from 'react';
import type { FormEvent } from 'react';
import { Lock, ArrowLeft, AlertCircle } from 'lucide-react';
import { useAuth } from '@/lib/auth';
import { useRouter } from '@/router';

export function AdminLoginPage() {
  const { signIn } = useAuth();
  const { navigate } = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    const { error: signInError } = await signIn(email.trim(), password);
    setLoading(false);
    if (signInError) {
      setError(signInError);
      return;
    }
    navigate({ name: 'admin-dashboard' });
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-steel-990 px-4">
      <div className="w-full max-w-sm">
        <button
          onClick={() => navigate({ name: 'home' })}
          className="mb-6 inline-flex items-center gap-1.5 text-sm font-500 text-steel-400 transition-colors hover:text-emerald2-400"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to site
        </button>

        <div className="rounded-2xl border border-steel-800 bg-steel-950 p-7 shadow-2xl shadow-black/40">
          <div className="flex items-center gap-3">
            <span className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-emerald2-600 text-steel-990">
              <Lock className="h-5 w-5" />
            </span>
            <div>
              <h1 className="font-display text-lg font-700 text-white">Admin Login</h1>
              <p className="text-xs text-steel-400">Manage site content</p>
            </div>
          </div>

          <form onSubmit={onSubmit} className="mt-6 space-y-4">
            <label className="block">
              <span className="mb-1.5 block text-xs font-600 uppercase tracking-wider text-steel-400">Email</span>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="email"
                required
                className={inputClass}
                placeholder="you@example.com"
              />
            </label>
            <label className="block">
              <span className="mb-1.5 block text-xs font-600 uppercase tracking-wider text-steel-400">Password</span>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="current-password"
                required
                className={inputClass}
                placeholder="••••••••"
              />
            </label>

            {error && (
              <div className="flex items-start gap-2.5 rounded-lg border border-danger-700 bg-danger-900/40 p-3 text-sm text-danger-200">
                <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-emerald2-600 px-5 py-3 text-sm font-600 text-steel-990 transition-all hover:bg-emerald2-500 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? 'Signing in...' : 'Sign in'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

const inputClass =
  'w-full rounded-lg border border-steel-700 bg-steel-900 px-3.5 py-2.5 text-sm text-white placeholder:text-steel-500 transition-colors focus:border-emerald2-500 focus:outline-none focus:ring-2 focus:ring-emerald2-500/30';
