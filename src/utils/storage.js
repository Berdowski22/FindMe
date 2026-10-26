import { seedJobs } from '../models/seedJobs'

const USERS = 'findme_users'
const JOBS = 'findme_jobs'
const SESSION = 'findme_session'

const read = (key, fallback) => {
  try {
    return JSON.parse(localStorage.getItem(key)) ?? fallback
  } catch {
    return fallback
  }
}
const write = (key, value) => localStorage.setItem(key, JSON.stringify(value))

export const getUsers = () => read(USERS, [])
export const saveUsers = (u) => write(USERS, u)

export const getSessionId = () => read(SESSION, null)
export const setSessionId = (id) =>
  id ? write(SESSION, id) : localStorage.removeItem(SESSION)

export function getJobs() {
  const jobs = read(JOBS, null)
  if (jobs) return jobs
  write(JOBS, seedJobs)
  return seedJobs
}
export const saveJobs = (j) => write(JOBS, j)
