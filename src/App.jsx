import { Outlet } from 'react-router-dom'
import Footer from './components/Footer.jsx'
import Header from './components/Header.jsx'

export default function App() {
  return (
    <div className="flex min-h-[100svh] flex-col">
      <Header />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
    </div>
  )
}
