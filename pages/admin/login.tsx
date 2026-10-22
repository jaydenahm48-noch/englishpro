import { useState, FormEvent } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';

export default function AdminLogin() {
    const router = useRouter();
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    async function handleSubmit(e: FormEvent) {
        e.preventDefault();
        setError('');
        setLoading(true);
        try {
            const res = await fetch('/api/admin/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, password }),
            });
            const data = await res.json();
            if (res.ok && data.success) {
                router.push((router.query.from as string) || '/admin/dashboard');
            } else {
                setError(data.error || 'Login gagal');
            }
        } catch {
            setError('Terjadi kesalahan. Periksa koneksi internet.');
        } finally {
            setLoading(false);
        }
    }

    return (
        <>
            <Head><title>Admin Login — Noch Portfolio</title></Head>
            <div className="admin-root" style={{
                minHeight: '100vh',
                background: '#0f1117',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontFamily: "'Inter', system-ui, sans-serif",
                padding: '16px',
            }}>
                {/* Card */}
                <div style={{
                    width: '100%', maxWidth: '380px',
                    background: '#13161f',
                    border: '1px solid #1e2535',
                    borderRadius: '10px',
                    padding: '36px 32px',
                }}>
                    {/* Brand */}
                    <div style={{ textAlign: 'center', marginBottom: '32px' }}>
                        <div style={{
                            width: '44px', height: '44px',
                            background: '#ec1839',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            fontSize: '20px', fontWeight: 700, color: '#fff',
                            margin: '0 auto 14px',
                        }}>N</div>
                        <h1 style={{ fontSize: '18px', fontWeight: 700, color: '#f1f5f9', margin: '0 0 4px' }}>Admin Panel</h1>
                        <p style={{ fontSize: '12px', color: '#475569', margin: 0 }}>Noch Portfolio CMS</p>
                    </div>

                    <form onSubmit={handleSubmit}>
                        {/* Username */}
                        <div style={{ marginBottom: '16px' }}>
                            <label style={{ display: 'block', fontSize: '12px', fontWeight: 500, color: '#94a3b8', marginBottom: '6px', letterSpacing: '0.04em', textTransform: 'uppercase' }}>
                                Username
                            </label>
                            <input
                                type="text" value={username} onChange={e => setUsername(e.target.value)}
                                required autoComplete="username" placeholder="admin"
                                style={{
                                    width: '100%', padding: '10px 14px',
                                    background: '#0a0d14', border: '1px solid #2a3347',
                                    borderRadius: '6px', fontSize: '14px', color: '#e2e8f0',
                                    outline: 'none', boxSizing: 'border-box',
                                }}
                                onFocus={e => { e.target.style.borderColor = '#ec1839'; e.target.style.boxShadow = '0 0 0 2px rgba(236,24,57,0.15)'; }}
                                onBlur={e => { e.target.style.borderColor = '#2a3347'; e.target.style.boxShadow = 'none'; }}
                            />
                        </div>

                        {/* Password */}
                        <div style={{ marginBottom: '20px' }}>
                            <label style={{ display: 'block', fontSize: '12px', fontWeight: 500, color: '#94a3b8', marginBottom: '6px', letterSpacing: '0.04em', textTransform: 'uppercase' }}>
                                Password
                            </label>
                            <input
                                type="password" value={password} onChange={e => setPassword(e.target.value)}
                                required autoComplete="current-password" placeholder="••••••••"
                                style={{
                                    width: '100%', padding: '10px 14px',
                                    background: '#0a0d14', border: '1px solid #2a3347',
                                    borderRadius: '6px', fontSize: '14px', color: '#e2e8f0',
                                    outline: 'none', boxSizing: 'border-box',
                                }}
                                onFocus={e => { e.target.style.borderColor = '#ec1839'; e.target.style.boxShadow = '0 0 0 2px rgba(236,24,57,0.15)'; }}
                                onBlur={e => { e.target.style.borderColor = '#2a3347'; e.target.style.boxShadow = 'none'; }}
                            />
                        </div>

                        {/* Error */}
                        {error && (
                            <div style={{ background: 'rgba(236,24,57,0.08)', border: '1px solid rgba(236,24,57,0.25)', color: '#f87171', fontSize: '13px', borderRadius: '6px', padding: '10px 14px', marginBottom: '16px' }}>
                                {error}
                            </div>
                        )}

                        {/* Submit */}
                        <button
                            type="submit" disabled={loading}
                            style={{
                                width: '100%', padding: '11px',
                                background: loading ? '#7c1525' : '#ec1839',
                                color: '#fff', border: 'none', borderRadius: '6px',
                                fontSize: '13px', fontWeight: 600, cursor: loading ? 'not-allowed' : 'pointer',
                                letterSpacing: '0.04em',
                                transition: 'background 0.15s',
                            }}
                        >
                            {loading ? 'Masuk...' : 'Masuk'}
                        </button>
                    </form>
                </div>
            </div>
        </>
    );
}
