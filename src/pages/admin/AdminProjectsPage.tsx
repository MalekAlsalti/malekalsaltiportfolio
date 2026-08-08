import { useEffect, useState } from 'react';
import { Plus, Trash2, Save, ImagePlus, X, Star, EyeOff } from 'lucide-react';
import { fetchProjects, uploadImage, type Project, type ProjectType } from '@/lib/content';
import { supabase } from '@/lib/supabase';
import { AdminPanel, TextField, TextArea, SelectField, StringListEditor, CheckboxField, Button, SaveStatus, EmptyState } from '@/components/admin/ui';

type SaveState = 'idle' | 'saving' | 'saved' | 'error';

const TYPE_OPTIONS = [
  { value: 'commercial', label: 'Commercial' },
  { value: 'industrial', label: 'Industrial' },
  { value: 'residential', label: 'Residential' },
  { value: 'infrastructure', label: 'Infrastructure' },
];

export function AdminProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [editing, setEditing] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);
  const [save, setSave] = useState<SaveState>('idle');

  useEffect(() => {
    (async () => {
      const p = await fetchProjects();
      setProjects(p);
      setLoading(false);
    })();
  }, []);

  const addProject = async () => {
    const slug = `new-project-${Date.now()}`;
    const { data, error } = await supabase
      .from('projects')
      .insert({
        slug, name: 'New Project', role: '', type: 'commercial', scope: '', timeframe: '',
        location: '', value: null, photos: [], technical_scope: [], challenges: [],
        systems: [], outcome: '', featured: false, hidden: false, sort_order: projects.length,
      })
      .select('*')
      .maybeSingle();
    if (error) return;
    if (data) {
      const newProj = data as Project;
      setProjects((prev) => [...prev, newProj]);
      setEditing(newProj);
    }
  };

  const removeProject = async (id: string) => {
    if (!confirm('Delete this project? This cannot be undone.')) return;
    await supabase.from('projects').delete().eq('id', id);
    setProjects((prev) => prev.filter((p) => p.id !== id));
    if (editing?.id === id) setEditing(null);
  };

  const saveProject = async () => {
    if (!editing) return;
    setSave('saving');
    const { error } = await supabase.from('projects').update({
      slug: editing.slug, name: editing.name, role: editing.role, type: editing.type,
      scope: editing.scope, timeframe: editing.timeframe, location: editing.location,
      value: editing.value, photos: editing.photos, technical_scope: editing.technical_scope,
      challenges: editing.challenges, systems: editing.systems, outcome: editing.outcome,
      featured: editing.featured, hidden: editing.hidden, sort_order: editing.sort_order,
    }).eq('id', editing.id);
    setSave(error ? 'error' : 'saved');
    if (!error) {
      setProjects((prev) => prev.map((p) => p.id === editing.id ? editing : p));
      setTimeout(() => setSave('idle'), 2000);
    }
  };

  const update = (patch: Partial<Project>) => {
    setEditing((prev) => (prev ? { ...prev, ...patch } : prev));
    setSave('idle');
  };

  const onUploadPhoto = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !editing) return;
    const url = await uploadImage(file, 'projects');
    if (url) update({ photos: [...editing.photos, url] });
  };

  const removePhoto = (idx: number) => {
    if (!editing) return;
    update({ photos: editing.photos.filter((_, i) => i !== idx) });
  };

  if (loading) return <div className="text-sm text-steel-400">Loading...</div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-800 text-white">Projects Manager</h1>
          <p className="mt-1 text-sm text-steel-400">Add, edit, and reorder projects. Toggle featured or hidden.</p>
        </div>
        <Button onClick={addProject} icon={<Plus className="h-4 w-4" />}>Add project</Button>
      </div>

      {projects.length === 0 && !editing ? (
        <EmptyState message="No projects yet. Add one to get started." />
      ) : (
        <div className="grid gap-6 lg:grid-cols-3">
          {/* List */}
          <div className="space-y-2 lg:col-span-1">
            {projects.map((p) => (
              <button
                key={p.id}
                onClick={() => setEditing(p)}
                className={`flex w-full items-start gap-3 rounded-lg border p-3 text-left transition-colors ${
                  editing?.id === p.id
                    ? 'border-emerald2-600 bg-emerald2-900/15'
                    : 'border-steel-800 bg-steel-950 hover:border-steel-600'
                }`}
              >
                {p.photos[0] ? (
                  <img src={p.photos[0]} alt="" className="h-12 w-12 shrink-0 rounded object-cover" />
                ) : (
                  <div className="h-12 w-12 shrink-0 rounded bg-steel-800" />
                )}
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-600 text-white">{p.name}</p>
                  <p className="truncate text-xs text-steel-400">{p.type} · {p.timeframe}</p>
                  <div className="mt-1 flex gap-2">
                    {p.featured && <span className="text-xs text-emerald2-400">Featured</span>}
                    {p.hidden && <span className="text-xs text-amber2-400">Hidden</span>}
                  </div>
                </div>
              </button>
            ))}
          </div>

          {/* Editor */}
          <div className="lg:col-span-2">
            {editing ? (
              <AdminPanel
                title={editing.name || 'Edit project'}
                actions={
                  <div className="flex items-center gap-2">
                    <SaveStatus status={save} />
                    <Button onClick={saveProject} icon={<Save className="h-4 w-4" />}>Save</Button>
                  </div>
                }
              >
                <div className="space-y-5">
                  <div className="grid gap-3 sm:grid-cols-2">
                    <TextField label="Name" value={editing.name} onChange={(v) => update({ name: v })} />
                    <TextField label="Slug" value={editing.slug} onChange={(v) => update({ slug: v })} />
                    <TextField label="Role" value={editing.role} onChange={(v) => update({ role: v })} />
                    <SelectField label="Type" value={editing.type} onChange={(v) => update({ type: v as ProjectType })} options={TYPE_OPTIONS} />
                    <TextField label="Timeframe" value={editing.timeframe} onChange={(v) => update({ timeframe: v })} />
                    <TextField label="Location" value={editing.location} onChange={(v) => update({ location: v })} />
                    <TextField label="Value" value={editing.value ?? ''} onChange={(v) => update({ value: v || null })} />
                  </div>

                  <TextArea label="Scope of work" value={editing.scope} onChange={(v) => update({ scope: v })} rows={3} />
                  <TextArea label="Outcome" value={editing.outcome} onChange={(v) => update({ outcome: v })} rows={3} />

                  <StringListEditor label="Technical scope" values={editing.technical_scope} onChange={(v) => update({ technical_scope: v })} placeholder="Technical scope item..." />
                  <StringListEditor label="Challenges" values={editing.challenges} onChange={(v) => update({ challenges: v })} placeholder="Challenge..." />
                  <StringListEditor label="Systems worked on" values={editing.systems} onChange={(v) => update({ systems: v })} placeholder="System..." />

                  {/* Photos */}
                  <div>
                    <span className="mb-2 block text-xs font-600 uppercase tracking-wider text-steel-400">Photos</span>
                    <div className="grid grid-cols-3 gap-3">
                      {editing.photos.map((url, i) => (
                        <div key={i} className="relative group">
                          <img src={url} alt="" className="h-24 w-full rounded-lg object-cover" />
                          <button
                            onClick={() => removePhoto(i)}
                            className="absolute right-1 top-1 rounded-full bg-steel-990/80 p-1 text-white opacity-0 transition-opacity group-hover:opacity-100"
                          >
                            <X className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      ))}
                      <label className="flex h-24 cursor-pointer items-center justify-center rounded-lg border border-dashed border-steel-700 bg-steel-900 text-steel-500 transition-colors hover:border-emerald2-600 hover:text-emerald2-400">
                        <ImagePlus className="h-5 w-5" />
                        <input type="file" accept="image/*" onChange={onUploadPhoto} className="hidden" />
                      </label>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-6 border-t border-steel-800 pt-4">
                    <CheckboxField label="Featured" checked={editing.featured} onChange={(v) => update({ featured: v })} />
                    <CheckboxField label="Hidden (not shown publicly)" checked={editing.hidden} onChange={(v) => update({ hidden: v })} />
                  </div>

                  <div className="flex justify-between border-t border-steel-800 pt-4">
                    <div className="flex gap-2 text-xs">
                      {editing.featured && <span className="inline-flex items-center gap-1 text-emerald2-400"><Star className="h-3 w-3" /> Featured</span>}
                      {editing.hidden && <span className="inline-flex items-center gap-1 text-amber2-400"><EyeOff className="h-3 w-3" /> Hidden</span>}
                    </div>
                    <Button onClick={() => removeProject(editing.id)} variant="danger" icon={<Trash2 className="h-4 w-4" />}>Delete project</Button>
                  </div>
                </div>
              </AdminPanel>
            ) : (
              <EmptyState message="Select a project to edit, or add a new one." />
            )}
          </div>
        </div>
      )}
    </div>
  );
}
