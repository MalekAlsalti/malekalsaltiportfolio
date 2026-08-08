import { useState, useMemo, useEffect } from 'react';
import { Building2, MapPin, Calendar, X, ArrowLeft, ChevronRight } from 'lucide-react';
import {
  fetchPublishedProjects,
  type Project,
  type ProjectType,
} from '@/lib/content';
import { PageHeader } from '@/components/ui';
import { useRouter, useScrollLock } from '@/router';

const FILTER_ALL = 'all';

export function ProjectsPage() {
  const { navigate } = useRouter();
  const [filter, setFilter] = useState<typeof FILTER_ALL | ProjectType>(FILTER_ALL);
  const [all, setAll] = useState<Project[]>([]);
  const [active, setActive] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);

  useScrollLock(!!active);

  useEffect(() => {
    (async () => {
      const p = await fetchPublishedProjects();
      setAll(p);
      setLoading(false);
    })();
  }, []);

  const filters: { id: typeof FILTER_ALL | ProjectType; label: string; count: number }[] = [
    { id: FILTER_ALL, label: 'All', count: all.length },
    ...(Object.keys(PROJECT_TYPE_LABELS) as ProjectType[])
      .map((id) => ({
        id,
        label: PROJECT_TYPE_LABELS[id],
        count: all.filter((p) => p.type === id).length,
      }))
      .filter((f) => f.count > 0),
  ];

  const visible = useMemo(
    () => (filter === FILTER_ALL ? all : all.filter((p) => p.type === filter)),
    [filter, all]
  );

  const openProject = (project: Project) => {
    setActive(project);
    navigate({ name: 'project', slug: project.slug });
  };
  const closeProject = () => {
    setActive(null);
    navigate({ name: 'projects' });
  };

  if (loading) return <div className="flex min-h-[60vh] items-center justify-center text-sm text-steel-400">Loading...</div>;

  return (
    <div>
      <PageHeader
        eyebrow="Field record"
        title="Projects"
        description="A selection of builds across commercial, industrial, residential, and infrastructure work — with technical scope, challenges, and outcomes."
        icon={Building2}
      />

      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 sm:py-14 lg:px-8">
        {/* Filters */}
        <div className="flex flex-wrap gap-2">
          {filters.map((f) => {
            const isActive = filter === f.id;
            return (
              <button
                key={f.id}
                onClick={() => setFilter(f.id)}
                className={`inline-flex items-center gap-1.5 rounded-full border px-3.5 py-1.5 text-sm font-500 transition-colors ${
                  isActive
                    ? 'border-emerald2-600 bg-emerald2-600 text-steel-990'
                    : 'border-steel-700 bg-steel-950 text-steel-300 hover:border-steel-500 hover:text-white'
                }`}
              >
                {f.label}
                <span className={`rounded-full px-1.5 text-xs ${isActive ? 'bg-steel-990/30 text-steel-990' : 'bg-steel-800 text-steel-400'}`}>
                  {f.count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Grid */}
        {visible.length === 0 ? (
          <p className="py-12 text-center text-sm text-steel-500">No projects in this category yet.</p>
        ) : (
          <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {visible.map((project) => (
              <button
                key={project.id}
                onClick={() => openProject(project)}
                className="group flex flex-col overflow-hidden rounded-xl border border-steel-800 bg-steel-950 text-left transition-all hover:-translate-y-0.5 hover:border-emerald2-700 hover:shadow-xl hover:shadow-black/40"
              >
                <div className="relative h-48 overflow-hidden">
                  {project.photos[0] ? (
                    <img src={project.photos[0]} alt={project.name} className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" loading="lazy" />
                  ) : (
                    <div className="h-full w-full bg-steel-800" />
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-steel-990 via-steel-990/40 to-transparent" />
                  <span className="absolute bottom-3 left-3 rounded-md bg-steel-990/85 px-2.5 py-1 text-xs font-600 uppercase tracking-wider text-emerald2-400">
                    {PROJECT_TYPE_LABELS[project.type]}
                  </span>
                  {project.value && (
                    <span className="absolute right-3 top-3 rounded-md bg-emerald2-600 px-2.5 py-1 text-xs font-700 text-steel-990">{project.value}</span>
                  )}
                </div>
                <div className="flex flex-1 flex-col p-5">
                  <h3 className="font-display text-base font-700 leading-snug text-white">{project.name}</h3>
                  <p className="mt-1 text-xs font-500 uppercase tracking-wider text-emerald2-400">{project.role}</p>
                  <p className="mt-3 line-clamp-3 text-sm leading-relaxed text-steel-300">{project.scope}</p>
                  <div className="mt-4 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-steel-400">
                    <span className="inline-flex items-center gap-1"><Calendar className="h-3.5 w-3.5" />{project.timeframe}</span>
                    <span className="inline-flex items-center gap-1"><MapPin className="h-3.5 w-3.5" />{project.location}</span>
                  </div>
                  <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-600 text-emerald2-400">
                    Read case study
                    <ChevronRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                  </span>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>

      {active && <ProjectModal project={active} onClose={closeProject} />}
    </div>
  );
}

const PROJECT_TYPE_LABELS: Record<ProjectType, string> = {
  commercial: 'Commercial',
  industrial: 'Industrial',
  residential: 'Residential',
  infrastructure: 'Infrastructure',
};

interface ProjectModalProps {
  project: Project;
  onClose: () => void;
}

function ProjectModal({ project, onClose }: ProjectModalProps) {
  const { navigate } = useRouter();
  return (
    <div
      className="fixed inset-0 z-[60] flex items-end justify-center bg-black/70 p-0 backdrop-blur-sm animate-fade-in sm:items-center sm:p-6"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label={`${project.name} details`}
    >
      <div
        className="relative flex max-h-[92vh] w-full max-w-3xl flex-col overflow-hidden rounded-t-2xl border border-steel-800 bg-steel-975 shadow-2xl animate-scale-in sm:rounded-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute right-3 top-3 z-10 inline-flex h-9 w-9 items-center justify-center rounded-full bg-steel-990/70 text-steel-200 transition-colors hover:bg-steel-990 hover:text-white"
          aria-label="Close"
        >
          <X className="h-5 w-5" />
        </button>

        <div className="overflow-y-auto">
          <div className="relative h-56 sm:h-64">
            {project.photos[0] ? (
              <img src={project.photos[0]} alt={project.name} className="h-full w-full object-cover" />
            ) : (
              <div className="h-full w-full bg-steel-800" />
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-steel-975 via-steel-975/70 to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 p-5 sm:p-6">
              <div className="flex flex-wrap items-center gap-2">
                <span className="rounded-md bg-emerald2-600 px-2.5 py-1 text-xs font-700 uppercase tracking-wider text-steel-990">
                  {PROJECT_TYPE_LABELS[project.type]}
                </span>
                {project.value && (
                  <span className="rounded-md bg-steel-990/80 px-2.5 py-1 text-xs font-600 text-white">{project.value}</span>
                )}
              </div>
              <h2 className="mt-2 font-display text-xl font-800 leading-tight text-white sm:text-2xl">{project.name}</h2>
            </div>
          </div>

          <div className="p-5 sm:p-7">
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
              <Meta label="Role" value={project.role} />
              <Meta label="Timeframe" value={project.timeframe} />
              <Meta label="Location" value={project.location} />
              <Meta label="Value" value={project.value ?? '—'} />
            </div>

            {project.scope && (
              <Section title="Scope of work">
                <p className="text-sm leading-relaxed text-steel-300">{project.scope}</p>
              </Section>
            )}

            {project.technical_scope.length > 0 && (
              <Section title="Technical scope">
                <ul className="space-y-2">
                  {project.technical_scope.map((item, i) => (
                    <li key={i} className="flex items-start gap-2.5 text-sm text-steel-300">
                      <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-emerald2-500" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </Section>
            )}

            {project.systems.length > 0 && (
              <Section title="Systems worked on">
                <div className="flex flex-wrap gap-2">
                  {project.systems.map((s) => (
                    <span key={s} className="rounded-md border border-steel-700 bg-steel-900 px-2.5 py-1.5 text-xs font-500 text-steel-200">{s}</span>
                  ))}
                </div>
              </Section>
            )}

            {project.challenges.length > 0 && (
              <Section title="Challenges">
                <ul className="space-y-2">
                  {project.challenges.map((c, i) => (
                    <li key={i} className="flex items-start gap-2.5 text-sm text-steel-300">
                      <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-amber2-500" />
                      <span>{c}</span>
                    </li>
                  ))}
                </ul>
              </Section>
            )}

            {project.outcome && (
              <Section title="Outcome">
                <div className="rounded-lg border-l-4 border-emerald2-500 bg-emerald2-900/20 p-4">
                  <p className="text-sm leading-relaxed text-steel-200">{project.outcome}</p>
                </div>
              </Section>
            )}

            {project.photos.length > 1 && (
              <Section title="Project gallery">
                <div className="grid grid-cols-2 gap-3">
                  {project.photos.slice(1).map((src, i) => (
                    <img key={i} src={src} alt={`${project.name} ${i + 2}`} className="h-32 w-full rounded-lg object-cover sm:h-40" loading="lazy" />
                  ))}
                </div>
              </Section>
            )}

            <div className="mt-7 flex items-center justify-between border-t border-steel-800 pt-5">
              <button onClick={onClose} className="inline-flex items-center gap-1.5 text-sm font-600 text-steel-400 transition-colors hover:text-emerald2-400">
                <ArrowLeft className="h-4 w-4" /> All projects
              </button>
              <button onClick={() => navigate({ name: 'contact' })} className="inline-flex items-center gap-1.5 text-sm font-600 text-emerald2-400 transition-colors hover:text-emerald2-300">
                Discuss similar work
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function Meta({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-steel-800 bg-steel-950 p-3">
      <p className="text-xs font-600 uppercase tracking-wider text-steel-500">{label}</p>
      <p className="mt-1 text-sm font-600 text-steel-100">{value}</p>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="mt-6">
      <h3 className="font-display text-sm font-700 uppercase tracking-wider text-white">{title}</h3>
      <div className="mt-3">{children}</div>
    </div>
  );
}
