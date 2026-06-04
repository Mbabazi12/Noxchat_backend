// NOTE: Diary entries are stored ONLY on the user's device (local storage).
// This module exposes NO storage endpoints.
//
// Server-side only:
// UserDiarySettings schema (optional, minimal):
// userId (ref: User), incognitoEnabled: Boolean, selfDestruct: Boolean
// -- PIN is stored on-device only, never sent to server
