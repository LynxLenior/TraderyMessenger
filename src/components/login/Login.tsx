import { useNavigate, useParams } from "react-router-dom";
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { auth, db } from "../../lib/firebase";
import { doc, setDoc, getDoc } from "firebase/firestore";
import "./login.css";
import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth"
import React from "react";
import { findUserDataById } from "../../lib/appwrite";
import { 
    arrayUnion, 
    collection, 
    getDocs, 
    query, 
    serverTimestamp, 
    updateDoc, 
    where 
  } from "firebase/firestore"
import { useUserStore } from "../../lib/userStore";
export interface TraderyProfiles {
    userId: string;
    displayName?: string | null;
    defaultName: string;
    profileImageId: string;
    profileSummary?: string | null;
    profileImageWidth: number;
    profileImageHeight: number;
    userEmail: string;
}

const Login = () => {
    const { currentUser } = useUserStore()
    const [loading,setLoading] = useState(false)
    const [user, setUser] = useState<TraderyProfiles | null>(null);
    const [userExists, setUserExists] = useState<boolean>()
    const { id } = useParams();
    useEffect(() => {
        (async function fetchData() {
            try {
                const {userdb} = await findUserDataById(id)
                setUser(userdb)
            } catch (error) {
                console.error("Error fetching user data:", error);
            }
            try {
                setLoading(true)            
                try{
                    if(!user) return;
                    const res = await createUserWithEmailAndPassword(auth, user.userEmail, user.userId)            
                    await setDoc(doc(db, "users", res.user.uid), {
                        username: user.defaultName,
                        email: user.userEmail,
                        id: res.user.uid,
                        blocked: [],
                    });            
                    await setDoc(doc(db, "userchats", res.user.uid), {chats: [],});            
                        toast.success("Account Created! You can login now!")
                    } catch(err) {
                        console.log(err)
                        toast.error(err.message)
                    } finally {
                        setLoading(false)
                    }
            } catch {
                setLoading(true)
                try{
                    if(!user) return;
                    await signInWithEmailAndPassword(auth, user.userEmail, user.userId)
                    toast.success("Account Login!")
                } catch(err) {
                    console.log(err)
                    toast.error(err.message)
                } finally {
                    setLoading(false)
                }
                }
        })();
    }, []);

    const handleSearch = async () => {
        try {
        const userRef = collection(db, "users")
        const q = query(userRef, where("username", "==", user?.defaultName))
        const querySnapShot = await getDocs(q)
    
        if (!querySnapShot.empty) {
            const foundUser = querySnapShot.docs[0].data()
            if (foundUser.id === currentUser.id) {
                return setUserExists(true);
            }
        } else {
            return setUserExists(false);
        }
        } catch (err) {
        console.log(err)
        }
    }

    // const handleGoogle = async () => {
    //     try {
    //         const provider = new GoogleAuthProvider();
    //         const result = await signInWithPopup(auth, provider);
    //         const user = result.user;

    //         const userRef = doc(db, "users", user.uid);
    //         const userSnap = await getDoc(userRef);

    //         if (!userSnap.exists()) {
    //             await setDoc(userRef, {
    //                 id: user.uid,
    //                 email: user.email,
    //                 username: user.displayName || "New User",
    //                 createdAt: new Date(),
    //                 blocked: []
    //             });
    //             await setDoc(doc(db, "userchats", user.uid), {
    //                 chats: [],
    //             });
    //         }

    //         // ✅ Redirect to admin if email matches
    //         if (user.email === "bagus.anselliam@ue.edu.ph") {
    //             navigate("/admin");
    //         }

    //         setTimeout(() => {
    //             window.location.reload();
    //         }, 500);

    //     } catch (error) {
    //         console.log("Error:", error);
    //     }
    // };

    return (
        <div className="login">
            
        </div>
    );
};

export default Login;
