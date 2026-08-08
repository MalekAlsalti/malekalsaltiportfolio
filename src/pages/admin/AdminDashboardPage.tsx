import {
  Home,
  FileText,
  Wrench,
  Building2,
  PenSquare,
  Settings,
  Inbox,
  ArrowRight,
} from 'lucide-react';
import { useRouter, type Route } from '@/router';
import { useAuth } from '@/lib/auth';
import { useEffect, useState } from 'react';
import { fetchContactMessages, fetchProjects, fetchBlogPosts, type ContactMessage } from '@/lib/content';

const SECTIONS: { label: string; description: string; icon: typeof Home; route: Route }[] = [
  { label: 'Homepage', description: 'Hero, intro, duty summary, availability badge', icon: Home, route: { name: 'admin-homepage' } },
  { label: 'Resume', description: 'Work history, credentials, PDF resume', icon: FileText, route: { name: 'admin-resume' } },
  { label: 'Skills', description: 'Skill groups and individual skills', icon: Wrench, route: { name: 'admin-skills' } },
  { label: 'Projects', description: 'Project entries, photos, featured/hidden', icon: Building2, route: { name: 'admin-projects' } },
  { label: 'Blog', description: 'Write and manage articles, drafts & published', icon: PenSquare, route: { name: 'admin-blog' } },
  { label: 'Contact Settings', description: 'Email, phone, LinkedIn, location', icon: Settings, route: { name: 'admin-contact' } },
  { label: 'Inquiries', description: 'Contact form submissions inbox', icon: Inbox, route: { name: 'admin-inquiries' } },
];

export function AdminDashboardPage() {
  const { user } = useAuth();
  const { navigate } = useRouter();
  const [newMessages, setNewMessages] = useState(0);
  const [projectCount, setProjectCount] = useState(0);
  const [postCount, setPostCount] = useState(0);

  useEffect(() => {
    (async () => {
      const [msgs, projects, posts] = await Promise.all([
        fetchContactMessages(),
        fetchProjects(),
        fetchBlogPosts(),
      ]);
      setNewMessages(msgs.filter((m) => m.status === 'new').length);
      setProjectCount(projects.length);
      setPostCount(posts.filter((p) => p.status === 'published').length);
    })();
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-800 text-white">Dashboard</h1>
        <p className="mt-1 text-sm text-steel-400">
          Welcome back{user?.email ? `, ${user.email}` : ''}. Manage all site content from here.
        </p>
      </div>

      {/* Quick stats */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <StatCard label="New inquiries" value={newMessages} accent />
        <StatCard label="Projects" value={projectCount} />
        <StatCard label="Published posts" value={postCount} />
      </div>

      {/* Section grid */}
      <div>
        <h2 className="mb-4 font-display text-lg font-700 text-white">Editable sections</h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {SECTIONS.map((section) => {
            const Icon = section.icon;
            return (
              <button
                key={section.label}
                onClick={() => navigate(section.route)}
                className="group flex flex-col items-start rounded-xl border border-steel-800 bg-steel-950 p-5 text-left transition-all hover:-translate-y-0.5 hover:border-emerald2-700 hover:shadow-lg hover:shadow-black/30"
              >
                <span className="inline-flex h-10 w-10 items-center justify-center rounded-lg bg-emerald2-600 text-steel-990">
                  <Icon className="h-5 w-5" />
                </span>
                <h3 className="mt-3 font-display text-base font-700 text-white">{section.label}</h3>
                <p className="mt-1 text-sm text-steel-400">{section.description}</p>
                <span className="mt-3 inline-flex items-center gap-1 text-sm font-600 text-emerald2-400">
                  Open
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function StatCard({ label, value, accent }: { label: string; value: number; accent?: boolean }) {
  return (
    <div className={`rounded-xl border p-5 ${accent ? 'border-emerald2-700/50 bg-emerald2-900/15' : 'border-steel-800 bg-steel-950'}`}>
      <p className="font-display text-3xl font-800 text-white">{value}</p>
      <p className="mt-1 text-sm text-steel-400">{label}</p>
    </div>
  );
}

export type { ContactMessage };
