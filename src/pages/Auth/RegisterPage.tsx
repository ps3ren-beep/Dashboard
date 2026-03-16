import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { ROUTES } from '@/constants/routes';

export function RegisterPage() {
  const { signUpWithPassword, loading } = useAuth();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    const result = await signUpWithPassword(email, password, name);
    if (result.error) {
      setError(result.error);
      return;
    }
    navigate(ROUTES.DASHBOARD, { replace: true });
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-background-400 px-4">
      <div className="w-full max-w-md rounded-card border border-neutral-300 bg-surface-50 p-8 shadow-lg">
        <h1 className="text-heading-medium font-bold text-secondary-darker">Criar conta</h1>
        <p className="mt-2 text-paragraph-small text-surface-700">
          Leva menos de um minuto para começar a usar o mycash+.
        </p>
        <form onSubmit={handleSubmit} className="mt-6 flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <label className="text-label-small font-semibold text-secondary-darker">
              Nome
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="h-12 rounded-card border border-neutral-300 bg-surface-50 px-4 text-paragraph-small text-secondary-darker outline-none focus:border-neutral-900"
              required
            />
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-label-small font-semibold text-secondary-darker">
              E-mail
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="h-12 rounded-card border border-neutral-300 bg-surface-50 px-4 text-paragraph-small text-secondary-darker outline-none focus:border-neutral-900"
              required
            />
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-label-small font-semibold text-secondary-darker">
              Senha
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="h-12 rounded-card border border-neutral-300 bg-surface-50 px-4 text-paragraph-small text-secondary-darker outline-none focus:border-neutral-900"
              required
            />
          </div>
          {error && <p className="text-label-xsmall text-red-600">{error}</p>}
          <button
            type="submit"
            disabled={loading}
            className="mt-2 h-12 rounded-pill bg-neutral-900 text-label-medium font-semibold text-neutral-0 transition-opacity hover:opacity-90 disabled:opacity-60"
          >
            Criar conta
          </button>
        </form>
        <p className="mt-4 text-label-xsmall text-surface-700">
          Já tem conta?{' '}
          <Link to="/login" className="font-semibold text-neutral-900 underline">
            Entrar
          </Link>
        </p>
      </div>
    </div>
  );
}

