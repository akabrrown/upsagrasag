import * as React from 'react';
import { X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

/**
 * Premium modal component used across the admin UI.
 * It features a subtle gradient background (primary → secondary) and a polished animation.
 *
 * Props match the original FormModal but with a unique visual style.
 */
interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}

export default function Modal({ isOpen, onClose, title, children }: ModalProps) {
  // Prevent background scroll when modal is open
  React.useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className="bg-gradient-to-r from-primary to-secondary bg-opacity-95 backdrop-blur-md rounded-2xl shadow-xl w-full max-w-2xl max-h-[90vh] flex flex-col overflow-hidden"
            onClick={e => e.stopPropagation()}
            initial={{ scale: 0.95, y: -20 }}
            animate={{ scale: 1, y: 0, transition: { duration: 0.2 } }}
            exit={{ scale: 0.95, y: -20, transition: { duration: 0.15 } }}
          >
            <header className="flex items-center justify-between px-6 py-4 border-b border-primary/30 bg-primary/10">
              <h3 className="text-lg font-semibold text-white">{title}</h3>
              <button
                onClick={onClose}
                className="p-2 text-white hover:text-primary-foreground hover:bg-primary/20 rounded-full transition-colors"
                aria-label="Close modal"
              >
                <X className="w-5 h-5" />
              </button>
            </header>
            <div className="p-6 overflow-y-auto flex-1 bg-white/95 rounded-b-2xl">
              {children}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
