import { ArrowRight, ChevronRight } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { useRouter, type Route } from '@/router';

// Reusable callout box for the highlighted one-sentence duty summary.
export function DutySummary({ text }: { text: string }) {
  return (
    <div className="relative overflow-hidden rounded-xl border border-emerald2-800/60 border-l-4 border-l-emerald2-500 bg-steel-950 p-5 shadow-lg shadow-black/30 sm:p-6">
      <div className="absolute right-0 top-0 h-24 w-24 -translate-y-8 translate-x-8 rounded-full bg-emerald2-500/15 blur-2xl" />
      <p className="relative font-display text-lg font-600 leading-snug text-steel-100 sm:text-xl">
        {text}
      </p>
    </div>
  );
}

interface PageHeaderProps {
  title: string;
  eyebrow?: string;
  description?: string;
  icon?: LucideIcon;
}

export function PageHeader({ title, eyebrow, description, icon: Icon }: PageHeaderProps) {
  return (
    <div className="border-b border-steel-800 bg-steel-950">
      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
        <Breadcrumbs items={[{ label: title }]} />
        <div className="mt-5 flex items-start gap-4">
          {Icon && (
            <span className="mt-1 hidden h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-emerald2-600 text-steel-990 sm:inline-flex">
              <Icon className="h-5 w-5" />
            </span>
          )}
          <div>
            {eyebrow && (
              <p className="text-xs font-600 uppercase tracking-widest text-emerald2-400">
                {eyebrow}
              </p>
            )}
            <h1 className="mt-1.5 font-display text-3xl font-800 tracking-tight text-white sm:text-4xl">
              {title}
            </h1>
            {description && (
              <p className="mt-3 max-w-2xl text-base leading-relaxed text-steel-300 sm:text-lg">
                {description}
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

interface BreadcrumbItem {
  label: string;
  route?: Route;
}

export function Breadcrumbs({ items }: { items: BreadcrumbItem[] }) {
  const { navigate } = useRouter();
  return (
    <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-sm text-steel-400">
      {items.map((item, idx) => {
        const last = idx === items.length - 1;
        return (
          <span key={idx} className="flex items-center gap-1.5">
            {idx > 0 && <ChevronRight className="h-3.5 w-3.5 text-steel-600" />}
            {item.route && !last ? (
              <button
                onClick={() => navigate(item.route!)}
                className="transition-colors hover:text-emerald2-400"
              >
                {item.label}
              </button>
            ) : (
              <span className={last ? 'font-500 text-steel-200' : ''}>{item.label}</span>
            )}
          </span>
        );
      })}
    </nav>
  );
}

interface CtaLinkProps {
  label: string;
  route: Route;
  icon?: LucideIcon;
}

export function CtaLink({ label, route, icon: Icon = ArrowRight }: CtaLinkProps) {
  const { navigate } = useRouter();
  return (
    <button
      onClick={() => navigate(route)}
      className="group inline-flex items-center gap-2 text-sm font-600 text-emerald2-400 transition-colors hover:text-emerald2-300"
    >
      {label}
      <Icon className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
    </button>
  );
}
