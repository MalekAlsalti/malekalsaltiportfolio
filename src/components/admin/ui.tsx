// Shared admin UI primitives — form fields, buttons, panels, list items.
import type { ReactNode } from 'react';
import { Loader2 } from 'lucide-react';

export function AdminPanel({ title, children, actions }: { title: string; children: ReactNode; actions?: ReactNode }) {
  return (
    <div className="rounded-xl border border-steel-800 bg-steel-950 p-5 sm:p-6">
      <div className="mb-5 flex items-center justify-between gap-4">
        <h2 className="font-display text-lg font-700 text-white">{title}</h2>
        {actions}
      </div>
      {children}
    </div>
  );
}

interface TextFieldProps {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  type?: string;
  disabled?: boolean;
}

export function TextField({ label, value, onChange, placeholder, type = 'text', disabled }: TextFieldProps) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-xs font-600 uppercase tracking-wider text-steel-400">{label}</span>
      <input
        type={type}
        value={value}
        disabled={disabled}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className={inputClass}
      />
    </label>
  );
}

interface TextAreaProps {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  rows?: number;
}

export function TextArea({ label, value, onChange, placeholder, rows = 4 }: TextAreaProps) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-xs font-600 uppercase tracking-wider text-steel-400">{label}</span>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        rows={rows}
        className={`${inputClass} resize-y font-mono text-sm`}
      />
    </label>
  );
}

interface SelectFieldProps {
  label: string;
  value: string;
  onChange: (v: string) => void;
  options: { value: string; label: string }[];
}

export function SelectField({ label, value, onChange, options }: SelectFieldProps) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-xs font-600 uppercase tracking-wider text-steel-400">{label}</span>
      <select value={value} onChange={(e) => onChange(e.target.value)} className={inputClass}>
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
    </label>
  );
}

interface CheckboxFieldProps {
  label: string;
  checked: boolean;
  onChange: (v: boolean) => void;
}

export function CheckboxField({ label, checked, onChange }: CheckboxFieldProps) {
  return (
    <label className="flex cursor-pointer items-center gap-2.5">
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        className="h-4 w-4 rounded border-steel-600 bg-steel-800 text-emerald2-500 focus:ring-emerald2-500/40"
      />
      <span className="text-sm text-steel-200">{label}</span>
    </label>
  );
}

export function StringListEditor({
  label,
  values,
  onChange,
  placeholder,
}: {
  label: string;
  values: string[];
  onChange: (v: string[]) => void;
  placeholder?: string;
}) {
  const update = (i: number, v: string) => {
    const next = [...values];
    next[i] = v;
    onChange(next);
  };
  const add = () => onChange([...values, '']);
  const remove = (i: number) => onChange(values.filter((_, idx) => idx !== i));

  return (
    <div>
      <span className="mb-1.5 block text-xs font-600 uppercase tracking-wider text-steel-400">{label}</span>
      <div className="space-y-2">
        {values.map((v, i) => (
          <div key={i} className="flex gap-2">
            <input
              value={v}
              onChange={(e) => update(i, e.target.value)}
              placeholder={placeholder}
              className={inputClass}
            />
            <button
              type="button"
              onClick={() => remove(i)}
              className="shrink-0 rounded-lg border border-steel-700 px-3 text-sm text-steel-400 transition-colors hover:border-danger-600 hover:text-danger-300"
              aria-label="Remove"
            >
              Remove
            </button>
          </div>
        ))}
        <button
          type="button"
          onClick={add}
          className="text-sm font-600 text-emerald2-400 transition-colors hover:text-emerald2-300"
        >
          + Add item
        </button>
      </div>
    </div>
  );
}

interface ButtonProps {
  children: ReactNode;
  onClick?: () => void;
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost';
  type?: 'button' | 'submit';
  disabled?: boolean;
  loading?: boolean;
  icon?: ReactNode;
}

export function Button({
  children,
  onClick,
  variant = 'primary',
  type = 'button',
  disabled,
  loading,
  icon,
}: ButtonProps) {
  const base =
    'inline-flex items-center justify-center gap-2 rounded-lg px-4 py-2.5 text-sm font-600 transition-all disabled:cursor-not-allowed disabled:opacity-50';
  const styles = {
    primary: 'bg-emerald2-600 text-steel-990 hover:bg-emerald2-500',
    secondary: 'border border-steel-700 bg-steel-900 text-steel-200 hover:border-steel-500 hover:text-white',
    danger: 'border border-danger-700 bg-danger-900/30 text-danger-300 hover:bg-danger-900/50',
    ghost: 'text-steel-400 hover:text-white',
  };
  return (
    <button type={type} onClick={onClick} disabled={disabled || loading} className={`${base} ${styles[variant]}`}>
      {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : icon}
      {children}
    </button>
  );
}

export const inputClass =
  'w-full rounded-lg border border-steel-700 bg-steel-900 px-3.5 py-2.5 text-sm text-white placeholder:text-steel-500 transition-colors focus:border-emerald2-500 focus:outline-none focus:ring-2 focus:ring-emerald2-500/30';

export function SaveStatus({ status }: { status: 'idle' | 'saving' | 'saved' | 'error' }) {
  if (status === 'idle') return null;
  const map = {
    saving: { text: 'Saving...', class: 'text-steel-400' },
    saved: { text: 'Saved', class: 'text-emerald2-400' },
    error: { text: 'Save failed', class: 'text-danger-400' },
  };
  const { text, class: cls } = map[status];
  return <span className={`text-xs font-600 ${cls}`}>{text}</span>;
}

export function EmptyState({ message }: { message: string }) {
  return (
    <div className="rounded-lg border border-dashed border-steel-700 bg-steel-900/40 p-8 text-center text-sm text-steel-500">
      {message}
    </div>
  );
}
