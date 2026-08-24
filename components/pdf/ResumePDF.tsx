import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  Font,
  Link,
} from '@react-pdf/renderer'
import type { AIResult } from '@/lib/actions/generate'

// Prevent word hyphenation
Font.registerHyphenationCallback((word) => [word])

// ── Styles ───────────────────────────────────────────────────────
const s = StyleSheet.create({
  page: {
    fontFamily: 'Helvetica',
    fontSize: 10,
    color: '#1a1a1a',
    paddingTop: 44,
    paddingBottom: 44,
    paddingHorizontal: 52,
    lineHeight: 1.4,
  },

  // ── HEADER (centered) ─────────────────────────────────────────
  header: {
    alignItems: 'center',
    marginBottom: 14,
  },
  name: {
    fontSize: 22,
    fontFamily: 'Helvetica-Bold',
    color: '#0f0f0f',
    letterSpacing: 0.8,
    textAlign: 'center',
    marginBottom: 5,
  },
  contactRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 4,
  },
  contactSep: {
    fontSize: 8.5,
    color: '#999',
    marginHorizontal: 2,
  },
  contactItem: {
    fontSize: 8.5,
    color: '#444',
  },
  contactLink: {
    fontSize: 8.5,
    color: '#2563eb',
    textDecoration: 'none',
  },

  // ── SECTION ───────────────────────────────────────────────────
  section: {
    marginBottom: 13,
  },
  sectionTitle: {
    fontSize: 8.5,
    fontFamily: 'Helvetica-Bold',
    color: '#de0d12',
    textTransform: 'uppercase',
    letterSpacing: 1.5,
    marginBottom: 5,
    paddingBottom: 2.5,
    borderBottomWidth: 0.75,
    borderBottomColor: '#ddd',
    borderBottomStyle: 'solid',
  },

  // ── SUMMARY ───────────────────────────────────────────────────
  summary: {
    fontSize: 10,
    color: '#2a2a2a',
    lineHeight: 1.55,
    textAlign: 'justify',
  },

  // ── SKILLS ────────────────────────────────────────────────────
  skillsText: {
    fontSize: 9.5,
    color: '#2a2a2a',
    lineHeight: 1.5,
  },

  // ── EXPERIENCE / PROJECTS ─────────────────────────────────────
  entry: {
    marginBottom: 9,
  },
  entryHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 1,
  },
  entryTitle: {
    fontSize: 10.5,
    fontFamily: 'Helvetica-Bold',
    color: '#0f0f0f',
  },
  entrySub: {
    fontSize: 9.5,
    fontFamily: 'Helvetica-Oblique',
    color: '#555',
    marginBottom: 3,
  },
  entryDate: {
    fontSize: 9,
    color: '#777',
    fontFamily: 'Helvetica-Oblique',
  },
  bulletRow: {
    flexDirection: 'row',
    marginBottom: 2,
    paddingLeft: 4,
  },
  bulletChar: {
    fontSize: 9,
    color: '#de0d12',
    width: 10,
    marginTop: 0.5,
    flexShrink: 0,
  },
  bulletText: {
    fontSize: 9.5,
    color: '#2a2a2a',
    flex: 1,
    lineHeight: 1.5,
  },

  // ── EDUCATION ─────────────────────────────────────────────────
  eduHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  eduTitle: {
    fontSize: 10.5,
    fontFamily: 'Helvetica-Bold',
    color: '#0f0f0f',
  },
  eduSub: {
    fontSize: 9.5,
    fontFamily: 'Helvetica-Oblique',
    color: '#555',
    marginTop: 1,
  },
})

// ── Helper: render a bullet point ───────────────────────────────
function Bullet({ text }: { text: string }) {
  return (
    <View style={s.bulletRow}>
      <Text style={s.bulletChar}>•</Text>
      <Text style={s.bulletText}>{text}</Text>
    </View>
  )
}

// ── Helper: section wrapper ──────────────────────────────────────
function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <View style={s.section}>
      <Text style={s.sectionTitle}>{title}</Text>
      {children}
    </View>
  )
}

