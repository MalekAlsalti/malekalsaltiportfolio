// Lightweight hash-router for a single-page portfolio + admin panel.
import { useEffect, useState } from 'react';

export type Route =
  | { name: 'home' }
  | { name: 'resume' }
  | { name: 'projects' }
  | { name: 'project'; slug: string }
  | { name: 'blog' }
  | { name: 'post'; slug: string }
  | { name: 'contact' }
  | { name: 'admin-login' }
  | { name: 'admin-dashboard' }
  | { name: 'admin-homepage' }
  | { name: 'admin-resume' }
  | { name: 'admin-skills' }
  | { name: 'admin-projects' }
  | { name: 'admin-blog' }
  | { name: 'admin-contact' }
  | { name: 'admin-inquiries' };

export function parseHash(hash: string): Route {
  const clean = hash.replace(/^#\/?/, '').trim();
  if (!clean) return { name: 'home' };
  const [head, ...rest] = clean.split('/');
  switch (head) {
    case 'resume':
      return { name: 'resume' };
    case 'projects':
      if (rest[0]) return { name: 'project', slug: decodeURIComponent(rest[0]) };
      return { name: 'projects' };
    case 'blog':
      if (rest[0]) return { name: 'post', slug: decodeURIComponent(rest[0]) };
      return { name: 'blog' };
    case 'contact':
      return { name: 'contact' };
    case 'admin':
      if (rest[0] === 'login') return { name: 'admin-login' };
      if (rest[0] === 'homepage') return { name: 'admin-homepage' };
      if (rest[0] === 'resume') return { name: 'admin-resume' };
      if (rest[0] === 'skills') return { name: 'admin-skills' };
      if (rest[0] === 'projects') return { name: 'admin-projects' };
      if (rest[0] === 'blog') return { name: 'admin-blog' };
      if (rest[0] === 'contact') return { name: 'admin-contact' };
      if (rest[0] === 'inquiries') return { name: 'admin-inquiries' };
      return { name: 'admin-dashboard' };
    default:
      return { name: 'home' };
  }
}

export function routeToHash(route: Route): string {
  switch (route.name) {
    case 'home':
      return '#/';
    case 'resume':
      return '#/resume';
    case 'projects':
      return '#/projects';
    case 'project':
      return `#/projects/${route.slug}`;
    case 'blog':
      return '#/blog';
    case 'post':
      return `#/blog/${route.slug}`;
    case 'contact':
      return '#/contact';
    case 'admin-login':
      return '#/admin/login';
    case 'admin-dashboard':
      return '#/admin';
    case 'admin-homepage':
      return '#/admin/homepage';
    case 'admin-resume':
      return '#/admin/resume';
    case 'admin-skills':
      return '#/admin/skills';
    case 'admin-projects':
      return '#/admin/projects';
    case 'admin-blog':
      return '#/admin/blog';
    case 'admin-contact':
      return '#/admin/contact';
    case 'admin-inquiries':
      return '#/admin/inquiries';
  }
}

export function useRouter() {
  const [route, setRoute] = useState<Route>(() => parseHash(window.location.hash));

  useEffect(() => {
    const onChange = () => {
      setRoute(parseHash(window.location.hash));
      window.scrollTo({ top: 0, behavior: 'instant' as ScrollBehavior });
    };
    window.addEventListener('hashchange', onChange);
    return () => window.removeEventListener('hashchange', onChange);
  }, []);

  const navigate = (r: Route) => {
    const hash = routeToHash(r);
    if (hash === window.location.hash) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      window.location.hash = hash;
    }
  };

  return { route, navigate };
}

export function useScrollLock(locked: boolean) {
  useEffect(() => {
    if (!locked) return;
    const original = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = original;
    };
  }, [locked]);
}

export function isAdminRoute(route: Route): boolean {
  return route.name.startsWith('admin-');
}
