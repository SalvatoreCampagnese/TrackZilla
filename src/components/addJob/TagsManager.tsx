
import React, { useCallback } from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Tag, Plus, X } from 'lucide-react';

interface TagsManagerProps {
  tags: string[];
  setTags: React.Dispatch<React.SetStateAction<string[]>>;
  newTag: string;
  setNewTag: (value: string) => void;
}

export const TagsManager: React.FC<TagsManagerProps> = ({
  tags,
  setTags,
  newTag,
  setNewTag
}) => {
  const predefinedTags = ['Dream Job', 'Startup', 'Important', 'Interesting Salary', 'Referral', 'Remote Friendly', 'Big Company', 'Growth Opportunity'];

  const handleAddTag = useCallback((tag: string) => {
    if (tag && !tags.includes(tag)) {
      setTags(prev => [...prev, tag]);
    }
  }, [tags, setTags]);

  const handleRemoveTag = useCallback((tagToRemove: string) => {
    setTags(prev => prev.filter(tag => tag !== tagToRemove));
  }, [setTags]);

  const handleAddCustomTag = useCallback(() => {
    if (newTag.trim()) {
      handleAddTag(newTag.trim());
      setNewTag('');
    }
  }, [newTag, handleAddTag, setNewTag]);

  return (
    <div className="space-y-3 sm:space-y-4">
      <Label className="flex items-center gap-2 text-white font-medium">
        <Tag className="w-4 h-4" />
        Custom Tags
      </Label>
      
      {/* Selected Tags */}
      {tags.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {tags.map((tag, index) => (
            <div
              key={index}
              className="inline-flex items-center gap-1 bg-red-100/20 text-red-300 px-2 py-1 rounded-full text-xs sm:text-sm border border-red-400/30"
            >
              <Tag className="w-3 h-3" />
              {tag}
              <button
                type="button"
                onClick={() => handleRemoveTag(tag)}
                className="ml-1 text-red-300 hover:text-red-100"
              >
                <X className="w-3 h-3" />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Predefined Tags */}
      <div className="space-y-2">
        <p className="text-xs sm:text-sm text-white/70">Predefined tags:</p>
        <div className="flex flex-wrap gap-2">
          {predefinedTags.filter(tag => !tags.includes(tag)).map(tag => (
            <button
              key={tag}
              type="button"
              onClick={() => handleAddTag(tag)}
              className="inline-flex items-center gap-1 bg-white/10 hover:bg-white/20 text-white px-2 py-1 rounded-full text-xs sm:text-sm transition-colors border border-white/20 hover:border-white/30"
            >
              <Plus className="w-3 h-3" />
              {tag}
            </button>
          ))}
        </div>
      </div>

      {/* Custom Tag Input */}
      <div className="flex gap-2">
        <Input
          value={newTag}
          onChange={(e) => setNewTag(e.target.value)}
          placeholder="Add custom tag..."
          className="flex-1 bg-white/10 backdrop-blur-md border-white/20 text-white placeholder:text-white/50 text-sm focus-visible:ring-red-500 focus-visible:border-red-500"
          onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddCustomTag())}
        />
        <Button
          type="button"
          onClick={handleAddCustomTag}
          variant="outline"
          size="sm"
          disabled={!newTag.trim()}
          className="text-white border-white/20 hover:bg-white/20 px-3 rounded-full"
        >
          <Plus className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
};
