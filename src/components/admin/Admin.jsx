import { useEffect, useState } from "react";
import { db } from "../../lib/firebase";
import { doc, getDoc } from "firebase/firestore";
import "./admin.css";

const Admin = () => {
    return (
        <div className="admin-container">
            <h1>Welcome, Admin!</h1>
            <p>You have access to admin functionalities.</p>
        </div>
    );
};

export default Admin;