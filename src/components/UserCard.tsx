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
}

function UserCard({ user }: UserCardProps) {
  return (
    <div className="user-card">
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