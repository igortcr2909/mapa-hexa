import api from './axios'
import type { MensagemMural } from '../types'

export const listarMural = (eventoId: string) =>
  api.get<MensagemMural[]>(`/eventos/${eventoId}/mural`)

export const publicarMensagem = (eventoId: string, conteudo: string) =>
  api.post<MensagemMural>(`/eventos/${eventoId}/mural`, { conteudo })
