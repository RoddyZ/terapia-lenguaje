import { AnimatePresence, motion } from 'motion/react';
import styles from './Celebration.module.css';

const PIECES = ['⭐', '🌟', '✨', '🎉', '⭐', '💜', '✨', '🌟', '⭐', '🎈'];

export interface CelebrationProps {
  show: boolean;
  message?: string;
}

/** Ráfaga de estrellas al acertar. Respeta prefers-reduced-motion vía CSS global. */
export function Celebration({ show, message = '¡Muy bien!' }: CelebrationProps) {
  return (
    <AnimatePresence>
      {show && (
        <motion.div
          className={styles.overlay}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          role="status"
          aria-live="polite"
        >
          {PIECES.map((piece, i) => {
            const angle = (i / PIECES.length) * Math.PI * 2;
            return (
              <motion.span
                key={i}
                className={styles.piece}
                aria-hidden="true"
                initial={{ x: 0, y: 0, scale: 0.2, opacity: 1 }}
                animate={{
                  x: Math.cos(angle) * 180,
                  y: Math.sin(angle) * 140,
                  scale: 1.2,
                  opacity: 0,
                  rotate: 180,
                }}
                transition={{ duration: 1.1, ease: 'easeOut' }}
              >
                {piece}
              </motion.span>
            );
          })}
          <motion.p
            className={styles.message}
            initial={{ scale: 0.6, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            transition={{ type: 'spring', stiffness: 400, damping: 15 }}
          >
            {message}
          </motion.p>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
