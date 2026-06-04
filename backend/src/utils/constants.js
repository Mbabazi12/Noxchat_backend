module.exports = {
  // Coins
  STARTING_COINS: 100,
  DAILY_COINS: 5,
  MAX_BET: 50,
  MIN_BET: 1,

  // Confession box
  CONFESSION_VOTE_THRESHOLD: 0.6,       // 60% vote to enable
  CONFESSION_DAILY_LIMIT: 5,
  CONFESSION_AUTO_HIDE_REPORTS: 5,
  CONFESSION_AUTO_HIDE_WINDOW_MS: 60 * 60 * 1000, // 1 hour

  // Echo
  ECHO_LOCK_MESSAGE_COUNT: 10,
  ECHO_LOCK_EXPIRY_MS: 24 * 60 * 60 * 1000,
  ECHO_DISABLE_VOTE_THRESHOLD: 0.5,
  ECHO_COOLDOWN_MS: 60 * 60 * 1000,    // 1 per hour per person

  // Status
  STATUS_EXPIRY_MS: 24 * 60 * 60 * 1000,
  STATUS_MAX_VIDEO_SECONDS: 30,

  // Messages
  DELETE_FOR_EVERYONE_WINDOW_MS: 2 * 60 * 1000, // 2 minutes
  MAX_PINNED_MESSAGES: 3,

  // Music
  MAX_SONG_SIZE_BYTES: 10 * 1024 * 1024,   // 10MB
  MAX_SONG_STORAGE_BYTES: 50 * 1024 * 1024, // 50MB

  // Safety
  SPAM_MESSAGE_LIMIT: 20,
  SPAM_WINDOW_MS: 10 * 1000,
  SPAM_MUTE_DURATION_MS: 60 * 60 * 1000,
  AUTO_HIDE_REPORT_COUNT: 5,
  AUTO_HIDE_WINDOW_MS: 60 * 60 * 1000,

  // Voice notes
  VOICE_NOTE_MAX_SECONDS: 300, // 5 minutes
  SUPPORTED_TRANSCRIPTION_LANGUAGES: ['en', 'es', 'hi', 'ar', 'fr'],

  // Leaderboard
  LEADERBOARD_RESET_DAY: 1, // Monday

  // Poll expiry options (ms)
  POLL_EXPIRY_OPTIONS: {
    '1h': 60 * 60 * 1000,
    '1d': 24 * 60 * 60 * 1000,
    '1w': 7 * 24 * 60 * 60 * 1000
  },

  // Ghost mode whitelist limit
  GHOST_WHITELIST_LIMIT: 3,

  // Group awards schedule: Sunday
  AWARDS_DAY: 0,

  // Throwback hour (local time trigger from client)
  THROWBACK_HOUR: 9,

  // Pin limit
  PIN_LIMIT: 3,
};
