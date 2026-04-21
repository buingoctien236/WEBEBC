import { useState, useEffect } from 'react';
import { Search, RefreshCw } from 'lucide-react';

interface AdminLog {
    id: number;
    admin_account: string;
    log: string;
    created_at: string;
}

export default function AdminLogs() {
    const [logs, setLogs] = useState<AdminLog[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);

    const ITEMS_PER_PAGE = 10;

    const fetchLogs = async () => {
        try {
            setLoading(true);
            setError('');

            const token = localStorage.getItem('admin_token');
            if (!token) {
                window.location.href = '/admin';
                return;
            }

            const response = await fetch(
                'https://ebc-biotech.com/api/admin/logs',
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            if (response.status === 401 || response.status === 403) {
                localStorage.removeItem('admin_token');
                window.location.href = '/admin';
                return;
            }

            if (!response.ok) {
                throw new Error('Không thể tải logs');
            }

            const data = await response.json();
            setLogs(data);
        } catch (err: any) {
            setError(err.message || 'Không thể tải nhật ký hoạt động');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchLogs();
    }, []);

    useEffect(() => {
        setCurrentPage(1);
    }, [searchTerm, logs]);

    const filteredLogs = logs.filter(log =>
        log.admin_account.toLowerCase().includes(searchTerm.toLowerCase()) ||
        log.log.toLowerCase().includes(searchTerm.toLowerCase()) ||
        log.created_at.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const totalPages = Math.ceil(filteredLogs.length / ITEMS_PER_PAGE);

    const paginatedLogs = filteredLogs.slice(
        (currentPage - 1) * ITEMS_PER_PAGE,
        currentPage * ITEMS_PER_PAGE
    );

    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold mb-6">Nhật ký hoạt động Admin</h1>

            {error && (
                <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded">
                    {error}
                </div>
            )}

            <div className="mb-6 flex gap-4 items-center">
                <div className="flex-1 relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Tìm kiếm logs..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-9 pr-3 py-2 border rounded"
                    />
                </div>
                <button
                    onClick={fetchLogs}
                    disabled={loading}
                    className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded"
                >
                    <RefreshCw size={18} className={loading ? 'animate-spin' : ''} />
                    {loading ? 'Đang tải...' : 'Làm mới'}
                </button>
            </div>

            <div className="bg-white rounded-lg border overflow-hidden">
                {loading ? (
                    <div className="p-8 text-center text-gray-500">
                        <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mb-2"></div>
                        <p>Đang tải logs...</p>
                    </div>
                ) : paginatedLogs.length === 0 ? (
                    <div className="p-8 text-center text-gray-500">
                        <p>Không có log nào</p>
                    </div>
                ) : (
                    <>
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">ID</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Admin</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Hành động</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Thời gian</th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {paginatedLogs.map(log => (
                                        <tr key={log.id} className="hover:bg-gray-50">
                                            <td className="px-6 py-4 text-sm text-gray-500">{log.id}</td>
                                            <td className="px-6 py-4 text-sm font-medium text-gray-900">
                                                {log.admin_account}
                                            </td>
                                            <td className="px-6 py-4 text-sm text-gray-900">
                                                {log.log}
                                            </td>
                                            <td className="px-6 py-4 text-sm text-gray-500">
                                                {new Date(log.created_at).toLocaleString('vi-VN')}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        {totalPages > 1 && (
                            <div className="flex items-center justify-between px-6 py-4 border-t bg-gray-50">
                                <span className="text-sm text-gray-600">
                                    Trang {currentPage} / {totalPages}
                                </span>
                                <div className="flex gap-2">
                                    <button
                                        disabled={currentPage === 1}
                                        onClick={() => setCurrentPage(p => p - 1)}
                                        className="px-3 py-1 border rounded disabled:opacity-50"
                                    >
                                        Trước
                                    </button>

                                    {[...Array(totalPages)].map((_, i) => {
                                        const page = i + 1;
                                        return (
                                            <button
                                                key={page}
                                                onClick={() => setCurrentPage(page)}
                                                className={`px-3 py-1 border rounded ${
                                                    page === currentPage
                                                        ? 'bg-blue-600 text-white border-blue-600'
                                                        : 'hover:bg-gray-100'
                                                }`}
                                            >
                                                {page}
                                            </button>
                                        );
                                    })}

                                    <button
                                        disabled={currentPage === totalPages}
                                        onClick={() => setCurrentPage(p => p + 1)}
                                        className="px-3 py-1 border rounded disabled:opacity-50"
                                    >
                                        Sau
                                    </button>
                                </div>
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    );
}
