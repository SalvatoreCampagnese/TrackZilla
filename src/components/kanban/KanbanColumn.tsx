
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
    <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-xl p-3 md:p-4 shadow-lg">
      {/* Column Header */}
      <div className="flex items-center justify-between mb-3 md:mb-4">
        <div className="flex items-center gap-2 md:gap-3">
          <div className={`w-2.5 h-2.5 md:w-3 md:h-3 rounded-full ${column.color}`}></div>
          <h3 className="font-medium text-white text-sm md:text-base truncate">{column.title}</h3>
        </div>
        <div className="bg-white/20 text-white text-xs px-1.5 md:px-2 py-0.5 md:py-1 rounded-full flex-shrink-0">
          {applicationCount}
        </div>
      </div>

      {/* Column Content */}
      {children}
    </div>
  );
};
