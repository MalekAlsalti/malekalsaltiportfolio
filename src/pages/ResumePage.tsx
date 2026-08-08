import { useEffect, useState } from 'react';
import { Download, MapPin, Briefcase, CheckCircle2 } from 'lucide-react';
import {
  fetchSiteSettings,
  fetchWorkHistory,
  fetchCredentials,
  fetchSkillGroups,
  type SiteSettings,
  type WorkHistoryItem,
  type Credential,
  type SkillGroup,
} from '@/lib/content';
import { PageHeader, DutySummary } from '@/components/ui';

// Icon resolver — maps icon_key strings from the DB to lucide components.
import {
  ShieldCheck, Layers, ClipboardList, HardHat, Zap, Users, Wrench, Ruler, Building2, FileSpreadsheet, Workflow,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

const ICONS: Record<string, LucideIcon> = {
  ShieldCheck, Layers, ClipboardList, HardHat, Zap, Users, Wrench, Ruler, Building2, FileSpreadsheet, Workflow,
};

function getIcon(key: string): LucideIcon {
  return ICONS[key] ?? HardHat;
}

export function ResumePage() {
  const [settings, setSettings] = useState<SiteSettings | null>(null);
  const [work, setWork] = useState<WorkHistoryItem[]>([]);
  const [creds, setCreds] = useState<Credential[]>([]);
  const [skills, setSkills] = useState<SkillGroup[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const [s, w, c, sk] = await Promise.all([
        fetchSiteSettings(),
        fetchWorkHistory(),
        fetchCredentials(),
        fetchSkillGroups(),
      ]);
      setSettings(s);
      setWork(w);
      setCreds(c);
      setSkills(sk);
      setLoading(false);
    })();
  }, []);

  if (loading) return <div className="flex min-h-[60vh] items-center justify-center text-sm text-steel-400">Loading...</div>;

  const resumeUrl = settings?.resume_pdf_url ?? '/Malek-Alsalti-Resume.pdf';

  return (
    <div>
      <PageHeader
        eyebrow="Credentials"
        title="Resume"
        description="Work history, credentials, and skills — organized by discipline. Available as a downloadable PDF for quick review."
        icon={Briefcase}
      />

      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 sm:py-14 lg:px-8">
        {/* Download + contact row */}
        <div className="flex flex-col gap-4 rounded-xl border border-steel-800 bg-steel-950 p-5 sm:flex-row sm:items-center sm:justify-between sm:p-6">
          <div>
            <h2 className="font-display text-lg font-700 text-white">{settings?.hero_name ?? 'Malek Alsalti'}</h2>
            <p className="text-sm text-steel-400">{settings?.hero_title ?? ''}</p>
            <p className="mt-1 inline-flex items-center gap-1.5 text-xs text-steel-500">
              <MapPin className="h-3.5 w-3.5" />
              {settings?.location ?? ''}
            </p>
          </div>
          <a
            href={resumeUrl}
            download
            className="inline-flex items-center justify-center gap-2 rounded-lg bg-emerald2-600 px-5 py-3 text-sm font-600 text-steel-990 transition-all hover:bg-emerald2-500 hover:shadow-lg hover:shadow-emerald2-600/30"
          >
            <Download className="h-4 w-4" />
            Download PDF Resume
          </a>
        </div>

        {/* Duty summary — reused for consistency */}
        {settings?.duty_summary && (
          <div className="mt-8">
            <h3 className="text-xs font-600 uppercase tracking-widest text-emerald2-400">Core duties</h3>
            <div className="mt-3">
              <DutySummary text={settings.duty_summary} />
            </div>
          </div>
        )}

        {/* Work history */}
        {work.length > 0 && (
          <div className="mt-12">
            <h3 className="flex items-center gap-2 font-display text-xl font-700 text-white">
              <Briefcase className="h-5 w-5 text-emerald2-500" />
              Work history
            </h3>
            <ol className="mt-6 space-y-6">
              {work.map((job) => (
                <li key={job.id} className="relative rounded-xl border border-steel-800 bg-steel-950 p-5 sm:p-6">
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                    <div>
                      <h4 className="font-display text-base font-700 text-white">{job.role}</h4>
                      <p className="text-sm font-500 text-emerald2-400">{job.company}</p>
                    </div>
                    <div className="text-left sm:text-right">
                      <p className="text-sm font-600 text-steel-200">{job.period}</p>
                      <p className="text-xs text-steel-500">{job.location}</p>
                    </div>
                  </div>
                  <ul className="mt-4 space-y-2">
                    {job.highlights.map((h, i) => (
                      <li key={i} className="flex items-start gap-2.5 text-sm text-steel-300">
                        <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald2-500" />
                        <span>{h}</span>
                      </li>
                    ))}
                  </ul>
                </li>
              ))}
            </ol>
          </div>
        )}

        {/* Skills by category */}
        {skills.length > 0 && (
          <div className="mt-12">
            <h3 className="font-display text-xl font-700 text-white">Skills &amp; disciplines</h3>
            <p className="mt-1 text-sm text-steel-400">Organized by category for quick review.</p>
            <div className="mt-6 grid gap-5 md:grid-cols-2">
              {skills.map((group) => {
                const Icon = getIcon(group.icon_key);
                return (
                  <div key={group.id} className="rounded-xl border border-steel-800 bg-steel-950 p-5 sm:p-6">
                    <div className="flex items-center gap-2.5">
                      <span className="inline-flex h-9 w-9 items-center justify-center rounded-lg bg-emerald2-600 text-steel-990">
                        <Icon className="h-4.5 w-4.5" />
                      </span>
                      <h4 className="font-display text-base font-700 text-white">{group.label}</h4>
                    </div>
                    <ul className="mt-4 flex flex-wrap gap-2">
                      {(group.skills ?? []).map((skill) => (
                        <li key={skill.id} className="rounded-md border border-steel-700 bg-steel-900 px-2.5 py-1.5 text-xs font-500 text-steel-200">
                          {skill.label}
                        </li>
                      ))}
                    </ul>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Credentials */}
        {creds.length > 0 && (
          <div className="mt-12">
            <h3 className="font-display text-xl font-700 text-white">Credentials</h3>
            <div className="mt-6 grid gap-5 md:grid-cols-3">
              {creds.map((cred) => {
                const Icon = getIcon(cred.icon_key);
                return (
                  <div key={cred.id} className="rounded-xl border border-steel-800 bg-steel-950 p-5">
                    <span className="inline-flex h-9 w-9 items-center justify-center rounded-lg bg-emerald2-900/30 text-emerald2-400 ring-1 ring-emerald2-800/40">
                      <Icon className="h-5 w-5" />
                    </span>
                    <h4 className="mt-3 font-display text-sm font-700 text-white">{cred.label}</h4>
                    <p className="mt-1 text-xs text-steel-400">{cred.detail}</p>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
