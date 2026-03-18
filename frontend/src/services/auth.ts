import { 
    createUserWithEmailAndPassword, 
    signInWithEmailAndPassword, 
    signOut as firebaseSignOut, 
    updateProfile, 
    browserLocalPersistence, 
    browserSessionPersistence, 
    setPersistence,
    sendPasswordResetEmail
} from "firebase/auth";
import { auth } from '../firebase'



export async function signUp(email: string, password: string, username: string) {
    try {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);

        await updateProfile(userCredential.user, {
            displayName: username
        })
        return userCredential.user

    } catch (error: any) {
        const errorCode = error.code;
        const errorMessage = error.message;
        throw new Error(`Sign up failed (${errorCode}): ${errorMessage}`);
    }
}

export async function logIn(email: string, password: string, rememberMe: boolean) {
    try {
        const persistence = rememberMe ? browserLocalPersistence : browserSessionPersistence
        await setPersistence(auth, persistence)
        const userCredential = await signInWithEmailAndPassword(auth, email, password)
        return userCredential.user
    } catch (error: any) {
        throw new Error(`Login failed (${error.code}): ${error.message}`)
    }
}

export async function signOut() {
    try {
        await firebaseSignOut(auth)
    } catch (error: any) {
        const errorCode = error.code;
        const errorMessage = error.message;
        throw new Error(`Sign out failed (${errorCode}): ${errorMessage}`);
    }
}

export async function resetPassword(email: string) {
    try {
        await sendPasswordResetEmail(auth, email)
    } catch (error: any) {
        throw new Error(`Password reset failed (${error.code}): ${error.message}`)
    }
}