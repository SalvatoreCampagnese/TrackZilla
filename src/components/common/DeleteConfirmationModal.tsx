
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
          <AlertDialogTitle className="text-foreground">Confirm Deletion</AlertDialogTitle>
          <AlertDialogDescription className="text-muted-foreground">
            This action cannot be undone. To confirm deletion, please type the {itemType} name "{itemName}" below.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <div className="my-4">
          <Input
            value={confirmationInput}
            onChange={(e) => setConfirmationInput(e.target.value)}
            placeholder={`Type ${itemType} name to confirm`}
            className="bg-background border-gray-600 text-foreground"
          />
        </div>
        <AlertDialogFooter>
          <AlertDialogCancel 
            onClick={handleCancel}
            className="border-gray-600 hover:bg-accent"
          >
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction 
            onClick={handleConfirm}
            disabled={confirmationInput !== itemName}
            className="bg-red-600 hover:bg-red-700 text-white disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Delete {itemType}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
