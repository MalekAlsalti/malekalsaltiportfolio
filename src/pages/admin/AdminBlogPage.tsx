import { useEffect, useState, useCallback } from 'react';
import { Plus, Trash2, Save, ImagePlus, X, Eye, FileEdit } from 'lucide-react';
import { fetchBlogPosts, uploadImage, slugify, type BlogPost, type BlogStatus } from '@/lib/content';
import { supabase } from '@/lib/supabase';
import { AdminPanel, TextField, TextArea, SelectField, Button, SaveStatus, EmptyState } from '@/components/admin/ui';
import { Markdown } from '@/components/Markdown';

type SaveState = 'idle' | 'saving' | 'saved' | 'error';

const CATEGORY_OPTIONS = [
  { value: 'estimating', label: 'Estimating' },
  { value: 'disputes', label: 'Disputes' },
  { value: 'structural-review', label: 'Structural Review' },
  { value: 'field-ops', label: 'Field Ops' },
];

export function AdminBlogPage() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [editing, setEditing] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState(true);
  const [save, setSave] = useState<SaveState>('idle');
  const [showPreview, setShowPreview] = useState(false);
  const [autosaveTimer, setAutosaveTimer] = useState<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    (async () => {
      const p = await fetchBlogPosts();
      setPosts(p);
      setLoading(false);
    })();
  }, []);

  const addPost = async () => {
    const slug = `new-post-${Date.now()}`;
    const { data, error } = await supabase
      .from('blog_posts')
      .insert({
        slug, title: 'New Post', excerpt: '', body: '', category: 'field-ops',
        cover_image: null, published_at: null, status: 'draft',
      })
      .select('*')
      .maybeSingle();
    if (error) return;
    if (data) {
      const newPost = data as BlogPost;
      setPosts((prev) => [newPost, ...prev]);
      setEditing(newPost);
    }
  };

  const removePost = async (id: string) => {
    if (!confirm('Delete this post? This cannot be undone.')) return;
    await supabase.from('blog_posts').delete().eq('id', id);
    setPosts((prev) => prev.filter((p) => p.id !== id));
    if (editing?.id === id) setEditing(null);
  };

  const update = (patch: Partial<BlogPost>) => {
    setEditing((prev) => (prev ? { ...prev, ...patch } : prev));
    setSave('idle');
  };

  const savePost = useCallback(async (post: BlogPost | null) => {
    if (!post) return;
    setSave('saving');
    const { error } = await supabase.from('blog_posts').update({
      slug: post.slug, title: post.title, excerpt: post.excerpt, body: post.body,
      category: post.category, cover_image: post.cover_image, published_at: post.published_at,
      status: post.status, updated_at: new Date().toISOString(),
    }).eq('id', post.id);
    setSave(error ? 'error' : 'saved');
    if (!error) {
      setPosts((prev) => prev.map((p) => p.id === post.id ? post : p));
      setTimeout(() => setSave('idle'), 2000);
    }
  }, []);

  // Autosave on body/title changes (debounced 2.5s)
  useEffect(() => {
    if (!editing) return;
    if (autosaveTimer) clearTimeout(autosaveTimer);
    const t = setTimeout(() => {
      savePost(editing);
    }, 2500);
    setAutosaveTimer(t);
    return () => clearTimeout(t);
  }, [editing?.body, editing?.title, editing?.excerpt]); // eslint-disable-line react-hooks/exhaustive-deps

  const onUploadCover = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !editing) return;
    const url = await uploadImage(file, 'blog');
    if (url) update({ cover_image: url });
  };

  if (loading) return <div className="text-sm text-steel-400">Loading...</div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-800 text-white">Blog Manager</h1>
          <p className="mt-1 text-sm text-steel-400">Write and manage articles. Drafts autosave.</p>
        </div>
        <Button onClick={addPost} icon={<Plus className="h-4 w-4" />}>New post</Button>
      </div>

      {posts.length === 0 && !editing ? (
        <EmptyState message="No posts yet. Write one to get started." />
      ) : (
        <div className="grid gap-6 lg:grid-cols-3">
          {/* List */}
          <div className="space-y-2 lg:col-span-1">
            {posts.map((p) => (
              <button
                key={p.id}
                onClick={() => setEditing(p)}
                className={`flex w-full flex-col gap-1 rounded-lg border p-3 text-left transition-colors ${
                  editing?.id === p.id
                    ? 'border-emerald2-600 bg-emerald2-900/15'
                    : 'border-steel-800 bg-steel-950 hover:border-steel-600'
                }`}
              >
                <div className="flex items-center gap-2">
                  <span className={`rounded px-1.5 py-0.5 text-xs font-600 ${
                    p.status === 'published' ? 'bg-emerald2-900/40 text-emerald2-300' : 'bg-steel-800 text-steel-400'
                  }`}>{p.status}</span>
                  <span className="truncate text-sm font-600 text-white">{p.title}</span>
                </div>
                <p className="text-xs text-steel-500">{p.category} · {p.published_at ?? 'No date'}</p>
              </button>
            ))}
          </div>

          {/* Editor */}
          <div className="lg:col-span-2">
            {editing ? (
              <AdminPanel
                title={editing.title || 'Edit post'}
                actions={
                  <div className="flex items-center gap-2">
                    <SaveStatus status={save} />
                    <Button onClick={() => setShowPreview((v) => !v)} variant="secondary" icon={showPreview ? <FileEdit className="h-4 w-4" /> : <Eye className="h-4 w-4" />}>
                      {showPreview ? 'Edit' : 'Preview'}
                    </Button>
                    <Button onClick={() => savePost(editing)} icon={<Save className="h-4 w-4" />}>Save</Button>
                  </div>
                }
              >
                {showPreview ? (
                  <article className="max-w-none">
                    <h2 className="mb-4 font-display text-xl font-700 text-white">{editing.title}</h2>
                    {editing.cover_image && <img src={editing.cover_image} alt="" className="mb-4 rounded-lg" />}
                    <Markdown source={editing.body} />
                  </article>
                ) : (
                  <div className="space-y-5">
                    <div className="grid gap-3 sm:grid-cols-2">
                      <TextField label="Title" value={editing.title} onChange={(v) => update({ title: v })} />
                      <TextField label="Slug" value={editing.slug} onChange={(v) => update({ slug: slugify(v) })} />
                    </div>
                    <SelectField label="Category" value={editing.category} onChange={(v) => update({ category: v })} options={CATEGORY_OPTIONS} />
                    <TextArea label="Excerpt" value={editing.excerpt} onChange={(v) => update({ excerpt: v })} rows={2} />
                    <TextArea label="Body (markdown)" value={editing.body} onChange={(v) => update({ body: v })} rows={14} placeholder="Write in markdown..." />

                    {/* Cover image */}
                    <div>
                      <span className="mb-2 block text-xs font-600 uppercase tracking-wider text-steel-400">Cover image</span>
                      {editing.cover_image ? (
                        <div className="relative inline-block">
                          <img src={editing.cover_image} alt="" className="h-32 rounded-lg object-cover" />
                          <button
                            onClick={() => update({ cover_image: null })}
                            className="absolute right-1 top-1 rounded-full bg-steel-990/80 p-1 text-white"
                          >
                            <X className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      ) : (
                        <label className="inline-flex cursor-pointer items-center gap-2 rounded-lg border border-dashed border-steel-700 px-4 py-2.5 text-sm text-steel-400 hover:border-emerald2-600 hover:text-emerald2-400">
                          <ImagePlus className="h-4 w-4" />
                          Upload cover
                          <input type="file" accept="image/*" onChange={onUploadCover} className="hidden" />
                        </label>
                      )}
                    </div>

                    <div className="grid gap-3 sm:grid-cols-2">
                      <TextField label="Publish date" type="date" value={editing.published_at ?? ''} onChange={(v) => update({ published_at: v || null })} />
                      <SelectField
                        label="Status"
                        value={editing.status}
                        onChange={(v) => update({ status: v as BlogStatus })}
                        options={[{ value: 'draft', label: 'Draft' }, { value: 'published', label: 'Published' }]}
                      />
                    </div>

                    <div className="flex justify-end border-t border-steel-800 pt-4">
                      <Button onClick={() => removePost(editing.id)} variant="danger" icon={<Trash2 className="h-4 w-4" />}>Delete post</Button>
                    </div>
                  </div>
                )}
              </AdminPanel>
            ) : (
              <EmptyState message="Select a post to edit, or write a new one." />
            )}
          </div>
        </div>
      )}
    </div>
  );
}
