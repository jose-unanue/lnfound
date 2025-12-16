import React, { useEffect, useState } from "react";
import { db, storage } from "../firebase/firebase";
import {
  collection,
  addDoc,
  getDoc,
  getDocs,
  updateDoc,
  doc,
  query,
  where,
  orderBy,
} from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import useAuthGuard from "../hooks/useAuthGuard";
import "../styles/Claim.css";

interface ClaimItem {
  id: string;
  itemId: string;
  itemName: string;
  claimedBy: string;
  status: "pending" | "approved" | "denied";
  identificationUrl?: string;
  timestamp?: any;
}

interface ItemOption {
  id: string;
  itemName: string;
}

const Claim: React.FC = () => {
  const user = useAuthGuard();
  const [isAdmin, setIsAdmin] = useState(false);
  const [itemOptions, setItemOptions] = useState<ItemOption[]>([]);
  const [selectedItem, setSelectedItem] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [claims, setClaims] = useState<ClaimItem[]>([]);
  const [message, setMessage] = useState("");

  // Fetch user info
  useEffect(() => {
    if (!user) return;

    const fetchUser = async () => {
      try {
        const docSnap = await getDoc(doc(db, "users", user.token));
        if (docSnap.exists()) {
          const data = docSnap.data();
          setIsAdmin(data.isAdmin === true); // explicitly check === true
        } else {
          console.warn("User document does not exist in Firestore!");
          setIsAdmin(false);
        }
      } catch (err) {
        console.error("Failed to fetch user data:", err);
        setIsAdmin(false);
      }
    };

    fetchUser();
  }, [user]);

  // Fetch items to claim
  useEffect(() => {
    const fetchItems = async () => {
      const snapshot = await getDocs(collection(db, "lostItems"));
      const items: ItemOption[] = snapshot.docs.map((d) => ({
        id: d.id,
        itemName: d.data().itemName,
      }));
      setItemOptions(items);
    };
    fetchItems();
  }, []);

  // Fetch claims for admin
  useEffect(() => {
    if (!isAdmin) return;
    const fetchClaims = async () => {
      const snapshot = await getDocs(
        query(collection(db, "claims"), orderBy("timestamp", "desc"))
      );
      const data: ClaimItem[] = snapshot.docs.map((d) => {
        const docData = d.data() as ClaimItem;
        return {
          docId: d.id, // keep the Firestore doc ID separate
          ...docData, // spread the rest of the fields
        };
      });
      setClaims(data);
    };
    fetchClaims();
  }, [isAdmin]);

  // Submit a new claim
  const submitClaim = async () => {
    if (!user || !selectedItem || !file) {
      setMessage("Please select an item and upload your ID.");
      return;
    }
    try {
      // Upload file
      const fileRef = ref(storage, `claims/${user.uid}-${file.name}`);
      await uploadBytes(fileRef, file);
      const url = await getDownloadURL(fileRef);

      // Add claim document
      await addDoc(collection(db, "claims"), {
        itemId: selectedItem,
        itemName:
          itemOptions.find((i) => i.id === selectedItem)?.itemName ?? "",
        claimedBy: user.email,
        status: "pending",
        identificationUrl: url,
        timestamp: new Date(),
      });

      setMessage("Claim submitted successfully!");
      setFile(null);
      setSelectedItem("");
    } catch (err) {
      console.error(err);
      setMessage("Failed to submit claim.");
    }
  };

  // Admin actions
  const approveClaim = async (itemId: string) => {
    try {
      // Find all claims with this itemId
      const q = query(collection(db, "claims"), where("itemId", "==", itemId));
      const snapshot = await getDocs(q);

      if (snapshot.empty) {
        console.log("No claims found for this itemId:", itemId);
        return;
      }

      snapshot.docs.forEach(async (claimDoc) => {
        await updateDoc(doc(db, "claims", claimDoc.id), { status: "approved" });
        setClaims((prev) =>
          prev.map((c) =>
            c.id === claimDoc.id ? { ...c, status: "approved" } : c
          )
        );
      });
    } catch (err) {
      console.error("Failed to approve claim:", err);
    }
  };

  const denyClaim = async (itemId: string) => {
    try {
      // Find all claims with this itemId
      const q = query(collection(db, "claims"), where("itemId", "==", itemId));
      const snapshot = await getDocs(q);

      if (snapshot.empty) {
        console.log("No claims found for this itemId:", itemId);
        return;
      }

      snapshot.docs.forEach(async (claimDoc) => {
        await updateDoc(doc(db, "claims", claimDoc.id), { status: "denied" });
        setClaims((prev) =>
          prev.map((c) =>
            c.id === claimDoc.id ? { ...c, status: "denied" } : c
          )
        );
      });
    } catch (err) {
      console.error("Failed to deny claim:", err);
    }
  };

  if (!user) return null;

  return (
    <div className="claim-page">
      <h1>Claim an Item</h1>

      {/* User submission */}
      {!isAdmin && (
        <div className="claim-form card">
          <label>Select Item:</label>
          <select
            value={selectedItem}
            onChange={(e) => setSelectedItem(e.target.value)}
          >
            <option value="">--Select an item--</option>
            {itemOptions.map((item) => (
              <option key={item.id} value={item.id}>
                {item.itemName}
              </option>
            ))}
          </select>

          <div className="claim-form">
            <label htmlFor="claim-file">Upload your ID:</label>
            <input
              type="file"
              id="claim-file"
              onChange={(e) => setFile(e.target.files?.[0] ?? null)}
              style={{ display: "none" }}
            />
            <button
              type="button"
              className="file-upload-btn"
              onClick={() => document.getElementById("claim-file")?.click()}
            >
              {file ? file.name : "Choose ID file"}
            </button>
          </div>

          <button onClick={submitClaim}>Submit Claim</button>
          {message && <p className="message">{message}</p>}
        </div>
      )}

      {/* Admin review */}
      {isAdmin && (
        <section className="claims-admin">
          <h2>Pending Claims</h2>
          {claims.length === 0 && <p>No claims yet.</p>}
          <div className="claims-list">
            {claims.map((claim) => (
              <div className="claim-card card" key={claim.itemId}>
                <p>
                  <strong>Item:</strong> {claim.itemName}
                </p>
                <p>
                  <strong>Claimed By:</strong> {claim.claimedBy}
                </p>
                {claim.identificationUrl && (
                  <p className="id-holder">
                    <a
                      href={claim.identificationUrl}
                      target="_blank"
                      rel="noreferrer"
                    >
                      View ID
                    </a>
                  </p>
                )}
                <p>
                  <strong>Status:</strong>{" "}
                  <span className={`status ${claim.status}`}>
                    {claim.status}
                  </span>
                </p>
                {claim.status === "pending" && (
                  <div className="claim-buttons">
                    <button
                      className="approve"
                      onClick={() => approveClaim(claim.itemId)}
                    >
                      Approve
                    </button>
                    <button
                      className="deny"
                      onClick={() => denyClaim(claim.itemId)}
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

export default Claim;
