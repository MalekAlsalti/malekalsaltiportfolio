import { useEffect, useState } from 'react';
import { Save } from 'lucide-react';
import { fetchSiteSettings, type SiteSettings } from '@/lib/content';
import { supabase } from '@/lib/supabase';
import { AdminPanel, TextField, TextArea, CheckboxField, Button, SaveStatus } from '@/components/admin/ui';

type SaveState = 'idle' | 'saving' | 'saved' | 'error';

export function AdminHomepagePage() {
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
    const { error } = await supabase
      .from('site_settings')
      .update({
        hero_name: settings.hero_name,
        hero_title: settings.hero_title,
        hero_intro: settings.hero_intro,
        duty_summary: settings.duty_summary,
        availability_badge: settings.availability_badge,
        availability_enabled: settings.availability_enabled,
        updated_at: new Date().toISOString(),
      })
      .eq('id', 1);
    setSave(error ? 'error' : 'saved');
    if (!error) setTimeout(() => setSave('idle'), 2500);
  };

  if (loading) return <div className="text-sm text-steel-400">Loading...</div>;
  if (!settings) return <div className="text-sm text-danger-400">Could not load site settings.</div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-800 text-white">Homepage Editor</h1>
          <p className="mt-1 text-sm text-steel-400">Edit the hero, intro, duty summary, and availability badge shown on the homepage.</p>
        </div>
        <div className="flex items-center gap-3">
          <SaveStatus status={save} />
          <Button onClick={onSave} icon={<Save className="h-4 w-4" />}>Save changes</Button>
        </div>
      </div>

      <AdminPanel title="Hero section">
        <div className="space-y-5">
          <TextField label="Name" value={settings.hero_name} onChange={(v) => update({ hero_name: v })} />
          <TextField label="Title / role" value={settings.hero_title} onChange={(v) => update({ hero_title: v })} />
          <TextArea label="Intro paragraph" value={settings.hero_intro} onChange={(v) => update({ hero_intro: v })} rows={4} />
        </div>
      </AdminPanel>

      <AdminPanel title="Duty summary callout">
        <TextArea
          label="Highlighted one-sentence duty summary"
          value={settings.duty_summary}
          onChange={(v) => update({ duty_summary: v })}
          rows={3}
        />
        <p className="mt-2 text-xs text-steel-500">This is the highlighted callout on the homepage and resume page.</p>
      </AdminPanel>

      <AdminPanel title="Availability badge">
        <div className="space-y-5">
          <TextField
            label="Badge text"
            value={settings.availability_badge}
            onChange={(v) => update({ availability_badge: v })}
            placeholder="Available for Freelance Work"
          />
          <CheckboxField
            label="Show availability badge on the homepage"
            checked={settings.availability_enabled}
            onChange={(v) => update({ availability_enabled: v })}
          />
        </div>
      </AdminPanel>
    </div>
  );
}
