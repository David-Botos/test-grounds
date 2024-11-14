import { google } from 'googleapis'
import { OAuth2Client } from 'google-auth-library'
import type { calendar_v3 } from 'googleapis'
import { 
  GoogleCalendarEvent, 
  CalendarEvent, 
  GoogleTokens,
  NewEventInput 
} from './types/gcalTypes'

const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID as string
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET as string
const REDIRECT_URI = 'http://localhost:3000/api/auth/google/callback'

if (!GOOGLE_CLIENT_ID || !GOOGLE_CLIENT_SECRET) {
  throw new Error('Missing Google OAuth credentials')
}

// Setup OAuth2 client
const oauth2Client = new OAuth2Client(
  GOOGLE_CLIENT_ID,
  GOOGLE_CLIENT_SECRET,
  REDIRECT_URI
)

/**
 * Transform Google Calendar event to our app's event format
 */
const transformGoogleEvent = (event: calendar_v3.Schema$Event): CalendarEvent => {
  if (!event.start || !event.end) {
    throw new Error('Invalid event data: missing start or end time')
  }

  return {
    title: event.summary || 'Untitled Event',
    start: new Date(event.start.dateTime || event.start.date || ''),
    end: new Date(event.end.dateTime || event.end.date || ''),
    description: event.description,
    allDay: !event.start.dateTime,
    id: event.id
  }
}

/**
 * Fetch events from Google Calendar
 */
export async function getGoogleCalendarEvents(accessToken: string): Promise<CalendarEvent[]> {
  try {
    oauth2Client.setCredentials({ access_token: accessToken })
    const calendar = google.calendar({ version: 'v3', auth: oauth2Client })
    
    const response = await calendar.events.list({
      calendarId: 'primary',
      timeMin: new Date().toISOString(),
      maxResults: 100,
      singleEvents: true,
      orderBy: 'startTime',
    })

    if (!response.data.items) {
      return []
    }

    return response.data.items.map(transformGoogleEvent)
  } catch (error) {
    console.error('Error fetching calendar events:', error)
    throw new Error(error instanceof Error ? error.message : 'Failed to fetch calendar events')
  }
}

/**
 * Add new event to Google Calendar
 */
export async function addGoogleCalendarEvent(
  accessToken: string, 
  event: NewEventInput
): Promise<CalendarEvent> {
  try {
    oauth2Client.setCredentials({ access_token: accessToken })
    const calendar = google.calendar({ version: 'v3', auth: oauth2Client })
    
    const eventData: GoogleCalendarEvent = {
      summary: event.title,
      description: event.description,
      start: event.allDay ? {
        date: event.start.toISOString().split('T')[0],
      } : {
        dateTime: event.start.toISOString(),
        timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      },
      end: event.allDay ? {
        date: event.end.toISOString().split('T')[0],
      } : {
        dateTime: event.end.toISOString(),
        timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      },
    }
    
    const response = await calendar.events.insert({
      calendarId: 'primary',
      requestBody: eventData,
    })

    if (!response.data) {
      throw new Error('Failed to create event')
    }

    return transformGoogleEvent(response.data)
  } catch (error) {
    console.error('Error adding event:', error)
    throw new Error(error instanceof Error ? error.message : 'Failed to add event')
  }
}

/**
 * Handle Google OAuth callback
 */
export async function handleGoogleCallback(code: string): Promise<GoogleTokens> {
  try {
    const { tokens } = await oauth2Client.getToken(code)
    if (!tokens.access_token) {
      throw new Error('No access token received')
    }
    return tokens as GoogleTokens
  } catch (error) {
    console.error('Error getting tokens:', error)
    throw new Error(error instanceof Error ? error.message : 'Failed to handle Google callback')
  }
}

/**
 * Refresh Google OAuth token
 */
export async function refreshGoogleToken(refreshToken: string): Promise<GoogleTokens> {
  try {
    oauth2Client.setCredentials({
      refresh_token: refreshToken
    })
    const { credentials } = await oauth2Client.refreshAccessToken()
    return credentials as GoogleTokens
  } catch (error) {
    console.error('Error refreshing token:', error)
    throw new Error(error instanceof Error ? error.message : 'Failed to refresh token')
  }
}