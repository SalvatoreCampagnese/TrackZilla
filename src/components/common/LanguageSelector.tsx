import { useLanguage } from '@/hooks/useLanguage';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface LanguageSelectorProps {
  id?: string;
  className?: string;
}

// Switches the UI language; for logged-in users the choice is also saved to their profile.
export const LanguageSelector = ({ id = 'language-select', className }: LanguageSelectorProps) => {
  const { t, currentLanguage, changeLanguage, loading } = useLanguage();

  return (
    <Select
      value={currentLanguage}
      onValueChange={(value: 'it' | 'en') => changeLanguage(value)}
      disabled={loading}
    >
      <SelectTrigger
        id={id}
        aria-label={t('settings.selectLanguage')}
        className={className ?? 'bg-background border-gray-600 text-foreground'}
      >
        <SelectValue />
      </SelectTrigger>
      <SelectContent className="bg-background border-gray-600">
        <SelectItem value="it" className="text-foreground">
          🇮🇹 {t('settings.italian')}
        </SelectItem>
        <SelectItem value="en" className="text-foreground">
          🇬🇧 {t('settings.english')}
        </SelectItem>
      </SelectContent>
    </Select>
  );
};
