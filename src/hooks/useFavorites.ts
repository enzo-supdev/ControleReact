import { useState, useEffect } from 'react'

export function useFavorites() {
  const [favorites, setFavorites] = useState<number[]>(() => {
    try {
      const savedFavorites = localStorage.getItem('favorites')
      return savedFavorites ? JSON.parse(savedFavorites) : []
    } catch (error) {
      console.error('Erreur lors du chargement des favoris:', error)
      return []
    }
  })

  useEffect(() => {
    try {
      localStorage.setItem('favorites', JSON.stringify(favorites))
    } catch (error) {
      console.error('Erreur lors de la sauvegarde des favoris:', error)
    }
  }, [favorites])

  const toggleFavorite = (userId: number) => {
    setFavorites(prev => {
      if (prev.includes(userId)) {
        return prev.filter(id => id !== userId)
      } else {
        return [...prev, userId]
      }
    })
  }

  const isFavorite = (userId: number) => {
    return favorites.includes(userId)
  }

  return { favorites, toggleFavorite, isFavorite }
}