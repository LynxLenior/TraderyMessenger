import { useEffect, useState } from "react";
import { auth, db } from "../../lib/firebase";
import { collection, getDocs } from "firebase/firestore";
import "./admin.css";

const Admin = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const usersCollection = collection(db, "users");
                const usersSnapshot = await getDocs(usersCollection);
                const usersList = usersSnapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data(),
                }));
                setUsers(usersList);
                setLoading(false);
            } catch (error) {
                console.error("Error fetching users:", error);
                setLoading(false);
            }
        };

        fetchUsers();
    }, []);

    return (
        
        <div className="admin-container">
            <h1>Admin Panel</h1>
            <p>Welcome, Admin! Here you can manage users.</p>
                <button className="logout" onClick={() => auth.signOut()}>Logout</button>
            {loading ? (
                <p>Loading users...</p>
            ) : (
                <div className="user-list">
                    <h2>Registered Users</h2>
                    <ul>
                        {users.map(user => (
                            <li key={user.id}>
                                <strong>{user.username}</strong> - {user.email}
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
};

export default Admin;
