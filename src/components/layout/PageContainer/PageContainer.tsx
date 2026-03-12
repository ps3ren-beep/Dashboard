import { type ReactNode } from 'react';

interface PageContainerProps {
  children: ReactNode;
  className?: string;
}

/**
 * Container fluido para páginas — width 100%, max-width conforme Rules
 */
export function PageContainer({ children, className = '' }: PageContainerProps) {
  return (
    <div className={`w-full max-w-content mx-auto px-4 md:px-6 lg:px-8 ${className}`}>
      {children}
    </div>
  );
}
