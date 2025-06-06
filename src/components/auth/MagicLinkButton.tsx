import React from 'react';
import { Button } from '@/components/ui/button';
import { Wand2 } from 'lucide-react';
interface MagicLinkButtonProps {
  onClick: () => void;
  loading: boolean;
}
export const MagicLinkButton: React.FC<MagicLinkButtonProps> = ({
  onClick,
  loading
}) => {
  return <>
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t border-white/20" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="px-3 text-white/70">
            or
          </span>
        </div>
      </div>

      <Button variant="ghost" className="w-full border border-red-600/50 text-red-400 hover:bg-transparent hover:border-red-600 hover:text-red-300 rounded-xl bg-transparent" onClick={onClick} disabled={loading}>
        <Wand2 className="w-4 h-4 mr-2" />
        {loading ? 'Sending Magic Link...' : 'Sign in with Magic Link'}
      </Button>
    </>;
};