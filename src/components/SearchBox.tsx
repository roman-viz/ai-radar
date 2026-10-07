import { CloseIcon, SearchIcon } from './Icons'

interface Props {
  value: string
  onChange: (value: string) => void
  id?: string
  label?: string
  placeholder?: string
  className?: string
}

export function SearchBox({
  value,
  onChange,
  id = 'search',
  label = 'Search AI websites',
  placeholder = 'Search AI tools and websites',
  className = '',
}: Props) {
  return (
    <form className={`search ${className}`.trim()} role="search" onSubmit={(e) => e.preventDefault()}>
      <label htmlFor={id} className="sr-only">
        {label}
      </label>
      <SearchIcon className="search-icon" width={20} height={20} />
      <input
        id={id}
        type="search"
        className={value ? 'has-value' : undefined}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        autoComplete="off"
        spellCheck={false}
        enterKeyHint="search"
      />
      {value && (
        <button type="button" className="icon-btn search-clear" onClick={() => onChange('')} aria-label="Clear search">
          <CloseIcon width={16} height={16} />
        </button>
      )}
    </form>
  )
}
