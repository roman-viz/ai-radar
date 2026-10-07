import { SearchBox } from './SearchBox'

const IDEAS = ['video editing', 'voice agent', 'code review', 'image upscaler']

interface Props {
  value: string
  onChange: (value: string) => void
}

export function Hero({ value, onChange }: Props) {
  return (
    <section className="hero" aria-labelledby="hero-title">
      <div className="hero-rings" aria-hidden="true">
        <span className="sweep" />
      </div>
      <div className="hero-inner">
        <p className="eyebrow">AI website discovery</p>
        <h1 id="hero-title">
          Discover the <span>AI web.</span>
        </h1>
        <p className="hero-copy">
          AI Radar surfaces AI products and tools found across the open web through FreeSERP — search them, narrow them
          down, and jump straight to the source.
        </p>

        <SearchBox value={value} onChange={onChange} />

        <p className="ideas">
          <span>Try</span>
          {IDEAS.map((idea) => (
            <button key={idea} type="button" onClick={() => onChange(idea)}>
              {idea}
            </button>
          ))}
        </p>
      </div>
    </section>
  )
}
