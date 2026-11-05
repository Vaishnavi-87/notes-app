import { Toaster as HotToaster } from 'react-hot-toast'

export function Toaster() {
  return (
    <HotToaster
      position="bottom-right"
      gutter={10}
      containerClassName="toast-container"
      toastOptions={{
        duration: 4000,
        style: {
          background: 'var(--color-toast-bg)',
          color: 'var(--color-toast-text)',
          border: '1px solid var(--color-toast-border)',
          borderRadius: 'var(--radius-md)',
          padding: '12px 16px',
          fontSize: '14px',
          lineHeight: 1.4,
          maxWidth: '380px',
          boxShadow: 'var(--shadow-md)',
        },
        success: {
          iconTheme: { primary: 'var(--color-success)', secondary: 'var(--color-toast-text)' },
        },
        error: {
          duration: 6000,
          iconTheme: { primary: 'var(--color-danger)', secondary: 'var(--color-toast-text)' },
        },
      }}
    />
  )
}
