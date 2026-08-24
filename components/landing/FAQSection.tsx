const QUESTIONS = [
  {
    question: 'Which job sources are available now?',
    answer: 'Mustakbil is the first verified live source. LinkedIn, Indeed, and Rozee are not in the automatic feed until their access and listing parsing are verified.',
  },
  {
    question: 'How do recommendations work?',
    answer: 'Applytics compares your stored profile skills and city with catalog job text. It shows the matching evidence and excludes listings with no positive signal.',
  },
  {
    question: 'Can I use a generated resume without reviewing it?',
    answer: 'No. Review every skill, employer, date, project, number, and other statement before you use the PDF. Validation reduces unsupported claims, but it cannot replace your review.',
  },
  {
    question: 'What does the application tracker connect?',
    answer: 'You can create a manual application or link an application to a catalog job and an owned generated resume. The tracker also stores status, dates, deadlines, follow-ups, outcomes, and notes.',
  },
  {
    question: 'Does early access cost anything?',
    answer: 'Applytics is free during early access. The available workflow can change while the product and source coverage are being validated.',
  },
]

export default function FAQSection() {
  return (
    <section id="faq" className="w-full" style={{ background: 'var(--surface)', padding: 'clamp(64px, 8vw, 112px) 0' }}>
      <div className="mx-auto max-w-[900px] px-6">
        <div className="mb-12 flex items-center gap-4">
          <span className="text-xs font-semibold uppercase tracking-widest" style={{ color: 'var(--steel)', fontFamily: 'var(--font-geist-mono)' }}>FAQ</span>
          <div style={{ flex: 1, height: '1px', background: 'var(--hairline-strong)' }} />
        </div>
        <div className="mb-10">
          <h2 className="text-4xl font-bold lg:text-5xl" style={{ color: 'var(--ink-deep)', letterSpacing: '-1.5px', lineHeight: 1.1 }}>Clear answers before you start.</h2>
          <p className="mt-4 max-w-[560px] text-lg" style={{ color: 'var(--slate)' }}>The current product scope is small on purpose. These answers describe what is available today.</p>
        </div>
        <div className="border-t" style={{ borderColor: 'var(--hairline)' }}>
          {QUESTIONS.map((item) => (
            <details key={item.question} className="group border-b py-5" style={{ borderColor: 'var(--hairline)' }}>
              <summary className="flex min-h-11 cursor-pointer list-none items-center justify-between gap-6 text-base font-semibold" style={{ color: 'var(--ink-deep)' }}>
                {item.question}
                <span className="text-xl font-normal" style={{ color: 'var(--brand-red)' }} aria-hidden="true">+</span>
              </summary>
              <p className="max-w-[680px] pt-3 text-sm leading-6" style={{ color: 'var(--charcoal)' }}>{item.answer}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  )
}
