import { useEffect, useState } from 'react';
import { Plus, Trash2, Save, Wrench } from 'lucide-react';
import { fetchSkillGroups, type SkillGroup, type Skill } from '@/lib/content';
import { supabase } from '@/lib/supabase';
import { AdminPanel, TextField, Button, SaveStatus, EmptyState } from '@/components/admin/ui';

type SaveState = 'idle' | 'saving' | 'saved' | 'error';

export function AdminSkillsPage() {
  const [groups, setGroups] = useState<SkillGroup[]>([]);
  const [loading, setLoading] = useState(true);
  const [save, setSave] = useState<SaveState>('idle');

  useEffect(() => {
    (async () => {
      const g = await fetchSkillGroups();
      setGroups(g);
      setLoading(false);
    })();
  }, []);

  const markDirty = () => setSave('idle');

  // --- Groups ---
  const updateGroup = (id: string, patch: Partial<SkillGroup>) => {
    setGroups((prev) => prev.map((g) => (g.id === id ? { ...g, ...patch } : g)));
    markDirty();
  };
  const addGroup = async () => {
    const { data, error } = await supabase
      .from('skill_groups')
      .insert({ label: 'New group', icon_key: 'HardHat', sort_order: groups.length })
      .select('*')
      .maybeSingle();
    if (error) return;
    if (data) setGroups((prev) => [...prev, { ...(data as SkillGroup), skills: [] }]);
  };
  const removeGroup = async (id: string) => {
    await supabase.from('skill_groups').delete().eq('id', id);
    setGroups((prev) => prev.filter((g) => g.id !== id));
  };
  const saveGroup = async (group: SkillGroup) => {
    setSave('saving');
    const { error } = await supabase.from('skill_groups').update({
      label: group.label, icon_key: group.icon_key, sort_order: group.sort_order,
    }).eq('id', group.id);
    setSave(error ? 'error' : 'saved');
    if (!error) setTimeout(() => setSave('idle'), 2000);
  };

  // --- Skills within a group ---
  const addSkill = async (groupId: string) => {
    const group = groups.find((g) => g.id === groupId);
    const order = group?.skills?.length ?? 0;
    const { data, error } = await supabase
      .from('skills')
      .insert({ group_id: groupId, label: 'New skill', sort_order: order })
      .select('*')
      .maybeSingle();
    if (error) return;
    if (data) {
      setGroups((prev) => prev.map((g) =>
        g.id === groupId ? { ...g, skills: [...(g.skills ?? []), data as Skill] } : g
      ));
    }
  };
  const updateSkill = (groupId: string, skillId: string, label: string) => {
    setGroups((prev) => prev.map((g) =>
      g.id === groupId ? { ...g, skills: (g.skills ?? []).map((s) => s.id === skillId ? { ...s, label } : s) } : g
    ));
    markDirty();
  };
  const removeSkill = async (groupId: string, skillId: string) => {
    await supabase.from('skills').delete().eq('id', skillId);
    setGroups((prev) => prev.map((g) =>
      g.id === groupId ? { ...g, skills: (g.skills ?? []).filter((s) => s.id !== skillId) } : g
    ));
  };
  const saveSkill = async (skill: Skill) => {
    setSave('saving');
    const { error } = await supabase.from('skills').update({ label: skill.label, sort_order: skill.sort_order }).eq('id', skill.id);
    setSave(error ? 'error' : 'saved');
    if (!error) setTimeout(() => setSave('idle'), 2000);
  };

  if (loading) return <div className="text-sm text-steel-400">Loading...</div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-800 text-white">Skills Manager</h1>
          <p className="mt-1 text-sm text-steel-400">Manage skill groups and the skills within each.</p>
        </div>
        <div className="flex items-center gap-3">
          <SaveStatus status={save} />
          <Button onClick={addGroup} variant="secondary" icon={<Plus className="h-4 w-4" />}>Add group</Button>
        </div>
      </div>

      {groups.length === 0 ? (
        <EmptyState message="No skill groups yet. Add one to get started." />
      ) : (
        <div className="space-y-4">
          {groups.map((group) => (
            <AdminPanel key={group.id} title={group.label || 'Untitled group'}>
              <div className="space-y-5">
                <div className="grid gap-3 sm:grid-cols-2">
                  <TextField label="Group label" value={group.label} onChange={(v) => updateGroup(group.id, { label: v })} />
                  <TextField label="Icon key" value={group.icon_key} onChange={(v) => updateGroup(group.id, { icon_key: v })} />
                </div>

                <div>
                  <div className="mb-2 flex items-center justify-between">
                    <span className="flex items-center gap-2 text-xs font-600 uppercase tracking-wider text-steel-400">
                      <Wrench className="h-3.5 w-3.5" /> Skills
                    </span>
                    <button onClick={() => addSkill(group.id)} className="text-sm font-600 text-emerald2-400 hover:text-emerald2-300">+ Add skill</button>
                  </div>
                  <div className="space-y-2">
                    {(group.skills ?? []).map((skill) => (
                      <div key={skill.id} className="flex gap-2">
                        <input
                          value={skill.label}
                          onChange={(e) => updateSkill(group.id, skill.id, e.target.value)}
                          className="w-full rounded-lg border border-steel-700 bg-steel-900 px-3 py-2 text-sm text-white placeholder:text-steel-500 focus:border-emerald2-500 focus:outline-none focus:ring-2 focus:ring-emerald2-500/30"
                        />
                        <Button onClick={() => saveSkill(skill)} variant="ghost">Save</Button>
                        <button onClick={() => removeSkill(group.id, skill.id)} className="shrink-0 rounded-lg border border-steel-700 px-3 text-sm text-steel-400 hover:border-danger-600 hover:text-danger-300"><Trash2 className="h-4 w-4" /></button>
                      </div>
                    ))}
                    {(group.skills ?? []).length === 0 && (
                      <p className="text-xs text-steel-500">No skills in this group yet.</p>
                    )}
                  </div>
                </div>

                <div className="flex justify-end gap-2 border-t border-steel-800 pt-3">
                  <Button onClick={() => saveGroup(group)} variant="secondary" icon={<Save className="h-4 w-4" />}>Save group</Button>
                  <Button onClick={() => removeGroup(group.id)} variant="danger" icon={<Trash2 className="h-4 w-4" />}>Delete group</Button>
                </div>
              </div>
            </AdminPanel>
          ))}
        </div>
      )}
    </div>
  );
}
