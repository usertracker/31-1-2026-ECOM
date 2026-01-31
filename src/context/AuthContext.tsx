import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { db, UserProfile } from '../services/db';
import { auth, googleProvider } from '../lib/firebase';
import { 
  signInWithPopup, 
  signInWithRedirect,
  getRedirectResult,
  signOut, 
  onAuthStateChanged,
  User as FirebaseUser,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  updateProfile
} from 'firebase/auth';

// Unified User Type for Context
type AuthUser = UserProfile & { role: 'user' | 'admin' };

interface AuthContextType {
  user: AuthUser | null;
  
  // Email/Password Auth
  loginWithEmail: (email: string, password: string) => Promise<void>;
  signupWithEmail: (data: { email: string; password: string; name: string; phone: string }) => Promise<void>;
  
  updateUserProfile: (updates: Partial<UserProfile>) => Promise<void>;
  
  // Social Auth
  signInWithGoogle: () => Promise<void>;
  
  // Admin Auth
  loginAsAdmin: () => void;
  
  logout: () => void;
  isAuthenticated: boolean;
  isAdmin: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<AuthUser | null>(() => {
    const saved = localStorage.getItem('dualite_session');
    return saved ? JSON.parse(saved) : null;
  });

  // Handle User Session Logic (Sync Firebase User with Supabase DB)
  const handleUserSession = async (firebaseUser: FirebaseUser) => {
    try {
        console.log("Handling session for:", firebaseUser.email);
        
        // 1. Try to find existing profile by Firebase UID
        let profile = await db.findUserById(firebaseUser.uid);

        // 2. If not found, create new profile (For Google Sign-In mainly)
        if (!profile) {
            console.log("Creating new user profile from session...");
            const newProfile = {
                id: firebaseUser.uid,
                name: firebaseUser.displayName || firebaseUser.email?.split('@')[0] || 'FlipZon User',
                email: firebaseUser.email || '',
                phone: '', // Phone might be missing in Google Auth
                avatar: firebaseUser.photoURL || '', // Save Google Avatar
                role: 'user' as const,
                createdAt: new Date().toISOString()
            };
            
            try {
                profile = await db.createUser(newProfile);
            } catch (dbError) {
                console.error("DB Profile Creation Failed:", dbError);
                // If creation fails (e.g. duplicate), try to fetch again just in case
                profile = await db.findUserById(firebaseUser.uid);
                
                // If still null, fall back to the object we tried to create (optimistic UI)
                if (!profile) profile = newProfile as UserProfile;
            }
        } 
        // 3. If profile exists but has no avatar, update it from Firebase
        else if (!profile.avatar && firebaseUser.photoURL) {
            try {
                await db.updateUser(profile.id, { avatar: firebaseUser.photoURL });
                profile.avatar = firebaseUser.photoURL;
            } catch (e) {
                console.warn("Failed to sync avatar", e);
            }
        }

        if (profile) {
            const userData = { ...profile, role: 'user' as const };
            setUser(userData);
            localStorage.setItem('dualite_session', JSON.stringify(userData));
        }
    } catch (error) {
        console.error("Error handling user session:", error);
    }
  };

  useEffect(() => {
    // Handle Redirect Result (for fallback flow)
    getRedirectResult(auth).then((result) => {
        if (result) {
            console.log("Redirect login successful");
        }
    }).catch((error) => {
        console.error("Redirect Login Failed:", error);
        if (error.code === 'auth/unauthorized-domain') {
            const domain = window.location.hostname;
            alert(`Firebase Configuration Error: Domain "${domain}" is not authorized.`);
        }
    });

    // Listen for Firebase Auth changes
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        handleUserSession(currentUser);
      } else {
        // Only clear if not admin (admin is a local mock state)
        const saved = localStorage.getItem('dualite_session');
        const parsed = saved ? JSON.parse(saved) : null;
        if (parsed?.role !== 'admin') {
            setUser(null);
            localStorage.removeItem('dualite_session');
        }
      }
    });

    return () => unsubscribe();
  }, []);

  // --- EMAIL / PASSWORD AUTH ---

  const loginWithEmail = async (email: string, password: string) => {
    await signInWithEmailAndPassword(auth, email, password);
    // onAuthStateChanged will handle the rest
  };

  const signupWithEmail = async ({ email, password, name, phone }: { email: string; password: string; name: string; phone: string }) => {
    // 1. Create Auth User
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const firebaseUser = userCredential.user;

    // 2. Update Firebase Profile Display Name (Best Effort)
    // We wrap this in try-catch so network errors here don't block account creation
    try {
        await updateProfile(firebaseUser, { displayName: name });
    } catch (e) {
        console.warn("Failed to update Firebase profile name (non-critical):", e);
    }

    // 3. Create Database Profile (Supabase)
    // We do this explicitly to ensure Name and Phone are saved correctly
    try {
        await db.createUser({
            id: firebaseUser.uid,
            name: name,
            email: email,
            phone: phone,
            role: 'user',
            createdAt: new Date().toISOString()
        });
    } catch (dbError) {
        console.error("Failed to create DB profile during signup:", dbError);
        // Continue anyway, handleUserSession will try to fix it or create a default one
    }

    // 4. Force session refresh to pick up the new DB data
    await handleUserSession(firebaseUser);
  };

  // --- GOOGLE AUTH ---
  const signInWithGoogle = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
    } catch (error: any) {
      if (error.code === 'auth/unauthorized-domain') {
         const domain = window.location.hostname;
         alert(`Firebase Error: Domain "${domain}" is not authorized.`);
         throw error;
      }

      if (error.code === 'auth/popup-blocked' || error.code === 'auth/cancelled-popup-request') {
        console.warn("Popup blocked, falling back to redirect...");
        try {
            await signInWithRedirect(auth, googleProvider);
            return;
        } catch (redirectError: any) {
            console.error("Redirect Sign In Error", redirectError);
            throw redirectError;
        }
      }
      throw error;
    }
  };

  const updateUserProfile = async (updates: Partial<UserProfile>) => {
    if (!user || user.role !== 'user') return;
    
    try {
      const updatedUser = await db.updateUser(user.id, updates);
      const newUserData = { ...updatedUser, role: 'user' as const };
      setUser(newUserData);
      localStorage.setItem('dualite_session', JSON.stringify(newUserData));
    } catch (error) {
      console.error("Failed to update profile:", error);
      throw error;
    }
  };

  // --- ADMIN AUTH ---

  const loginAsAdmin = () => {
    const adminUser = {
      id: 'admin_1',
      name: 'Administrator',
      email: 'admin@flipzon.com',
      phone: '0000000000',
      role: 'admin' as const,
      createdAt: new Date().toISOString()
    };
    setUser(adminUser);
    localStorage.setItem('dualite_session', JSON.stringify(adminUser));
  };

  const logout = async () => {
    await signOut(auth);
    setUser(null);
    localStorage.removeItem('dualite_session');
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      loginWithEmail,
      signupWithEmail,
      updateUserProfile,
      signInWithGoogle,
      loginAsAdmin,
      logout, 
      isAuthenticated: !!user,
      isAdmin: user?.role === 'admin'
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};
