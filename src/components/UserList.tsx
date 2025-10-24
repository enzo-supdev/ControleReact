import { useState, useEffect, useMemo } from 'react'
import { Link } from 'react-router-dom'
import UserCard from './UserCard'
import SkeletonLoader from './SkeletonLoader'
import ErrorMessage from './ErrorMessage'
import { useFavorites } from '../hooks/useFavorites'

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

type SortOption = 'name-asc' | 'name-desc' | 'age-asc' | 'age-desc' | 'favorites'

function UserList() {
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  
  // États pour la recherche
  const [searchTerm, setSearchTerm] = useState('')
  
  // État pour le tri via menu déroulant
  const [sortOption, setSortOption] = useState<SortOption>('name-asc')
  
  // États pour la pagination
  const [currentPage, setCurrentPage] = useState(1)
  const USERS_PER_PAGE = 10

  // Hook personnalisé pour les favoris
  const { favorites, toggleFavorite, isFavorite } = useFavorites()

  // Récupération des utilisateurs avec gestion d'erreurs
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

  useEffect(() => {
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

      // 2. Tri dynamique selon l'option sélectionnée
      filtered.sort((a, b) => {
        switch (sortOption) {
          case 'name-asc':
            const nameA = `${a.firstName} ${a.lastName}`.toLowerCase()
            const nameB = `${b.firstName} ${b.lastName}`.toLowerCase()
            return nameA.localeCompare(nameB)
          
          case 'name-desc':
            const nameDescA = `${a.firstName} ${a.lastName}`.toLowerCase()
            const nameDescB = `${b.firstName} ${b.lastName}`.toLowerCase()
            return nameDescB.localeCompare(nameDescA)
          
          case 'age-asc':
            return a.age - b.age
          
          case 'age-desc':
            return b.age - a.age
          
          case 'favorites':
            // Les favoris en premier
            const aIsFav = isFavorite(a.id)
            const bIsFav = isFavorite(b.id)
            if (aIsFav && !bIsFav) return -1
            if (!aIsFav && bIsFav) return 1
            // Sinon tri par nom
            const favNameA = `${a.firstName} ${a.lastName}`.toLowerCase()
            const favNameB = `${b.firstName} ${b.lastName}`.toLowerCase()
            return favNameA.localeCompare(favNameB)
          
          default:
            return 0
        }
      })

      return filtered
    } catch (err) {
      console.error('Erreur lors du traitement des utilisateurs:', err)
      return []
    }
  }, [users, searchTerm, sortOption, favorites, isFavorite])

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
  }, [searchTerm, sortOption])

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
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i)
      }
    } else {
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

  // Affichage du chargement avec skeleton
  if (loading) {
    return (
      <div className="user-list-container">
        <h2>Liste des utilisateurs</h2>
        <SkeletonLoader />
      </div>
    )
  }

  // Affichage de l'erreur avec composant stylisé
  if (error) {
    return (
      <div className="user-list-container">
        <ErrorMessage message={error} onRetry={fetchUsers} />
      </div>
    )
  }

  return (
    <div className="user-list-container fade-in">
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

        {/* Menu déroulant pour le tri */}
        <div className="sort-dropdown-container">
          <label htmlFor="sort-select" className="sort-label">
            Trier par :
          </label>
          <select
            id="sort-select"
            className="sort-dropdown"
            value={sortOption}
            onChange={(e) => setSortOption(e.target.value as SortOption)}
          >
            <option value="name-asc">Nom (A → Z)</option>
            <option value="name-desc">Nom (Z → A)</option>
            <option value="age-asc">Âge (croissant)</option>
            <option value="age-desc">Âge (décroissant)</option>
            <option value="favorites">Favoris en premier ⭐</option>
          </select>
        </div>

        {/* Compteur de favoris */}
        {favorites.length > 0 && (
          <div className="favorites-counter">
            ⭐ {favorites.length} favori{favorites.length > 1 ? 's' : ''}
          </div>
        )}
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
                <UserCard 
                  user={user} 
                  isFavorite={isFavorite(user.id)}
                  onToggleFavorite={toggleFavorite}
                />
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