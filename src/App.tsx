import { AdaptiveExperience } from '@/components/AdaptiveExperience'
import { BeforeAfter } from '@/components/BeforeAfter'
import { BookingForm } from '@/components/BookingForm'
import { CareValues } from '@/components/CareValues'
import { ContrastSection } from '@/components/ContrastSection'
import { Header } from '@/components/Header'
import { Hero } from '@/components/Hero'
import { LocationMap } from '@/components/LocationMap'
import { Magnetic } from '@/components/Magnetic'
import { Reveal } from '@/components/Reveal'
import { TeamPortrait } from '@/components/TeamPortrait'
import { Testimonials } from '@/components/Testimonials'
import { TreatmentMarquee } from '@/components/TreatmentMarquee'
import { TreatmentGallery } from '@/components/TreatmentGallery'
import { WhatsAppDock } from '@/components/WhatsAppDock'
import { Button, ButtonArrow } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'

function App() {
  return (
    <div id="inicio" className="min-h-screen overflow-x-clip bg-background text-foreground">
      <a className="skip-link" href="#conteudo">Ir para o conteúdo</a>
      <AdaptiveExperience />
      <Header />

      <main id="conteudo">
        <Hero />

        <section id="clinica" className="section-cream scroll-mt-28" aria-labelledby="clinic-title">
          <div className="page-grid">
            <Separator className="section-divider" />
            <div className="grid gap-10 lg:grid-cols-[minmax(0,1.08fr)_minmax(340px,0.75fr)] lg:items-end lg:gap-16">
              <figure>
                <div className="clinic-photo photo-frame" data-photo-frame="clinic">
                  <img
                    className="aspect-[3/2] w-full object-cover"
                    src="/images/clinica-interior.jpg"
                    alt="Sala de atendimento da Clínica Olívia Salles"
                    width="1536"
                    height="1024"
                    loading="lazy"
                  />
                </div>
                <figcaption className="mt-2 text-xs text-muted-foreground">Sala de atendimento facial · unidade Jardim Paulista</figcaption>
              </figure>

              <div>
                <p className="eyebrow">A clínica</p>
                <h2 id="clinic-title" className="section-title mt-6">Um plano de cuidado começa pelo que sua pele precisa agora.</h2>
                <p className="body-copy mt-6">
                  A Clínica Olívia Salles atende com hora marcada e agenda reduzida. Na primeira consulta, conversamos sobre histórico, rotina, sensibilidade e tratamentos anteriores antes de definir qualquer procedimento.
                </p>
              </div>
            </div>
            <CareValues />
          </div>
        </section>

        <section id="tratamentos" className="section-pink scroll-mt-28" aria-labelledby="treatments-title">
          <div className="page-grid">
            <Separator className="section-divider" />
            <div className="grid gap-6 md:grid-cols-[0.62fr_1fr] md:items-end">
              <p className="eyebrow">Tratamentos</p>
              <div>
                <h2 id="treatments-title" className="section-title max-w-3xl">Indicações explicadas antes de qualquer decisão.</h2>
                <p className="body-copy mt-6 max-w-2xl">
                  Selecione um tratamento para entender em que situações ele costuma ser considerado e quanto tempo a sessão leva.
                </p>
              </div>
            </div>
            <TreatmentGallery />
          </div>
        </section>

        <TreatmentMarquee />
        <ContrastSection />

        <section id="resultados" className="section-cream scroll-mt-28" aria-labelledby="results-title">
          <Reveal className="page-grid">
            <Separator className="section-divider" />
            <div className="grid gap-6 lg:grid-cols-[0.7fr_1fr] lg:items-end">
              <div>
                <p className="eyebrow">Antes e depois</p>
                <h2 id="results-title" className="section-title mt-6 max-w-xl">Mudanças reais costumam ser graduais.</h2>
              </div>
              <p className="body-copy max-w-2xl lg:justify-self-end">
                Este comparativo ilustra uma melhora sutil de textura após um protocolo de cuidado da pele. Arraste a linha para observar; resposta, número de sessões e manutenção variam de pessoa para pessoa.
              </p>
            </div>
            <div className="results-case-grid mt-10">
              <BeforeAfter />
              <aside className="results-notes" aria-label="Leitura do comparativo">
                <p className="data-label">Leitura do comparativo</p>
                <h3 className="subheading mt-4">O objetivo não é mudar o rosto. É devolver uniformidade à pele.</h3>
                <p className="mt-4 text-sm leading-7 text-muted-foreground">
                  O registro lado a lado ajuda a discutir textura, luminosidade e resposta gradual — sem prometer um resultado padronizado.
                </p>
                <dl className="results-facts mt-8">
                  <div><dt>Protocolo</dt><dd>Cuidado de textura</dd></div>
                  <div><dt>Registro</dt><dd>Mesma luz e posição</dd></div>
                  <div><dt>Indicação</dt><dd>Somente após avaliação</dd></div>
                </dl>
                <p className="mt-6 text-xs leading-5 text-muted-foreground">Imagem ilustrativa. Resposta e número de sessões variam de pessoa para pessoa.</p>
              </aside>
            </div>
          </Reveal>
        </section>

        <section id="equipe" className="section-pink scroll-mt-28" aria-labelledby="team-title">
          <div className="page-grid">
            <Separator className="section-divider" />
            <div className="grid gap-10 lg:grid-cols-[minmax(320px,0.72fr)_minmax(0,1fr)] lg:gap-16">
              <TeamPortrait />
              <div className="self-center">
              <p className="eyebrow">Equipe</p>
              <h2 id="team-title" className="section-title mt-6">Marina Avelar</h2>
              <p className="mt-2 font-display text-2xl italic text-primary">Biomedicina estética e tecnologias da pele</p>
              <p className="body-copy mt-6 max-w-2xl">
                Marina conduz as avaliações e os protocolos faciais da clínica. Sua prática é voltada a tratamentos graduais, com registro de evolução e indicação conservadora de injetáveis e tecnologias.
              </p>
              <dl className="team-credentials mt-10 grid sm:grid-cols-2">
                <div>
                  <dt className="data-label">Formação</dt>
                  <dd>Biomedicina, habilitação em estética e pós-graduação em saúde da pele</dd>
                </div>
                <div>
                  <dt className="data-label">Atuação</dt>
                  <dd>Avaliação facial, tecnologias, peelings e protocolos combinados</dd>
                </div>
              </dl>
              </div>
            </div>
          </div>
        </section>

        <section className="section-cream" aria-labelledby="testimonials-title">
          <div className="page-grid">
            <Separator className="section-divider" />
            <div className="grid gap-6 md:grid-cols-[0.62fr_1fr] md:items-end">
              <p className="eyebrow">Relatos de atendimento</p>
              <h2 id="testimonials-title" className="section-title max-w-3xl">O que as pacientes lembram depois da consulta.</h2>
            </div>
            <Testimonials />
          </div>
        </section>

        <section id="agendamento" className="section-pink scroll-mt-28" aria-labelledby="booking-title">
          <Reveal className="page-grid">
            <Separator className="section-divider" />
            <div className="grid gap-6 md:grid-cols-[0.62fr_1fr] md:items-end">
              <p className="eyebrow">Agendamento</p>
              <div>
                <h2 id="booking-title" className="section-title max-w-3xl">Conte como prefere ser atendida.</h2>
                <p className="body-copy mt-6 max-w-2xl">Você envia uma preferência; a equipe confirma o melhor horário pelo WhatsApp.</p>
              </div>
            </div>
            <div className="mt-10">
              <BookingForm />
            </div>
          </Reveal>
        </section>

        <section id="contato" className="section-cream scroll-mt-28" aria-labelledby="contact-title">
          <Reveal className="page-grid">
            <Separator className="section-divider" />
            <div className="grid gap-10 lg:grid-cols-[minmax(0,0.8fr)_minmax(380px,1fr)] lg:items-start lg:gap-16">
              <div>
              <p className="eyebrow">Localização e contato</p>
              <h2 id="contact-title" className="section-title mt-6">Atendimento com hora marcada no Jardim Paulista.</h2>
              <address className="mt-10 not-italic">
                <p className="font-display text-2xl leading-tight">Alameda das Acácias, 184 · sala 31</p>
                <p className="mt-2 text-sm text-muted-foreground">Jardim Paulista · São Paulo — SP</p>
              </address>
              <Button asChild variant="secondary" className="mt-6">
                <a href="https://www.google.com/maps/search/?api=1&query=Jardim+Paulista+S%C3%A3o+Paulo" target="_blank" rel="noreferrer">
                  Abrir localização no mapa
                  <ButtonArrow direction="up-right" />
                </a>
              </Button>

              <div className="contact-list mt-10">
                <div className="contact-row"><span>Segunda a sexta</span><strong>9h às 19h</strong></div>
                <Separator className="inset-hairline" data-inset-rule />
                <div className="contact-row"><span>Sábado</span><strong>9h às 14h</strong></div>
                <Separator className="inset-hairline" data-inset-rule />
                <div className="contact-row"><span>Telefone</span><a href="tel:+5511999999999">(11) 99999-9999</a></div>
                <Separator className="inset-hairline" data-inset-rule />
                <div className="contact-row"><span>Instagram</span><a href="https://instagram.com" target="_blank" rel="noreferrer">@clinicaoliviasalles</a></div>
              </div>
              </div>

              <LocationMap />
            </div>
          </Reveal>
        </section>
      </main>

      <footer className="site-footer bg-foreground text-primary-foreground">
        <div className="page-grid footer-grid">
          <div>
            <p className="font-display text-3xl font-semibold tracking-[-0.035em]">Olívia Salles</p>
            <p className="mt-3 max-w-xs text-sm leading-6 text-primary-foreground/65">Estética com indicação responsável, tempo de consulta e acompanhamento.</p>
          </div>
          <nav className="footer-nav" aria-label="Navegação do rodapé">
            <a href="#clinica">A clínica</a>
            <a href="#tratamentos">Tratamentos</a>
            <a href="#resultados">Resultados</a>
            <a href="#contato">Contato</a>
          </nav>
          <div className="text-sm leading-7 text-primary-foreground/70">
            <p>Jardim Paulista · São Paulo</p>
            <a href="tel:+5511999999999">(11) 99999-9999</a>
          </div>
          <Magnetic className="footer-magnetic">
            <Button asChild className="footer-cta">
              <a href="#agendamento" data-cursor-label="Agendar">Solicitar avaliação<ButtonArrow /></a>
            </Button>
          </Magnetic>
        </div>
        <div className="page-grid footer-legal">
          <p>© 2026 Clínica Olívia Salles</p>
          <p>Projeto conceitual: nomes, casos, endereço e contatos são fictícios.</p>
        </div>
      </footer>
      <WhatsAppDock />
    </div>
  )
}

export default App
