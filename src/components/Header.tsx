import { useEffect, useState } from 'react';
import { Menu, X, Linkedin, Mail, Phone } from 'lucide-react';
import { NAV_LINKS } from '@/content';
import { fetchSiteSettings, type SiteSettings } from '@/lib/content';
import { useRouter, type Route } from '@/router';

interface HeaderProps {
  current: Route;
}

export function Header({ current }: HeaderProps) {
  const { navigate } = useRouter();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [settings, setSettings] = useState<SiteSettings | null>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    (async () => {
      const s = await fetchSiteSettings();
      setSettings(s);
    })();
  }, []);

  useEffect(() => {
    setOpen(false);
  }, [current]);

  const name = settings?.hero_name ?? 'Malek Alsalti';
  const email = settings?.contact_email ?? 'malek.alsalti@example.com';
  const phone = settings?.contact_phone ?? '';
  const linkedin = settings?.linkedin_url ?? '';

  const isActive = (name: string) => {
    const map: Record<string, string[]> = {
      home: ['home'],
      projects: ['projects', 'project'],
      resume: ['resume'],
      blog: ['blog', 'post'],
      contact: ['contact'],
    };
    return map[name].includes(current.name);
  };

  const go = (route: Route) => {
    navigate(route);
    setOpen(false);
  };

  return (
    <header
      className={`sticky top-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'border-b border-steel-800 bg-steel-975/95 backdrop-blur-md shadow-lg shadow-black/40'
          : 'border-b border-transparent bg-steel-975'
      }`}
    >
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo / name */}
          <button
            onClick={() => go({ name: 'home' })}
            className="group flex items-center gap-2.5 focus:outline-none"
            aria-label="Go to home"
          >
            <span className="inline-block h-7 w-1.5 bg-emerald2-500 transition-colors group-hover:bg-emerald2-400" />
            <span className="font-display text-lg font-700 tracking-tight text-white sm:text-xl">
              {name}
            </span>
          </button>

          {/* Desktop nav */}
          <nav className="hidden items-center gap-1 md:flex">
            {NAV_LINKS.map((link) => {
              const active = isActive(link.route.name);
              return (
                <button
                  key={link.label}
                  onClick={() => go(link.route)}
                  className={`relative px-3.5 py-2 text-sm font-500 transition-colors ${
                    active ? 'text-white' : 'text-steel-300 hover:text-white'
                  }`}
                >
                  {link.label}
                  {active && (
                    <span className="absolute inset-x-3 -bottom-px h-0.5 bg-emerald2-500" />
                  )}
                </button>
              );
            })}
            <a
              href={`mailto:${email}`}
              className="ml-2 inline-flex items-center gap-1.5 rounded-md bg-emerald2-600 px-3.5 py-2 text-sm font-600 text-steel-990 transition-colors hover:bg-emerald2-500"
            >
              <Mail className="h-4 w-4" />
              Hire
            </a>
          </nav>

          {/* Mobile toggle */}
          <button
            onClick={() => setOpen((v) => !v)}
            className="inline-flex items-center justify-center rounded-md p-2 text-steel-200 transition-colors hover:bg-steel-800 hover:text-white md:hidden"
            aria-label={open ? 'Close menu' : 'Open menu'}
            aria-expanded={open}
          >
            {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="border-t border-steel-800 bg-steel-975 md:hidden">
          <nav className="mx-auto flex max-w-6xl flex-col gap-1 px-4 py-3 sm:px-6">
            {NAV_LINKS.map((link) => {
              const active = isActive(link.route.name);
              return (
                <button
                  key={link.label}
                  onClick={() => go(link.route)}
                  className={`rounded-md px-3 py-2.5 text-left text-base font-500 transition-colors ${
                    active
                      ? 'bg-steel-800 text-white'
                      : 'text-steel-300 hover:bg-steel-800/60 hover:text-white'
                  }`}
                >
                  {link.label}
                </button>
              );
            })}
            <div className="mt-2 flex flex-col gap-2 border-t border-steel-800 pt-3">
              <a
                href={`mailto:${email}`}
                className="inline-flex items-center gap-2 rounded-md bg-emerald2-600 px-3 py-2.5 text-base font-600 text-steel-990"
              >
                <Mail className="h-4 w-4" /> Email
              </a>
              <a
                href={`tel:${phone.replace(/[^+\d]/g, '')}`}
                className="inline-flex items-center gap-2 rounded-md border border-steel-700 px-3 py-2.5 text-base font-500 text-steel-200"
              >
                <Phone className="h-4 w-4" /> Call
              </a>
              <a
                href={linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-md border border-steel-700 px-3 py-2.5 text-base font-500 text-steel-200"
              >
                <Linkedin className="h-4 w-4" /> LinkedIn
              </a>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
