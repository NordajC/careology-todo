import { initializeApp, applicationDefault } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';

initializeApp({
  credential: applicationDefault(),
});

// This is what you'll call in your Apollo context
// It takes the raw token string and returns the decoded user
// or null if the token is invalid/missing
export const verifyFirebaseToken = async (token: string) => {
  try {
    const decoded = await getAuth().verifyIdToken(token)
    return decoded // contains uid, email, etc.
  } catch (error) {
    return null // invalid or expired token
  }
}
