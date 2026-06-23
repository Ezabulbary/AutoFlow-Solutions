'use client';

import styles from './Toast.module.css';

export default function Toast({ toast }) {
  if (!toast) return null;

  return (
    <div className={styles.toastContainer}>
      <div className={styles.toast}>
        <span className={styles.icon}>{toast.icon || '✅'}</span>
        <span className={styles.message}>{toast.msg}</span>
      </div>
    </div>
  );
}
