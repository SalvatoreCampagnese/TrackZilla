
import React, { useState } from 'react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Input } from '@/components/ui/input';
import { useTranslation } from 'react-i18next';

interface DeleteConfirmationModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
  itemName: string;
  itemType: string;
}

export const DeleteConfirmationModal: React.FC<DeleteConfirmationModalProps> = ({
  open,
  onOpenChange,
  onConfirm,
  itemName,
  itemType
}) => {
  const { t } = useTranslation();
  // itemType is an identifier (e.g. 'application'); fall back to the raw value if there is no translation.
  const itemTypeLabel = t(`deleteConfirmation.itemTypes.${itemType}`, { defaultValue: itemType });
  const [confirmationInput, setConfirmationInput] = useState('');

  const handleConfirm = () => {
    if (confirmationInput === itemName) {
      onConfirm();
      setConfirmationInput('');
    }
  };

  const handleCancel = () => {
    onOpenChange(false);
    setConfirmationInput('');
  };

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent className="bg-card border-gray-700">
        <AlertDialogHeader>
          <AlertDialogTitle className="text-foreground">{t('deleteConfirmation.title')}</AlertDialogTitle>
          <AlertDialogDescription className="text-muted-foreground">
            {t('deleteConfirmation.typeToConfirmDescription', { itemType: itemTypeLabel, itemName })}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <div className="my-4">
          <Input
            value={confirmationInput}
            onChange={(e) => setConfirmationInput(e.target.value)}
            placeholder={t('deleteConfirmation.typeToConfirmPlaceholder', { itemType: itemTypeLabel })}
            className="bg-background border-gray-600 text-foreground"
          />
        </div>
        <AlertDialogFooter>
          <AlertDialogCancel 
            onClick={handleCancel}
            className="border-gray-600 hover:bg-accent"
          >
            {t('common.cancel')}
          </AlertDialogCancel>
          <AlertDialogAction 
            onClick={handleConfirm}
            disabled={confirmationInput !== itemName}
            className="bg-red-600 hover:bg-red-700 text-white disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {t('deleteConfirmation.deleteItem', { itemType: itemTypeLabel })}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
