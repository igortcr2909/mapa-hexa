import api from './axios'
import type { AuthResponse, UserData } from '../types'

export const register = (nome: string, email: string, password: string) =>
  api.post<AuthResponse>('/auth/register', { nome, email, password })

export const login = (email: string, password: string) =>
  api.post<AuthResponse>('/auth/login', { email, password })

export const getMe = () => api.get<UserData>('/users/me')

export const updateProfile = (data: {
  nome?: string
  currentPassword?: string
  newPassword?: string
  avatarUrl?: string
}) => api.put<UserData>('/users/me', data)
