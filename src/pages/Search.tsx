import React, { useEffect, useState } from "react";
import { db } from "../firebase/firebase";
import {
  collection,
  query,
  orderBy,
  limit,
  getDocs,
  deleteDoc,
  doc,
  updateDoc,
  getDoc,
} from "firebase/firestore";
import "../styles/Search.css";
import useAuthGuard from "../hooks/useAuthGuard";

interface ReportItem {
  id: string;
  itemName: string;
  description: string;
  status: string;
  imageUrl?: string;
  submittedBy: string;
  timestamp: any;
}

const Search: React.FC = () => {
  const user = useAuthGuard();
  const [reports, setReports] = useState<ReportItem[]>([]);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    if (!user) return;
    const checkAdmin = async () => {
      try {
        const docSnap = await getDoc(doc(db, "users", user.token));
        if (docSnap.exists()) {
          setIsAdmin(docSnap.data().isAdmin ?? false);
        }
      } catch (err) {
        console.error("Failed to check admin status:", err);
      }
    };
    checkAdmin();
  }, [user]);

  useEffect(() => {
    const fetchReports = async () => {
      if (!user) return;
      const q = query(collection(db, "lostItems"), orderBy("timestamp", "desc"), limit(6));
      const snapshot = await getDocs(q);
      const data = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as ReportItem[];
      setReports(data);
    };

    fetchReports();
  }, [user]);

  const handleDelete = async (reportId: string) => {
    try {
      await deleteDoc(doc(db, "lostItems", reportId));
      setReports((prev) => prev.filter((r) => r.id !== reportId));
    } catch (err) {
      console.error("Failed to delete report:", err);
    }
  };

  const handleMarkFound = async (reportId: string) => {
    try {
      await updateDoc(doc(db, "lostItems", reportId), { status: "found" });
      setReports((prev) =>
        prev.map((r) => (r.id === reportId ? { ...r, status: "found" } : r))
      );
    } catch (err) {
      console.error("Failed to mark report as found:", err);
    }
  };

  return (
    <div className="search-page">
      <h1>Recent Reports</h1>
      <div className="report-cards">
        {reports.map((report) => (
          <div className="report-card" key={report.id}>
            {report.imageUrl && (
              <img src={report.imageUrl} alt={report.itemName} className="report-image" />
            )}
            <div className="report-content">
              <h3>{report.itemName}</h3>
              <p>{report.description}</p>
              <span className={`status ${report.status}`}>{report.status.toUpperCase()}</span>
              <small>Submitted by: {report.submittedBy}</small>

              {isAdmin && (
                <div className="admin-actions">
                  {report.status !== "found" && (
                    <button className="mark-found" onClick={() => handleMarkFound(report.id)}>
                      Mark Found
                    </button>
                  )}
                  <button className="delete" onClick={() => handleDelete(report.id)}>
                    Delete
                  </button>
                </div>
              )}
            </div>
          </div>
        ))}
        {reports.length === 0 && <p className="no-reports">No reports yet.</p>}
      </div>
    </div>
  );
};

export default Search;
