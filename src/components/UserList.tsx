import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import UserCard from './UserCard'

interface User {
  id: number
  firstName: string
  lastName: string
  email: string
  image: string
  age: number
  company: {
    name: string
  }
  address: {
    city: string
  }
}

function UserList() {
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true)
        setError(null)
        
        const response = await fetch('https://dummyjson.com/users')
        
        if (!response.ok) {
          throw new Error('Erreur lors du chargement des utilisateurs')
        }
        
        const data = await response.json()
        setUsers(data.users)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Une erreur est survenue')
      } finally {
        setLoading(false)
      }
    }

    fetchUsers()
  }, [])

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>Chargement des utilisateurs...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="error-container">
        <h2>❌ Erreur</h2>
        <p>{error}</p>
        <button onClick={() => window.location.reload()}>
          Réessayer
        </button>
      </div>
    )
  }

  return (
    <div className="user-list-container">
      <h2>Liste des utilisateurs ({users.length})</h2>
      <div className="user-grid">
        {users.map((user) => (
          <Link key={user.id} to={`/user/${user.id}`} className="user-link">
            <UserCard user={user} />
          </Link>
        ))}
      </div>
    </div>
  )
}

export default UserList