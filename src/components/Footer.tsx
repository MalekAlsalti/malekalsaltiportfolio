import { useEffect, useState } from 'react';
import { Linkedin, Mail, Phone, MapPin } from 'lucide-react';
import { NAV_LINKS } from '@/content';
import { fetchSiteSettings, type SiteSettings } from '@/lib/content';
import { useRouter, type Route } from '@/router';

export function Footer() {
  const { navigate } = useRouter();
  const [settings, setSettings] = useState<SiteSettings | null>(null);
  const year = new Date().getFullYear();
  const go = (r: Route) => navigate(r);

  useEffect(() => {
    (async () => {
      const s = await fetchSiteSettings();
      setSettings(s);
    })();
  }, []);

  const name = settings?.hero_name ?? 'Malek Alsalti';
  const title = settings?.hero_title ?? 'Construction & Project Management Professional';
  const email = settings?.contact_email ?? '';
  const phone = settings?.contact_phone ?? '';
  const linkedin = settings?.linkedin_url ?? '';
  const location = settings?.location ?? '';

  return (
    <footer className="border-t border-steel-800 bg-steel-990 text-steel-400">
      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid gap-10 md:grid-cols-3">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2.5">
              <span className="inline-block h-6 w-1.5 bg-emerald2-500" />
              <span className="font-display text-lg font-700 tracking-tight text-white">{name}</span>
            </div>
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-steel-400">
              {title}. Field-tested coordination for complex builds — MEP, structural, and
              subcontractor management.
            </p>
          </div>

          {/* Nav */}
          <div>
            <h3 className="text-xs font-600 uppercase tracking-wider text-steel-500">Site</h3>
            <ul className="mt-4 space-y-2.5 text-sm">
              {NAV_LINKS.map((link) => (
                <li key={link.label}>
                  <button
                    onClick={() => go(link.route)}
                    className="text-steel-300 transition-colors hover:text-emerald2-400"
                  >
                    {link.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-xs font-600 uppercase tracking-wider text-steel-500">Contact</h3>
            <ul className="mt-4 space-y-3 text-sm">
              {email && (
                <li>
                  <a href={`mailto:${email}`} className="inline-flex items-center gap-2.5 text-steel-300 transition-colors hover:text-emerald2-400">
                    <Mail className="h-4 w-4 shrink-0 text-steel-500" />
                    {email}
                  </a>
                </li>
              )}
              {phone && (
                <li>
                  <a href={`tel:${phone.replace(/[^+\d]/g, '')}`} className="inline-flex items-center gap-2.5 text-steel-300 transition-colors hover:text-emerald2-400">
                    <Phone className="h-4 w-4 shrink-0 text-steel-500" />
                    {phone}
                  </a>
                </li>
              )}
              {linkedin && (
                <li>
                  <a href={linkedin} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2.5 text-steel-300 transition-colors hover:text-emerald2-400">
                    <Linkedin className="h-4 w-4 shrink-0 text-steel-500" />
                    LinkedIn
                  </a>
                </li>
              )}
              {location && (
                <li className="inline-flex items-start gap-2.5 text-steel-400">
                  <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-steel-500" />
                  <span>{location}</span>
                </li>
              )}
            </ul>
          </div>
        </div>

        <div className="mt-10 flex flex-col items-start justify-between gap-3 border-t border-steel-800 pt-6 text-xs text-steel-500 sm:flex-row sm:items-center">
          <p>&copy; {year} {name}. All rights reserved.</p>
          <div className="flex items-center gap-4">
            <a href="#/admin" className="text-steel-600 transition-colors hover:text-steel-400">Admin</a>
            <p className="text-steel-600">Built for field review — mobile-first and quick to load.</p>
          </div>
        </div>
      </div>
    </footer>
  );
}
