function SkeletonCard() {
  return (
    <div className="user-card skeleton-card">
      <div className="skeleton-image"></div>
      <div className="skeleton-content">
        <div className="skeleton-line skeleton-line-title"></div>
        <div className="skeleton-line skeleton-line-subtitle"></div>
        <div className="skeleton-line"></div>
        <div className="skeleton-line"></div>
        <div className="skeleton-line skeleton-line-short"></div>
      </div>
    </div>
  )
}

function SkeletonLoader() {
  return (
    <div className="user-grid fade-in">
      {[...Array(8)].map((_, index) => (
        <SkeletonCard key={index} />
      ))}
    </div>
  )
}

export default SkeletonLoader