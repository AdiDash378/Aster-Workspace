import { useEffect, useLayoutEffect } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { Asterisk } from 'lucide-react'
import AppLayout from './layouts/AppLayout'
import Login from './pages/Login'
import Register from './pages/Register'
import Home from './pages/Home'
import PageView from './pages/PageView'
import Trash from './pages/Trash'
import NotFound from './pages/NotFound'
import { RequireAuth, RedirectIfAuthed } from './components/auth/RequireAuth'
import Toaster from './components/ui/Toaster'
import Spinner from './components/ui/Spinner'
import { useAuthStore } from './store/authStore'
import { useUiStore } from './store/uiStore'

function SplashScreen() {
  return (
    <div className="flex h-screen items-center justify-center bg-zinc-50 dark:bg-zinc-950">
      <div className="flex flex-col items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-accent text-white">
          <Asterisk className="h-5 w-5" />
        </div>
        <Spinner className="h-5 w-5" />
      </div>
    </div>
  )
}

export default function App() {
  const initialize = useAuthStore((s) => s.initialize)
  const isInitialized = useAuthStore((s) => s.isInitialized)

  useEffect(() => { initialize() }, [initialize])

  // First visit: follow the OS theme preference; otherwise re-apply the persisted one.
  useLayoutEffect(() => {
    if (localStorage.getItem('aster-ui') === null) {
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
      useUiStore.getState().setTheme(prefersDark ? 'dark' : 'light')
    } else {
      document.documentElement.classList.toggle('dark', useUiStore.getState().theme === 'dark')
    }
  }, [])

  if (!isInitialized) return <SplashScreen />

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<RedirectIfAuthed><Login /></RedirectIfAuthed>} />
        <Route path="/register" element={<RedirectIfAuthed><Register /></RedirectIfAuthed>} />
        <Route element={<RequireAuth><AppLayout /></RequireAuth>}>
          <Route path="/" element={<Home />} />
          <Route path="/page/:pageId" element={<PageView />} />
          <Route path="/trash" element={<Trash />} />
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
      <Toaster />
    </BrowserRouter>
  )
}