
import React from 'react';
import { KanbanColumnType } from './KanbanBoard';

interface KanbanColumnProps {
  column: KanbanColumnType;
  applicationCount: number;
  children: React.ReactNode;
}

export const KanbanColumn: React.FC<KanbanColumnProps> = ({
  column,
  applicationCount,
  children
}) => {
  return (
    <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-xl p-4 shadow-lg">
      {/* Column Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className={`w-3 h-3 rounded-full ${column.color}`}></div>
          <h3 className="font-medium text-white">{column.title}</h3>
        </div>
        <div className="bg-white/20 text-white text-xs px-2 py-1 rounded-full">
          {applicationCount}
        </div>
      </div>

      {/* Column Content */}
      {children}
    </div>
  );
};
