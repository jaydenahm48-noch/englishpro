/**
 * GET    /api/admin/tasks/[id]  → Get task by id
 * PUT    /api/admin/tasks/[id]  → Update task
 * DELETE /api/admin/tasks/[id]  → Hapus task
 */

import type { NextApiRequest, NextApiResponse } from 'next';
import { withAdminAuth, handleApiError } from '../../../../lib/withAdminAuth';
import { getTaskById, updateTask, deleteTask } from '../../../../lib/googleSheets';

export default withAdminAuth(async function handler(req: NextApiRequest, res: NextApiResponse) {
    const { id } = req.query;
    if (!id || typeof id !== 'string') {
        return res.status(400).json({ success: false, error: 'ID tidak valid' });
    }

    if (req.method === 'GET') {
        try {
            const task = await getTaskById(id);
            if (!task) return res.status(404).json({ success: false, error: 'Task tidak ditemukan' });
            return res.status(200).json({ success: true, data: task });
        } catch (error) {
            return handleApiError(res, error);
        }
    }

    if (req.method === 'PUT') {
        try {
            const {
                title, description, task_number, link_url,
                link_label, link_type, submitted_date, published, sort_order,
            } = req.body ?? {};

            const update: Record<string, string> = {};
            if (title !== undefined) update.title = String(title).trim();
            if (description !== undefined) update.description = String(description).trim();
            if (task_number !== undefined) update.task_number = String(task_number).trim();
            if (link_url !== undefined) update.link_url = String(link_url).trim();
            if (link_label !== undefined) update.link_label = String(link_label).trim();
            if (link_type !== undefined) update.link_type = String(link_type).trim();
            if (submitted_date !== undefined) update.submitted_date = String(submitted_date).trim();
            if (published !== undefined) update.published = (published === false || published === 'false') ? 'false' : 'true';
            if (sort_order !== undefined) update.sort_order = String(sort_order).trim();

            await updateTask(id, update);
            const updated = await getTaskById(id);
            return res.status(200).json({ success: true, data: updated });
        } catch (error) {
            return handleApiError(res, error);
        }
    }

    if (req.method === 'DELETE') {
        try {
            await deleteTask(id);
            return res.status(200).json({ success: true });
        } catch (error) {
            return handleApiError(res, error);
        }
    }

    return res.status(405).json({ success: false, error: 'Method not allowed' });
});
