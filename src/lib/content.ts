// Typed content types + data-access helpers backed by Supabase.
// The public site reads via these; the admin panel reads/writes via these too.
import { supabase } from '@/lib/supabase';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface SiteSettings {
  id: number;
  hero_name: string;
  hero_title: string;
  hero_intro: string;
  duty_summary: string;
  availability_badge: string;
  availability_enabled: boolean;
  contact_email: string;
  contact_phone: string;
  linkedin_url: string;
  location: string;
  resume_pdf_url: string;
  updated_at: string;
}

export interface WorkHistoryItem {
  id: string;
  role: string;
  company: string;
  period: string;
  location: string;
  highlights: string[];
  sort_order: number;
  created_at: string;
}

export interface Credential {
  id: string;
  label: string;
  detail: string;
  icon_key: string;
  sort_order: number;
  created_at: string;
}

export interface SkillGroup {
  id: string;
  label: string;
  icon_key: string;
  sort_order: number;
  created_at: string;
  skills?: Skill[];
}

export interface Skill {
  id: string;
  group_id: string;
  label: string;
  sort_order: number;
  created_at: string;
}

export type ProjectType = 'commercial' | 'industrial' | 'residential' | 'infrastructure';

export interface Project {
  id: string;
  slug: string;
  name: string;
  role: string;
  type: ProjectType;
  scope: string;
  timeframe: string;
  location: string;
  value: string | null;
  photos: string[];
  technical_scope: string[];
  challenges: string[];
  systems: string[];
  outcome: string;
  featured: boolean;
  hidden: boolean;
  sort_order: number;
  created_at: string;
}

export type BlogStatus = 'draft' | 'published';

export interface BlogPost {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  body: string;
  category: string;
  cover_image: string | null;
  published_at: string | null;
  status: BlogStatus;
  created_at: string;
  updated_at: string;
}

export type InquiryType = 'Full-time opportunity' | 'Freelance/contract project' | 'General inquiry';

export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  company: string | null;
  project_type: string | null;
  inquiry_type: string;
  message: string;
  status: string;
  created_at: string;
}

// ---------------------------------------------------------------------------
// Public reads (anon)
// ---------------------------------------------------------------------------

export async function fetchSiteSettings(): Promise<SiteSettings | null> {
  const { data, error } = await supabase.from('site_settings').select('*').eq('id', 1).maybeSingle();
  if (error) {
    console.error('fetchSiteSettings:', error.message);
    return null;
  }
  return data as SiteSettings | null;
}

export async function fetchWorkHistory(): Promise<WorkHistoryItem[]> {
  const { data, error } = await supabase
    .from('work_history')
    .select('*')
    .order('sort_order', { ascending: true });
  if (error) {
    console.error('fetchWorkHistory:', error.message);
    return [];
  }
  return (data as WorkHistoryItem[]) ?? [];
}

export async function fetchCredentials(): Promise<Credential[]> {
  const { data, error } = await supabase
    .from('credentials')
    .select('*')
    .order('sort_order', { ascending: true });
  if (error) {
    console.error('fetchCredentials:', error.message);
    return [];
  }
  return (data as Credential[]) ?? [];
}

export async function fetchSkillGroups(): Promise<SkillGroup[]> {
  const { data, error } = await supabase
    .from('skill_groups')
    .select('*, skills(*)')
    .order('sort_order', { ascending: true });
  if (error) {
    console.error('fetchSkillGroups:', error.message);
    return [];
  }
  const groups = (data as SkillGroup[]) ?? [];
  // sort skills within each group
  groups.forEach((g) => g.skills?.sort((a, b) => a.sort_order - b.sort_order));
  return groups;
}

export async function fetchProjects(): Promise<Project[]> {
  const { data, error } = await supabase
    .from('projects')
    .select('*')
    .order('sort_order', { ascending: true });
  if (error) {
    console.error('fetchProjects:', error.message);
    return [];
  }
  return (data as Project[]) ?? [];
}

export async function fetchPublishedProjects(): Promise<Project[]> {
  const all = await fetchProjects();
  return all.filter((p) => !p.hidden);
}

