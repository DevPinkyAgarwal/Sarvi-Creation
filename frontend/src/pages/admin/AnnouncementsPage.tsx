import { useState, useEffect } from 'react';
import { useAnnouncementStore } from '../../store/admin/announcementStore';
import type { Announcement } from '../../store/admin/announcementStore';
import { Plus, Trash2, Edit2, AlertCircle } from 'lucide-react';

export default function AnnouncementsPage() {
    const {
        announcements,
        isLoading,
        error,
        fetchAnnouncements,
        createAnnouncement,
        updateAnnouncement,
        deleteAnnouncement
    } = useAnnouncementStore();

    const [isFormOpen, setIsFormOpen] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [formData, setFormData] = useState({ message: '', isActive: false });

    useEffect(() => {
        fetchAnnouncements();
    }, [fetchAnnouncements]);

    const handleOpenForm = (announcement?: Announcement) => {
        if (announcement) {
            setFormData({ message: announcement.message, isActive: announcement.isActive });
            setEditingId(announcement._id);
        } else {
            setFormData({ message: '', isActive: false });
            setEditingId(null);
        }
        setIsFormOpen(true);
    };

    const handleCloseForm = () => {
        setIsFormOpen(false);
        setEditingId(null);
        setFormData({ message: '', isActive: false });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (editingId) {
            await updateAnnouncement(editingId, formData);
        } else {
            await createAnnouncement(formData);
        }
        handleCloseForm();
    };

    const toggleActiveStatus = async (announcement: Announcement) => {
        await updateAnnouncement(announcement._id, { isActive: !announcement.isActive });
    };

    return (
        <div className="space-y-6 font-sans">
            <div className="flex justify-between items-center">
                <div>
                    <h2 className="text-2xl font-semibold text-slate-900 tracking-tight">Announcements</h2>
                    <p className="text-slate-500 text-sm mt-1">Manage global website announcements.</p>
                </div>
                <button
                    onClick={() => handleOpenForm()}
                    className="flex items-center gap-2 bg-[#7F56D9] text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-[#6941C6] transition-colors shadow-sm"
                >
                    <Plus className="w-4 h-4" /> Add Announcement
                </button>
            </div>

            {error && (
                <div className="bg-red-50 text-red-600 p-4 rounded-xl flex items-center gap-3 text-sm">
                    <AlertCircle className="w-5 h-5 shrink-0" />
                    {error}
                </div>
            )}

            {isFormOpen && (
                <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
                    <h3 className="text-lg font-semibold text-slate-900 mb-4 tracking-tight">
                        {editingId ? 'Edit Announcement' : 'New Announcement'}
                    </h3>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1.5">Message</label>
                            <input
                                type="text"
                                required
                                value={formData.message}
                                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                                className="w-full px-3.5 py-2.5 bg-white border border-slate-300 rounded-lg text-slate-900 placeholder-slate-400 text-sm focus:outline-none focus:ring-4 focus:ring-purple-500/10 focus:border-purple-500 transition-all shadow-sm"
                                placeholder="E.g., Free Express Shipping on all orders!"
                            />
                        </div>
                        <div className="flex items-center gap-2.5 cursor-pointer pt-2">
                            <input
                                type="checkbox"
                                id="isActiveCheck"
                                checked={formData.isActive}
                                onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                                className="w-4 h-4 rounded border-slate-300 text-[#7F56D9] focus:ring-[#7F56D9] transition-colors cursor-pointer"
                            />
                            <label htmlFor="isActiveCheck" className="text-sm font-medium text-slate-700 cursor-pointer">
                                Set as currently active announcement
                            </label>
                        </div>
                        <div className="flex justify-end gap-3 pt-4">
                            <button
                                type="button"
                                onClick={handleCloseForm}
                                className="px-4 py-2 text-sm font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-50 border border-slate-200 rounded-lg transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                disabled={isLoading}
                                className="px-4 py-2 text-sm font-medium text-white bg-[#7F56D9] hover:bg-[#6941C6] rounded-lg disabled:opacity-50 transition-colors shadow-sm"
                            >
                                {isLoading ? 'Saving...' : 'Save'}
                            </button>
                        </div>
                    </form>
                </div>
            )}

            {/* List */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                {announcements.length === 0 && !isLoading ? (
                    <div className="p-8 text-center text-slate-500 text-sm">No announcements found. Add one above.</div>
                ) : (
                    <table className="w-full text-left text-sm text-slate-600">
                        <thead className="bg-[#F9FAFB] border-b border-slate-200 uppercase text-[11px] font-semibold text-slate-500 tracking-wider">
                            <tr>
                                <th className="px-6 py-4">Message</th>
                                <th className="px-6 py-4">Status</th>
                                <th className="px-6 py-4 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {announcements.map((announcement) => (
                                <tr key={announcement._id} className="hover:bg-slate-50 transition-colors">
                                    <td className="px-6 py-4 font-medium text-slate-900">
                                        {announcement.message}
                                    </td>
                                    <td className="px-6 py-4 pt-5">
                                        <button
                                            onClick={() => toggleActiveStatus(announcement)}
                                            className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${announcement.isActive
                                                ? 'bg-emerald-100 text-emerald-700 hover:bg-emerald-200'
                                                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                                                } transition-colors`}
                                        >
                                            {announcement.isActive ? 'Active' : 'Inactive'}
                                        </button>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <button
                                            onClick={() => handleOpenForm(announcement)}
                                            className="text-slate-400 hover:text-blue-600 p-2 transition-colors"
                                            title="Edit"
                                        >
                                            <Edit2 className="w-4 h-4" />
                                        </button>
                                        <button
                                            onClick={() => deleteAnnouncement(announcement._id)}
                                            className="text-slate-400 hover:text-red-600 p-2 transition-colors"
                                            title="Delete"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    );
}
