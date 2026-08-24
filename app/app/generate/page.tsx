import GenerateForm from '@/components/generate/GenerateForm'

export const metadata = {
  title: 'Applytics',
  description: 'Paste a job description and get an AI-tailored, ATS-optimised resume in seconds.',
}

export default function GeneratePage() {
  return (
    <div className="max-w-2xl mx-auto w-full">
      <div className="mb-8">
        <p className="text-label mb-1">AI Resume Generator</p>
        <h1 className="text-h1" style={{ color: 'var(--ink-deep)' }}>Generate Resume</h1>
        <p className="mt-2 text-sm" style={{ color: 'var(--steel)', maxWidth: '52ch' }}>
          Paste any job description. Applytics tailors your profile to match - rewriting bullets, surfacing keywords, and scoring your fit.
        </p>
      </div>

      <GenerateForm />
    </div>
  )
}
