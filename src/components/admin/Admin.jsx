import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { auth, db } from "../../lib/firebase";
import { collection, getDocs, doc, deleteDoc } from "firebase/firestore";
import "./admin.css";

const Admin = () => {
    const [users, setUsers] = useState([]);
    const [reports, setReports] = useState([]);
    const [filteredReports, setFilteredReports] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedReport, setSelectedReport] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const usersSnapshot = await getDocs(collection(db, "users"));
                const reportsSnapshot = await getDocs(collection(db, "reports"));

                setUsers(usersSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
                const reportsData = reportsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
                setReports(reportsData);
                setFilteredReports(reportsData);
            } catch (error) {
                console.error("Error fetching data:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    // Delete a report
    const handleDeleteReport = async (reportId) => {
        try {
            await deleteDoc(doc(db, "reports", reportId));
            setReports(prev => prev.filter(report => report.id !== reportId));
            setFilteredReports(prev => prev.filter(report => report.id !== reportId));
        } catch (error) {
            console.error("Error deleting report:", error);
        }
    };

    return (
        <div className="admin-container">
            <h1>Admin Panel</h1>
            <p>Welcome, Admin! Here you can manage users and view reports.</p>

            {/* Buttons */}
            <div className="admin-buttons">
                <button className="back-button" onClick={() => navigate("/TraderyMessenger")}>Back to Chat</button>
                <button className="logout" onClick={() => auth.signOut()}>Logout</button>
            </div>

            {loading ? (
                <p>Loading data...</p>
            ) : (
                <>
                    {/* User List */}
                    <div className="user-list">
                        <h2>Registered Users</h2>
                        <ul>
                            {users.map(user => (
                                <li key={user.id} className="user-item">
                                    <strong>{user.username}</strong> - {user.email}
                                    <button onClick={() => setFilteredReports(reports.filter(r => r.reportedUserId === user.id))}>
                                        View Reports
                                    </button>
                                </li>
                            ))}
                        </ul>
                        <button className="show-all-reports" onClick={() => setFilteredReports(reports)}>
                            Show All Reported Users
                        </button>
                    </div>

                    {/* Reports List */}
                    <div className="reports-list">
                        <h2>Reported Users</h2>
                        {filteredReports.length === 0 ? (
                            <p>No reports available.</p>
                        ) : (
                            <ul>
                                {filteredReports.map(report => {
                                    const timestamp = report.timestamp?.seconds ? 
                                        new Date(report.timestamp.seconds * 1000).toLocaleString() : "Unknown";
                                    return (
                                        <li key={report.id} className="report-item">
                                            <p><strong>Reporter:</strong> {report.reporterUsername}</p>
                                            <p><strong>Reporter ID:</strong> {report.reporterId}</p>
                                            <p><strong>Reported User:</strong> {report.reportedUsername}</p>
                                            <p><strong>Reported ID:</strong> {report.reportedUserId}</p>
                                            <p><strong>Reason:</strong> {report.reason.length > 10 ? (
                                                <>
                                                    {report.reason.substring(0, 10)}...
                                                    <button className="read-more" onClick={() => setSelectedReport(report)}>
                                                        Read More
                                                    </button>
                                                </>
                                            ) : report.reason}
                                            </p>
                                            <p><strong>Timestamp:</strong> {timestamp}</p>
                                            <button onClick={() => handleDeleteReport(report.id)}>Delete</button>
                                        </li>
                                    );
                                })}
                            </ul>
                        )}
                    </div>

                    {/* Modal for full report */}
                    {selectedReport && (
                        <div className="modal">
                            <div className="modal-content">
                                <h2>Full Report</h2>
                                <p><strong>Reporter:</strong> {selectedReport.reporterUsername}</p>
                                <p><strong>Reporter ID:</strong> {selectedReport.reporterId}</p>
                                <p><strong>Reported User:</strong> {selectedReport.reportedUsername}</p>
                                <p><strong>Reported ID:</strong> {selectedReport.reportedUserId}</p>
                                <p><strong>Reason:</strong> {selectedReport.reason}</p>
                                <p><strong>Timestamp:</strong> {new Date(selectedReport.timestamp?.seconds * 1000).toLocaleString()}</p>
                                <button className="close-modal" onClick={() => setSelectedReport(null)}>Close</button>
                            </div>
                        </div>
                    )}
                </>
            )}
        </div>
    );
};

export default Admin;
