import React from 'react';
import { AlertTriangle } from 'lucide-react';
import { Modal } from './Modal';

interface ConfirmDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  isDestructive?: boolean;
}

export const ConfirmDialog: React.FC<ConfirmDialogProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  isDestructive = false
}) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} maxWidth="md">
      <div className="flex flex-col items-center text-center p-2">
        <div className={`w-12 h-12 rounded-full flex items-center justify-center mb-4 ${
          isDestructive ? 'bg-red-50 text-red-600' : 'bg-sand/30 text-bronze'
        }`}>
          <AlertTriangle className="w-6 h-6" />
        </div>
        <h4 className="text-lg font-serif font-semibold text-charcoal">{title}</h4>
        <p className="text-sm text-charcoal/70 mt-2 mb-6 leading-relaxed">{message}</p>

        <div className="flex items-center justify-end gap-3 w-full">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 px-4 py-2.5 text-xs font-semibold tracking-wider uppercase border border-sand-dark/40 text-charcoal rounded hover:bg-sand/20 transition-colors"
          >
            {cancelText}
          </button>
          <button
            type="button"
            onClick={() => {
              onConfirm();
              onClose();
            }}
            className={`flex-1 px-4 py-2.5 text-xs font-semibold tracking-wider uppercase rounded transition-colors text-white ${
              isDestructive
                ? 'bg-red-600 hover:bg-red-700'
                : 'bg-forest hover:bg-forest-deep'
            }`}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </Modal>
  );
};
