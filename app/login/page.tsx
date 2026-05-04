import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import LoginForm from './LoginForm'
import Image from 'next/image'

const AUTH_COOKIE_NAME = 'auth_token'

export const metadata = {
  title: 'Acceso — Powerade Dashboard',
  description: 'Panel de control para gestión de publicaciones',
}

export default async function LoginPage() {
  // Check if already logged in
  const cookieStore = await cookies()
  const token = cookieStore.get(AUTH_COOKIE_NAME)?.value

  if (token) {
    redirect('/dashboard/noticias')
  }

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-background">
      <div className="w-full max-w-sm px-4 py-8">
        {/* Logo */}
        <div className="flex justify-center mb-12">
          <div className="relative h-24 w-96">
            <Image
              src="/tribuna_powerade.png"
              alt="Tribuna Powerade"
              fill
              className="object-contain"
            />
          </div>
        </div>

        {/* Card */}
        <div className="rounded-lg border border-border bg-card p-6 shadow-xl">
          <div className="mb-6 text-center">
            <h1 className="text-2xl font-bold text-foreground mb-2">Panel de Control</h1>
            <p className="text-sm text-muted-foreground">Generador de posts para redes sociales</p>
          </div>

          <LoginForm />
        </div>

        {/* Footer */}
        <p className="mt-6 text-center text-xs text-muted-foreground">
          © 2026 Grupo El Deber. Todos los derechos reservados.
        </p>
      </div>
    </div>
  )
}
