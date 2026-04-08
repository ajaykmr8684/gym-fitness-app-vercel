import { ButtonHTMLAttributes, ReactNode } from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
  icon?: ReactNode;
}

const variantStyles: Record<NonNullable<ButtonProps['variant']>, React.CSSProperties> = {
  primary: {
    background: 'linear-gradient(135deg, #0ea5e9 0%, #0369a1 100%)',
    color: 'white',
    border: '1px solid transparent',
  },
  secondary: {
    background: 'white',
    color: '#0f172a',
    border: '1px solid #cbd5e1',
  },
  danger: {
    background: '#fee2e2',
    color: '#b91c1c',
    border: '1px solid #fca5a5',
  },
  ghost: {
    background: 'transparent',
    color: '#0f172a',
    border: '1px solid transparent',
  },
  outline: {
    background: 'white',
    color: '#0f172a',
    border: '1px solid #cbd5e1',
  },
};

const sizeStyles: Record<NonNullable<ButtonProps['size']>, React.CSSProperties> = {
  sm: { padding: '0.55rem 0.9rem', fontSize: '0.85rem' },
  md: { padding: '0.75rem 1.1rem', fontSize: '0.95rem' },
  lg: { padding: '0.95rem 1.25rem', fontSize: '1rem' },
};

export const Button = ({
  children,
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  icon,
  style,
  type = 'button',
  ...props
}: ButtonProps) => {
  return (
    <button
      type={type}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '0.5rem',
        borderRadius: '10px',
        cursor: 'pointer',
        fontWeight: 600,
        transition: 'all 180ms ease',
        width: fullWidth ? '100%' : 'auto',
        boxShadow: variant === 'primary' ? '0 10px 24px rgba(14, 165, 233, 0.18)' : 'none',
        whiteSpace: 'nowrap',
        ...variantStyles[variant],
        ...sizeStyles[size],
        ...style,
      }}
      {...props}
    >
      {icon}
      {children}
    </button>
  );
};
