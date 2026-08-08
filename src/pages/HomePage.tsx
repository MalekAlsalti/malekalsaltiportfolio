import { useEffect, useState } from 'react';
import { ArrowRight, Mail, ChevronRight, Briefcase, FileText, MessagesSquare, Circle } from 'lucide-react';
import { useRouter, type Route } from '@/router';
import { CtaLink } from '@/components/ui';
import {
  fetchSiteSettings,
  fetchPublishedProjects,
  fetchPublishedPosts,
  type SiteSettings,
  type Project,
  type BlogPost,
  estimateReadTime,
  formatDate,
} from '@/lib/content';
import { categoryMeta } from '@/blog';

export function HomePage() {
  const { navigate } = useRouter();
  const [settings, setSettings] = useState<SiteSettings | null>(null);
  const [projects, setProjects] = useState<Project[]>([]);
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const [s, p, b] = await Promise.all([
        fetchSiteSettings(),
        fetchPublishedProjects(),
        fetchPublishedPosts(),
      ]);
      setSettings(s);
      setProjects(p.filter((x) => x.featured).slice(0, 3));
      if (p.filter((x) => x.featured).length === 0) setProjects(p.slice(0, 3));
      setPosts(b.slice(0, 2));
      setLoading(false);
    })();
  }, []);

  if (loading) return <div className="flex min-h-[60vh] items-center justify-center text-sm text-steel-400">Loading...</div>;

  const heroName = settings?.hero_name ?? 'Malek Alsalti';
  const heroTitle = settings?.hero_title ?? 'Construction & Project Management Professional';
  const heroIntro = settings?.hero_intro ?? '';
  const dutySummary = settings?.duty_summary ?? '';
  const badge = settings?.availability_badge ?? 'Available for Freelance Work';
  const showBadge = settings?.availability_enabled ?? true;

  const quickLinks: { label: string; blurb: string; icon: typeof Briefcase; route: Route }[] = [
    { label: 'Projects', blurb: 'Field-built work across commercial, industrial, residential, and infrastructure.', icon: Briefcase, route: { name: 'projects' } },
    { label: 'Resume', blurb: 'Full work history, credentials, and skills — organized by discipline.', icon: FileText, route: { name: 'resume' } },
    { label: 'Blog', blurb: 'Notes from the field: estimating, disputes, structural review, and field ops.', icon: MessagesSquare, route: { name: 'blog' } },
  ];

  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden bg-steel-975 text-white">
        <div className="absolute inset-0">
          <img
            src="https://images.pexels.com/photos/15532135/pexels-photo-15532135.jpeg?auto=compress&cs=tinysrgb&h=650&w=940"
            alt="Construction site at sunset"
            className="h-full w-full object-cover opacity-20"
            loading="eager"
          />
          <div className="absolute inset-0 bg-gradient-to-br from-steel-975 via-steel-975/95 to-steel-950/80" />
        </div>
        <div
          className="absolute inset-0 opacity-[0.07]"
          style={{
            backgroundImage:
              'linear-gradient(to right, #10b981 1px, transparent 1px), linear-gradient(to bottom, #10b981 1px, transparent 1px)',
            backgroundSize: '48px 48px',
          }}
        />

        <div className="relative mx-auto max-w-6xl px-4 py-20 sm:px-6 sm:py-28 lg:px-8 lg:py-32">
          <div className="max-w-3xl animate-fade-up">
            {showBadge && (
              <p className="inline-flex items-center gap-2 rounded-full border border-emerald2-700/50 bg-emerald2-900/20 px-3.5 py-1.5 text-xs font-500 uppercase tracking-widest text-emerald2-300">
                <Circle className="h-2 w-2 fill-emerald2-400 text-emerald2-400" />
                {badge}
              </p>
            )}
            <h1 className="mt-5 font-display text-4xl font-800 leading-[1.05] tracking-tight text-white sm:text-5xl lg:text-6xl">
              {heroName}
            </h1>
            <p className="mt-3 text-sm font-500 uppercase tracking-widest text-emerald2-400 sm:text-base">
              {heroTitle}
            </p>

            {/* Highlighted duty summary */}
            <div className="mt-7">
              <div className="relative rounded-xl border border-emerald2-800/60 border-l-4 border-l-emerald2-500 bg-steel-950/80 p-5 shadow-xl backdrop-blur sm:p-6">
                <div className="absolute -right-10 -top-10 h-32 w-32 rounded-full bg-emerald2-500/20 blur-3xl" />
                <p className="relative font-display text-xl font-600 leading-snug text-white sm:text-2xl">
                  {dutySummary}
                </p>
              </div>
            </div>

            <p className="mt-6 max-w-2xl text-base leading-relaxed text-steel-300 sm:text-lg">
              {heroIntro}
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <button
                onClick={() => navigate({ name: 'projects' })}
                className="inline-flex items-center gap-2 rounded-lg bg-emerald2-600 px-5 py-3 text-sm font-600 text-steel-990 transition-all hover:bg-emerald2-500 hover:shadow-lg hover:shadow-emerald2-600/30"
              >
                View Projects
                <ArrowRight className="h-4 w-4" />
              </button>
              <button
                onClick={() => navigate({ name: 'contact' })}
                className="inline-flex items-center gap-2 rounded-lg border border-steel-700 bg-steel-900/60 px-5 py-3 text-sm font-600 text-white transition-colors hover:border-emerald2-600 hover:bg-steel-800"
              >
                <Mail className="h-4 w-4" />
                Start a project
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Ways to work with me */}
      <section className="border-b border-steel-800 bg-steel-950 py-14 sm:py-16">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <p className="text-xs font-600 uppercase tracking-widest text-emerald2-400">Ways to work with me</p>
          <h2 className="mt-2 font-display text-2xl font-700 tracking-tight text-white sm:text-3xl">
            Open to freelance projects and full-time roles
          </h2>
          <div className="mt-8 grid gap-5 md:grid-cols-2">
            <div className="rounded-xl border border-steel-800 bg-steel-975 p-6">
              <span className="inline-flex h-10 w-10 items-center justify-center rounded-lg bg-emerald2-600 text-steel-990">
                <Briefcase className="h-5 w-5" />
              </span>
              <h3 className="mt-4 font-display text-lg font-700 text-white">Freelance / contract projects</h3>
              <p className="mt-2 text-sm leading-relaxed text-steel-400">
                Hire me as a subcontractor or MEP coordinator for a defined scope or project phase —
                field supervision, trade coordination, commissioning, or a single deliverable like a
                submittal package or coordination model.
              </p>
            </div>
            <div className="rounded-xl border border-steel-800 bg-steel-975 p-6">
              <span className="inline-flex h-10 w-10 items-center justify-center rounded-lg bg-steel-700 text-emerald2-300">
                <FileText className="h-5 w-5" />
              </span>
              <h3 className="mt-4 font-display text-lg font-700 text-white">Full-time roles</h3>
              <p className="mt-2 text-sm leading-relaxed text-steel-400">
                Available for a permanent field or project management position with a GC, mechanical
                subcontractor, or owner's representative. Full work history and references on the
                resume page.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Quick links */}
      <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
        <div className="flex items-end justify-between">
          <div>
            <p className="text-xs font-600 uppercase tracking-widest text-emerald2-400">Explore</p>
            <h2 className="mt-2 font-display text-2xl font-700 tracking-tight text-white sm:text-3xl">
              What I do, in detail
            </h2>
          </div>
        </div>
        <div className="mt-8 grid gap-5 md:grid-cols-3">
          {quickLinks.map((link) => {
            const Icon = link.icon;
            return (
              <button
                key={link.label}
                onClick={() => navigate(link.route)}
                className="group flex flex-col items-start rounded-xl border border-steel-800 bg-steel-950 p-6 text-left transition-all hover:-translate-y-0.5 hover:border-emerald2-700 hover:shadow-lg hover:shadow-emerald2-900/20"
              >
                <span className="inline-flex h-11 w-11 items-center justify-center rounded-lg bg-emerald2-600 text-steel-990 transition-colors group-hover:bg-emerald2-500">
                  <Icon className="h-5 w-5" />
                </span>
                <h3 className="mt-4 font-display text-lg font-700 text-white">{link.label}</h3>
                <p className="mt-1.5 text-sm leading-relaxed text-steel-400">{link.blurb}</p>
                <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-600 text-emerald2-400">
                  Open
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                </span>
              </button>
            );
          })}
        </div>
      </section>

      {/* Featured projects */}
      {projects.length > 0 && (
        <section className="bg-steel-990 py-16 sm:py-20">
          <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
            <div className="flex items-end justify-between">
              <div>
                <p className="text-xs font-600 uppercase tracking-widest text-emerald2-400">Selected work</p>
                <h2 className="mt-2 font-display text-2xl font-700 tracking-tight text-white sm:text-3xl">Featured projects</h2>
              </div>
              <CtaLink label="All projects" route={{ name: 'projects' }} />
            </div>
            <div className="mt-8 grid gap-6 md:grid-cols-3">
              {projects.map((project) => (
                <button
                  key={project.id}
                  onClick={() => navigate({ name: 'project', slug: project.slug })}
                  className="group flex flex-col overflow-hidden rounded-xl border border-steel-800 bg-steel-950 text-left transition-all hover:-translate-y-0.5 hover:border-emerald2-700 hover:shadow-xl hover:shadow-black/40"
                >
                  <div className="relative h-44 overflow-hidden">
                    <img src={project.photos[0]} alt={project.name} className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" loading="lazy" />
                    <div className="absolute inset-0 bg-gradient-to-t from-steel-990 via-steel-990/40 to-transparent" />
                    <span className="absolute bottom-3 left-3 rounded-md bg-steel-990/85 px-2.5 py-1 text-xs font-600 uppercase tracking-wider text-emerald2-400">{project.type}</span>
                  </div>
                  <div className="flex flex-1 flex-col p-5">
                    <h3 className="font-display text-base font-700 leading-snug text-white">{project.name}</h3>
                    <p className="mt-1 text-xs font-500 uppercase tracking-wider text-steel-400">{project.role}</p>
                    <p className="mt-3 line-clamp-2 text-sm leading-relaxed text-steel-300">{project.scope}</p>
                    <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-600 text-emerald2-400">
                      Read case study
                      <ChevronRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                    </span>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Recent posts */}
      {posts.length > 0 && (
        <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
          <div className="flex items-end justify-between">
            <div>
              <p className="text-xs font-600 uppercase tracking-widest text-emerald2-400">From the field</p>
              <h2 className="mt-2 font-display text-2xl font-700 tracking-tight text-white sm:text-3xl">Latest writing</h2>
            </div>
            <CtaLink label="All articles" route={{ name: 'blog' }} />
          </div>
          <div className="mt-8 grid gap-6 md:grid-cols-2">
            {posts.map((post) => {
              const cat = categoryMeta(post.category as never);
              const Icon = cat.icon;
              return (
                <button
                  key={post.id}
                  onClick={() => navigate({ name: 'post', slug: post.slug })}
                  className="group flex flex-col items-start rounded-xl border border-steel-800 bg-steel-950 p-6 text-left transition-all hover:-translate-y-0.5 hover:border-emerald2-700 hover:shadow-lg hover:shadow-black/40"
                >
                  <div className="flex items-center gap-2 text-xs font-500 uppercase tracking-wider text-steel-400">
                    <span className="inline-flex items-center gap-1.5 rounded-md bg-emerald2-900/30 px-2 py-1 text-emerald2-300 ring-1 ring-emerald2-800/40">
                      <Icon className="h-3.5 w-3.5" />{cat.label}
                    </span>
                    <span>{post.published_at ? formatDate(post.published_at) : ''}</span>
                    <span className="text-steel-600">&middot;</span>
                    <span>{estimateReadTime(post.body)}</span>
                  </div>
                  <h3 className="mt-3 font-display text-lg font-700 leading-snug text-white">{post.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-steel-400">{post.excerpt}</p>
                  <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-600 text-emerald2-400">
                    Read article
                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                  </span>
                </button>
              );
            })}
          </div>
        </section>
      )}

      {/* CTA */}
      <section className="bg-steel-990 py-16 sm:py-20">
        <div className="mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8">
          <h2 className="font-display text-2xl font-800 tracking-tight text-white sm:text-3xl">
            Have a project that needs field-tested coordination?
          </h2>
          <p className="mt-4 text-base leading-relaxed text-steel-300">
            Whether you're a GC looking for a subcontractor on a defined scope or an employer with a
            full-time role, I'd like to hear about it.
          </p>
          <div className="mt-7 flex flex-wrap justify-center gap-3">
            <button
              onClick={() => navigate({ name: 'contact' })}
              className="inline-flex items-center gap-2 rounded-lg bg-emerald2-600 px-5 py-3 text-sm font-600 text-steel-990 transition-all hover:bg-emerald2-500 hover:shadow-lg hover:shadow-emerald2-600/30"
            >
              Start a conversation
              <ArrowRight className="h-4 w-4" />
            </button>
            <button
              onClick={() => navigate({ name: 'resume' })}
              className="inline-flex items-center gap-2 rounded-lg border border-steel-700 px-5 py-3 text-sm font-600 text-white transition-colors hover:bg-steel-800"
            >
              View resume
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
