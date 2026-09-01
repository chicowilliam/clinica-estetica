import { MapPinIcon } from 'lucide-react'

export function LocationMap() {
  return (
    <figure className="location-map">
      <div className="map-canvas">
        <svg
          viewBox="0 0 720 500"
          role="img"
          aria-label="Mapa ilustrado da região do Jardim Paulista"
          preserveAspectRatio="xMidYMid slice"
        >
          <title>Clínica Olívia Salles no Jardim Paulista</title>
          <desc>
            Mapa editorial com a Avenida Paulista, Alameda Santos, ruas do entorno, Parque Trianon,
            estação Trianon-Masp e o marcador da clínica.
          </desc>

          <rect width="720" height="500" fill="var(--map-ground, #f2e7e7)" />

          <g className="map-blocks" fill="var(--card)" stroke="var(--map-line, #d8bbb6)" strokeWidth="1.2">
            <path d="M-18 18 126 7l18 88-151 20Z" />
            <path d="m164 5 139 2 9 79-132 13Z" />
            <path d="m337 5 142 9-10 69-142 3Z" />
            <path d="m516 19 182 17-8 73-183-20Z" />
            <path d="m6 142 152-18 15 92-161 19Z" />
            <path d="m198 120 116-11 11 91-114 14Z" />
            <path d="m343 109 132 2-9 83-127 7Z" />
            <path d="m505 119 188 17-9 78-184-10Z" />
            <path d="m25 263 163-22 16 94-172 28Z" />
            <path d="m229 238 104-14 12 85-102 18Z" />
            <path d="m367 222 107-5-5 80-111 9Z" />
            <path d="m505 230 167 4-12 77-169-10Z" />
            <path d="m43 387 180-30 19 112-190 27Z" />
            <path d="m274 347 102-17 12 116-99 18Z" />
            <path d="m416 324 104-6-3 108-111 13Z" />
            <path d="m553 329 153 12 2 112-168-19Z" />
          </g>

          <g className="map-lots" fill="none" stroke="var(--map-line, #d8bbb6)" strokeWidth="0.8" opacity="0.68">
            <path d="m59 13 16 91M222 6l8 88M402 9l-7 75M591 26l-9 72" />
            <path d="m73 135 12 91M260 114l9 92M407 110l-5 87M586 126l-6 84" />
            <path d="m98 253 15 96M288 231l10 88M421 219l-4 82M581 231l-8 76" />
            <path d="m116 375 19 107M331 338l10 116M468 321l-4 111M628 335l-6 108" />
          </g>

          <path
            className="map-park"
            d="m321 115 150 1-10 79-124 7-13-43Z"
            fill="var(--map-park, #dfe4d4)"
            stroke="var(--map-park-line, #aab89b)"
            strokeWidth="1.4"
          />
          <g className="map-park-paths" fill="none" stroke="var(--map-park-line, #aab89b)" strokeWidth="1" opacity="0.85">
            <path d="M337 184c31-36 74-25 118-54M353 126c22 22 59 39 100 53" />
            <circle cx="382" cy="153" r="3" fill="var(--map-park-line, #aab89b)" />
            <circle cx="419" cy="138" r="2.5" fill="var(--map-park-line, #aab89b)" />
            <circle cx="430" cy="175" r="3" fill="var(--map-park-line, #aab89b)" />
          </g>

          <g className="map-road-casings" fill="none" stroke="var(--map-line, #d8bbb6)" strokeLinecap="round" strokeLinejoin="round">
            <path d="M-25 132 735 78" strokeWidth="25" />
            <path d="M-28 254 733 194" strokeWidth="25" />
            <path d="M-35 384 742 282" strokeWidth="42" />
            <path d="M146-20 258 520" strokeWidth="23" />
            <path d="M309-20 405 520" strokeWidth="23" />
            <path d="M492-20 531 520" strokeWidth="23" />
            <path d="M680-20 646 520" strokeWidth="23" />
          </g>
          <g className="map-streets" fill="none" stroke="var(--map-road, #fbf7f3)" strokeLinecap="round" strokeLinejoin="round">
            <path d="M-25 132 735 78" strokeWidth="20" />
            <path d="M-28 254 733 194" strokeWidth="20" />
            <path d="M-35 384 742 282" strokeWidth="36" />
            <path d="M146-20 258 520" strokeWidth="18" />
            <path d="M309-20 405 520" strokeWidth="18" />
            <path d="M492-20 531 520" strokeWidth="18" />
            <path d="M680-20 646 520" strokeWidth="18" />
          </g>

          <path
            className="map-walking-route"
            d="M314 352c43-8 75-28 96-62 21-34 48-51 78-61"
            fill="none"
            stroke="var(--primary)"
            strokeWidth="3"
            strokeDasharray="2 9"
            strokeLinecap="round"
          />

          <g className="map-station" transform="translate(304 355)">
            <circle r="12" fill="var(--foreground)" />
            <text x="0" y="4" textAnchor="middle" fill="var(--card)" fontSize="10" fontWeight="700">M</text>
          </g>

          <g className="map-clinic-pin" transform="translate(491 220)">
            <circle r="29" fill="var(--card)" stroke="var(--primary)" strokeWidth="2" opacity="0.98" />
            <MapPinIcon x="-14" y="-14" width="28" height="28" color="var(--primary)" strokeWidth={1.5} aria-hidden="true" />
          </g>

          <g className="map-compass" transform="translate(665 452)" fill="var(--foreground)">
            <path d="M0-20 5 0 0-4-5 0Z" fill="var(--primary)" />
            <text x="0" y="-27" textAnchor="middle" fontSize="10" fontWeight="700">N</text>
            <path d="M-34 15h68" stroke="currentColor" strokeWidth="1.5" />
            <path d="M-34 11v8M0 11v8M34 11v8" stroke="currentColor" strokeWidth="1.5" />
            <text x="0" y="31" textAnchor="middle" fontSize="9">200 m</text>
          </g>
        </svg>

        <span className="map-road-label" aria-hidden="true">Av. Paulista</span>
        <span className="map-park-label" aria-hidden="true">Parque Trianon</span>
        <span className="map-station-label" aria-hidden="true">Metrô Trianon-Masp</span>

        <div className="map-callout" aria-hidden="true">
          <span>Clínica Olívia Salles</span>
          <small>Alameda das Acácias, 184</small>
        </div>
      </div>

      <figcaption>
        <span>Jardim Paulista · 6 min a pé do metrô Trianon-Masp</span>
      </figcaption>
    </figure>
  )
}
