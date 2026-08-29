import { MapPinIcon } from 'lucide-react'

export function LocationMap() {
  return (
    <figure className="location-map">
      <svg
        viewBox="0 0 720 500"
        role="img"
        aria-label="Mapa ilustrado da região do Jardim Paulista"
        preserveAspectRatio="xMidYMid meet"
      >
        <rect width="720" height="500" fill="var(--card)" />
        <g className="map-blocks" fill="var(--background)">
          <path d="M28 36h168v94H28zM230 36h210v94H230zM474 36h218v94H474z" />
          <path d="M28 166h168v120H28zM230 166h210v120H230zM474 166h218v120H474z" />
          <path d="M28 324h168v142H28zM230 324h210v142H230zM474 324h218v142H474z" />
        </g>
        <g className="map-streets" fill="none" stroke="var(--gold)" strokeWidth="2">
          <path d="M0 148h720" />
          <path d="M0 305h720" />
          <path d="M214 0v500" />
          <path d="M456 0v500" />
        </g>
        <path className="map-route" d="M84 410C176 342 260 376 344 302S484 184 628 101" fill="none" stroke="var(--primary)" strokeWidth="5" strokeLinecap="round" />
        <g className="map-labels" fill="var(--muted-foreground)">
          <text x="34" y="143">Al. Santos</text>
          <text x="34" y="300">Av. Paulista</text>
          <text x="221" y="28" transform="rotate(90 221 28)">R. Pamplona</text>
          <text x="463" y="28" transform="rotate(90 463 28)">Al. Campinas</text>
        </g>
        <g transform="translate(424 235)">
          <circle r="32" fill="var(--card)" stroke="var(--gold)" strokeWidth="2" />
          <MapPinIcon x="-14" y="-14" width="28" height="28" color="var(--primary)" strokeWidth="1.35" aria-hidden="true" />
        </g>
        <g transform="translate(474 225)">
          <rect width="202" height="54" fill="var(--card)" stroke="var(--gold)" />
          <text x="16" y="23" fill="var(--foreground)" className="map-clinic-name">Clínica Olívia Salles</text>
          <text x="16" y="41" fill="var(--muted-foreground)" className="map-clinic-address">Alameda das Acácias, 184</text>
        </g>
      </svg>
      <figcaption>
        <span>Jardim Paulista</span>
        <span>Mapa ilustrativo · projeto conceitual</span>
      </figcaption>
    </figure>
  )
}
