// Frontend Constants
export const LANGUAGES = [
  { value: 'javascript', label: 'JavaScript' },
  { value: 'python', label: 'Python' },
  { value: 'java', label: 'Java' },
  { value: 'cpp', label: 'C++' },
  { value: 'csharp', label: 'C#' },
  { value: 'sql', label: 'SQL' },
  { value: 'ruby', label: 'Ruby' },
  { value: 'go', label: 'Go' },
  { value: 'rust', label: 'Rust' },
  { value: 'typescript', label: 'TypeScript' },
]

export const ROLES = {
  INTERVIEWER: 'interviewer',
  CANDIDATE: 'candidate',
}

export const INTERVIEW_STATUS = {
  ACTIVE: 'active',
  COMPLETED: 'completed',
  CANCELLED: 'cancelled',
}

export const API_ENDPOINTS = {
  // Auth
  REGISTER: '/auth/register',
  LOGIN: '/auth/login',
  GET_ME: '/auth/me',
  
  // Interviews
  CREATE_ROOM: '/interviews/create-room',
  GET_INTERVIEWS: '/interviews',
  GET_INTERVIEW: '/interviews/room/:roomId',
  UPDATE_CODE: '/interviews/:roomId/code',
  RATE_INTERVIEW: '/interviews/:roomId/rate',
}

export const SOCKET_EVENTS = {
  // Room Events
  JOIN_ROOM: 'join-room',
  ROOM_JOINED: 'room-joined',
  USER_JOINED: 'user-joined',
  USER_LEFT: 'user-left',
  
  // Code Events
  CODE_CHANGE: 'code-change',
  RECEIVE_CODE: 'receive-code',
  LANGUAGE_CHANGE: 'language-change',
  
  // WebRTC Events
  OFFER: 'offer',
  ANSWER: 'answer',
  ICE_CANDIDATE: 'ice-candidate',
  
  // Interview Events
  END_INTERVIEW: 'end-interview',
  INTERVIEW_ENDED: 'interview-ended',
  RESET_TIMER: 'reset-timer',
}

export const RATING_OPTIONS = {
  MIN: 1,
  MAX: 10,
}

export const TIMER_UPDATE_INTERVAL = 1000 // milliseconds
export const CODE_AUTO_SAVE_INTERVAL = 5000 // milliseconds
