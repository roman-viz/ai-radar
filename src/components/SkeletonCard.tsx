export function SkeletonCard() {
  return (
    <div className="card skeleton" aria-hidden="true">
      <div className="card-head">
        <span className="sk sk-icon" />
        <div className="card-id">
          <span className="sk sk-line" style={{ width: '70%' }} />
          <span className="sk sk-line sk-sm" style={{ width: '40%' }} />
        </div>
      </div>
      <div className="sk-body">
        <span className="sk sk-line" />
        <span className="sk sk-line" />
        <span className="sk sk-line" style={{ width: '60%' }} />
      </div>
      <div className="card-bottom">
        <span className="sk sk-pill" />
        <div className="card-foot">
          <span className="sk sk-line sk-sm" style={{ width: 56 }} />
          <span className="sk sk-pill" style={{ width: 72, height: 38, borderRadius: 10 }} />
        </div>
      </div>
    </div>
  )
}