// ── Component ────────────────────────────────────────────────────
interface Props {
  ai: AIResult
  jobTitle: string
  company: string
  profile: {
    full_name: string
    email?: string
    phone?: string
    city?: string
    linkedin_url?: string
    portfolio_url?: string
    university?: string
    degree?: string
    graduation_status?: string
  }
}

export default function ResumePDF({ ai, jobTitle, company, profile }: Props) {
  // Build contact items
  const contacts: { text: string; href?: string }[] = []
  if (profile.email)         contacts.push({ text: profile.email })
  if (profile.phone)         contacts.push({ text: profile.phone })
  if (profile.city)          contacts.push({ text: profile.city })
  if (profile.linkedin_url)  contacts.push({ text: 'LinkedIn', href: profile.linkedin_url })
  if (profile.portfolio_url) contacts.push({ text: 'Portfolio', href: profile.portfolio_url })

  return (
    <Document
      title={`${profile.full_name} - ${jobTitle} at ${company}`}
      author={profile.full_name}
      creator="Applytics"
      producer="Applytics"
    >
      <Page size="A4" style={s.page}>

        {/* ── HEADER ────────────────────────────────────────── */}
        <View style={s.header}>
          <Text style={s.name}>{profile.full_name}</Text>
          <View style={s.contactRow}>
            {contacts.map((c, i) => (
              <View key={i} style={{ flexDirection: 'row', alignItems: 'center' }}>
                {i > 0 && <Text style={s.contactSep}>|</Text>}
                {c.href
                  ? <Link src={c.href} style={s.contactLink}><Text>{c.text}</Text></Link>
                  : <Text style={s.contactItem}>{c.text}</Text>
                }
              </View>
            ))}
          </View>
        </View>

        {/* ── PROFESSIONAL SUMMARY ──────────────────────────── */}
        {!!ai.summary && (
          <Section title="Professional Summary">
            <Text style={s.summary}>{ai.summary}</Text>
          </Section>
        )}

        {/* ── SKILLS ────────────────────────────────────────── */}
        {(ai.skills_to_emphasize ?? []).length > 0 && (
          <Section title="Technical Skills">
            <Text style={s.skillsText}>
              {ai.skills_to_emphasize.join('  •  ')}
            </Text>
          </Section>
        )}

        {/* ── WORK EXPERIENCE ───────────────────────────────── */}
        {(ai.rewritten_experience ?? []).length > 0 && (
          <Section title="Work Experience">
            {ai.rewritten_experience.map((exp, i) => (
              <View key={i} style={s.entry}>
                <View style={s.entryHeaderRow}>
                  <Text style={s.entryTitle}>{exp.role}</Text>
                  {exp.duration && <Text style={s.entryDate}>{exp.duration}</Text>}
                </View>
                <Text style={s.entrySub}>{exp.company}</Text>
                {exp.bullets.map((b, j) => <Bullet key={j} text={b} />)}
              </View>
            ))}
          </Section>
        )}

        {/* ── PROJECTS ──────────────────────────────────────── */}
        {(ai.rewritten_projects ?? []).length > 0 && (
          <Section title="Projects">
            {ai.rewritten_projects.map((proj, i) => (
              <View key={i} style={s.entry}>
                <Text style={s.entryTitle}>{proj.title}</Text>
                {proj.bullets.map((b, j) => <Bullet key={j} text={b} />)}
              </View>
            ))}
          </Section>
        )}

        {/* ── EDUCATION ─────────────────────────────────────── */}
        {(profile.university || profile.degree) && (
          <Section title="Education">
            <View style={s.entry}>
              <View style={s.eduHeaderRow}>
                <Text style={s.eduTitle}>{profile.university}</Text>
                {profile.graduation_status && (
                  <Text style={s.entryDate}>{profile.graduation_status}</Text>
                )}
              </View>
              {profile.degree && <Text style={s.eduSub}>{profile.degree}</Text>}
            </View>
          </Section>
        )}

      </Page>
    </Document>
  )
}
