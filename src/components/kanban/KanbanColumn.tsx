
import React from 'react';
import { useDroppable } from '@dnd-kit/core';
import { JobApplication, JobStatus } from '@/types/job';
import { KanbanCard } from './KanbanCard';

interface KanbanColumnProps {
  id: JobStatus;
  title: string;
  applications: JobApplication[];
  onDelete: (id: string) => Promise<void>;
}

export const KanbanColumn: React.FC<KanbanColumnProps> = ({
  id,
  title,
  applications,
  onDelete,
}) => {
  const { setNodeRef, isOver } = useDroppable({
    id: id,
  });

  const getColumnColor = (status: JobStatus) => {
    switch (status) {
      case 'in-corso':
        return 'from-blue-500/20 to-blue-600/20 border-blue-400/30';
      case 'primo-colloquio':
      case 'secondo-colloquio':
      case 'colloquio-tecnico':
      case 'colloquio-finale':
        return 'from-yellow-500/20 to-orange-600/20 border-yellow-400/30';
      case 'offerta-ricevuta':
        return 'from-green-500/20 to-green-600/20 border-green-400/30';
      case 'rifiutato':
        return 'from-red-500/20 to-red-600/20 border-red-400/30';
      case 'ghosting':
        return 'from-gray-500/20 to-gray-600/20 border-gray-400/30';
      case 'ritirato':
        return 'from-purple-500/20 to-purple-600/20 border-purple-400/30';
      default:
        return 'from-slate-500/20 to-slate-600/20 border-slate-400/30';
    }
  };

  return (
    <div
      ref={setNodeRef}
      className={`
        flex flex-col min-w-[280px] max-w-[320px] bg-gradient-to-b ${getColumnColor(id)} 
        backdrop-blur-xl border rounded-2xl p-4 shadow-lg
        ${isOver ? 'ring-2 ring-white/50 shadow-2xl' : ''}
        transition-all duration-200
      `}
    >
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-white font-semibold text-lg">{title}</h3>
        <span className="bg-white/20 text-white text-xs px-2 py-1 rounded-full font-medium">
          {applications.length}
        </span>
      </div>

      <div className="flex flex-col gap-3 min-h-[200px]">
        {applications.map((application) => (
          <KanbanCard
            key={application.id}
            application={application}
            onDelete={onDelete}
          />
        ))}
        {applications.length === 0 && (
          <div className="flex items-center justify-center h-32 text-white/50 text-sm font-medium">
            Drop applications here
          </div>
        )}
      </div>
    </div>
  );
};
