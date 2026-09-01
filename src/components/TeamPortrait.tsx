export function TeamPortrait() {
  return (
    <div className="team-portrait" data-team-portrait>
      <div className="team-portrait-frame photo-frame" data-photo-frame="team" data-team-frame>
        <img
          src="/images/hero-marina.jpg"
          alt="Retrato de Marina Avelar"
          width="1122"
          height="1402"
          loading="lazy"
          decoding="async"
          data-team-image
        />
      </div>
      <p className="team-portrait-note">Atendimento clínico com agenda reduzida</p>
    </div>
  )
}
