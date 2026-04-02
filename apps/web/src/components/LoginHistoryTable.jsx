import React, { useState, useEffect } from 'react';
import pb from '@/lib/pocketbaseClient';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ShieldAlert, ShieldCheck, Clock } from 'lucide-react';

const LoginHistoryTable = () => {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('all');

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const records = await pb.collection('login_history').getList(1, 50, {
          sort: '-login_time',
          $autoCancel: false
        });
        setHistory(records.items);
      } catch (error) {
        console.error('Error fetching login history:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchHistory();
  }, []);

  const filteredHistory = history.filter(record => {
    if (statusFilter === 'all') return true;
    if (statusFilter === 'success') return record.success;
    if (statusFilter === 'failed') return !record.success;
    return true;
  });

  if (loading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3, 4, 5].map(i => <Skeleton key={i} className="w-full h-16" />)}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium text-slate-900">Recent Login Activity</h3>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-[150px]">
            <SelectValue placeholder="Filter status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Attempts</SelectItem>
            <SelectItem value="success">Successful</SelectItem>
            <SelectItem value="failed">Failed</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="border border-slate-200 rounded-xl overflow-hidden bg-white">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-xs text-slate-500 uppercase bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="px-6 py-4 font-medium">Time</th>
                <th className="px-6 py-4 font-medium">User Email</th>
                <th className="px-6 py-4 font-medium">IP Address</th>
                <th className="px-6 py-4 font-medium">Status</th>
                <th className="px-6 py-4 font-medium">Details</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredHistory.length === 0 ? (
                <tr>
                  <td colSpan="5" className="px-6 py-8 text-center text-slate-500">
                    No login history found.
                  </td>
                </tr>
              ) : (
                filteredHistory.map((record) => (
                  <tr key={record.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center text-slate-900">
                        <Clock className="w-4 h-4 mr-2 text-slate-400" />
                        {new Date(record.login_time).toLocaleString()}
                      </div>
                    </td>
                    <td className="px-6 py-4 font-medium text-slate-900">{record.user_email}</td>
                    <td className="px-6 py-4 text-slate-500 font-mono text-xs">{record.ip_address || 'Unknown'}</td>
                    <td className="px-6 py-4">
                      {record.success ? (
                        <Badge variant="outline" className="bg-emerald-50 text-emerald-700 border-emerald-200">
                          <ShieldCheck className="w-3 h-3 mr-1" /> Success
                        </Badge>
                      ) : (
                        <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">
                          <ShieldAlert className="w-3 h-3 mr-1" /> Failed
                        </Badge>
                      )}
                    </td>
                    <td className="px-6 py-4 text-slate-500">
                      {record.reason || (record['2fa_verified'] ? '2FA Verified' : 'Password OK')}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default LoginHistoryTable;