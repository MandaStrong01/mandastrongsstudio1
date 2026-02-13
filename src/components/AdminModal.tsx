import { X } from 'lucide-react';
import AdminDashboard from './AdminDashboard';

interface AdminModalProps {
  onClose: () => void;
}

export default function AdminModal({ onClose }: AdminModalProps) {
  return (
    <div className="fixed inset-0 bg-black/90 backdrop-blur-sm z-50 overflow-y-auto">
      <div className="min-h-screen p-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-end mb-4">
            <button
              onClick={onClose}
              className="flex items-center gap-2 px-6 py-3 bg-red-500/20 hover:bg-red-500/30 text-red-400 rounded-lg transition-all font-bold border border-red-500/30"
            >
              <X className="w-5 h-5" />
              Close Admin Panel
            </button>
          </div>
          <AdminDashboard />
        </div>
      </div>
    </div>
  );
}
