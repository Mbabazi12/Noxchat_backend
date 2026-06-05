export const STARTING_COINS = 100;
export const DAILY_COINS = 5;
export const MAX_BET = 50;
export const MIN_BET = 1;

export const CONFESSION_VOTE_THRESHOLD = 0.6;
export const CONFESSION_DAILY_LIMIT = 5;
export const CONFESSION_AUTO_HIDE_REPORTS = 5;
export const CONFESSION_AUTO_HIDE_WINDOW_MS = 60 * 60 * 1000;

export const ECHO_LOCK_MESSAGE_COUNT = 10;
export const ECHO_LOCK_EXPIRY_MS = 24 * 60 * 60 * 1000;
export const ECHO_DISABLE_VOTE_THRESHOLD = 0.5;
export const ECHO_COOLDOWN_MS = 60 * 60 * 1000;

export const STATUS_EXPIRY_MS = 24 * 60 * 60 * 1000;
export const STATUS_MAX_VIDEO_SECONDS = 30;

export const DELETE_FOR_EVERYONE_WINDOW_MS = 2 * 60 * 1000;
export const MAX_PINNED_MESSAGES = 3;

export const MAX_SONG_SIZE_BYTES = 10 * 1024 * 1024;
export const MAX_SONG_STORAGE_BYTES = 50 * 1024 * 1024;

export const SPAM_MESSAGE_LIMIT = 20;
export const SPAM_WINDOW_MS = 10 * 1000;
export const SPAM_MUTE_DURATION_MS = 60 * 60 * 1000;
export const AUTO_HIDE_REPORT_COUNT = 5;
export const AUTO_HIDE_WINDOW_MS = 60 * 60 * 1000;

export const VOICE_NOTE_MAX_SECONDS = 300;
export const SUPPORTED_TRANSCRIPTION_LANGUAGES = ['en', 'es', 'hi', 'ar', 'fr'] as const;

export const LEADERBOARD_RESET_DAY = 1;

export const POLL_EXPIRY_OPTIONS: Record<string, number> = {
  '1h': 60 * 60 * 1000,
  '1d': 24 * 60 * 60 * 1000,
  '1w': 7 * 24 * 60 * 60 * 1000,
};

export const GHOST_WHITELIST_LIMIT = 3;
export const AWARDS_DAY = 0;
export const THROWBACK_HOUR = 9;
export const PIN_LIMIT = 3;
