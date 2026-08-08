import { useEffect, useState } from 'react';
import { Save } from 'lucide-react';
import { fetchSiteSettings, type SiteSettings } from '@/lib/content';
import { supabase } from '@/lib/supabase';
import { AdminPanel, TextField, Button, SaveStatus } from '@/components/admin/ui';

type SaveState = 'idle' | 'saving' | 'saved' | 'error';

export function AdminContactPage() {
  const [settings, setSettings] = useState<SiteSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [save, setSave] = useState<SaveState>('idle');

  useEffect(() => {
    (async () => {
      const s = await fetchSiteSettings();
      setSettings(s);
      setLoading(false);
    })();
  }, []);

  const update = (patch: Partial<SiteSettings>) => {
    setSettings((prev) => (prev ? { ...prev, ...patch } : prev));
    setSave('idle');
  };

  const onSave = async () => {
    if (!settings) return;
    setSave('saving');
    const { error } = await supabase.from('site_settings').update({
      contact_email: settings.contact_email,
      contact_phone: settings.contact_phone,
      linkedin_url: settings.linkedin_url,
      location: settings.location,
      resume_pdf_url: settings.resume_pdf_url,
      updated_at: new Date().toISOString(),
    }).eq('id', 1);
    setSave(error ? 'error' : 'saved');
    if (!error) setTimeout(() => setSave('idle'), 2500);
  };

  if (loading) return <div className="text-sm text-steel-400">Loading...</div>;
  if (!settings) return <div className="text-sm text-danger-400">Could not load settings.</div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-800 text-white">Contact Settings</h1>
          <p className="mt-1 text-sm text-steel-400">Edit the contact details displayed across the site.</p>
        </div>
        <div className="flex items-center gap-3">
          <SaveStatus status={save} />
          <Button onClick={onSave} icon={<Save className="h-4 w-4" />}>Save changes</Button>
        </div>
      </div>

      <AdminPanel title="Contact details">
        <div className="space-y-5">
          <TextField label="Contact email" value={settings.contact_email} onChange={(v) => update({ contact_email: v })} type="email" />
          <TextField label="Contact phone" value={settings.contact_phone} onChange={(v) => update({ contact_phone: v })} />
          <TextField label="LinkedIn URL" value={settings.linkedin_url} onChange={(v) => update({ linkedin_url: v })} />
          <TextField label="Location" value={settings.location} onChange={(v) => update({ location: v })} />
          <TextField label="Resume PDF URL" value={settings.resume_pdf_url} onChange={(v) => update({ resume_pdf_url: v })} />
        </div>
      </AdminPanel>
    </div>
  );
}
