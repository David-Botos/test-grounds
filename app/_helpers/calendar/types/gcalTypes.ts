// types/calendar.ts
export interface GoogleCalendarEvent {
    summary: string;
    description?: string;
    start: {
      dateTime?: string;
      date?: string;
      timeZone?: string;
    };
    end: {
      dateTime?: string;
      date?: string;
      timeZone?: string;
    };
    id?: string;
  }
  
  export interface CalendarEvent {
    title: string;
    start: Date;
    end: Date;
    description?: string;
    allDay: boolean;
    id?: string;
  }
  
  export interface GoogleTokens {
    access_token: string;
    refresh_token?: string;
    scope: string;
    token_type: string;
    expiry_date: number;
  }
  
  export interface NewEventInput {
    title: string;
    description?: string;
    start: Date;
    end: Date;
    allDay?: boolean;
  }