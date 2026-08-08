import { useRouter, isAdminRoute } from '@/router';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { HomePage } from '@/pages/HomePage';
import { ResumePage } from '@/pages/ResumePage';
import { ProjectsPage } from '@/pages/ProjectsPage';
import { BlogPage, PostPage } from '@/pages/BlogPage';
import { ContactPage } from '@/pages/ContactPage';
import { AdminLoginPage } from '@/pages/admin/AdminLoginPage';
import { AdminShell, ProtectedRoute } from '@/components/admin/AdminShell';
import { AdminDashboardPage } from '@/pages/admin/AdminDashboardPage';
import { AdminHomepagePage } from '@/pages/admin/AdminHomepagePage';
import { AdminResumePage } from '@/pages/admin/AdminResumePage';
import { AdminSkillsPage } from '@/pages/admin/AdminSkillsPage';
import { AdminProjectsPage } from '@/pages/admin/AdminProjectsPage';
import { AdminBlogPage } from '@/pages/admin/AdminBlogPage';
import { AdminContactPage } from '@/pages/admin/AdminContactPage';
import { AdminInquiriesPage } from '@/pages/admin/AdminInquiriesPage';

export default function App() {
  const { route } = useRouter();
  const admin = isAdminRoute(route);

  // Admin login renders standalone (no public header/footer)
  if (route.name === 'admin-login') {
    return <AdminLoginPage />;
  }

  // All other admin routes share the admin shell + route guard
  if (admin) {
    return (
      <ProtectedRoute>
        <AdminShell current={route}>
          {route.name === 'admin-dashboard' && <AdminDashboardPage />}
          {route.name === 'admin-homepage' && <AdminHomepagePage />}
          {route.name === 'admin-resume' && <AdminResumePage />}
          {route.name === 'admin-skills' && <AdminSkillsPage />}
          {route.name === 'admin-projects' && <AdminProjectsPage />}
          {route.name === 'admin-blog' && <AdminBlogPage />}
          {route.name === 'admin-contact' && <AdminContactPage />}
          {route.name === 'admin-inquiries' && <AdminInquiriesPage />}
        </AdminShell>
      </ProtectedRoute>
    );
  }

  // Public site
  return (
    <div className="flex min-h-screen flex-col bg-steel-975 text-steel-200">
      <Header current={route} />
      <main className="flex-1">
        {route.name === 'home' && <HomePage />}
        {route.name === 'resume' && <ResumePage />}
        {route.name === 'projects' && <ProjectsPage />}
        {route.name === 'project' && <ProjectsPage />}
        {route.name === 'blog' && <BlogPage />}
        {route.name === 'post' && <PostPage slug={route.slug} />}
        {route.name === 'contact' && <ContactPage />}
      </main>
      <Footer />
    </div>
  );
}
