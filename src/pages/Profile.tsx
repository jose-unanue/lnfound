import React, { useEffect, useState } from "react";
import { db } from "../firebase/firebase";
import {
  doc,
  setDoc,
  getDoc,
  collection,
  getDocs,
  addDoc,
  updateDoc,
} from "firebase/firestore";
import useAuthGuard from "../hooks/useAuthGuard";
import "../styles/Profile.css";

interface AdminRequest {
  id: string;
  email: string;
  status: "pending" | "approved" | "denied";
  requestedAt?: any;
  token: string;
}

const Profile: React.FC = () => {
  const user = useAuthGuard();
  const [isAdmin, setIsAdmin] = useState(false);
  const [adminRequests, setAdminRequests] = useState<AdminRequest[]>([]);
  const [requestMessage, setRequestMessage] = useState("");

  // Fetch current user info
  useEffect(() => {
    if (!user) return;
    const fetchUser = async () => {
      const userRef = doc(db, "users", user.token);
      const docSnap = await getDoc(userRef);

      if (docSnap.exists()) {
        const data = docSnap.data();
        setIsAdmin(data.isAdmin ?? false);
      } else {
        // Create user doc if missing
        await setDoc(userRef, { email: user.email, isAdmin: false });
        setIsAdmin(false);
      }
    };

    fetchUser();
  }, [user]);

  // Fetch admin requests if current user is admin
  useEffect(() => {
    if (!isAdmin) return;
    const fetchRequests = async () => {
      try {
        const snapshot = await getDocs(collection(db, "adminRequests"));
        const requests: AdminRequest[] = snapshot.docs.map((d) => {
          const data = d.data();
          return {
            id: d.id,
            email: typeof data.email === "string" ? data.email : "unknown",
            status: ["pending", "approved", "denied"].includes(data.status)
              ? data.status
              : "pending",
            requestedAt: data.requestedAt ?? null,
            token: typeof data.token === "string" ? data.token : "unknown",
          };
        });
        setAdminRequests(requests);
      } catch (err) {
        console.error("Failed to fetch admin requests:", err);
      }
    };
    fetchRequests();
  }, [isAdmin]);

  // Submit an admin request
  const requestAdmin = async () => {
    if (!user) return;
    try {
      const snapshot = await getDocs(collection(db, "adminRequests"));
      const pending = snapshot.docs.find(
        (doc) =>
          doc.data().email === user.email && doc.data().status === "pending"
      );

      if (pending) {
        setRequestMessage("You already have a pending admin request.");
        return;
      }

      await addDoc(collection(db, "adminRequests"), {
        token: user.token,
        email: user.email,
        status: "pending",
        requestedAt: new Date(),
      });
      setRequestMessage("Admin request submitted!");
    } catch (err) {
      console.error("Failed to submit admin request:", err);
      setRequestMessage("Failed to submit admin request.");
    }
  };

  // Approve a request
  const approveRequest = async (requestId: string, requesterToken: string) => {
    try {
      await updateDoc(doc(db, "users", requesterToken), { isAdmin: true });
      await updateDoc(doc(db, "adminRequests", requestId), {
        status: "approved",
      });
      setAdminRequests((prev) =>
        prev.map((req) =>
          req.id === requestId ? { ...req, status: "approved" } : req
        )
      );
    } catch (err) {
      console.error("Failed to approve request:", err);
    }
  };

  // Deny a request
  const denyRequest = async (requestId: string, requesterToken: string) => {
    try {
      await updateDoc(doc(db, "users", requesterToken), { isAdmin: false });
      await updateDoc(doc(db, "adminRequests", requestId), {
        status: "denied",
      });
      setAdminRequests((prev) =>
        prev.map((req) =>
          req.id === requestId ? { ...req, status: "denied" } : req
        )
      );
    } catch (err) {
      console.error("Failed to deny request:", err);
    }
  };

  if (!user) return null;

  return (
    <div className="profile-container">
      <h1>Your Profile</h1>

      {/* Admin Request Section */}
      {!isAdmin && (
        <div className="admin-request-section card">
          <p>Want admin access? Request it below:</p>
          <button onClick={requestAdmin}>Request Admin Access</button>
          {requestMessage && <p className="message">{requestMessage}</p>}
        </div>
      )}

      {/* Admin Approval Panel */}
      {isAdmin && (
        <section className="admin-requests">
          <h2>Admin Requests</h2>
          {adminRequests.length === 0 && (
            <p className="no-requests">No pending requests</p>
          )}
          <div className="requests-list">
            {adminRequests.map((req) => (
              <div className="request-card card" key={req.id}>
                <div className="request-info">
                  <p>
                    <strong>{req.email}</strong>
                  </p>
                  <p>
                    Status:{" "}
                    <span className={`status ${req.status}`}>{req.status}</span>
                  </p>
                </div>
                {req.status === "pending" && (
                  <div className="request-buttons">
                    <button
                      className="approve"
                      onClick={() => approveRequest(req.id, req.token)}
                    >
                      Approve
                    </button>
                    <button
                      className="deny"
                      onClick={() => denyRequest(req.id, req.token)}
                    >
                      Deny
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
};

export default Profile;
