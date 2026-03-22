import LoginForm from '@/components/features/auth/LoginForm'

export const metadata = {
  title: 'NODO | Login',
  description: 'Inicia sesión en NODO. Infraestructura de validación que conecta al productor con el consumidor final.',
}

export default function LoginPage() {
  return <LoginForm />
}
