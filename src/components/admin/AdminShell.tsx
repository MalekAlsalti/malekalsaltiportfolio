import { useEffect, type ReactNode } from 'react';
import {
  LayoutDashboard,
  Home,
  FileText,
  Wrench,
  Building2,
  PenSquare,
  Settings,
  Inbox,
  LogOut,
  Menu,
  X,
  ExternalLink,
} from 'lucide-react';
import { useAuth } from '@/lib/auth';
import { useRouter, type Route } from '@/router';
import { useState } from 'react';

const NAV_ITEMS: { label: string; icon: typeof Home; route: Route }[] = [
  { label: 'Dashboard', icon: LayoutDashboard, route: { name: 'admin-dashboard' } },
  { label: 'Homepage', icon: Home, route: { name: 'admin-homepage' } },
  { label: 'Resume', icon: FileText, route: { name: 'admin-resume' } },
  { label: 'Skills', icon: Wrench, route: { name: 'admin-skills' } },
  { label: 'Projects', icon: Building2, route: { name: 'admin-projects' } },
  { label: 'Blog', icon: PenSquare, route: { name: 'admin-blog' } },
  { label: 'Contact Settings', icon: Settings, route: { name: 'admin-contact' } },
  { label: 'Inquiries', icon: Inbox, route: { name: 'admin-inquiries' } },
];

export function AdminShell({
  current,
  children,
}: {
  current: Route;
  children: ReactNode;
}) {
  const { user, signOut } = useAuth();
  const { navigate } = useRouter();
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    setMobileOpen(false);
  }, [current]);

  const isActive = (name: string) => current.name === name;

  const onSignOut = async () => {
    await signOut();
    navigate({ name: 'admin-login' });
  };

  return (
    <div className="min-h-screen bg-steel-975">
      {/* Top bar (mobile) */}
      <div className="sticky top-0 z-40 flex items-center justify-between border-b border-steel-800 bg-steel-990 px-4 py-3 lg:hidden">
        <div className="flex items-center gap-2">
          <span className="inline-block h-6 w-1.5 bg-emerald2-500" />
          <span className="font-display text-sm font-700 text-white">Admin Panel</span>
        </div>
        <button
          onClick={() => setMobileOpen((v) => !v)}
          className="rounded-md p-2 text-steel-300 hover:bg-steel-800 hover:text-white"
          aria-label="Toggle menu"
        >
          {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      <div className="flex">
        {/* Sidebar (desktop) */}
        <aside className="sticky top-0 hidden h-screen w-64 shrink-0 border-r border-steel-800 bg-steel-990 lg:block">
          <div className="flex h-16 items-center gap-2.5 border-b border-steel-800 px-5">
            <span className="inline-block h-6 w-1.5 bg-emerald2-500" />
            <span className="font-display text-sm font-700 text-white">Admin Panel</span>
          </div>
          <AdminNav current={current} navigate={navigate} isActive={isActive} />
          <div className="absolute inset-x-0 bottom-0 border-t border-steel-800 p-4">
            <div className="mb-3 truncate text-xs text-steel-500">{user?.email}</div>
            <button
              onClick={onSignOut}
              className="inline-flex w-full items-center gap-2 rounded-lg border border-steel-700 px-3 py-2 text-sm font-500 text-steel-300 transition-colors hover:border-danger-600 hover:text-danger-300"
            >
              <LogOut className="h-4 w-4" />
              Sign out
            </button>
          </div>
        </aside>

        {/* Mobile sidebar */}
        {mobileOpen && (
          <div className="fixed inset-0 top-[57px] z-30 bg-steel-990 lg:hidden">
            <div className="p-4">
              <AdminNav current={current} navigate={navigate} isActive={isActive} />
              <div className="mt-6 border-t border-steel-800 pt-4">
                <div className="mb-3 truncate text-xs text-steel-500">{user?.email}</div>
                <button
                  onClick={onSignOut}
                  className="inline-flex w-full items-center gap-2 rounded-lg border border-steel-700 px-3 py-2 text-sm font-500 text-steel-300 transition-colors hover:border-danger-600 hover:text-danger-300"
                >
                  <LogOut className="h-4 w-4" />
                  Sign out
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Main content */}
        <main className="min-w-0 flex-1">
          {/* Desktop top bar */}
          <div className="hidden items-center justify-between border-b border-steel-800 bg-steel-990 px-6 py-3 lg:flex">
            <button
              onClick={() => navigate({ name: 'home' })}
              className="inline-flex items-center gap-1.5 text-sm font-500 text-steel-400 transition-colors hover:text-emerald2-400"
            >
              View public site
              <ExternalLink className="h-3.5 w-3.5" />
            </button>
          </div>
          <div className="p-4 sm:p-6 lg:p-8">{children}</div>
        </main>
      </div>
    </div>
  );
}

function AdminNav({
  current,
  navigate,
  isActive,
}: {
  current: Route;
  navigate: (r: Route) => void;
  isActive: (name: string) => boolean;
}) {
  return (
    <nav className="space-y-1 p-3">
      {NAV_ITEMS.map((item) => {
        const Icon = item.icon;
        const active = isActive(item.route.name);
        return (
          <button
            key={item.label}
            onClick={() => navigate(item.route)}
            className={`flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-500 transition-colors ${
              active
                ? 'bg-emerald2-600/15 text-emerald2-300 ring-1 ring-emerald2-700/40'
                : 'text-steel-300 hover:bg-steel-800/60 hover:text-white'
            }`}
          >
            <Icon className="h-4.5 w-4.5" />
            {item.label}
          </button>
        );
      })}
    </nav>
  );
}

// Route guard wrapper — redirects to login if unauthenticated.
export function ProtectedRoute({ children }: { children: ReactNode }) {
  const { user, loading } = useAuth();
  const { navigate } = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      navigate({ name: 'admin-login' });
    }
  }, [loading, user, navigate]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-steel-990">
        <div className="text-sm text-steel-400">Loading admin...</div>
      </div>
    );
  }

  if (!user) return null;

  return <>{children}</>;
}
