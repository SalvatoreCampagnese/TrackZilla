
import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { useTranslation } from 'react-i18next';
import { AVAILABLE_COLORS } from './constants';

interface ColorSelectorProps {
  value: string;
  onChange: (value: string) => void;
  id: string;
  label?: string;
}

export const ColorSelector: React.FC<ColorSelectorProps> = ({
  value,
  onChange,
  id,
  label
}) => {
  const { t } = useTranslation();
  return (
    <div>
      <Label htmlFor={id} className="text-foreground">{label ?? t('kanban.color')}</Label>
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger className="bg-background border-border text-foreground">
          <SelectValue />
        </SelectTrigger>
        <SelectContent className="bg-background border-border">
          {AVAILABLE_COLORS.map((color) => (
            <SelectItem key={color.value} value={color.value}>
              <div className="flex items-center gap-2">
                <div className={`w-3 h-3 rounded-full ${color.value}`}></div>
                {t(color.labelKey)}
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};
