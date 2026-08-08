import { useState, useEffect } from 'react';
import { ArrowLeft, Clock, Calendar, Tag, ChevronRight } from 'lucide-react';
import {
  fetchPublishedPosts,
  fetchPostBySlug,
  type BlogPost,
  estimateReadTime,
  formatDate,
} from '@/lib/content';
import { categoryMeta, type BlogCategory } from '@/blog';
import { PageHeader, Breadcrumbs } from '@/components/ui';
import { Markdown } from '@/components/Markdown';
import { useRouter } from '@/router';

export function BlogPage() {
  const { navigate } = useRouter();
  const [filter, setFilter] = useState<'all' | BlogCategory>('all');
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const p = await fetchPublishedPosts();
      setPosts(p);
      setLoading(false);
    })();
  }, []);

  const visible = filter === 'all' ? posts : posts.filter((p) => p.category === filter);

  if (loading) return <div className="flex min-h-[60vh] items-center justify-center text-sm text-steel-400">Loading...</div>;

  return (
    <div>
      <PageHeader
        eyebrow="Field notes"
        title="Blog"
        description="Notes from the field and the trailer — estimating, disputes, structural review, and field ops. Written for crews and GCs who need the short version."
      />

      <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6 sm:py-14 lg:px-8">
        {/* Category filters */}
        <div className="flex flex-wrap gap-2">
          <FilterChip label="All" active={filter === 'all'} onClick={() => setFilter('all')} count={posts.length} />
          {(['estimating', 'disputes', 'structural-review', 'field-ops'] as BlogCategory[]).map((cat) => {
            const count = posts.filter((p) => p.category === cat).length;
            if (count === 0) return null;
            return (
              <FilterChip
                key={cat}
                label={categoryMeta(cat).label}
                active={filter === cat}
                onClick={() => setFilter(cat)}
                count={count}
              />
            );
          })}
        </div>

        {/* List */}
        {visible.length === 0 ? (
          <p className="py-12 text-center text-sm text-steel-500">No articles in this category yet.</p>
        ) : (
          <div className="mt-8 divide-y divide-steel-800 border-y border-steel-800">
            {visible.map((post) => {
              const cat = categoryMeta(post.category as BlogCategory);
              const Icon = cat.icon;
              return (
                <button
                  key={post.id}
                  onClick={() => navigate({ name: 'post', slug: post.slug })}
                  className="group flex w-full flex-col gap-3 py-6 text-left transition-colors hover:bg-steel-950/60 sm:flex-row sm:items-center sm:justify-between sm:gap-6 sm:px-2"
                >
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2 text-xs font-500 text-steel-400">
                      <span className="inline-flex items-center gap-1.5 rounded-md bg-emerald2-900/30 px-2 py-1 text-emerald2-300 ring-1 ring-emerald2-800/40">
                        <Icon className="h-3.5 w-3.5" />{cat.label}
                      </span>
                      <span className="inline-flex items-center gap-1">
                        <Calendar className="h-3.5 w-3.5" />{post.published_at ? formatDate(post.published_at) : ''}
                      </span>
                      <span className="inline-flex items-center gap-1">
                        <Clock className="h-3.5 w-3.5" />{estimateReadTime(post.body)}
                      </span>
                    </div>
                    <h2 className="mt-2.5 font-display text-lg font-700 leading-snug text-white transition-colors group-hover:text-emerald2-300 sm:text-xl">
                      {post.title}
                    </h2>
                    <p className="mt-1.5 line-clamp-2 text-sm leading-relaxed text-steel-400">{post.excerpt}</p>
                  </div>
                  <span className="inline-flex shrink-0 items-center gap-1 self-start text-sm font-600 text-emerald2-400 sm:self-center">
                    Read
                    <ChevronRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                  </span>
                </button>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

export function PostPage({ slug }: { slug: string }) {
  const { navigate } = useRouter();
  const [post, setPost] = useState<BlogPost | null>(null);
  const [allPosts, setAllPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const [p, all] = await Promise.all([
        fetchPostBySlug(slug),
        fetchPublishedPosts(),
      ]);
      setPost(p);
      setAllPosts(all);
      setLoading(false);
    })();
  }, [slug]);

  if (loading) return <div className="flex min-h-[60vh] items-center justify-center text-sm text-steel-400">Loading...</div>;

  if (!post || post.status !== 'published') {
    return (
      <div className="mx-auto max-w-2xl px-4 py-24 text-center sm:px-6">
        <p className="text-xs font-600 uppercase tracking-widest text-emerald2-400">Not found</p>
        <h1 className="mt-2 font-display text-2xl font-800 text-white">Article not found</h1>
        <p className="mt-3 text-sm text-steel-400">That article may have moved or been removed.</p>
        <button
          onClick={() => navigate({ name: 'blog' })}
          className="mt-6 inline-flex items-center gap-1.5 rounded-lg bg-emerald2-600 px-4 py-2.5 text-sm font-600 text-steel-990 transition-colors hover:bg-emerald2-500"
        >
          <ArrowLeft className="h-4 w-4" /> Back to blog
        </button>
      </div>
    );
  }

  const cat = categoryMeta(post.category as BlogCategory);
  const others = allPosts.filter((p) => p.slug !== post.slug);
  const next = others.find((p) => p.category === post.category) ?? others[0];

  return (
    <div>
      <div className="border-b border-steel-800 bg-steel-950">
        <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6 sm:py-14 lg:px-8">
          <Breadcrumbs items={[{ label: 'Blog', route: { name: 'blog' } }, { label: post.title }]} />
          <div className="mt-5 flex flex-wrap items-center gap-2 text-xs font-500 text-steel-400">
            <span className="inline-flex items-center gap-1.5 rounded-md bg-emerald2-900/30 px-2 py-1 text-emerald2-300 ring-1 ring-emerald2-800/40">
              <Tag className="h-3.5 w-3.5" />{cat.label}
            </span>
            <span className="inline-flex items-center gap-1">
              <Calendar className="h-3.5 w-3.5" />{post.published_at ? formatDate(post.published_at) : ''}
            </span>
            <span className="inline-flex items-center gap-1">
              <Clock className="h-3.5 w-3.5" />{estimateReadTime(post.body)}
            </span>
          </div>
          <h1 className="mt-4 font-display text-3xl font-800 leading-tight tracking-tight text-white sm:text-4xl">
            {post.title}
          </h1>
          <p className="mt-4 text-base leading-relaxed text-steel-300 sm:text-lg">{post.excerpt}</p>
        </div>
      </div>

      <article className="mx-auto max-w-3xl px-4 py-10 sm:px-6 sm:py-14 lg:px-8">
        {post.cover_image && (
          <img src={post.cover_image} alt={post.title} className="mb-8 rounded-xl" />
        )}
        <Markdown source={post.body} />

        <div className="mt-12 flex flex-col gap-4 border-t border-steel-800 pt-6 sm:flex-row sm:items-center sm:justify-between">
          <button
            onClick={() => navigate({ name: 'blog' })}
            className="inline-flex items-center gap-1.5 text-sm font-600 text-steel-400 transition-colors hover:text-emerald2-400"
          >
            <ArrowLeft className="h-4 w-4" /> All articles
          </button>
          {next && (
            <button
              onClick={() => navigate({ name: 'post', slug: next.slug })}
              className="group inline-flex items-center gap-2 text-right"
            >
              <span>
                <span className="block text-xs font-500 uppercase tracking-wider text-steel-500">Next</span>
                <span className="block text-sm font-600 text-steel-100 transition-colors group-hover:text-emerald2-300">{next.title}</span>
              </span>
              <ChevronRight className="h-5 w-5 text-emerald2-500 transition-transform group-hover:translate-x-0.5" />
            </button>
          )}
        </div>
      </article>
    </div>
  );
}

function FilterChip({ label, active, onClick, count }: { label: string; active: boolean; onClick: () => void; count: number }) {
  return (
    <button
      onClick={onClick}
      className={`inline-flex items-center gap-1.5 rounded-full border px-3.5 py-1.5 text-sm font-500 transition-colors ${
        active
          ? 'border-emerald2-600 bg-emerald2-600 text-steel-990'
          : 'border-steel-700 bg-steel-950 text-steel-300 hover:border-steel-500 hover:text-white'
      }`}
    >
      {label}
      <span className={`rounded-full px-1.5 text-xs ${active ? 'bg-steel-990/30 text-steel-990' : 'bg-steel-800 text-steel-400'}`}>{count}</span>
    </button>
  );
}
