import { BeforeAfter } from './components/BeforeAfter'
import { BookingForm } from './components/BookingForm'
import { Header } from './components/Header'
import { ArrowIcon, WhatsAppIcon } from './components/icons'
import { TreatmentGallery } from './components/TreatmentGallery'
import { testimonials } from './content'
import { buildWhatsAppUrl } from './lib/booking'

const directWhatsAppUrl = buildWhatsAppUrl(
  {
    name: 'Paciente',
    phone: 'A combinar',
    treatment: 'Avaliação inicial',
    preferredDate: 'A combinar',
    preferredTime: 'A combinar',
  },
  import.meta.env.VITE_WHATSAPP_NUMBER as string | undefined,
)

function App() {
  return (
    <div id="inicio" className="min-h-screen overflow-x-clip bg-clinic-pink text-ink">
      <Header />

      <main>
        <section className="hero-section" aria-labelledby="hero-title">
          <div className="page-grid grid items-end gap-10 lg:grid-cols-[minmax(0,0.79fr)_minmax(440px,1.1fr)] lg:gap-14">
            <div className="pb-1 lg:pb-12">
              <p className="eyebrow">Estética facial e corporal · São Paulo</p>
              <h1 id="hero-title" className="mt-7 max-w-[13ch] font-display text-[clamp(3.25rem,8vw,7.3rem)] leading-[0.88] font-medium tracking-[-0.055em]">
                Antes de indicar um procedimento, olhamos sua pele <em className="font-normal text-rose">de perto.</em>
              </h1>
              <p className="mt-8 max-w-lg text-[1.02rem] leading-7 text-muted md:text-lg md:leading-8">
                Avaliação individual, protocolos explicados com clareza e acompanhamento depois de cada sessão.
              </p>
              <div className="mt-8 flex flex-wrap items-center gap-5">
                <a className="button-primary" href="#agendamento">
                  Solicitar avaliação
                  <ArrowIcon className="size-4" />
                </a>
                <a className="text-link" href="#tratamentos">Ver tratamentos</a>
              </div>
            </div>

            <figure className="hero-figure">
              <div className="hero-image-wrap">
                <img
                  src="/images/hero-marina.jpg"
                  alt="Marina Avelar, biomédica esteta responsável pela clínica"
                  width="1122"
                  height="1402"
                  fetchPriority="high"
                />
              </div>
              <figcaption className="hero-caption">
                <span>Responsável técnica</span>
                <strong>Marina Avelar</strong>
                <small>Biomédica esteta · 9 anos de prática clínica</small>
              </figcaption>
            </figure>
          </div>
        </section>

        <section id="clinica" className="section-cream scroll-mt-6">
          <div className="page-grid grid gap-12 lg:grid-cols-[minmax(0,1.08fr)_minmax(340px,0.75fr)] lg:items-end lg:gap-18">
            <figure>
              <img
                className="aspect-[3/2] w-full object-cover"
                src="/images/clinica-interior.jpg"
                alt="Sala de atendimento da Clínica Olívia Salles"
                width="1536"
                height="1024"
                loading="lazy"
              />
              <figcaption className="mt-3 text-xs text-muted">Sala de atendimento facial · unidade Jardim Paulista</figcaption>
            </figure>

            <div>
              <p className="eyebrow">A clínica</p>
              <h2 className="section-title mt-6">Um plano de cuidado começa pelo que sua pele precisa agora.</h2>
              <p className="mt-7 text-base leading-8 text-muted">
                A Clínica Olívia Salles atende com hora marcada e agenda reduzida. Na primeira consulta, conversamos sobre histórico, rotina, sensibilidade e tratamentos anteriores antes de definir qualquer procedimento.
              </p>
              <div className="mt-9 border-t border-gold/65">
                {[
                  ['Avaliação antes da indicação', 'A decisão considera pele, saúde, expectativa e tempo disponível para recuperação.'],
                  ['Protocolos sem pacote fechado', 'As sessões são combinadas apenas quando fazem sentido para o objetivo discutido.'],
                  ['Acompanhamento após o atendimento', 'Você recebe orientações claras e um canal para relatar como a pele está reagindo.'],
                ].map(([title, text]) => (
                  <div className="grid gap-2 border-b border-gold/50 py-5 sm:grid-cols-[0.78fr_1fr] sm:gap-6" key={title}>
                    <h3 className="font-medium">{title}</h3>
                    <p className="text-sm leading-6 text-muted">{text}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section id="tratamentos" className="section-pink scroll-mt-6" aria-labelledby="treatments-title">
          <div className="page-grid">
            <div className="grid gap-6 md:grid-cols-[0.62fr_1fr] md:items-end">
              <p className="eyebrow">Tratamentos</p>
              <div>
                <h2 id="treatments-title" className="section-title max-w-3xl">Indicações explicadas antes de qualquer decisão.</h2>
                <p className="mt-5 max-w-2xl text-base leading-7 text-muted">
                  Selecione um tratamento para entender em que situações ele costuma ser considerado e quanto tempo a sessão leva.
                </p>
              </div>
            </div>
            <TreatmentGallery />
          </div>
        </section>

        <section id="resultados" className="section-cream scroll-mt-6" aria-labelledby="results-title">
          <div className="page-grid">
            <div className="grid gap-7 lg:grid-cols-[0.7fr_1fr] lg:items-end">
              <div>
                <p className="eyebrow">Antes e depois</p>
                <h2 id="results-title" className="section-title mt-6 max-w-xl">Mudanças reais costumam ser graduais.</h2>
              </div>
              <p className="max-w-2xl text-base leading-8 text-muted lg:justify-self-end">
                Este comparativo ilustra uma melhora sutil de textura após um protocolo fictício de cuidado da pele. Arraste a linha para observar; resposta, número de sessões e manutenção variam de pessoa para pessoa.
              </p>
            </div>
            <div className="mt-10">
              <BeforeAfter />
            </div>
            <div className="mt-5 flex flex-col gap-3 border-t border-gold/55 pt-4 text-xs leading-5 text-muted sm:flex-row sm:justify-between">
              <p>Controle ilustrativo para esta peça de portfólio.</p>
              <p className="max-w-2xl sm:text-right">Imagens e caso são fictícios. Nenhum resultado é garantido; a indicação depende de avaliação profissional.</p>
            </div>
          </div>
        </section>

        <section id="equipe" className="section-pink scroll-mt-6" aria-labelledby="team-title">
          <div className="page-grid grid gap-12 lg:grid-cols-[minmax(320px,0.72fr)_minmax(0,1fr)] lg:gap-20">
            <div className="overflow-hidden">
              <img
                className="aspect-[4/5] w-full object-cover object-[58%_center]"
                src="/images/hero-marina.jpg"
                alt="Retrato de Marina Avelar"
                width="1122"
                height="1402"
                loading="lazy"
              />
            </div>
            <div className="self-center">
              <p className="eyebrow">Equipe</p>
              <h2 id="team-title" className="section-title mt-6">Marina Avelar</h2>
              <p className="mt-3 font-display text-2xl italic text-rose">Biomedicina estética e tecnologias da pele</p>
              <p className="mt-8 max-w-2xl text-base leading-8 text-muted">
                Marina conduz as avaliações e os protocolos faciais da clínica. Sua prática é voltada a tratamentos graduais, com registro de evolução e indicação conservadora de injetáveis e tecnologias.
              </p>
              <dl className="mt-9 grid gap-0 border-t border-gold/65 sm:grid-cols-2">
                <div className="border-b border-gold/50 py-5 sm:pr-7">
                  <dt className="data-label">Formação</dt>
                  <dd className="mt-2 text-sm leading-6">Biomedicina, habilitação em estética e pós-graduação em saúde da pele</dd>
                </div>
                <div className="border-b border-gold/50 py-5 sm:border-l sm:pl-7">
                  <dt className="data-label">Atuação</dt>
                  <dd className="mt-2 text-sm leading-6">Avaliação facial, tecnologias, peelings e protocolos combinados</dd>
                </div>
              </dl>
              <p className="mt-5 text-xs leading-5 text-muted">Perfil profissional criado exclusivamente para este projeto conceitual.</p>
            </div>
          </div>
        </section>

        <section className="section-cream" aria-labelledby="testimonials-title">
          <div className="page-grid">
            <div className="grid gap-5 md:grid-cols-[0.62fr_1fr] md:items-end">
              <p className="eyebrow">Relatos de atendimento</p>
              <h2 id="testimonials-title" className="section-title max-w-3xl">O que as pacientes lembram depois da consulta.</h2>
            </div>
            <div className="mt-12 grid border-t border-gold/65 md:grid-cols-2">
              {testimonials.map((testimonial, index) => (
                <blockquote className={`testimonial ${index % 2 === 1 ? 'md:border-l md:pl-8' : 'md:pr-8'}`} key={testimonial.patient}>
                  <p>“{testimonial.quote}”</p>
                  <footer className="mt-7 flex items-end justify-between gap-6 text-xs text-muted">
                    <cite className="not-italic font-semibold text-ink">{testimonial.patient}</cite>
                    <span className="text-right">{testimonial.context}</span>
                  </footer>
                </blockquote>
              ))}
            </div>
          </div>
        </section>

        <section id="agendamento" className="section-pink scroll-mt-6" aria-labelledby="booking-title">
          <div className="page-grid">
            <div className="grid gap-6 md:grid-cols-[0.62fr_1fr] md:items-end">
              <p className="eyebrow">Agendamento</p>
              <div>
                <h2 id="booking-title" className="section-title max-w-3xl">Conte como prefere ser atendida.</h2>
                <p className="mt-5 max-w-2xl text-base leading-7 text-muted">Você envia uma preferência; a equipe confirma o melhor horário pelo WhatsApp.</p>
              </div>
            </div>
            <div className="mt-12 bg-cream p-5 sm:p-8 lg:p-12">
              <BookingForm />
            </div>
          </div>
        </section>

        <section id="contato" className="section-cream scroll-mt-6" aria-labelledby="contact-title">
          <div className="page-grid grid gap-12 lg:grid-cols-[minmax(0,0.8fr)_minmax(380px,1fr)] lg:gap-20">
            <div>
              <p className="eyebrow">Localização e contato</p>
              <h2 id="contact-title" className="section-title mt-6">Atendimento com hora marcada no Jardim Paulista.</h2>
              <address className="mt-9 not-italic">
                <p className="font-display text-2xl leading-tight">Alameda das Acácias, 184 · sala 31</p>
                <p className="mt-2 text-sm text-muted">Jardim Paulista · São Paulo — SP</p>
              </address>
              <a className="text-link mt-7 inline-flex" href="https://www.google.com/maps/search/?api=1&query=Jardim+Paulista+S%C3%A3o+Paulo" target="_blank" rel="noreferrer">
                Abrir localização no mapa
              </a>
            </div>
            <div className="border-t border-gold/65">
              <div className="contact-row">
                <span>Segunda a sexta</span>
                <strong>9h às 19h</strong>
              </div>
              <div className="contact-row">
                <span>Sábado</span>
                <strong>9h às 14h</strong>
              </div>
              <div className="contact-row">
                <span>Telefone</span>
                <a href="tel:+5511999999999">(11) 99999-9999</a>
              </div>
              <div className="contact-row">
                <span>Instagram</span>
                <a href="https://instagram.com" target="_blank" rel="noreferrer">@clinicaoliviasalles</a>
              </div>
              <p className="mt-4 text-xs leading-5 text-muted">Endereço, telefone e perfis são fictícios e aparecem apenas para demonstrar a experiência completa do site.</p>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-gold/50 bg-clinic-pink py-8">
        <div className="page-grid flex flex-col gap-5 text-xs leading-5 text-muted sm:flex-row sm:items-end sm:justify-between">
          <p><span className="font-display text-lg font-semibold text-ink">Olívia Salles</span><br />Projeto conceitual de portfólio. Todo o conteúdo é fictício.</p>
          <p className="sm:text-right">© 2026 Clínica Olívia Salles<br />Estética com indicação responsável.</p>
        </div>
      </footer>

      <a className="whatsapp-dock" href={directWhatsAppUrl} target="_blank" rel="noreferrer" aria-label="Conversar com a clínica pelo WhatsApp">
        <WhatsAppIcon className="size-4" />
        <span>WhatsApp</span>
      </a>
    </div>
  )
}

export default App
