import Groq from 'groq-sdk'

export const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY!,
})

// The model to use for resume generation
// llama-3.3-70b-versatile has a large 128k context window — good for long resumes
export const GROQ_MODEL = 'llama-3.3-70b-versatile'
