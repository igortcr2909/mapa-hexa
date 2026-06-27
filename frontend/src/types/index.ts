export interface AuthResponse {
  token: string
  userId: string
  nome: string
  email: string
  tokenType: string
  expiresIn: number
}

export interface UserData {
  id: string
  nome: string
  email: string
  avatarUrl?: string
  criadoEm?: number
}

export interface Evento {
  id: string
  organizadorId: string
  organizadorNome: string
  titulo: string
  jogo: string
  data: string
  horario: string
  nomeLocal: string
  endereco?: string
  lat?: number
  lng?: number
  descricao?: string
  oQueLevar?: string
  infraestrutura?: string
  maxParticipantes?: number
  totalInscritos: number
  usuarioInscrito: boolean
  criadoEm: number
}

export interface EventoRequest {
  titulo: string
  jogo: string
  data: string
  horario: string
  nomeLocal: string
  endereco?: string
  lat?: number
  lng?: number
  descricao?: string
  oQueLevar?: string
  infraestrutura?: string
  maxParticipantes?: number
}

export interface Inscricao {
  id: string
  eventoId: string
  userId: string
  userNome: string
  criadoEm: number
}

export interface MensagemMural {
  id: string
  eventoId: string
  autorId: string
  autorNome: string
  conteudo: string
  ehOrganizador: boolean
  criadoEm: number
}
