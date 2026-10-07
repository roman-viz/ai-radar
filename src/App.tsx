import { BackToTop } from './components/BackToTop'
import { Footer } from './components/Footer'
import { Header } from './components/Header'
import { useHashRoute } from './hooks/useHashRoute'
import { Favorites } from './pages/Favorites'
import { About } from './pages/About'
import { Explore } from './pages/Explore'

export default function App() {
  const route = useHashRoute()
  return (
    <>
      <a
        className="skip-link"
        href="#main"
        onClick={(e) => {
          e.preventDefault()
          document.getElementById('main')?.focus()
        }}
      >
        Skip to content
      </a>
      <Header route={route} />
      <main id="main" tabIndex={-1}>
        {route === 'about' ? <About /> : route === 'favorites' ? <Favorites /> : <Explore />}
      </main>
      <Footer />
      <BackToTop />
    </>
  )
}
