export type Treatment = {
  name: string
  indication: string
  duration: string
  sheet: '/images/tratamentos-faciais.jpg' | '/images/tratamentos-clinicos.jpg'
  panel: 0 | 1 | 2
  imageDescription: string
}

export const treatments: Treatment[] = [
  {
    name: 'Limpeza de pele profunda',
    indication: 'Para poros obstruídos, cravos e pele com excesso de oleosidade.',
    duration: '75 a 90 min',
    sheet: '/images/tratamentos-faciais.jpg',
    panel: 0,
    imageDescription: 'Procedimento de limpeza de pele profunda sob luz de aumento',
  },
  {
    name: 'Harmonização facial',
    indication: 'Para ajustes pontuais de proporção, sempre após avaliação presencial.',
    duration: '60 a 90 min',
    sheet: '/images/tratamentos-clinicos.jpg',
    panel: 0,
    imageDescription: 'Avaliação de proporções para harmonização facial',
  },
  {
    name: 'Peeling',
    indication: 'Para textura irregular, manchas superficiais e renovação controlada da pele.',
    duration: '40 a 60 min',
    sheet: '/images/tratamentos-faciais.jpg',
    panel: 1,
    imageDescription: 'Aplicação cuidadosa de peeling facial com pincel',
  },
  {
    name: 'Drenagem linfática',
    indication: 'Para retenção de líquidos, sensação de peso e cuidados no pós-operatório indicado.',
    duration: '50 a 60 min',
    sheet: '/images/tratamentos-clinicos.jpg',
    panel: 1,
    imageDescription: 'Sessão manual de drenagem linfática nas pernas',
  },
  {
    name: 'Microagulhamento',
    indication: 'Para cicatrizes de acne, poros aparentes e estímulo gradual de colágeno.',
    duration: '60 a 75 min',
    sheet: '/images/tratamentos-faciais.jpg',
    panel: 2,
    imageDescription: 'Preparação para uma sessão de microagulhamento facial',
  },
  {
    name: 'Laser',
    indication: 'Para protocolos de manchas, vasos e estímulo de colágeno conforme o equipamento indicado.',
    duration: '30 a 60 min',
    sheet: '/images/tratamentos-clinicos.jpg',
    panel: 2,
    imageDescription: 'Aplicação facial de laser com proteção ocular',
  },
]

export const testimonials = [
  {
    quote:
      'Na primeira consulta, a Marina descartou dois procedimentos que eu achava necessários e explicou o motivo. Começamos com um protocolo mais simples e minha pele respondeu muito bem.',
    patient: 'L. M.',
    context: 'Limpeza de pele e peeling · fev. 2026',
  },
  {
    quote:
      'Gostei de saber o que seria feito em cada etapa e como cuidar da pele nos dias seguintes. O acompanhamento depois da sessão fez diferença.',
    patient: 'C. R.',
    context: 'Microagulhamento · nov. 2025',
  },
  {
    quote:
      'A drenagem foi adaptada ao meu pós-operatório e não seguiu um protocolo pronto. O atendimento foi cuidadoso e sem pressa.',
    patient: 'A. F.',
    context: 'Drenagem linfática · jan. 2026',
  },
  {
    quote:
      'Eu tinha receio de ficar com um resultado marcado. A avaliação foi objetiva, o plano foi conservador e respeitou o que eu pedi.',
    patient: 'B. N.',
    context: 'Harmonização facial · set. 2025',
  },
]
