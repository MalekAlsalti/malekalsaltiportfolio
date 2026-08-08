// Minimal, safe markdown renderer for blog posts.
// Supports: h2, h3, paragraphs, ul/ol, blockquote, code fences (```spec),
// inline code, tables, bold (**), links [text](url), images ![alt](url).
// Renders to React elements (no dangerouslySetInnerHTML).
import { Fragment, type ReactNode } from 'react';

interface Block {
  type: 'h2' | 'h3' | 'p' | 'ul' | 'ol' | 'quote' | 'spec' | 'table' | 'img';
  content?: string;
  items?: string[];
  rows?: string[][];
  src?: string;
  alt?: string;
}

const TABLE_SEP = /^\s*\|?[-:\s|]+\|?\s*$/;

function splitBlocks(md: string): Block[] {
  const lines = md.replace(/\r\n/g, '\n').split('\n');
  const blocks: Block[] = [];
  let i = 0;
  while (i < lines.length) {
    const line = lines[i];
    if (line.trim() === '') {
      i++;
      continue;
    }
    // fenced code
    if (line.trim().startsWith('```')) {
      const spec: string[] = [];
      i++;
      while (i < lines.length && !lines[i].trim().startsWith('```')) {
        spec.push(lines[i]);
        i++;
      }
      i++;
      blocks.push({ type: 'spec', content: spec.join('\n') });
      continue;
    }
    // blockquote
    if (line.trim().startsWith('> ')) {
      const quote: string[] = [];
      while (i < lines.length && lines[i].trim().startsWith('> ')) {
        quote.push(lines[i].trim().slice(2));
        i++;
      }
      blocks.push({ type: 'quote', content: quote.join('\n') });
      continue;
    }
    // headings
    if (line.startsWith('### ')) {
      blocks.push({ type: 'h3', content: line.slice(4).trim() });
      i++;
      continue;
    }
    if (line.startsWith('## ')) {
      blocks.push({ type: 'h2', content: line.slice(3).trim() });
      i++;
      continue;
    }
    // image
    const imgMatch = line.match(/^!\[([^\]]*)\]\(([^)]+)\)\s*$/);
    if (imgMatch) {
      blocks.push({ type: 'img', alt: imgMatch[1], src: imgMatch[2] });
      i++;
      continue;
    }
    // table
    if (
      line.includes('|') &&
      i + 1 < lines.length &&
      TABLE_SEP.test(lines[i + 1]) &&
      lines[i + 1].includes('-')
    ) {
      const header = splitTableRow(line);
      i += 2;
      const rows: string[][] = [];
      while (i < lines.length && lines[i].includes('|') && lines[i].trim() !== '') {
        rows.push(splitTableRow(lines[i]));
        i++;
      }
      blocks.push({ type: 'table', rows: [header, ...rows] });
      continue;
    }
    // unordered list
    if (line.match(/^\s*[-*]\s+/)) {
      const items: string[] = [];
      while (i < lines.length && lines[i].match(/^\s*[-*]\s+/)) {
        items.push(lines[i].replace(/^\s*[-*]\s+/, '').trim());
        i++;
      }
      blocks.push({ type: 'ul', items });
      continue;
    }
    // ordered list
    if (line.match(/^\s*\d+\.\s+/)) {
      const items: string[] = [];
      while (i < lines.length && lines[i].match(/^\s*\d+\.\s+/)) {
        items.push(lines[i].replace(/^\s*\d+\.\s+/, '').trim());
        i++;
      }
      blocks.push({ type: 'ol', items });
      continue;
    }
    // paragraph
    const para: string[] = [];
    while (
      i < lines.length &&
      lines[i].trim() !== '' &&
      !lines[i].trim().startsWith('```') &&
      !lines[i].trim().startsWith('> ') &&
      !lines[i].startsWith('## ') &&
      !lines[i].startsWith('### ') &&
      !lines[i].match(/^\s*[-*]\s+/) &&
      !lines[i].match(/^\s*\d+\.\s+/) &&
      !lines[i].match(/^!\[([^\]]*)\]\(([^)]+)\)\s*$/)
    ) {
      para.push(lines[i]);
      i++;
    }
    blocks.push({ type: 'p', content: para.join(' ') });
  }
  return blocks;
}

function splitTableRow(line: string): string[] {
  return line
    .replace(/^\s*\|/, '')
    .replace(/\|\s*$/, '')
    .split('|')
    .map((c) => c.trim());
}

