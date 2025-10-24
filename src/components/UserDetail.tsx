import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'

interface User {
  id: number
  firstName: string
  lastName: string
  email: string
  phone: string
  image: string
  age: number
  gender: string
  birthDate: string
  bloodGroup: string
  height: number
  weight: number
  eyeColor: string
  hair: {
    color: string
    type: string
  }
  company: {
    name: string
    title: string
    department: string
  }
  address: {
    address: string
    city: string
    state: string
    postalCode: string
    country: string
  }
  university: string
}

function UserDetail() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchUser = async () => {
      try {
        setLoading(true)
        setError(null)
        
        const response = await fetch(`https://dummyjson.com/users/${id}`)
        
        if (!response.ok) {
          throw new Error('Utilisateur non trouvé')
        }
        
        const data = await response.json()
        setUser(data)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Une erreur est survenue')
      } finally {
        setLoading(false)
      }
    }

    fetchUser()
  }, [id])

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>Chargement des détails...</p>
      </div>
    )
  }

  if (error || !user) {
    return (
      <div className="error-container">
        <h2>❌ Erreur</h2>
        <p>{error || 'Utilisateur non trouvé'}</p>
        <button onClick={() => navigate('/')}>
          Retour à la liste
        </button>
      </div>
    )
  }

  return (
    <div className="user-detail-container">
      <button className="back-button" onClick={() => navigate('/')}>
        ← Retour à la liste
      </button>

      <div className="user-detail-card">
        <div className="user-detail-header">
          <img 
            src={user.image} 
            alt={`${user.firstName} ${user.lastName}`}
            className="user-detail-image"
          />
          <div className="user-detail-title">
            <h1>{user.firstName} {user.lastName}</h1>
            <p className="user-detail-subtitle">
              {user.company.title} chez {user.company.name}
            </p>
          </div>
        </div>

        <div className="user-detail-sections">
          {/* Section Informations personnelles */}
          <section className="detail-section">
            <h2>📋 Informations personnelles</h2>
            <div className="detail-grid">
              <div className="detail-item">
                <span className="detail-label">Âge</span>
                <span className="detail-value">{user.age} ans</span>
              </div>
              <div className="detail-item">
                <span className="detail-label">Genre</span>
                <span className="detail-value">{user.gender === 'male' ? 'Homme' : 'Femme'}</span>
              </div>
              <div className="detail-item">
                <span className="detail-label">Date de naissance</span>
                <span className="detail-value">{new Date(user.birthDate).toLocaleDateString('fr-FR')}</span>
              </div>
              <div className="detail-item">
                <span className="detail-label">Groupe sanguin</span>
                <span className="detail-value">{user.bloodGroup}</span>
              </div>
              <div className="detail-item">
                <span className="detail-label">Taille</span>
                <span className="detail-value">{user.height} cm</span>
              </div>
              <div className="detail-item">
                <span className="detail-label">Poids</span>
                <span className="detail-value">{user.weight} kg</span>
              </div>
              <div className="detail-item">
                <span className="detail-label">Couleur des yeux</span>
                <span className="detail-value">{user.eyeColor}</span>
              </div>
              <div className="detail-item">
                <span className="detail-label">Cheveux</span>
                <span className="detail-value">{user.hair.color} - {user.hair.type}</span>
              </div>
            </div>
          </section>

          {/* Section Contact */}
          <section className="detail-section">
            <h2>📞 Contact</h2>
            <div className="detail-grid">
              <div className="detail-item">
                <span className="detail-label">Email</span>
                <span className="detail-value">{user.email}</span>
              </div>
              <div className="detail-item">
                <span className="detail-label">Téléphone</span>
                <span className="detail-value">{user.phone}</span>
              </div>
            </div>
          </section>

          {/* Section Adresse */}
          <section className="detail-section">
            <h2>📍 Adresse</h2>
            <div className="detail-address">
              <p>{user.address.address}</p>
              <p>{user.address.postalCode} {user.address.city}</p>
              <p>{user.address.state}, {user.address.country}</p>
            </div>
          </section>

          {/* Section Professionnelle */}
          <section className="detail-section">
            <h2>💼 Informations professionnelles</h2>
            <div className="detail-grid">
              <div className="detail-item">
                <span className="detail-label">Entreprise</span>
                <span className="detail-value">{user.company.name}</span>
              </div>
              <div className="detail-item">
                <span className="detail-label">Poste</span>
                <span className="detail-value">{user.company.title}</span>
              </div>
              <div className="detail-item">
                <span className="detail-label">Département</span>
                <span className="detail-value">{user.company.department}</span>
              </div>
            </div>
          </section>

          {/* Section Éducation */}
          <section className="detail-section">
            <h2>🎓 Éducation</h2>
            <div className="detail-grid">
              <div className="detail-item">
                <span className="detail-label">Université</span>
                <span className="detail-value">{user.university}</span>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  )
}

export default UserDetail