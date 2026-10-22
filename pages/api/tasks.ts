/**
 * GET /api/tasks
 * Mengembalikan daftar tugas Bahasa Inggris yang sudah published.
 */

import type { NextApiRequest, NextApiResponse } from 'next';
import { getTasks } from '../../lib/googleSheets';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== 'GET') {
        return res.status(405).json({ success: false, error: 'Method not allowed' });
    }

    try {
        const allTasks = await getTasks();

        const published = allTasks
            .filter((t) => t.published === 'true')
            .sort((a, b) => Number(a.sort_order) - Number(b.sort_order));

        return res.status(200).json({ success: true, data: published });
    } catch (error) {
        console.error('[/api/tasks] Error:', error);
        return res.status(500).json({ success: false, error: 'Gagal memuat tasks' });
    }
}
