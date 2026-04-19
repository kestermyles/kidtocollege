// Renders subject/html/text for the checklist reminder email.
// Plain template literals (matches existing welcome-email/checkin-emails style);
// no React Email dependency.

export type ReminderTask = {
  task_id: string
  task_title: string
  task_description: string
  priority: 'critical' | 'important' | 'recommended'
  ideal_completion_month: number | null
  related_tool_url: string | null
}

const MONTH_NAMES = ['', 'January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']

const PRIORITY_STYLES: Record<ReminderTask['priority'], { bg: string; color: string; label: string }> = {
  critical: { bg: '#fef2f2', color: '#c1121f', label: 'Critical' },
  important: { bg: '#fef6e6', color: '#b77600', label: 'Important' },
  recommended: { bg: '#f4f4f5', color: '#52525b', label: 'Recommended' },
}

const BASE_URL = 'https://www.kidtocollege.com'

export function renderChecklistReminder(params: {
  name: string
  tasks: ReminderTask[]
}): { subject: string; html: string; text: string } {
  const { name, tasks } = params

  const subject =
    tasks.length === 1
      ? `Upcoming: ${tasks[0].task_title}`
      : `${tasks.length} upcoming college planning tasks`

  const taskCards = tasks
    .map(t => {
      const p = PRIORITY_STYLES[t.priority]
      const monthLine = t.ideal_completion_month
        ? `<div style="font-size: 13px; color: #777; margin-top: 6px;">Target: ${MONTH_NAMES[t.ideal_completion_month]}</div>`
        : ''
      const toolLink = t.related_tool_url
        ? `<div style="margin-top: 10px;">
            <a href="${BASE_URL}${t.related_tool_url}" style="color: #f59e0b; font-size: 13px; font-weight: 600; text-decoration: none;">Open related tool →</a>
          </div>`
        : ''
      return `
        <div style="background: #ffffff; border: 1px solid #e8e4de; border-radius: 10px; padding: 18px; margin-bottom: 12px;">
          <div style="display: inline-block; background: ${p.bg}; color: ${p.color}; font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.04em; padding: 3px 8px; border-radius: 4px;">${p.label}</div>
          <div style="font-size: 16px; font-weight: 600; color: #0f2d52; margin-top: 8px;">${escapeHtml(t.task_title)}</div>
          <div style="font-size: 14px; color: #555; margin-top: 6px; line-height: 1.5;">${escapeHtml(t.task_description)}</div>
          ${monthLine}
          ${toolLink}
        </div>`
    })
    .join('')

  const html = `
    <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; max-width: 600px; margin: 0 auto; padding: 32px 24px; color: #1a1a1a; background: #faf7f2;">
      <div style="margin-bottom: 24px;">
        <span style="font-size: 22px; font-weight: 700; color: #0f2d52;">Kid<span style="color: #f59e0b;">To</span>College</span>
      </div>
      <h1 style="font-size: 26px; font-weight: 700; margin: 0 0 8px 0; color: #0f2d52;">Hi ${escapeHtml(name)},</h1>
      <p style="color: #555; font-size: 16px; margin: 0 0 24px 0; line-height: 1.5;">
        ${tasks.length === 1 ? 'Here is an upcoming task on your college checklist:' : `You have ${tasks.length} upcoming tasks on your college checklist:`}
      </p>

      ${taskCards}

      <div style="text-align: center; margin: 28px 0 20px 0;">
        <a href="${BASE_URL}/checklist" style="display: inline-block; background: #f59e0b; color: #1a1a1a; font-weight: 700; padding: 14px 28px; border-radius: 10px; text-decoration: none; font-size: 15px;">View full checklist →</a>
      </div>

      <p style="color: #888; font-size: 13px; border-top: 1px solid #e8e4de; padding-top: 16px; margin-top: 24px; line-height: 1.5;">
        You are receiving this because you have an account at KidToCollege.
        <a href="${BASE_URL}/account" style="color: #888;">Manage preferences</a>
      </p>
    </div>`

  const textTasks = tasks
    .map(t => {
      const month = t.ideal_completion_month ? ` — target ${MONTH_NAMES[t.ideal_completion_month]}` : ''
      return `• [${PRIORITY_STYLES[t.priority].label}] ${t.task_title}${month}\n  ${t.task_description}`
    })
    .join('\n\n')

  const text = `Hi ${name},\n\n${tasks.length === 1 ? 'Here is an upcoming task on your college checklist:' : `You have ${tasks.length} upcoming tasks on your college checklist:`}\n\n${textTasks}\n\nView your full checklist: ${BASE_URL}/checklist\n\n— KidToCollege`

  return { subject, html, text }
}

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;')
}
