'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createSupabaseBrowserClient } from '@/lib/supabase-browser'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [ssoLoading, setSsoLoading] = useState(false)

  // SSO (Portal BDT): o magic link entrega access_token/refresh_token no #fragment
  // da URL. O @supabase/ssr (cookie/PKCE) não processa o fluxo implícito sozinho,
  // então criamos a sessão aqui e seguimos para o painel.
  useEffect(() => {
    const hash = new URLSearchParams(window.location.hash.slice(1))
    const access_token = hash.get('access_token')
    const refresh_token = hash.get('refresh_token')
    if (!access_token || !refresh_token) return
    setSsoLoading(true)
    const supabase = createSupabaseBrowserClient()
    supabase.auth
      .setSession({ access_token, refresh_token })
      .then(({ error }) => {
        window.history.replaceState(null, '', window.location.pathname)
        if (error) {
          setSsoLoading(false)
          setError('Não foi possível entrar pelo Portal. Tente o login normal.')
          return
        }
        router.replace('/admin')
        router.refresh()
      })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')
    const supabase = createSupabaseBrowserClient()
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) {
      setError('E-mail ou senha incorretos.')
      setLoading(false)
      return
    }
    router.push('/admin')
    router.refresh()
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[oklch(0.20_0.03_150)] to-[oklch(0.28_0.04_150)] p-4">
      <Card className="w-full max-w-md shadow-2xl">
        <CardHeader className="text-center space-y-2 pb-6">
          <div className="mx-auto w-16 h-16 bg-[oklch(0.88_0.08_85)] rounded-2xl flex items-center justify-center text-2xl font-bold text-[oklch(0.20_0.03_150)]">
            BT
          </div>
          <CardTitle className="text-2xl font-bold">Banco de Talentos do Ton</CardTitle>
          <CardDescription>Acesso restrito ao painel administrativo</CardDescription>
        </CardHeader>
        <CardContent>
          {ssoLoading ? (
            <p className="py-8 text-center text-sm text-muted-foreground">
              Entrando pelo Portal BDT…
            </p>
          ) : (
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">E-mail</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="admin@browniedoton.com.br"
                required
                autoComplete="email"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Senha</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                autoComplete="current-password"
              />
            </div>
            {error && (
              <p className="text-sm text-destructive text-center">{error}</p>
            )}
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? 'Entrando...' : 'Entrar'}
            </Button>
          </form>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
