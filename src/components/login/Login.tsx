import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, onAuthStateChanged } from "firebase/auth";
import { auth, db } from "../../lib/firebase";
import { doc, setDoc, getDoc } from "firebase/firestore";
import { findUserDataById, updateUserData } from "../../lib/appwrite";
import { TraderyProfiles } from "../../lib/appwrite";
import { toast } from "react-toastify";
import React from "react";

const Login = () => {
    const { id } = useParams(); // Get Appwrite user ID from the URL
    const [loading, setLoading] = useState(false);
    const [firebaseId, setFirebaseId] = useState<boolean>();

    useEffect(() => {
        const fetchUser = async () => {
            if (!id) {
                toast.error("Missing user ID");
                return;
            }

            try {
                setLoading(true);

                // 🔹 Fetch user data from Appwrite
                const { userdb } = await findUserDataById(id);

                if (!userdb || !userdb.userEmail || !userdb.userId) {
                    toast.error("Invalid user data from Appwrite.");
                    return;
                }
                console.log("Fetched user:", userdb);

                // 🔹 Check if firebaseId is stored in appwrite
                if (userdb) {
                    setFirebaseId(userdb.firebaseId != null); // Sets true if not null/undefined, otherwise false
                }

                if (firebaseId) {
                    // 🔹 If user exists, log in with Firebase
                    console.log("User exists, logging in...");
                    await signInWithEmailAndPassword(auth, userdb.userEmail, userdb.userId);
                    toast.success("Logged in successfully!");
                } else {
                    // 🔹 If user doesn't exist, create Firebase account
                    console.log("User does not exist, creating account...");
                    const res = await createUserWithEmailAndPassword(auth, userdb.userEmail, userdb.userId);

                    // 🔹 Wait for Firebase auth state update
                    await new Promise((resolve) => onAuthStateChanged(auth, (user) => user && resolve(user)));

                    if (!auth.currentUser) {
                        console.error("User is not authenticated!");
                        toast.error("Authentication required.");
                        return;
                    }

                    console.log("Firebase Auth User:", auth.currentUser);

                    // 🔹 Store user data in Firestore using correct UID
                    await setDoc(doc(db, "users", auth.currentUser.uid), {
                        username: userdb.defaultName,
                        email: userdb.userEmail,
                        id: auth.currentUser.uid,
                        blocked: [],
                    });

                    await setDoc(doc(db, "userchats", auth.currentUser.uid), { chats: [] });

                    toast.success("Account created successfully!");
                    await updateUserData(userdb.userId, {
                        ...userdb,
                        firebaseId: auth.currentUser.uid
                    });
                    console.log(userdb)
                }
            } catch (error: any) {
                console.error("Login error:", error);
                toast.error(error.message);
            } finally {
                setLoading(false);
            }
        };

        fetchUser();
    }, [id]);

    return (
        <div className="login">
            {loading ? <div>Loading...</div> : <div>Welcome to Tradery Messenger!</div>}
        </div>
    );
};

export default Login;