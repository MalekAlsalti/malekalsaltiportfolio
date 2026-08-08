import { useEffect, useState } from 'react';
import { Save, Plus, Trash2, GripVertical, Upload, Briefcase, Award } from 'lucide-react';
import {
  fetchWorkHistory,
  fetchCredentials,
  type WorkHistoryItem,
  type Credential,
} from '@/lib/content';
import { supabase } from '@/lib/supabase';
import { AdminPanel, TextField, TextArea, StringListEditor, Button, SaveStatus, EmptyState } from '@/components/admin/ui';

type SaveState = 'idle' | 'saving' | 'saved' | 'error';

export function AdminResumePage() {
  const [work, setWork] = useState<WorkHistoryItem[]>([]);
  const [creds, setCreds] = useState<Credential[]>([]);
  const [loading, setLoading] = useState(true);
  const [save, setSave] = useState<SaveState>('idle');
  const [resumeUrl, setResumeUrl] = useState('');
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    (async () => {
      const [w, c] = await Promise.all([fetchWorkHistory(), fetchCredentials()]);
      setWork(w);
      setCreds(c);
      setLoading(false);
    })();
  }, []);

  const markDirty = () => setSave('idle');

  // --- Work history ---
  const updateWork = (id: string, patch: Partial<WorkHistoryItem>) => {
    setWork((prev) => prev.map((w) => (w.id === id ? { ...w, ...patch } : w)));
    markDirty();
  };
  const addWork = async () => {
    const { data, error } = await supabase
      .from('work_history')
      .insert({ role: 'New role', company: 'Company', period: 'Year — Year', location: '', highlights: [], sort_order: work.length })
      .select('*')
      .maybeSingle();
    if (error) return;
    if (data) setWork((prev) => [...prev, data as WorkHistoryItem]);
  };
  const removeWork = async (id: string) => {
    await supabase.from('work_history').delete().eq('id', id);
    setWork((prev) => prev.filter((w) => w.id !== id));
  };
  const moveWork = (id: string, dir: -1 | 1) => {
    setWork((prev) => reorder(prev, id, dir));
    markDirty();
  };
  const saveWork = async (item: WorkHistoryItem) => {
    setSave('saving');
    const { error } = await supabase.from('work_history').update({
      role: item.role, company: item.company, period: item.period, location: item.location,
      highlights: item.highlights, sort_order: item.sort_order,
    }).eq('id', item.id);
    setSave(error ? 'error' : 'saved');
    if (!error) setTimeout(() => setSave('idle'), 2000);
  };

  // --- Credentials ---
  const updateCred = (id: string, patch: Partial<Credential>) => {
    setCreds((prev) => prev.map((c) => (c.id === id ? { ...c, ...patch } : c)));
    markDirty();
  };
  const addCred = async () => {
    const { data, error } = await supabase
      .from('credentials')
      .insert({ label: 'New credential', detail: '', icon_key: 'ShieldCheck', sort_order: creds.length })
      .select('*')
      .maybeSingle();
    if (error) return;
    if (data) setCreds((prev) => [...prev, data as Credential]);
  };
  const removeCred = async (id: string) => {
    await supabase.from('credentials').delete().eq('id', id);
    setCreds((prev) => prev.filter((c) => c.id !== id));
  };
  const saveCred = async (item: Credential) => {
    setSave('saving');
    const { error } = await supabase.from('credentials').update({
      label: item.label, detail: item.detail, icon_key: item.icon_key, sort_order: item.sort_order,
    }).eq('id', item.id);
    setSave(error ? 'error' : 'saved');
    if (!error) setTimeout(() => setSave('idle'), 2000);
  };

  // --- Persist all reorderings ---
  const persistOrder = async () => {
    setSave('saving');
    let anyError = false;
    for (let i = 0; i < work.length; i++) {
      const { error } = await supabase.from('work_history').update({ sort_order: i }).eq('id', work[i].id);
      if (error) anyError = true;
    }
    for (let i = 0; i < creds.length; i++) {
      const { error } = await supabase.from('credentials').update({ sort_order: i }).eq('id', creds[i].id);
      if (error) anyError = true;
    }
    setSave(anyError ? 'error' : 'saved');
    if (!anyError) setTimeout(() => setSave('idle'), 2000);
  };

  // --- Resume PDF upload ---
  const onUploadPdf = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.type !== 'application/pdf') {
      alert('Please choose a PDF file.');
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      alert('That PDF is larger than 10 MB. Please upload a smaller file.');
      return;
    }
    setUploading(true);
    const path = `resume/Malek-Alsalti-Resume.pdf`;
    const { error } = await supabase.storage.from('portfolio-media').upload(path, file, { upsert: true, cacheControl: '3600' });
    setUploading(false);
    if (error) {
      console.error('resume upload:', error.message);
      alert('Upload failed. Please try again.');
      return;
    }
    const { data } = supabase.storage.from('portfolio-media').getPublicUrl(path);
    setResumeUrl(data.publicUrl);
    await supabase.from('site_settings').update({ resume_pdf_url: data.publicUrl }).eq('id', 1);
  };

  if (loading) return <div className="text-sm text-steel-400">Loading...</div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-800 text-white">Resume Manager</h1>
          <p className="mt-1 text-sm text-steel-400">Edit work history, credentials, and upload the downloadable PDF.</p>
        </div>
        <div className="flex items-center gap-3">
          <SaveStatus status={save} />
          <Button onClick={persistOrder} variant="secondary">Save order</Button>
        </div>
      </div>

      {/* PDF upload */}
      <AdminPanel title="Resume PDF">
        <div className="flex flex-wrap items-center gap-4">
          <label className="inline-flex cursor-pointer items-center gap-2 rounded-lg bg-emerald2-600 px-4 py-2.5 text-sm font-600 text-steel-990 transition-colors hover:bg-emerald2-500">
            <Upload className="h-4 w-4" />
            {uploading ? 'Uploading...' : 'Upload / replace PDF'}
            <input type="file" accept="application/pdf" onChange={onUploadPdf} className="hidden" disabled={uploading} />
          </label>
          <span className="text-sm text-steel-400">
            {resumeUrl ? 'Uploaded — link updated' : 'Current file serves from /Malek-Alsalti-Resume.pdf'}
          </span>
        </div>
      </AdminPanel>

      {/* Work history */}
      <AdminPanel
        title="Work history"
        actions={<Button onClick={addWork} variant="secondary" icon={<Plus className="h-4 w-4" />}>Add</Button>}
      >
        {work.length === 0 ? (
          <EmptyState message="No work history entries yet." />
        ) : (
          <div className="space-y-4">
            {work.map((item, idx) => (
              <div key={item.id} className="rounded-lg border border-steel-800 bg-steel-900/50 p-4">
                <div className="mb-3 flex items-center justify-between">
                  <div className="flex items-center gap-2 text-steel-400">
                    <Briefcase className="h-4 w-4" />
                    <span className="text-xs font-600 uppercase tracking-wider">Entry {idx + 1}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <button onClick={() => moveWork(item.id, -1)} disabled={idx === 0} className="rounded p-1 text-steel-500 hover:text-white disabled:opacity-30"><GripVertical className="h-4 w-4 rotate-90" /></button>
                    <button onClick={() => moveWork(item.id, 1)} disabled={idx === work.length - 1} className="rounded p-1 text-steel-500 hover:text-white disabled:opacity-30"><GripVertical className="h-4 w-4 -rotate-90" /></button>
                    <button onClick={() => removeWork(item.id)} className="rounded p-1 text-steel-500 hover:text-danger-400"><Trash2 className="h-4 w-4" /></button>
                  </div>
                </div>
                <div className="grid gap-3 sm:grid-cols-2">
                  <TextField label="Role" value={item.role} onChange={(v) => updateWork(item.id, { role: v })} />
                  <TextField label="Company" value={item.company} onChange={(v) => updateWork(item.id, { company: v })} />
                  <TextField label="Period" value={item.period} onChange={(v) => updateWork(item.id, { period: v })} />
                  <TextField label="Location" value={item.location} onChange={(v) => updateWork(item.id, { location: v })} />
                </div>
                <div className="mt-3">
                  <StringListEditor label="Highlights" values={item.highlights} onChange={(v) => updateWork(item.id, { highlights: v })} placeholder="Bullet point..." />
                </div>
                <div className="mt-3 flex justify-end">
                  <Button onClick={() => saveWork(item)} variant="secondary">Save entry</Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </AdminPanel>

      {/* Credentials */}
      <AdminPanel
        title="Credentials"
        actions={<Button onClick={addCred} variant="secondary" icon={<Plus className="h-4 w-4" />}>Add</Button>}
      >
        {creds.length === 0 ? (
          <EmptyState message="No credentials yet." />
        ) : (
          <div className="space-y-4">
            {creds.map((cred) => (
              <div key={cred.id} className="rounded-lg border border-steel-800 bg-steel-900/50 p-4">
                <div className="mb-3 flex items-center justify-between">
                  <div className="flex items-center gap-2 text-steel-400">
                    <Award className="h-4 w-4" />
                    <span className="text-xs font-600 uppercase tracking-wider">Credential</span>
                  </div>
                  <button onClick={() => removeCred(cred.id)} className="rounded p-1 text-steel-500 hover:text-danger-400"><Trash2 className="h-4 w-4" /></button>
                </div>
                <div className="grid gap-3 sm:grid-cols-3">
                  <div className="sm:col-span-1"><TextField label="Label" value={cred.label} onChange={(v) => updateCred(cred.id, { label: v })} /></div>
                  <div className="sm:col-span-1"><TextField label="Detail" value={cred.detail} onChange={(v) => updateCred(cred.id, { detail: v })} /></div>
                  <div className="sm:col-span-1"><TextField label="Icon key" value={cred.icon_key} onChange={(v) => updateCred(cred.id, { icon_key: v })} /></div>
                </div>
                <div className="mt-3 flex justify-end">
                  <Button onClick={() => saveCred(cred)} variant="secondary">Save</Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </AdminPanel>
    </div>
  );
}

function reorder<T extends { id: string }>(arr: T[], id: string, dir: -1 | 1): T[] {
  const idx = arr.findIndex((x) => x.id === id);
  if (idx < 0) return arr;
  const target = idx + dir;
  if (target < 0 || target >= arr.length) return arr;
  const next = [...arr];
  [next[idx], next[target]] = [next[target], next[idx]];
  return next;
}
