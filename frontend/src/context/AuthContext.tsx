import { createContext, useContext, useState, useEffect } from "react"
import { onAuthStateChanged, type User } from "firebase/auth"
import { auth } from "../firebase"

interface AuthContextType {
  user: User | null
  loading: boolean
}

// 1. Create the channel
const AuthContext = createContext<AuthContextType | null>(null)

// 2. The provider — broadcasts user state to everything inside it
export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Set up the Firebase listener when the component mounts
    // This fires immediately with the current auth state
    // then again whenever it changes
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser)   // null if logged out, User object if logged in
      setLoading(false)       // we now know the auth state, stop loading
    })

    // Cleanup — stop listening when the component unmounts
    return unsubscribe
  }, []) // empty array = only run once on mount

  return (
    <AuthContext.Provider value={{ user, loading }}>
      {children}
    </AuthContext.Provider>
  )
}

// 3. The hook — how components read from the channel
export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) throw new Error('useAuth must be used inside AuthProvider')
  return context
}