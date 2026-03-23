import { Resend } from 'resend'
import { NextResponse } from 'next/server'

const resend = new Resend('re_BiWgvYh3_2nHN8V2BAojzCfQcnVhZVFD8')

export async function POST(request: Request) {
  const { to, subject, html } = await request.json()
  
  const { data, error } = await resend.emails.send({
    from: 'Voisin Proche <onboarding@resend.dev>',
    to,
    subject,
    html
  })

  if (error) return NextResponse.json({ error }, { status: 400 })
  return NextResponse.json({ success: true, data })
}
