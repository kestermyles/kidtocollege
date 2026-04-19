/**
 * Generate the static checklist PDF lead magnet.
 *
 *   npx tsx scripts/generate-checklist-pdf.ts
 *
 * Output: public/downloads/college-planning-checklist.pdf
 *
 * Task source is mirrored from migration 015_student_checklist_system.sql so the
 * PDF can be built without hitting Supabase. When the DB seed changes, update
 * TASKS below to match.
 */
import PDFDocument from 'pdfkit'
import { createWriteStream, mkdirSync } from 'node:fs'
import { resolve, dirname } from 'node:path'

type Priority = 'critical' | 'important' | 'recommended'
type GradeLevel = '9' | '10' | '11' | 'summer-before-12' | '12'

type Task = {
  grade: GradeLevel
  title: string
  priority: Priority
  month: number | null
}

const MONTH_ABBR = ['', 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

const GRADE_ORDER: { key: GradeLevel; title: string; blurb: string }[] = [
  { key: '9', title: 'Freshman (9th Grade)', blurb: 'Build the foundation — GPA, habits, exploration.' },
  { key: '10', title: 'Sophomore (10th Grade)', blurb: 'Deepen involvement and start practicing for standardized tests.' },
  { key: '11', title: 'Junior (11th Grade)', blurb: 'The most critical year: tests, college list, visits, grades.' },
  { key: 'summer-before-12', title: 'Summer Before Senior Year', blurb: 'The make-or-break summer: rec letters, essays, logistics.' },
  { key: '12', title: 'Senior (12th Grade)', blurb: 'Applications in the fall, decisions in the spring.' },
]

const TASKS: Task[] = [
  // 9th
  { grade: '9', title: 'Build a strong GPA foundation', priority: 'important', month: null },
  { grade: '9', title: 'Understand weighted vs unweighted GPA', priority: 'recommended', month: 9 },
  { grade: '9', title: 'Choose rigorous classes for next year', priority: 'important', month: 3 },
  { grade: '9', title: 'Explore extracurricular activities', priority: 'important', month: null },
  { grade: '9', title: 'Find activities with leadership potential', priority: 'important', month: null },
  // 10th
  { grade: '10', title: 'Maintain a strong GPA', priority: 'important', month: null },
  { grade: '10', title: 'Continue challenging coursework', priority: 'important', month: 3 },
  { grade: '10', title: 'Deepen extracurricular involvement', priority: 'important', month: null },
  { grade: '10', title: 'Take the PSAT for practice', priority: 'important', month: 10 },
  { grade: '10', title: 'Start informal college research', priority: 'recommended', month: null },
  // 11th
  { grade: '11', title: 'Take the PSAT/NMSQT (National Merit qualifier)', priority: 'critical', month: 10 },
  { grade: '11', title: 'Register for the SAT or ACT', priority: 'critical', month: 1 },
  { grade: '11', title: 'Take a full-length practice test over winter break', priority: 'important', month: 12 },
  { grade: '11', title: 'Take your first official SAT or ACT', priority: 'critical', month: 3 },
  { grade: '11', title: 'Retake SAT or ACT in May or June if needed', priority: 'important', month: 5 },
  { grade: '11', title: 'Build a broad college list (10-20 schools)', priority: 'critical', month: 2 },
  { grade: '11', title: 'Schedule college visits in spring', priority: 'important', month: 3 },
  { grade: '11', title: 'Research scholarship opportunities', priority: 'important', month: null },
  { grade: '11', title: 'Maintain strong grades through junior year', priority: 'critical', month: null },
  // Summer before 12
  { grade: 'summer-before-12', title: 'Request letters of recommendation', priority: 'critical', month: 6 },
  { grade: 'summer-before-12', title: 'Narrow college list to 5-7 schools', priority: 'critical', month: 7 },
  { grade: 'summer-before-12', title: 'Review Common App essay prompts', priority: 'important', month: 6 },
  { grade: 'summer-before-12', title: 'Brainstorm essay topics and stories', priority: 'important', month: 7 },
  { grade: 'summer-before-12', title: 'Request an unofficial transcript', priority: 'important', month: 7 },
  { grade: 'summer-before-12', title: 'Create a dedicated college application email', priority: 'important', month: 6 },
  { grade: 'summer-before-12', title: 'Draft a resume or activity list', priority: 'important', month: 7 },
  { grade: 'summer-before-12', title: 'Take college visits if not done in spring', priority: 'important', month: 7 },
  { grade: 'summer-before-12', title: 'Create an organized folder for application materials', priority: 'recommended', month: 6 },
  // 12th fall
  { grade: '12', title: 'Create accounts on all application portals', priority: 'critical', month: 8 },
  { grade: '12', title: 'Complete all essays and short answers', priority: 'critical', month: 9 },
  { grade: '12', title: 'Submit applications by each deadline', priority: 'critical', month: 11 },
  { grade: '12', title: 'Track application status in each portal', priority: 'important', month: 11 },
  { grade: '12', title: 'Request official transcript sent to colleges', priority: 'critical', month: 10 },
  { grade: '12', title: 'Send official SAT or ACT score reports', priority: 'critical', month: 10 },
  { grade: '12', title: 'Ensure recommendation letters are submitted', priority: 'critical', month: 10 },
  { grade: '12', title: 'Complete the FAFSA', priority: 'critical', month: 10 },
  { grade: '12', title: 'Apply for scholarships', priority: 'important', month: 9 },
  // 12th spring
  { grade: '12', title: 'Review acceptance letters', priority: 'critical', month: 3 },
  { grade: '12', title: 'Compare financial aid packages', priority: 'critical', month: 3 },
  { grade: '12', title: 'Estimate four-year total cost', priority: 'important', month: 3 },
  { grade: '12', title: 'Make your final college decision', priority: 'critical', month: 5 },
  { grade: '12', title: 'Submit enrollment deposit', priority: 'critical', month: 5 },
  { grade: '12', title: 'Complete housing applications', priority: 'important', month: 5 },
  { grade: '12', title: 'Register for orientation', priority: 'important', month: 6 },
]

// Brand colors (from tailwind.config.ts)
const NAVY = '#0b1f3a'
const GOLD = '#f2a900'
const CRIMSON = '#c1121f'
const GRAY = '#6b7280'
const LIGHT_GRAY = '#d4d4d8'

const PRIORITY_LABEL: Record<Priority, string> = {
  critical: 'Critical',
  important: 'Important',
  recommended: 'Recommended',
}
const PRIORITY_COLOR: Record<Priority, string> = {
  critical: CRIMSON,
  important: GOLD,
  recommended: GRAY,
}

// Priority sort order within a grade
const PRIORITY_RANK: Record<Priority, number> = { critical: 0, important: 1, recommended: 2 }
const acadMonth = (m: number | null) => (m == null ? 99 : m >= 8 ? m - 8 : m + 4)

function main() {
  const outPath = resolve(process.cwd(), 'public/downloads/college-planning-checklist.pdf')
  mkdirSync(dirname(outPath), { recursive: true })

  const doc = new PDFDocument({
    size: 'LETTER',
    margins: { top: 54, bottom: 54, left: 54, right: 54 },
    info: {
      Title: 'The Complete College Planning Checklist',
      Author: 'KidToCollege',
      Subject: 'Grade-by-grade college planning roadmap',
    },
  })
  doc.pipe(createWriteStream(outPath))

  // Cover
  doc.fillColor(NAVY).fontSize(28).font('Helvetica-Bold').text('The Complete', { align: 'left' })
  doc.fillColor(NAVY).text('College Planning Checklist', { align: 'left' })
  doc.moveDown(0.3)
  doc.fillColor(GRAY).fontSize(12).font('Helvetica').text('Grade-by-grade roadmap from KidToCollege.com', { align: 'left' })
  doc.moveDown(0.5)
  doc
    .fillColor('#333333')
    .fontSize(11)
    .text(
      'Print this checklist and work through it year by year. Track your progress automatically at kidtocollege.com/checklist.',
      { align: 'left', lineGap: 2 },
    )

  // Legend
  doc.moveDown(0.8)
  doc.fillColor(NAVY).fontSize(10).font('Helvetica-Bold').text('Priority key:', { continued: true })
  doc.font('Helvetica').fillColor(GRAY).text('  ', { continued: true })
  drawInlineBadge(doc, 'Critical', CRIMSON, { continued: true })
  doc.fillColor(GRAY).text('  ', { continued: true })
  drawInlineBadge(doc, 'Important', GOLD, { continued: true })
  doc.fillColor(GRAY).text('  ', { continued: true })
  drawInlineBadge(doc, 'Recommended', GRAY, { continued: false })

  doc.moveDown(1.2)
  doc.strokeColor(LIGHT_GRAY).lineWidth(0.5).moveTo(54, doc.y).lineTo(558, doc.y).stroke()
  doc.moveDown(0.8)

  // Sections
  for (const section of GRADE_ORDER) {
    const sectionTasks = TASKS.filter(t => t.grade === section.key).sort((a, b) => {
      const p = PRIORITY_RANK[a.priority] - PRIORITY_RANK[b.priority]
      if (p !== 0) return p
      return acadMonth(a.month) - acadMonth(b.month)
    })

    renderSection(doc, section.title, section.blurb, sectionTasks)
  }

  // Footer page — final note
  if (doc.y > 700) doc.addPage()
  doc.moveDown(1.5)
  doc.strokeColor(LIGHT_GRAY).lineWidth(0.5).moveTo(54, doc.y).lineTo(558, doc.y).stroke()
  doc.moveDown(0.6)
  doc
    .fillColor(NAVY)
    .fontSize(11)
    .font('Helvetica-Bold')
    .text('Track your progress automatically at kidtocollege.com/checklist')
  doc.moveDown(0.3)
  doc
    .fillColor(GRAY)
    .fontSize(9)
    .font('Helvetica')
    .text(
      '© KidToCollege. Editorially independent. Free for students and families.',
    )

  doc.end()
  doc.on('end', () => console.log(`Wrote ${outPath}`))
}

function renderSection(
  doc: PDFKit.PDFDocument,
  title: string,
  blurb: string,
  tasks: Task[],
) {
  if (doc.y > 650) doc.addPage()

  doc.moveDown(0.4)
  doc.fillColor(NAVY).fontSize(16).font('Helvetica-Bold').text(title)
  doc.fillColor(GRAY).fontSize(10).font('Helvetica-Oblique').text(blurb)
  doc.moveDown(0.4)

  for (const t of tasks) {
    renderTask(doc, t)
  }
}

function renderTask(doc: PDFKit.PDFDocument, task: Task) {
  if (doc.y > 720) doc.addPage()

  const x = 54
  const y = doc.y
  // Checkbox
  doc.lineWidth(1).strokeColor(NAVY).rect(x, y + 3, 10, 10).stroke()

  // Text starts after checkbox
  const textX = x + 18
  const textWidth = 558 - textX

  doc
    .fillColor(NAVY)
    .fontSize(11)
    .font('Helvetica')
    .text(task.title, textX, y, { width: textWidth - 110, lineGap: 1 })

  // Priority + month on same row as title baseline (right-aligned)
  const meta: string[] = []
  if (task.month) meta.push(`By ${MONTH_ABBR[task.month]}`)
  const metaText = meta.join(' · ')

  // Badge + month on right side
  const badgeLabel = PRIORITY_LABEL[task.priority]
  const badgeColor = PRIORITY_COLOR[task.priority]

  doc.font('Helvetica-Bold').fontSize(8)
  const badgeWidth = doc.widthOfString(badgeLabel) + 10
  const badgeY = y + 1
  const badgeX = 558 - badgeWidth
  doc.roundedRect(badgeX, badgeY, badgeWidth, 12, 3).fillColor(badgeColor).fill()
  doc
    .fillColor('#ffffff')
    .text(badgeLabel, badgeX + 5, badgeY + 3, { width: badgeWidth - 10, lineBreak: false })

  if (metaText) {
    doc.font('Helvetica').fontSize(9)
    const metaWidth = doc.widthOfString(metaText)
    doc
      .fillColor(GRAY)
      .text(metaText, 558 - badgeWidth - metaWidth - 8, badgeY + 2, { lineBreak: false })
  }

  doc.moveDown(0.4)
}

function drawInlineBadge(
  doc: PDFKit.PDFDocument,
  label: string,
  color: string,
  opts: { continued: boolean },
) {
  // Simple inline colored text label used in the priority legend.
  doc.fillColor(color).font('Helvetica-Bold').text(label, { continued: opts.continued })
  if (!opts.continued) doc.fillColor(NAVY).font('Helvetica')
}

main()