const INLINE_RE = /(\*\*([^*]+)\*\*)|(`([^`]+)`)|(\[([^\]]+)\]\(([^)]+)\))/g;

// Only allow URL schemes that cannot execute script. Anything else (javascript:,
// data:, vbscript:, ...) is dropped so authored content can never become a
// script-execution vector.
const SAFE_SCHEMES = ['http:', 'https:', 'mailto:', 'tel:'];

function safeUrl(raw: string | undefined): string | undefined {
  if (!raw) return undefined;
  const url = raw.trim();
  // Relative / same-page targets are safe.
  if (/^(\/|\.\/|\.\.\/|#|\?)/.test(url)) return url;
  try {
    const parsed = new URL(url, 'https://example.invalid');
    // A bare relative path resolves against the base; explicit schemes must be allow-listed.
    if (!/^[a-zA-Z][a-zA-Z0-9+.-]*:/.test(url)) return url;
    return SAFE_SCHEMES.includes(parsed.protocol) ? url : undefined;
  } catch {
    return undefined;
  }
}

// Inline parser: handles **bold**, `code`, [text](url), and plain text.
function renderInline(text: string, keyBase: string): ReactNode[] {
  const nodes: ReactNode[] = [];
  const regex = new RegExp(INLINE_RE.source, 'g');
  let lastIndex = 0;
  let match: RegExpExecArray | null;
  let k = 0;
  while ((match = regex.exec(text)) !== null) {
    if (match.index > lastIndex) {
      nodes.push(<Fragment key={`${keyBase}-t-${k}`}>{text.slice(lastIndex, match.index)}</Fragment>);
    }
    if (match[1]) {
      nodes.push(<strong key={`${keyBase}-b-${k}`}>{match[2]}</strong>);
    } else if (match[3]) {
      nodes.push(<code key={`${keyBase}-c-${k}`}>{match[4]}</code>);
    } else if (match[5]) {
      const href = safeUrl(match[7]);
      nodes.push(
        href ? (
          <a key={`${keyBase}-l-${k}`} href={href} target="_blank" rel="noopener noreferrer">
            {match[6]}
          </a>
        ) : (
          <Fragment key={`${keyBase}-l-${k}`}>{match[6]}</Fragment>
        )
      );
    }
    lastIndex = regex.lastIndex;
    k++;
  }
  if (lastIndex < text.length) {
    nodes.push(<Fragment key={`${keyBase}-t-end`}>{text.slice(lastIndex)}</Fragment>);
  }
  return nodes;
}

const SPEC_KEY_RE = /^(\s*[A-Za-z_][\w\s/().+\-]*?):\s*(.*)$/;

function renderSpec(content: string): ReactNode {
  const lines = content.split('\n');
  return (
    <pre className="spec-callout">
      {lines.map((line, idx) => {
        const m = line.match(SPEC_KEY_RE);
        if (m) {
          return (
            <div key={idx}>
              <span className="tok-k">{m[1]}</span>
              {': '}
              {m[2]}
            </div>
          );
        }
        return <div key={idx}>{line}</div>;
      })}
    </pre>
  );
}

export function Markdown({ source }: { source: string }) {
  const blocks = splitBlocks(source);
  return (
    <div className="prose-article">
      {blocks.map((b, idx) => {
        const key = `b-${idx}`;
        switch (b.type) {
          case 'h2':
            return <h2 key={key}>{renderInline(b.content ?? '', key)}</h2>;
          case 'h3':
            return <h3 key={key}>{renderInline(b.content ?? '', key)}</h3>;
          case 'p':
            return <p key={key}>{renderInline(b.content ?? '', key)}</p>;
          case 'ul':
            return (
              <ul key={key}>
                {b.items?.map((it, j) => (
                  <li key={`${key}-li-${j}`}>{renderInline(it, `${key}-${j}`)}</li>
                ))}
              </ul>
            );
          case 'ol':
            return (
              <ol key={key}>
                {b.items?.map((it, j) => (
                  <li key={`${key}-li-${j}`}>{renderInline(it, `${key}-${j}`)}</li>
                ))}
              </ol>
            );
          case 'quote':
            return (
              <blockquote key={key}>
                <p>{renderInline(b.content ?? '', key)}</p>
              </blockquote>
            );
          case 'spec':
            return <Fragment key={key}>{renderSpec(b.content ?? '')}</Fragment>;
          case 'img': {
            const src = safeUrl(b.src);
            if (!src) return null;
            return <img key={key} src={src} alt={b.alt ?? ''} loading="lazy" />;
          }
          case 'table':
            return (
              <div key={key} className="overflow-x-auto">
                <table>
                  <thead>
                    <tr>
                      {b.rows?.[0].map((c, j) => (
                        <th key={`th-${j}`}>{renderInline(c, `${key}-th-${j}`)}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {b.rows?.slice(1).map((row, ri) => (
                      <tr key={`tr-${ri}`}>
                        {row.map((c, ci) => (
                          <td key={`td-${ri}-${ci}`}>{renderInline(c, `${key}-td-${ri}-${ci}`)}</td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            );
          default:
            return null;
        }
      })}
    </div>
  );
}
