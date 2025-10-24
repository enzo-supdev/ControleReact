import { useState, useEffect, useMemo } from 'react'
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

type SortField = 'name' | 'age'
type SortOrder = 'asc' | 'desc'

function UserList() {
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  
  // États pour la recherche
  const [searchTerm, setSearchTerm] = useState('')
  
  // États pour le tri
  const [sortField, setSortField] = useState<SortField>('name')
  const [sortOrder, setSortOrder] = useState<SortOrder>('asc')
  
  // États pour la pagination
  const [currentPage, setCurrentPage] = useState(1)
  const USERS_PER_PAGE = 10

  // Récupération des utilisateurs avec gestion d'erreurs
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true)
        setError(null)
        
        const response = await fetch('https://dummyjson.com/users')
        
        if (!response.ok) {
          throw new Error(`Erreur HTTP: ${response.status}`)
        }
        
        const data = await response.json()
        
        if (!data.users || !Array.isArray(data.users)) {
          throw new Error('Format de données invalide')
        }
        
        setUsers(data.users)
      } catch (err) {
        console.error('Erreur lors du chargement:', err)
        if (err instanceof TypeError) {
          setError('Erreur de connexion. Vérifiez votre connexion internet.')
        } else if (err instanceof Error) {
          setError(err.message)
        } else {
          setError('Une erreur inconnue est survenue')
        }
      } finally {
        setLoading(false)
      }
    }

    fetchUsers()
  }, [])

  // Filtrage, tri et pagination avec useMemo pour optimiser les performances
  const processedUsers = useMemo(() => {
    try {
      // 1. Filtrage par recherche
      let filtered = users.filter((user) => {
        const searchLower = searchTerm.toLowerCase().trim()
        return (
          user.firstName.toLowerCase().includes(searchLower) ||
          user.lastName.toLowerCase().includes(searchLower) ||
          user.email.toLowerCase().includes(searchLower)
        )
      })

      // 2. Tri
      filtered.sort((a, b) => {
        let comparison = 0
        
        if (sortField === 'name') {
          const nameA = `${a.firstName} ${a.lastName}`.toLowerCase()
          const nameB = `${b.firstName} ${b.lastName}`.toLowerCase()
          comparison = nameA.localeCompare(nameB)
        } else if (sortField === 'age') {
          comparison = a.age - b.age
        }
        
        return sortOrder === 'asc' ? comparison : -comparison
      })

      return filtered
    } catch (err) {
      console.error('Erreur lors du traitement des utilisateurs:', err)
      return []
    }
  }, [users, searchTerm, sortField, sortOrder])

  // 3. Pagination
  const totalPages = Math.ceil(processedUsers.length / USERS_PER_PAGE)
  const paginatedUsers = useMemo(() => {
    const startIndex = (currentPage - 1) * USERS_PER_PAGE
    const endIndex = startIndex + USERS_PER_PAGE
    return processedUsers.slice(startIndex, endIndex)
  }, [processedUsers, currentPage])

  // Réinitialiser la page lors de la recherche ou du tri
  useEffect(() => {
    setCurrentPage(1)
  }, [searchTerm, sortField, sortOrder])

  // Gestion du changement de tri
  const handleSortChange = (field: SortField) => {
    try {
      if (sortField === field) {
        // Inverser l'ordre si on clique sur le même champ
        setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')
      } else {
        // Nouveau champ, ordre ascendant par défaut
        setSortField(field)
        setSortOrder('asc')
      }
    } catch (err) {
      console.error('Erreur lors du changement de tri:', err)
    }
  }

  // Gestion de la pagination
  const handlePageChange = (page: number) => {
    try {
      if (page >= 1 && page <= totalPages) {
        setCurrentPage(page)
        window.scrollTo({ top: 0, behavior: 'smooth' })
      }
    } catch (err) {
      console.error('Erreur lors du changement de page:', err)
    }
  }

  // Génération des numéros de pages à afficher
  const getPageNumbers = () => {
    const pages: (number | string)[] = []
    const maxPagesToShow = 5

    if (totalPages <= maxPagesToShow) {
      // Afficher toutes les pages si peu nombreuses
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i)
      }
    } else {
      // Logique pour afficher ... entre les pages
      pages.push(1)
      
      if (currentPage > 3) {
        pages.push('...')
      }
      
      for (let i = Math.max(2, currentPage - 1); i <= Math.min(totalPages - 1, currentPage + 1); i++) {
        pages.push(i)
      }
      
      if (currentPage < totalPages - 2) {
        pages.push('...')
      }
      
      pages.push(totalPages)
    }

    return pages
  }

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
      <h2>Liste des utilisateurs</h2>

      {/* Barre de recherche et contrôles */}
      <div className="controls-container">
        {/* Champ de recherche */}
        <div className="search-box">
          <input
            type="text"
            placeholder="🔍 Rechercher par nom, prénom ou email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
          {searchTerm && (
            <button
              className="clear-search"
              onClick={() => setSearchTerm('')}
              aria-label="Effacer la recherche"
            >
              ✕
            </button>
          )}
        </div>

        {/* Boutons de tri */}
        <div className="sort-buttons">
          <button
            className={`sort-button ${sortField === 'name' ? 'active' : ''}`}
            onClick={() => handleSortChange('name')}
          >
            Trier par nom
            {sortField === 'name' && (
              <span className="sort-icon">
                {sortOrder === 'asc' ? ' ↑' : ' ↓'}
              </span>
            )}
          </button>
          <button
            className={`sort-button ${sortField === 'age' ? 'active' : ''}`}
            onClick={() => handleSortChange('age')}
          >
            Trier par âge
            {sortField === 'age' && (
              <span className="sort-icon">
                {sortOrder === 'asc' ? ' ↑' : ' ↓'}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Compteur de résultats */}
      <div className="results-info">
        {processedUsers.length} utilisateur{processedUsers.length > 1 ? 's' : ''} trouvé{processedUsers.length > 1 ? 's' : ''}
        {searchTerm && ` pour "${searchTerm}"`}
      </div>

      {/* Grille d'utilisateurs */}
      {paginatedUsers.length > 0 ? (
        <>
          <div className="user-grid">
            {paginatedUsers.map((user) => (
              <Link key={user.id} to={`/user/${user.id}`} className="user-link">
                <UserCard user={user} />
              </Link>
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="pagination">
              <button
                className="pagination-button"
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                aria-label="Page précédente"
              >
                ← Précédent
              </button>

              <div className="pagination-numbers">
                {getPageNumbers().map((page, index) => (
                  typeof page === 'number' ? (
                    <button
                      key={index}
                      className={`pagination-number ${currentPage === page ? 'active' : ''}`}
                      onClick={() => handlePageChange(page)}
                    >
                      {page}
                    </button>
                  ) : (
                    <span key={index} className="pagination-ellipsis">
                      {page}
                    </span>
                  )
                ))}
              </div>

              <button
                className="pagination-button"
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                aria-label="Page suivante"
              >
                Suivant →
              </button>
            </div>
          )}
        </>
      ) : (
        <div className="no-results">
          <p>😕 Aucun utilisateur ne correspond à votre recherche</p>
          {searchTerm && (
            <button
              className="clear-search-button"
              onClick={() => setSearchTerm('')}
            >
              Effacer la recherche
            </button>
          )}
        </div>
      )}
    </div>
  )
}

export default UserList