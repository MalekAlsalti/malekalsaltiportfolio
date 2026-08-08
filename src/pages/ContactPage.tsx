import { useState, useEffect } from 'react';
import type { FormEvent } from 'react';
import { Mail, Phone, Linkedin, MapPin, Send, CheckCircle2, AlertCircle, Loader2, Briefcase, FileText, MessageSquare } from 'lucide-react';
import { fetchSiteSettings, insertContactMessage, type SiteSettings } from '@/lib/content';
import { PageHeader } from '@/components/ui';

type Status = 'idle' | 'submitting' | 'success' | 'error';

const INQUIRY_TYPES = [
  { value: 'Freelance/contract project', label: 'Freelance / contract project', icon: Briefcase },
  { value: 'Full-time opportunity', label: 'Full-time opportunity', icon: FileText },
  { value: 'General inquiry', label: 'General inquiry', icon: MessageSquare },
];

export function ContactPage() {
  const [settings, setSettings] = useState<SiteSettings | null>(null);
  const [status, setStatus] = useState<Status>('idle');
  const [errorMsg, setErrorMsg] = useState<string>('');

  useEffect(() => {
    (async () => {
      const s = await fetchSiteSettings();
      setSettings(s);
    })();
  }, []);

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const data = new FormData(form);
    const name = String(data.get('name') ?? '').trim();
    const email = String(data.get('email') ?? '').trim();
    const company = String(data.get('company') ?? '').trim() || null;
    const inquiryType = String(data.get('inquiry_type') ?? '').trim();
    const projectType = String(data.get('project_type') ?? '').trim() || null;
    const message = String(data.get('message') ?? '').trim();

    if (!name || !email || !message || !inquiryType) {
      setStatus('error');
      setErrorMsg('Please fill in your name, email, inquiry type, and message.');
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setStatus('error');
      setErrorMsg('Please enter a valid email address.');
      return;
    }
    if (name.length > 200 || email.length > 320 || (company && company.length > 200)) {
      setStatus('error');
      setErrorMsg('One of your details is too long. Please shorten it and try again.');
      return;
    }
    if (message.length > 5000) {
      setStatus('error');
      setErrorMsg('Your message is too long. Please keep it under 5,000 characters.');
      return;
    }

    setStatus('submitting');
    setErrorMsg('');

    const ok = await insertContactMessage({
      name, email, company, project_type: projectType, inquiry_type: inquiryType, message,
    });

    if (!ok) {
      setStatus('error');
      setErrorMsg('Something went wrong sending your message. Please try emailing directly.');
      return;
    }

    setStatus('success');
    form.reset();
  };

  const email = settings?.contact_email ?? '';
  const phone = settings?.contact_phone ?? '';
  const linkedin = settings?.linkedin_url ?? '';
  const location = settings?.location ?? '';

  return (
    <div>
      <PageHeader
        eyebrow="Get in touch"
        title="Contact"
        description="Whether you're hiring a subcontractor for a defined scope or filling a full-time role — send a message or reach out directly."
        icon={Mail}
      />

      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 sm:py-14 lg:px-8">
        <div className="grid gap-8 lg:grid-cols-5">
          {/* Contact details */}
          <div className="lg:col-span-2">
            <h2 className="font-display text-lg font-700 text-white">Direct contact</h2>
            <p className="mt-2 text-sm leading-relaxed text-steel-400">
              Fastest response by email or phone. Available for freelance projects, contract scopes,
              and full-time roles — regional and remote.
            </p>

            <ul className="mt-6 space-y-4">
              {email && (
                <ContactRow icon={Mail} label="Email" value={email} href={`mailto:${email}`} />
              )}
              {phone && (
                <ContactRow icon={Phone} label="Phone" value={phone} href={`tel:${phone.replace(/[^+\d]/g, '')}`} />
              )}
              {linkedin && (
                <ContactRow icon={Linkedin} label="LinkedIn" value="View profile" href={linkedin} external />
              )}
              {location && (
                <li className="flex items-start gap-3">
                  <span className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-steel-900 text-steel-300 ring-1 ring-steel-800">
                    <MapPin className="h-4.5 w-4.5" />
                  </span>
                  <div>
                    <p className="text-xs font-600 uppercase tracking-wider text-steel-500">Location</p>
                    <p className="mt-0.5 text-sm font-500 text-steel-200">{location}</p>
                  </div>
                </li>
              )}
            </ul>

            <div className="mt-8 rounded-xl border border-emerald2-800/40 bg-emerald2-900/15 p-5">
              <p className="text-sm font-600 text-white">Two ways to work together</p>
              <ul className="mt-2 space-y-1.5 text-xs leading-relaxed text-steel-300">
                <li className="flex items-start gap-2"><Briefcase className="mt-0.5 h-3.5 w-3.5 shrink-0 text-emerald2-400" /> Freelance / contract — defined scope or project phase</li>
                <li className="flex items-start gap-2"><FileText className="mt-0.5 h-3.5 w-3.5 shrink-0 text-emerald2-400" /> Full-time — permanent field or PM role</li>
              </ul>
            </div>
          </div>

          {/* Form */}
          <div className="lg:col-span-3">
            <div className="rounded-xl border border-steel-800 bg-steel-950 p-5 shadow-lg shadow-black/20 sm:p-7">
              {status === 'success' ? (
                <div className="flex flex-col items-center py-10 text-center animate-fade-up">
                  <span className="inline-flex h-14 w-14 items-center justify-center rounded-full bg-emerald2-900/40 text-emerald2-400 ring-1 ring-emerald2-800/50">
                    <CheckCircle2 className="h-7 w-7" />
                  </span>
                  <h3 className="mt-4 font-display text-lg font-700 text-white">Message sent</h3>
                  <p className="mt-2 max-w-sm text-sm text-steel-400">
                    Thanks for reaching out. I'll get back to you shortly — usually within one business day.
                  </p>
                  <button onClick={() => setStatus('idle')} className="mt-6 text-sm font-600 text-emerald2-400 hover:text-emerald2-300">
                    Send another message
                  </button>
                </div>
              ) : (
                <form onSubmit={onSubmit} noValidate className="space-y-5">
                  {/* Inquiry type — visually prominent, first */}
                  <div>
                    <span className="mb-1.5 block text-xs font-600 uppercase tracking-wider text-steel-400">
                      What's this about? <span className="text-emerald2-400">*</span>
                    </span>
                    <div className="grid gap-2 sm:grid-cols-3">
                      {INQUIRY_TYPES.map((opt) => {
                        const Icon = opt.icon;
                        return (
                          <label key={opt.value} className="flex cursor-pointer items-center gap-2 rounded-lg border border-steel-700 bg-steel-900 px-3 py-2.5 text-sm text-steel-200 transition-colors hover:border-emerald2-600 has-[:checked]:border-emerald2-600 has-[:checked]:bg-emerald2-900/30">
                            <input type="radio" name="inquiry_type" value={opt.value} className="h-4 w-4 text-emerald2-500 focus:ring-emerald2-500/40" required />
                            <Icon className="h-4 w-4 text-emerald2-400" />
                            <span className="text-xs font-500">{opt.label}</span>
                          </label>
                        );
                      })}
                    </div>
                  </div>

                  <div className="grid gap-5 sm:grid-cols-2">
                    <Field label="Name" required>
                      <input name="name" type="text" maxLength={200} autoComplete="name" className={inputClass} placeholder="Jane Doe" />
                    </Field>
                    <Field label="Email" required>
                      <input name="email" type="email" maxLength={320} autoComplete="email" className={inputClass} placeholder="jane@company.com" />
                    </Field>
                  </div>

                  <div className="grid gap-5 sm:grid-cols-2">
                    <Field label="Company">
                      <input name="company" type="text" maxLength={200} autoComplete="organization" className={inputClass} placeholder="GC / firm name" />
                    </Field>
                    <Field label="Project type">
                      <select name="project_type" className={inputClass} defaultValue="">
                        <option value="" disabled>Select one</option>
                        <option>Commercial</option>
                        <option>Industrial</option>
                        <option>Residential</option>
                        <option>Infrastructure</option>
                        <option>Not applicable</option>
                      </select>
                    </Field>
                  </div>

                  <Field label="Message" required>
                    <textarea name="message" rows={5} maxLength={5000} className={`${inputClass} resize-y`} placeholder="Scope of work, timeframe, location, and what you need reviewed." />
                  </Field>

                  {status === 'error' && (
                    <div className="flex items-start gap-2.5 rounded-lg border border-danger-700 bg-danger-900/40 p-3 text-sm text-danger-200">
                      <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
                      <span>{errorMsg}</span>
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={status === 'submitting'}
                    className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-emerald2-600 px-5 py-3 text-sm font-600 text-steel-990 transition-all hover:bg-emerald2-500 disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
                  >
                    {status === 'submitting' ? (
                      <><Loader2 className="h-4 w-4 animate-spin" /> Sending...</>
                    ) : (
                      <><Send className="h-4 w-4" /> Send message</>
                    )}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

const inputClass =
  'w-full rounded-lg border border-steel-700 bg-steel-900 px-3.5 py-2.5 text-sm text-white placeholder:text-steel-500 transition-colors focus:border-emerald2-500 focus:outline-none focus:ring-2 focus:ring-emerald2-500/30';

function Field({ label, required, children }: { label: string; required?: boolean; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-xs font-600 uppercase tracking-wider text-steel-400">
        {label}{required && <span className="text-emerald2-400"> *</span>}
      </span>
      {children}
    </label>
  );
}

function ContactRow({ icon: Icon, label, value, href, external }: { icon: typeof Mail; label: string; value: string; href: string; external?: boolean }) {
  return (
    <li>
      <a href={href} target={external ? '_blank' : undefined} rel={external ? 'noopener noreferrer' : undefined} className="group flex items-start gap-3">
        <span className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-steel-900 text-steel-300 ring-1 ring-steel-800 transition-colors group-hover:bg-emerald2-600 group-hover:text-steel-990 group-hover:ring-emerald2-600">
          <Icon className="h-4.5 w-4.5" />
        </span>
        <div>
          <p className="text-xs font-600 uppercase tracking-wider text-steel-500">{label}</p>
          <p className="mt-0.5 text-sm font-500 text-steel-200 transition-colors group-hover:text-emerald2-300">{value}</p>
        </div>
      </a>
    </li>
  );
}
