import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import UserList from './components/UserList'
import UserDetail from './components/UserDetail'
import './App.css'

function App() {
  return (
    <Router>
      <div className="app">
        <header className="app-header">
          <h1>Gestion des Utilisateurs</h1>
        </header>
        <main className="app-main">
          <Routes>
            <Route path="/" element={<UserList />} />
            <Route path="/user/:id" element={<UserDetail />} />
          </Routes>
        </main>
      </div>
    </Router>
  )
}

export default App