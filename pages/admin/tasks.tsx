import { useEffect, useState } from 'react';
import Head from 'next/head';
import AdminLayout from '../../components/admin/AdminLayout';

interface Task {
    id: string;
    title: string;
    description: string;
    task_number: string;
    link_url: string;
    link_label: string;
    link_type: string;
    submitted_date: string;
    published: string;
    sort_order: string;
}

type FormState = Omit<Task, 'id'>;

const LINK_TYPE_OPTIONS = [
    { value: 'doc', label: '📄 Document (Word/Docs)' },
    { value: 'pdf', label: '📋 PDF' },
    { value: 'video', label: '🎬 Video (MP4/YouTube)' },
    { value: 'presentation', label: '📊 Presentation (PPT/Slides)' },
    { value: 'other', label: '🔗 Other' },
];

const EMPTY: FormState = {
    title: '',
    description: '',
    task_number: '',
    link_url: '',
    link_label: 'Lihat File',
    link_type: 'doc',
    submitted_date: '',
    published: 'true',
    sort_order: '',
};

export default function AdminTasks() {
    const [tasks, setTasks] = useState<Task[]>([]);
    const [loading, setLoading] = useState(true);
    const [form, setForm] = useState<FormState>(EMPTY);
    const [editId, setEditId] = useState<string | null>(null);
    const [saving, setSaving] = useState(false);
    const [msg, setMsg] = useState('');
    const [showForm, setShowForm] = useState(false);

    async function load() {
        setLoading(true);
        const r = await fetch('/api/admin/tasks');
        const d = await r.json();
        if (d.success) setTasks(d.data);
        setLoading(false);
    }
    useEffect(() => { load(); }, []);

    function openNew() {
        setForm(EMPTY);
        setEditId(null);
        setMsg('');
        setShowForm(true);
    }

    function openEdit(t: Task) {
        setForm({
            title: t.title,
            description: t.description,
            task_number: t.task_number,
            link_url: t.link_url,
            link_label: t.link_label,
            link_type: t.link_type,
            submitted_date: t.submitted_date,
            published: t.published,
            sort_order: t.sort_order,
        });
        setEditId(t.id);
        setMsg('');
        setShowForm(true);
    }

    async function handleSave() {
        if (!form.title.trim()) { setMsg('❌ Title harus diisi'); return; }
        if (!form.link_url.trim()) { setMsg('❌ Link URL harus diisi'); return; }
        setSaving(true);
        setMsg('');
        try {
            const url = editId ? `/api/admin/tasks/${editId}` : '/api/admin/tasks';
            const method = editId ? 'PUT' : 'POST';
            const r = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(form),
            });
            const d = await r.json();
            if (d.success) {
                setMsg('✅ Tersimpan!');
                await load();
                setTimeout(() => setShowForm(false), 800);
            } else {
                setMsg('❌ ' + (d.error || 'Gagal menyimpan'));
            }
        } catch {
            setMsg('❌ Terjadi kesalahan');
        } finally {
            setSaving(false);
        }
    }

    async function handleDelete(id: string, title: string) {
        if (!confirm(`Hapus task "${title}"?`)) return;
        const r = await fetch(`/api/admin/tasks/${id}`, { method: 'DELETE' });
        const d = await r.json();
        if (d.success) load();
        else alert(d.error || 'Gagal menghapus');
    }

    async function togglePublish(t: Task) {
        await fetch(`/api/admin/tasks/${t.id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ published: t.published === 'true' ? 'false' : 'true' }),
        });
        load();
    }

    const linkTypeIcon = (type: string) => {
        const map: Record<string, string> = {
            doc: '📄', pdf: '📋', video: '🎬', presentation: '📊', other: '🔗',
        };
        return map[type] ?? '🔗';
    };

    return (
        <>
            <Head><title>Tasks — Admin</title></Head>
            <AdminLayout title="Tasks (Bahasa Inggris)">
                <div className="flex justify-between items-center mb-5">
                    <p className="text-sm text-gray-500">{tasks.length} tugas terdaftar</p>
                    <button
                        onClick={openNew}
                        className="bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold px-4 py-2 rounded-lg transition-colors"
                    >
                        + Tambah Task
                    </button>
                </div>

                {loading ? (
                    <div className="text-gray-400 py-20 text-center">Memuat...</div>
                ) : tasks.length === 0 ? (
                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 py-16 text-center text-gray-400">
                        Belum ada task. Klik &quot;+ Tambah Task&quot; untuk mulai.
                    </div>
                ) : (
                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-x-auto">
                        <table className="w-full text-sm min-w-[640px]">
                            <thead className="bg-gray-50 text-gray-500 text-xs uppercase tracking-wide">
                                <tr>
                                    <th className="text-left px-4 py-3 w-10">#</th>
                                    <th className="text-left px-4 py-3">Judul</th>
                                    <th className="text-left px-4 py-3 hidden md:table-cell">Tipe</th>
                                    <th className="text-left px-4 py-3 hidden lg:table-cell">Tanggal</th>
                                    <th className="text-left px-4 py-3">Status</th>
                                    <th className="text-right px-4 py-3">Aksi</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50">
                                {tasks.map((t) => (
                                    <tr key={t.id} className="hover:bg-gray-50 transition-colors">
                                        <td className="px-4 py-3 text-gray-400 font-mono text-xs">{t.task_number || t.sort_order}</td>
                                        <td className="px-4 py-3">
                                            <p className="font-medium text-gray-900">{t.title}</p>
                                            {t.description && (
                                                <p className="text-xs text-gray-400 mt-0.5 truncate max-w-[240px]">{t.description}</p>
                                            )}
                                        </td>
                                        <td className="px-4 py-3 text-gray-500 hidden md:table-cell">
                                            <span className="text-base" title={t.link_type}>{linkTypeIcon(t.link_type)}</span>
                                            <span className="ml-1 text-xs capitalize">{t.link_type}</span>
                                        </td>
                                        <td className="px-4 py-3 text-gray-400 text-xs hidden lg:table-cell">{t.submitted_date}</td>
                                        <td className="px-4 py-3">
                                            <button
                                                onClick={() => togglePublish(t)}
                                                className={`text-xs font-semibold px-2.5 py-1 rounded-full transition-colors ${
                                                    t.published === 'true'
                                                        ? 'bg-green-100 text-green-700'
                                                        : 'bg-gray-100 text-gray-500'
                                                }`}
                                            >
                                                {t.published === 'true' ? 'Published' : 'Draft'}
                                            </button>
                                        </td>
                                        <td className="px-4 py-3 text-right whitespace-nowrap">
                                            <a
                                                href={t.link_url}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="text-gray-400 hover:text-indigo-600 text-xs mr-3"
                                                title="Buka link"
                                            >
                                                ↗ Buka
                                            </a>
                                            <button onClick={() => openEdit(t)} className="text-indigo-600 hover:underline text-xs mr-3">Edit</button>
                                            <button onClick={() => handleDelete(t.id, t.title)} className="text-red-500 hover:underline text-xs">Hapus</button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}

                {/* ── Modal Form ──────────────────────────────────────────────── */}
                {showForm && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
                        <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg p-6 max-h-[90vh] overflow-y-auto">
                            <div className="flex items-center justify-between mb-5">
                                <h2 className="text-lg font-semibold text-gray-900">
                                    {editId ? 'Edit Task' : 'Tambah Task Baru'}
                                </h2>
                                <button onClick={() => setShowForm(false)} className="text-gray-400 hover:text-gray-600 text-xl">×</button>
                            </div>

                            <div className="space-y-4">
                                {/* Title */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Judul Task *</label>
                                    <input
                                        type="text"
                                        value={form.title}
                                        onChange={e => setForm(p => ({ ...p, title: e.target.value }))}
                                        placeholder="Contoh: Task 2 - Presentation"
                                        className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                    />
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    {/* Task Number */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Nomor Task</label>
                                        <input
                                            type="text"
                                            value={form.task_number}
                                            onChange={e => setForm(p => ({ ...p, task_number: e.target.value }))}
                                            placeholder="Contoh: 2"
                                            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                        />
                                    </div>
                                    {/* Sort Order */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Sort Order</label>
                                        <input
                                            type="number"
                                            value={form.sort_order}
                                            onChange={e => setForm(p => ({ ...p, sort_order: e.target.value }))}
                                            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                        />
                                    </div>
                                </div>

                                {/* Deskripsi */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Deskripsi</label>
                                    <textarea
                                        value={form.description}
                                        onChange={e => setForm(p => ({ ...p, description: e.target.value }))}
                                        rows={2}
                                        placeholder="Deskripsi singkat tugas ini..."
                                        className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                    />
                                </div>

                                {/* Link URL */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Link File / URL *</label>
                                    <input
                                        type="url"
                                        value={form.link_url}
                                        onChange={e => setForm(p => ({ ...p, link_url: e.target.value }))}
                                        placeholder="https://drive.google.com/file/d/... atau https://youtube.com/..."
                                        className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                    />
                                    <p className="text-xs text-gray-400 mt-1">
                                        Bisa link Google Drive, YouTube, atau URL lainnya. Pastikan sharing sudah &quot;Anyone with the link&quot;.
                                    </p>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    {/* Link Type */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Tipe File</label>
                                        <select
                                            value={form.link_type}
                                            onChange={e => setForm(p => ({ ...p, link_type: e.target.value }))}
                                            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                        >
                                            {LINK_TYPE_OPTIONS.map(o => (
                                                <option key={o.value} value={o.value}>{o.label}</option>
                                            ))}
                                        </select>
                                    </div>

                                    {/* Link Label */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Label Tombol</label>
                                        <input
                                            type="text"
                                            value={form.link_label}
                                            onChange={e => setForm(p => ({ ...p, link_label: e.target.value }))}
                                            placeholder="Lihat File"
                                            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                        />
                                    </div>
                                </div>

                                {/* Submitted Date */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Tanggal Submit</label>
                                    <input
                                        type="text"
                                        value={form.submitted_date}
                                        onChange={e => setForm(p => ({ ...p, submitted_date: e.target.value }))}
                                        placeholder="Contoh: 9 Oktober 2024"
                                        className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                    />
                                </div>

                                {/* Status */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                                    <select
                                        value={form.published}
                                        onChange={e => setForm(p => ({ ...p, published: e.target.value }))}
                                        className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                    >
                                        <option value="true">Published</option>
                                        <option value="false">Draft</option>
                                    </select>
                                </div>
                            </div>

                            {msg && <p className="mt-3 text-sm text-center">{msg}</p>}

                            <div className="mt-5 flex gap-3 justify-end">
                                <button
                                    onClick={() => setShowForm(false)}
                                    className="px-4 py-2 text-sm text-gray-600 hover:bg-gray-100 rounded-lg"
                                >
                                    Batal
                                </button>
                                <button
                                    onClick={handleSave}
                                    disabled={saving}
                                    className="bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 text-white text-sm font-semibold px-5 py-2 rounded-lg transition-colors"
                                >
                                    {saving ? 'Menyimpan...' : 'Simpan'}
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </AdminLayout>
        </>
    );
}
