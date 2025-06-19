
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';

export const AddJobHeader: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="mb-6">
      <div className="flex items-center gap-4 mb-6">
        <Button
          onClick={() => navigate('/')}
          variant="outline"
          size="sm"
          className="flex items-center gap-2 border-white/20 bg-white/10 hover:bg-white/20 hover:border-white/30 text-white"
        >
          <ArrowLeft className="w-4 h-4" />
          Back
        </Button>
        
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-2xl overflow-hidden shadow-lg">
            <img src="/lovable-uploads/95407aee-75ac-4d31-a281-db4fc0472751.png" alt="TrackZilla Logo" className="w-full h-full object-cover" />
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-white">Add New Application</h1>
            <p className="text-sm text-white/70">Track your job application progress</p>
          </div>
        </div>
      </div>
    </div>
  );
};
