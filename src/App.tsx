import { BeforeAfter } from '@/components/BeforeAfter'
import { BookingForm } from '@/components/BookingForm'
import { CareValues } from '@/components/CareValues'
import { Header } from '@/components/Header'
import { Hero } from '@/components/Hero'
import { LocationMap } from '@/components/LocationMap'
import { Reveal } from '@/components/Reveal'
import { TeamPortrait } from '@/components/TeamPortrait'
import { Testimonials } from '@/components/Testimonials'
import { TreatmentGallery } from '@/components/TreatmentGallery'
import { WhatsAppIcon } from '@/components/icons'
import { Button, ButtonArrow } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { buildWhatsAppUrl } from '@/lib/booking'

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
    <div id="inicio" className="min-h-screen overflow-x-clip bg-background text-foreground">
      <Header />

      <main>
        <Hero />

        <section id="clinica" className="section-cream scroll-mt-6" aria-labelledby="clinic-title">
          <div className="page-grid">
            <div className="grid gap-12 lg:grid-cols-[minmax(0,1.08fr)_minmax(340px,0.75fr)] lg:items-end lg:gap-18">
              <figure>
                <img
                  className="aspect-[3/2] w-full object-cover"
                  src="/images/clinica-interior.jpg"
                  alt="Sala de atendimento da Clínica Olívia Salles"
                  width="1536"
                  height="1024"
                  loading="lazy"
                />
                <figcaption className="mt-3 text-xs text-muted-foreground">Sala de atendimento facial · unidade Jardim Paulista</figcaption>
              </figure>

              <div>
                <p className="eyebrow">A clínica</p>
                <h2 id="clinic-title" className="section-title mt-6">Um plano de cuidado começa pelo que sua pele precisa agora.</h2>
                <p className="body-copy mt-7">
                  A Clínica Olívia Salles atende com hora marcada e agenda reduzida. Na primeira consulta, conversamos sobre histórico, rotina, sensibilidade e tratamentos anteriores antes de definir qualquer procedimento.
                </p>
              </div>
            </div>
            <CareValues />
          </div>
        </section>

        <section id="tratamentos" className="section-pink scroll-mt-6" aria-labelledby="treatments-title">
          <div className="page-grid">
            <div className="grid gap-6 md:grid-cols-[0.62fr_1fr] md:items-end">
              <p className="eyebrow">Tratamentos</p>
              <div>
                <h2 id="treatments-title" className="section-title max-w-3xl">Indicações explicadas antes de qualquer decisão.</h2>
                <p className="body-copy mt-5 max-w-2xl">
                  Selecione um tratamento para entender em que situações ele costuma ser considerado e quanto tempo a sessão leva.
                </p>
              </div>
            </div>
            <TreatmentGallery />
          </div>
        </section>

        <section id="resultados" className="section-cream section-curve scroll-mt-6" aria-labelledby="results-title">
          <Reveal className="page-grid">
            <div className="grid gap-7 lg:grid-cols-[0.7fr_1fr] lg:items-end">
              <div>
                <p className="eyebrow">Antes e depois</p>
                <h2 id="results-title" className="section-title mt-6 max-w-xl">Mudanças reais costumam ser graduais.</h2>
              </div>
              <p className="body-copy max-w-2xl lg:justify-self-end">
                Este comparativo ilustra uma melhora sutil de textura após um protocolo fictício de cuidado da pele. Arraste a linha para observar; resposta, número de sessões e manutenção variam de pessoa para pessoa.
              </p>
            </div>
            <div className="mt-10">
              <BeforeAfter />
            </div>
            <Separator className="mt-5" />
            <div className="mt-4 flex flex-col gap-3 text-xs leading-5 text-muted-foreground sm:flex-row sm:justify-between">
              <p>Controle ilustrativo para esta peça de portfólio.</p>
              <p className="max-w-2xl sm:text-right">Imagens e caso são fictícios. Nenhum resultado é garantido; a indicação depende de avaliação profissional.</p>
            </div>
          </Reveal>
        </section>

        <section id="equipe" className="section-pink scroll-mt-6" aria-labelledby="team-title">
          <div className="page-grid grid gap-12 lg:grid-cols-[minmax(320px,0.72fr)_minmax(0,1fr)] lg:gap-20">
            <TeamPortrait />
            <div className="self-center">
              <p className="eyebrow">Equipe</p>
              <h2 id="team-title" className="section-title mt-6">Marina Avelar</h2>
              <p className="mt-3 font-display text-2xl italic text-primary">Biomedicina estética e tecnologias da pele</p>
              <p className="body-copy mt-8 max-w-2xl">
                Marina conduz as avaliações e os protocolos faciais da clínica. Sua prática é voltada a tratamentos graduais, com registro de evolução e indicação conservadora de injetáveis e tecnologias.
              </p>
              <dl className="team-credentials mt-9 grid sm:grid-cols-2">
                <div>
                  <dt className="data-label">Formação</dt>
                  <dd>Biomedicina, habilitação em estética e pós-graduação em saúde da pele</dd>
                </div>
                <div>
                  <dt className="data-label">Atuação</dt>
                  <dd>Avaliação facial, tecnologias, peelings e protocolos combinados</dd>
                </div>
              </dl>
              <p className="mt-5 text-xs leading-5 text-muted-foreground">Perfil profissional criado exclusivamente para este projeto conceitual.</p>
            </div>
          </div>
        </section>

        <section className="section-cream section-curve" aria-labelledby="testimonials-title">
          <div className="page-grid">
            <div className="grid gap-5 md:grid-cols-[0.62fr_1fr] md:items-end">
              <p className="eyebrow">Relatos de atendimento</p>
              <h2 id="testimonials-title" className="section-title max-w-3xl">O que as pacientes lembram depois da consulta.</h2>
            </div>
            <Testimonials />
          </div>
        </section>

        <section id="agendamento" className="section-pink scroll-mt-6" aria-labelledby="booking-title">
          <Reveal className="page-grid">
            <div className="grid gap-6 md:grid-cols-[0.62fr_1fr] md:items-end">
              <p className="eyebrow">Agendamento</p>
              <div>
                <h2 id="booking-title" className="section-title max-w-3xl">Conte como prefere ser atendida.</h2>
                <p className="body-copy mt-5 max-w-2xl">Você envia uma preferência; a equipe confirma o melhor horário pelo WhatsApp.</p>
              </div>
            </div>
            <div className="elevated-panel mt-12">
              <BookingForm />
            </div>
          </Reveal>
        </section>

        <section id="contato" className="section-cream section-curve scroll-mt-6" aria-labelledby="contact-title">
          <Reveal className="page-grid grid gap-12 lg:grid-cols-[minmax(0,0.8fr)_minmax(380px,1fr)] lg:items-start lg:gap-20">
            <div>
              <p className="eyebrow">Localização e contato</p>
              <h2 id="contact-title" className="section-title mt-6">Atendimento com hora marcada no Jardim Paulista.</h2>
              <address className="mt-9 not-italic">
                <p className="font-display text-2xl leading-tight">Alameda das Acácias, 184 · sala 31</p>
                <p className="mt-2 text-sm text-muted-foreground">Jardim Paulista · São Paulo — SP</p>
              </address>
              <Button asChild variant="secondary" className="mt-7">
                <a href="https://www.google.com/maps/search/?api=1&query=Jardim+Paulista+S%C3%A3o+Paulo" target="_blank" rel="noreferrer">
                  Abrir localização no mapa
                  <ButtonArrow direction="up-right" />
                </a>
              </Button>

              <div className="contact-list mt-10">
                <div className="contact-row"><span>Segunda a sexta</span><strong>9h às 19h</strong></div>
                <Separator />
                <div className="contact-row"><span>Sábado</span><strong>9h às 14h</strong></div>
                <Separator />
                <div className="contact-row"><span>Telefone</span><a href="tel:+5511999999999">(11) 99999-9999</a></div>
                <Separator />
                <div className="contact-row"><span>Instagram</span><a href="https://instagram.com" target="_blank" rel="noreferrer">@clinicaoliviasalles</a></div>
              </div>
            </div>

            <div>
              <LocationMap />
              <p className="mt-4 text-xs leading-5 text-muted-foreground">Endereço, telefone e perfis são fictícios e aparecem apenas para demonstrar a experiência completa do site.</p>
            </div>
          </Reveal>
        </section>
      </main>

      <footer className="border-t border-border bg-background py-8">
        <div className="page-grid flex flex-col gap-5 text-xs leading-5 text-muted-foreground sm:flex-row sm:items-end sm:justify-between">
          <p><span className="font-display text-lg font-semibold text-foreground">Olívia Salles</span><br />Projeto conceitual de portfólio. Todo o conteúdo é fictício.</p>
          <p className="sm:text-right">© 2026 Clínica Olívia Salles<br />Estética com indicação responsável.</p>
        </div>
      </footer>

      <Button asChild variant="control" className="whatsapp-dock">
        <a href={directWhatsAppUrl} target="_blank" rel="noreferrer" aria-label="Conversar com a clínica pelo WhatsApp">
          <WhatsAppIcon />
          <span>WhatsApp</span>
        </a>
      </Button>
    </div>
  )
}

export default App
