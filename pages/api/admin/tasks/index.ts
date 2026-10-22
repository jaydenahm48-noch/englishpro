/**
 * GET  /api/admin/tasks  → List semua tasks
 * POST /api/admin/tasks  → Tambah task baru
 */

import type { NextApiRequest, NextApiResponse } from 'next';
import { withAdminAuth, handleApiError } from '../../../../lib/withAdminAuth';
import { getTasks, createTask, SHEETS } from '../../../../lib/googleSheets';

const TASK_HEADERS = [
    'id', 'title', 'description', 'task_number',
    'link_url', 'link_label', 'link_type',
    'submitted_date', 'published', 'sort_order',
];

async function ensureTasksHeader(): Promise<void> {
    try {
        const { google } = await import('googleapis');
        const email = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL;
        const key = process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n');
        const auth = new google.auth.GoogleAuth({
            credentials: { client_email: email, private_key: key },
            scopes: ['https://www.googleapis.com/auth/spreadsheets'],
        });
        const sheets = google.sheets({ version: 'v4', auth });
        const spreadsheetId = process.env.GOOGLE_SPREADSHEET_ID!;

        const res = await sheets.spreadsheets.values.get({
            spreadsheetId,
            range: `${SHEETS.TASKS}!A1:Z1`,
        }).catch(() => ({ data: { values: [] } }));

        const firstRow = (res as { data: { values?: string[][] } }).data.values?.[0] ?? [];
        if (firstRow.length === 0) {
            await sheets.spreadsheets.values.update({
                spreadsheetId,
                range: `${SHEETS.TASKS}!A1`,
                valueInputOption: 'RAW',
                requestBody: { values: [TASK_HEADERS] },
            });
        }
    } catch {
        // Ignore — sheet akan auto-dibuat
    }
}

export default withAdminAuth(async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === 'GET') {
        try {
            const tasks = await getTasks();
            const sorted = tasks.sort((a, b) => Number(a.sort_order) - Number(b.sort_order));
            return res.status(200).json({ success: true, data: sorted });
        } catch (error) {
            return handleApiError(res, error);
        }
    }

    if (req.method === 'POST') {
        try {
            const {
                title, description, task_number, link_url,
                link_label, link_type, submitted_date, published, sort_order,
            } = req.body ?? {};

            if (!title || typeof title !== 'string' || title.trim().length === 0) {
                return res.status(400).json({ success: false, error: 'Title harus diisi' });
            }
            if (!link_url || typeof link_url !== 'string' || link_url.trim().length === 0) {
                return res.status(400).json({ success: false, error: 'Link URL harus diisi' });
            }

            await ensureTasksHeader();

            let order = sort_order;
            if (!order) {
                const existing = await getTasks();
                order = String(existing.length + 1);
            }

            const task = await createTask({
                title: title.trim(),
                description: (description ?? '').trim(),
                task_number: String(task_number ?? '').trim(),
                link_url: link_url.trim(),
                link_label: (link_label ?? 'Buka File').trim(),
                link_type: (link_type ?? 'other').trim(),
                submitted_date: (submitted_date ?? '').trim(),
                published: published === false || published === 'false' ? 'false' : 'true',
                sort_order: String(order),
            });

            return res.status(201).json({ success: true, data: task });
        } catch (error) {
            return handleApiError(res, error);
        }
    }

    return res.status(405).json({ success: false, error: 'Method not allowed' });
});
