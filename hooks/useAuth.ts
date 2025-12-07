import { onAuthStateChanged, signInWithEmailAndPassword, User } from "firebase/auth";
import { useEffect, useState } from "react";
import { auth } from "../lib/firebase";

export function useAuth() {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    
    useEffect(() => {
        // // Auto sign in with default credentials
        // const autoSignIn = async () => {
        //     try {
        //         await signInWithEmailAndPassword(auth, "test@gmail.com", "password");
        //     } catch (error) {
        //         console.error("Error auto signing in:", error);
        //     }
        // };
        
        // autoSignIn();
        
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            setUser(user);
            setLoading(false);
        });
        return () => unsubscribe();
    }, []); 
    return {user, loading};
}