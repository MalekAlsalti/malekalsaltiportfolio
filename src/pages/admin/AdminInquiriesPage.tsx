import { useEffect, useState } from 'react';
import { Trash2, Mail, Building2, Calendar, Inbox } from 'lucide-react';
import { fetchContactMessages, deleteContactMessage, updateContactMessageStatus, type ContactMessage } from '@/lib/content';
import { Button, EmptyState } from '@/components/admin/ui';
import { formatDate } from '@/lib/content';

export function AdminInquiriesPage() {
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<ContactMessage | null>(null);

  useEffect(() => {
    (async () => {
      const m = await fetchContactMessages();
      setMessages(m);
      setLoading(false);
    })();
  }, []);

  const refresh = async () => {
    const m = await fetchContactMessages();
    setMessages(m);
  };

  const setStatus = async (id: string, status: string) => {
    await updateContactMessageStatus(id, status);
    await refresh();
    setSelected((prev) => (prev && prev.id === id ? { ...prev, status } : prev));
  };

  const remove = async (id: string) => {
    if (!confirm('Delete this inquiry?')) return;
    await deleteContactMessage(id);
    if (selected?.id === id) setSelected(null);
    await refresh();
  };

  if (loading) return <div className="text-sm text-steel-400">Loading...</div>;

  const newCount = messages.filter((m) => m.status === 'new').length;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-800 text-white">Inquiries</h1>
        <p className="mt-1 text-sm text-steel-400">
          Contact form submissions. {newCount > 0 && <span className="text-emerald2-400">{newCount} new</span>}
        </p>
      </div>

      {messages.length === 0 ? (
        <EmptyState message="No inquiries yet." />
      ) : (
        <div className="grid gap-6 lg:grid-cols-3">
          {/* List */}
          <div className="space-y-2 lg:col-span-1">
            {messages.map((m) => (
              <button
                key={m.id}
                onClick={() => {
                  setSelected(m);
                  if (m.status === 'new') setStatus(m.id, 'read');
                }}
                className={`flex w-full flex-col gap-1 rounded-lg border p-3 text-left transition-colors ${
                  selected?.id === m.id
                    ? 'border-emerald2-600 bg-emerald2-900/15'
                    : 'border-steel-800 bg-steel-950 hover:border-steel-600'
                }`}
              >
                <div className="flex items-center justify-between gap-2">
                  <span className={`truncate text-sm font-600 ${m.status === 'new' ? 'text-white' : 'text-steel-300'}`}>{m.name}</span>
                  <span className={`shrink-0 rounded px-1.5 py-0.5 text-xs ${
                    m.status === 'new' ? 'bg-emerald2-600 text-steel-990' :
                    m.status === 'read' ? 'bg-steel-700 text-steel-300' :
                    'bg-steel-800 text-steel-400'
                  }`}>{m.status}</span>
                </div>
                <p className="truncate text-xs text-steel-400">{m.inquiry_type}</p>
                <p className="text-xs text-steel-500">{formatDate(m.created_at)}</p>
              </button>
            ))}
          </div>

          {/* Detail */}
          <div className="lg:col-span-2">
            {selected ? (
              <div className="rounded-xl border border-steel-800 bg-steel-950 p-6">
                <div className="flex items-start justify-between">
                  <div>
                    <h2 className="font-display text-lg font-700 text-white">{selected.name}</h2>
                    <a href={`mailto:${selected.email}`} className="inline-flex items-center gap-1.5 text-sm text-emerald2-400 hover:text-emerald2-300">
                      <Mail className="h-3.5 w-3.5" /> {selected.email}
                    </a>
                  </div>
                  <div className="flex items-center gap-2">
                    <select
                      value={selected.status}
                      onChange={(e) => setStatus(selected.id, e.target.value)}
                      className="rounded-lg border border-steel-700 bg-steel-900 px-3 py-2 text-sm text-white focus:border-emerald2-500 focus:outline-none"
                    >
                      <option value="new">New</option>
                      <option value="read">Read</option>
                      <option value="handled">Handled</option>
                    </select>
                    <Button onClick={() => remove(selected.id)} variant="danger" icon={<Trash2 className="h-4 w-4" />}>Delete</Button>
                  </div>
                </div>

                <div className="mt-4 grid gap-3 sm:grid-cols-3">
                  <Detail icon={Inbox} label="Inquiry type" value={selected.inquiry_type} />
                  <Detail icon={Building2} label="Company" value={selected.company || '—'} />
                  <Detail icon={Calendar} label="Received" value={formatDate(selected.created_at)} />
                </div>

                <div className="mt-5">
                  <p className="mb-2 text-xs font-600 uppercase tracking-wider text-steel-400">Project type</p>
                  <p className="text-sm text-steel-200">{selected.project_type || '—'}</p>
                </div>

                <div className="mt-5">
                  <p className="mb-2 text-xs font-600 uppercase tracking-wider text-steel-400">Message</p>
                  <div className="rounded-lg border border-steel-800 bg-steel-900/50 p-4 text-sm leading-relaxed text-steel-200 whitespace-pre-wrap">
                    {selected.message}
                  </div>
                </div>

                <div className="mt-5 flex justify-end">
                  <a
                    href={`mailto:${selected.email}?subject=Re: Your inquiry`}
                    className="inline-flex items-center gap-2 rounded-lg bg-emerald2-600 px-4 py-2.5 text-sm font-600 text-steel-990 hover:bg-emerald2-500"
                  >
                    <Mail className="h-4 w-4" /> Reply by email
                  </a>
                </div>
              </div>
            ) : (
              <EmptyState message="Select an inquiry to read it." />
            )}
          </div>
        </div>
      )}
    </div>
  );
}

function Detail({ icon: Icon, label, value }: { icon: typeof Mail; label: string; value: string }) {
  return (
    <div className="rounded-lg border border-steel-800 bg-steel-900/50 p-3">
      <p className="flex items-center gap-1.5 text-xs font-600 uppercase tracking-wider text-steel-500">
        <Icon className="h-3.5 w-3.5" /> {label}
      </p>
      <p className="mt-1 text-sm font-500 text-steel-100">{value}</p>
    </div>
  );
}