export async function fetchProjectBySlug(slug: string): Promise<Project | null> {
  const { data, error } = await supabase
    .from('projects')
    .select('*')
    .eq('slug', slug)
    .maybeSingle();
  if (error) {
    console.error('fetchProjectBySlug:', error.message);
    return null;
  }
  return (data as Project) ?? null;
}

export async function fetchBlogPosts(): Promise<BlogPost[]> {
  const { data, error } = await supabase
    .from('blog_posts')
    .select('*')
    .order('published_at', { ascending: false, nullsFirst: false });
  if (error) {
    console.error('fetchBlogPosts:', error.message);
    return [];
  }
  return (data as BlogPost[]) ?? [];
}

export async function fetchPublishedPosts(): Promise<BlogPost[]> {
  const all = await fetchBlogPosts();
  return all.filter((p) => p.status === 'published');
}

export async function fetchPostBySlug(slug: string): Promise<BlogPost | null> {
  const { data, error } = await supabase
    .from('blog_posts')
    .select('*')
    .eq('slug', slug)
    .maybeSingle();
  if (error) {
    console.error('fetchPostBySlug:', error.message);
    return null;
  }
  return (data as BlogPost) ?? null;
}

export async function insertContactMessage(input: {
  name: string;
  email: string;
  company?: string | null;
  project_type?: string | null;
  inquiry_type: string;
  message: string;
}): Promise<boolean> {
  const { error } = await supabase.from('contact_messages').insert({
    name: input.name,
    email: input.email,
    company: input.company ?? null,
    project_type: input.project_type ?? null,
    inquiry_type: input.inquiry_type,
    message: input.message,
  });
  if (error) {
    console.error('insertContactMessage:', error.message);
    return false;
  }
  return true;
}

// ---------------------------------------------------------------------------
// Admin reads (authenticated)
// ---------------------------------------------------------------------------

export async function fetchContactMessages(): Promise<ContactMessage[]> {
  const { data, error } = await supabase
    .from('contact_messages')
    .select('*')
    .order('created_at', { ascending: false });
  if (error) {
    console.error('fetchContactMessages:', error.message);
    return [];
  }
  return (data as ContactMessage[]) ?? [];
}

export async function updateContactMessageStatus(id: string, status: string): Promise<boolean> {
  const { error } = await supabase.from('contact_messages').update({ status }).eq('id', id);
  if (error) {
    console.error('updateContactMessageStatus:', error.message);
    return false;
  }
  return true;
}

export async function deleteContactMessage(id: string): Promise<boolean> {
  const { error } = await supabase.from('contact_messages').delete().eq('id', id);
  if (error) {
    console.error('deleteContactMessage:', error.message);
    return false;
  }
  return true;
}

// ---------------------------------------------------------------------------
// Image upload (storage)
// ---------------------------------------------------------------------------

// Mirrors the bucket's server-side allow-list. The server enforces these limits too;
// this check only gives a faster, clearer failure in the admin UI.
const ALLOWED_IMAGE_TYPES = [
  'image/jpeg',
  'image/png',
  'image/webp',
  'image/gif',
  'image/svg+xml',
  'image/avif',
];
const MAX_UPLOAD_BYTES = 10 * 1024 * 1024;

export async function uploadImage(file: File, folder: string): Promise<string | null> {
  if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
    console.error('uploadImage: unsupported file type');
    return null;
  }
  if (file.size > MAX_UPLOAD_BYTES) {
    console.error('uploadImage: file too large');
    return null;
  }
  const ext = file.name.split('.').pop() ?? 'jpg';
  const path = `${folder}/${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;
  const { error } = await supabase.storage.from('portfolio-media').upload(path, file, {
    cacheControl: '3600',
    upsert: false,
  });
  if (error) {
    console.error('uploadImage:', error.message);
    return null;
  }
  const { data } = supabase.storage.from('portfolio-media').getPublicUrl(path);
  return data.publicUrl;
}

// ---------------------------------------------------------------------------
// Slugify + read-time helpers (kept here for shared use)
// ---------------------------------------------------------------------------

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');
}

export function estimateReadTime(markdown: string): string {
  const words = markdown.split(/\s+/).filter(Boolean).length;
  const minutes = Math.max(1, Math.round(words / 200));
  return `${minutes} min read`;
}

export function formatDate(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
}
