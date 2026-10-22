import { ReactNode, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';

interface NavItem { href: string; label: string; icon: string; }

const navItems: NavItem[] = [
    { href: '/admin/dashboard',    label: 'Dashboard',    icon: '◈' },
    { href: '/admin/profile',      label: 'Profile',      icon: '◉' },
    { href: '/admin/certificates', label: 'Certificates', icon: '◆' },
    { href: '/admin/tasks',        label: 'Tasks',        icon: '✎' },
    { href: '/admin/skills',       label: 'Skills',       icon: '▲' },
    { href: '/admin/messages',     label: 'Messages',     icon: '▣' },
];

export default function AdminLayout({ children, title }: { children: ReactNode; title?: string }) {
    const router = useRouter();
    const [sidebarOpen, setSidebarOpen] = useState(false);

    async function handleLogout() {
        await fetch('/api/admin/auth/logout', { method: 'POST' });
        router.push('/admin/login');
    }

    return (
        <div className="admin-root" style={{ display: 'flex', minHeight: '100vh', background: '#0f1117', color: '#e2e8f0', fontFamily: "'Inter', system-ui, sans-serif" }}>

            {/* ── Sidebar ── */}
            <aside style={{
                width: '220px', flexShrink: 0,
                background: '#13161f',
                borderRight: '1px solid #1e2535',
                display: 'flex', flexDirection: 'column',
                position: 'fixed', top: 0, left: 0, bottom: 0,
                zIndex: 50,
                transform: sidebarOpen ? 'translateX(0)' : undefined,
                transition: 'transform 0.2s ease',
            }} className={`lg-sidebar ${sidebarOpen ? '' : 'sidebar-hidden'}`}>

                {/* Brand */}
                <div style={{ padding: '20px 20px 16px', borderBottom: '1px solid #1e2535' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <div style={{ width: '32px', height: '32px', background: '#ec1839', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '14px', fontWeight: 700, color: '#fff', flexShrink: 0 }}>N</div>
                        <div>
                            <p style={{ fontWeight: 700, fontSize: '14px', color: '#f1f5f9', margin: 0 }}>Noch Admin</p>
                            <p style={{ fontSize: '11px', color: '#475569', margin: 0 }}>Portfolio CMS</p>
                        </div>
                    </div>
                </div>

                {/* Nav */}
                <nav style={{ flex: 1, padding: '12px 10px', overflowY: 'auto' }}>
                    {navItems.map((item) => {
                        const isActive = router.pathname === item.href ||
                            (item.href !== '/admin/dashboard' && router.pathname.startsWith(item.href));
                        return (
                            <Link key={item.href} href={item.href} onClick={() => setSidebarOpen(false)} style={{
                                display: 'flex', alignItems: 'center', gap: '10px',
                                padding: '9px 12px', marginBottom: '2px',
                                borderRadius: '6px',
                                fontSize: '13px', fontWeight: isActive ? 600 : 400,
                                color: isActive ? '#f1f5f9' : '#64748b',
                                background: isActive ? 'rgba(236,24,57,0.12)' : 'transparent',
                                borderLeft: isActive ? '2px solid #ec1839' : '2px solid transparent',
                                textDecoration: 'none',
                                transition: 'all 0.15s',
                            }}>
                                <span style={{ fontSize: '13px', opacity: isActive ? 1 : 0.6, color: isActive ? '#ec1839' : 'inherit' }}>{item.icon}</span>
                                {item.label}
                            </Link>
                        );
                    })}
                </nav>

                {/* Footer */}
                <div style={{ padding: '10px 10px 16px', borderTop: '1px solid #1e2535' }}>
                    <Link href="/" target="_blank" style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '8px 12px', borderRadius: '6px', fontSize: '13px', color: '#64748b', textDecoration: 'none', marginBottom: '2px' }}>
                        <span style={{ fontSize: '12px' }}>↗</span> Lihat Website
                    </Link>
                    <button onClick={handleLogout} style={{ width: '100%', display: 'flex', alignItems: 'center', gap: '10px', padding: '8px 12px', borderRadius: '6px', fontSize: '13px', color: '#ec1839', background: 'none', border: 'none', cursor: 'pointer', textAlign: 'left' }}>
                        <span style={{ fontSize: '12px' }}>⏏</span> Logout
                    </button>
                </div>
            </aside>

            {/* Mobile overlay */}
            {sidebarOpen && (
                <div onClick={() => setSidebarOpen(false)} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', zIndex: 40 }} />
            )}

            {/* ── Main ── */}
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', marginLeft: '220px', minWidth: 0 }} className="admin-main">
                {/* Topbar */}
                <header style={{ background: '#13161f', borderBottom: '1px solid #1e2535', padding: '0 24px', height: '56px', display: 'flex', alignItems: 'center', gap: '16px', position: 'sticky', top: 0, zIndex: 30 }}>
                    <button onClick={() => setSidebarOpen(true)} aria-label="Menu" style={{ display: 'none', background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer', padding: '4px' }} className="mobile-menu-btn">
                        <svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" /></svg>
                    </button>
                    {title && <h1 style={{ fontSize: '15px', fontWeight: 600, color: '#f1f5f9', margin: 0 }}>{title}</h1>}
                    <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <div style={{ width: '28px', height: '28px', background: '#ec1839', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '11px', fontWeight: 700, color: '#fff' }}>A</div>
                    </div>
                </header>

                {/* Content */}
                <main style={{ flex: 1, padding: '24px', overflowAuto: 'auto' } as React.CSSProperties}>
                    {children}
                </main>
            </div>

            <style>{`
                @media (max-width: 1024px) {
                    .sidebar-hidden { transform: translateX(-100%) !important; }
                    .admin-main { margin-left: 0 !important; }
                    .mobile-menu-btn { display: flex !important; }
                }
                .admin-root a:hover { opacity: 0.85; }
                .admin-root * { box-sizing: border-box; }
                /* Tailwind card overrides for dark theme */
                .admin-root .bg-white { background: #1a1f2e !important; }
                .admin-root .bg-gray-50 { background: #0f1117 !important; }
                .admin-root .bg-gray-100 { background: #1e2535 !important; }
                .admin-root .bg-gray-200 { background: #252d3d !important; }
                .admin-root .border-gray-100 { border-color: #1e2535 !important; }
                .admin-root .border-gray-200 { border-color: #1e2535 !important; }
                .admin-root .border-gray-300 { border-color: #2a3347 !important; }
                .admin-root .text-gray-900 { color: #f1f5f9 !important; }
                .admin-root .text-gray-800 { color: #e2e8f0 !important; }
                .admin-root .text-gray-700 { color: #cbd5e1 !important; }
                .admin-root .text-gray-600 { color: #94a3b8 !important; }
                .admin-root .text-gray-500 { color: #64748b !important; }
                .admin-root .text-gray-400 { color: #475569 !important; }
                .admin-root .shadow-sm { box-shadow: 0 1px 3px rgba(0,0,0,0.4) !important; }
                .admin-root .hover\\:shadow-md:hover { box-shadow: 0 4px 16px rgba(0,0,0,0.5) !important; }
                .admin-root .bg-indigo-50 { background: rgba(99,102,241,0.12) !important; }
                .admin-root .bg-indigo-600 { background: #ec1839 !important; }
                .admin-root .hover\\:bg-indigo-700:hover { background: #c5142f !important; }
                .admin-root .disabled\\:bg-indigo-400:disabled { background: #7c1525 !important; }
                .admin-root .text-indigo-600, .admin-root .text-indigo-700 { color: #ec1839 !important; }
                .admin-root .focus\\:ring-indigo-500:focus { --tw-ring-color: #ec1839 !important; }
                .admin-root input, .admin-root textarea, .admin-root select {
                    background: #0f1117 !important;
                    border-color: #2a3347 !important;
                    color: #e2e8f0 !important;
                }
                .admin-root input::placeholder, .admin-root textarea::placeholder { color: #475569 !important; }
                .admin-root input:focus, .admin-root textarea:focus, .admin-root select:focus {
                    border-color: #ec1839 !important;
                    box-shadow: 0 0 0 2px rgba(236,24,57,0.15) !important;
                }
                .admin-root .bg-green-100 { background: rgba(34,197,94,0.12) !important; }
                .admin-root .text-green-700 { color: #4ade80 !important; }
                .admin-root .bg-blue-100 { background: rgba(59,130,246,0.12) !important; }
                .admin-root .text-blue-700 { color: #60a5fa !important; }
                .admin-root .bg-yellow-100 { background: rgba(234,179,8,0.12) !important; }
                .admin-root .text-yellow-700 { color: #facc15 !important; }
                .admin-root .bg-purple-50, .admin-root .bg-purple-100 { background: rgba(168,85,247,0.12) !important; }
                .admin-root .text-purple-700 { color: #c084fc !important; }
                .admin-root .bg-red-50 { background: rgba(236,24,57,0.08) !important; }
                .admin-root .text-red-500, .admin-root .text-red-600, .admin-root .text-red-700 { color: #ec1839 !important; }
                .admin-root .hover\\:bg-red-50:hover { background: rgba(236,24,57,0.08) !important; }
                .admin-root .divide-y > * + * { border-top-color: #1e2535 !important; }
                .admin-root .divide-gray-50 > * + * { border-top-color: #1e2535 !important; }
                .admin-root table thead { background: #1a1f2e !important; }
                .admin-root table thead th { color: #64748b !important; }
                .admin-root table tbody tr:hover { background: #1e2535 !important; }
                .admin-root .rounded-xl, .admin-root .rounded-2xl { border-radius: 8px !important; }
                .admin-root .rounded-lg { border-radius: 6px !important; }
                .admin-root .rounded-full { border-radius: 9999px !important; }
            `}</style>
        </div>
    );
}
