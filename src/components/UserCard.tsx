interface User {
  id: number
  firstName: string
  lastName: string
  email: string
  image: string
  age?: number
  company?: {
    name: string
  }
  address?: {
    city: string
  }
}

interface UserCardProps {
  user: User
  isFavorite: boolean
  onToggleFavorite: (userId: number) => void
}

function UserCard({ user, isFavorite, onToggleFavorite }: UserCardProps) {
  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.preventDefault() // Empêcher la navigation
    e.stopPropagation()
    onToggleFavorite(user.id)
  }

  return (
    <div className="user-card">
      {/* Bouton favori avec étoile */}
      <button 
        className={`favorite-button ${isFavorite ? 'is-favorite' : ''}`}
        onClick={handleFavoriteClick}
        aria-label={isFavorite ? 'Retirer des favoris' : 'Ajouter aux favoris'}
      >
        <svg 
          width="24" 
          height="24" 
          viewBox="0 0 24 24" 
          fill={isFavorite ? 'currentColor' : 'none'}
          stroke="currentColor" 
          strokeWidth="2"
        >
          <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
        </svg>
      </button>

      <div className="user-card-image">
        <img src={user.image} alt={`${user.firstName} ${user.lastName}`} />
      </div>
      <div className="user-card-content">
        <h3 className="user-card-name">
          {user.firstName} {user.lastName}
        </h3>
        <p className="user-card-email">
          📧 {user.email}
        </p>
        {user.age && (
          <p className="user-card-info">
            🎂 {user.age} ans
          </p>
        )}
        {user.company && (
          <p className="user-card-info">
            🏢 {user.company.name}
          </p>
        )}
        {user.address && (
          <p className="user-card-info">
            📍 {user.address.city}
          </p>
        )}
      </div>
      <div className="user-card-footer">
        <span className="view-details">Voir le détail →</span>
      </div>
    </div>
  )
}

export default UserCard