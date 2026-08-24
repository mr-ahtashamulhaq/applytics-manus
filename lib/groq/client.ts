import Groq from 'groq-sdk'

let client: Groq | null = null

export function getGroqClient() {
  if (client) return client

  const apiKey = process.env.GROQ_API_KEY
  if (!apiKey) throw new Error('Missing required server environment variable: GROQ_API_KEY')

  client = new Groq({ apiKey })
  return client
}

// The model to use for resume generation
// llama-3.3-70b-versatile has a large 128k context window — good for long resumes
export const GROQ_MODEL = 'llama-3.3-70b-versatile'
