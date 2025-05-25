// src/app/api/events/types.ts
export interface OracleRawEvent {
  ID:           number
  TITLE:        string
  DESCRIPTION:  string | null
  EVENT_DATE:   Date
  LOCATION:     string | null
  CATEGORY:     string | null
  ORGANIZER:    string | null
  IMAGE_URL:    string | null
  CREATED_AT:   Date
}

export interface Event {
  id:           number
  title:        string
  description:  string | null
  event_date:   string   // ISO
  location:     string | null
  category:     string | null
  organizer:    string | null
  image_url:    string | null
  created_at:   string   // ISO
}
