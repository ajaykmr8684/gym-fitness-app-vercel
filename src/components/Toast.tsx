import { createContext, ReactNode, useCallback, useContext, useMemo, useState } from 'react';

type ToastType = 'success' | 'error' | 'info';

interface ToastMessage {
  id: string;
  title: string;
  description?: string;
  type: ToastType;
}

interface ToastContextValue {
  notify: (title: string, options?: { type?: ToastType; description?: string }) => void;
  success: (title: string, description?: string) => void;
  error: (title: string, description?: string) => void;
  info: (title: string, description?: string) => void;
}

const ToastContext = createContext<ToastContextValue | undefined>(undefined);

export const ToastProvider = ({ children }: { children: ReactNode }) => {
  const [messages, setMessages] = useState<ToastMessage[]>([]);

  const removeToast = useCallback((id: string) => {
    setMessages((current) => current.filter((item) => item.id !== id));
  }, []);

  const notify = useCallback(
    (title: string, options: { type?: ToastType; description?: string } = {}) => {
      const id = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
      const toast: ToastMessage = {
        id,
        title,
        type: options.type ?? 'info',
        description: options.description,
      };
      setMessages((current) => [toast, ...current]);
      window.setTimeout(() => removeToast(id), 4200);
    },
    [removeToast],
  );

  const value = useMemo(
    () => ({
      notify,
      success: (title: string, description?: string) => notify(title, { type: 'success', description }),
      error: (title: string, description?: string) => notify(title, { type: 'error', description }),
      info: (title: string, description?: string) => notify(title, { type: 'info', description }),
    }),
    [notify],
  );

  return (
    <ToastContext.Provider value={value}>
      {children}
      <div
        style={{
          position: 'fixed',
          top: 16,
          right: 16,
          zIndex: 9999,
          display: 'flex',
          flexDirection: 'column',
          gap: '0.75rem',
          maxWidth: '360px',
          width: '100%',
          pointerEvents: 'none',
        }}
      >
        {messages.map((toast) => (
          <div
            key={toast.id}
            style={{
              pointerEvents: 'auto',
              borderRadius: '16px',
              padding: '1rem 1rem 0.95rem',
              boxShadow: '0 12px 32px rgba(15, 23, 42, 0.18)',
              backgroundColor: toast.type === 'success' ? '#ecfdf5' : toast.type === 'error' ? '#fee2e2' : '#eff6ff',
              border: `1px solid ${toast.type === 'success' ? '#10b981' : toast.type === 'error' ? '#ef4444' : '#3b82f6'}`,
              color: '#0f172a',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', gap: '0.75rem' }}>
              <div>
                <strong style={{ display: 'block', marginBottom: '0.25rem' }}>{toast.title}</strong>
                {toast.description && <p style={{ margin: 0, color: '#334155', fontSize: '0.95rem', lineHeight: 1.4 }}>{toast.description}</p>}
              </div>
              <button
                onClick={() => removeToast(toast.id)}
                style={{
                  border: 'none',
                  background: 'transparent',
                  cursor: 'pointer',
                  color: '#475569',
                  fontWeight: 700,
                  fontSize: '1rem',
                  lineHeight: 1,
                }}
              >
                ×
              </button>
            </div>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
};

export const useToast = (): ToastContextValue => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within ToastProvider');
  }
  return context;
};
