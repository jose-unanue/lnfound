import React, { useState } from "react";
import "../styles/Report.css";
import { db, storage } from "../firebase/firebase";
import { collection, addDoc, Timestamp } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import useAuthGuard from "../hooks/useAuthGuard";

const Report: React.FC = () => {
  const user = useAuthGuard();
  const [itemName, setItemName] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState("lost");
  const [message, setMessage] = useState("");
  const [file, setFile] = useState<File | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user) {
      console.error("User not authenticated");
      setMessage("You must be logged in to report an item.")
      return;
    }

    try {
      let imageUrl = "";
      if (file) {
        const storageRef = ref(storage, `items/${file.name}_${Date.now()}`);
        await uploadBytes(storageRef, file);
        imageUrl = await getDownloadURL(storageRef);
      }

      await addDoc(collection(db, "lostItems"), {
        itemName,
        description,
        status,
        imageUrl,
        submittedBy: user.email,
        timestamp: Timestamp.now(),
      });

      setMessage("Item reported successfully!");
      setItemName("");
      setDescription("");
      setStatus("lost");
      setFile(null);
    } catch (err) {
      setMessage("Failed to report item.");
    }
  };

  return (
    <div className="report-container">
      <section className="instructions">
        <h2>How to Submit an Item</h2>
        <div className="instruction-cards">
          <div className="instruction-card">
            <h3>1. Enter Details</h3>
            <p>Fill in the item name and description.</p>
          </div>
          <div className="instruction-card">
            <h3>2. Upload Image</h3>
            <p>Optionally upload an image of the item.</p>
          </div>
          <div className="instruction-card">
            <h3>3. Select Status</h3>
            <p>Choose Lost or Found.</p>
          </div>
          <div className="instruction-card">
            <h3>4. Submit</h3>
            <p>Click “Submit Item” and you’re done!</p>
          </div>
        </div>
      </section>

      <section className="form-section">
        <h2>Report a Lost / Found Item</h2>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Item Name"
            value={itemName}
            onChange={(e) => setItemName(e.target.value)}
            required
          />
          <textarea
            placeholder="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          />
          <div className="custom-file-upload">
            <label>
              {file ? file.name : "Upload Image (optional)"}
              <input
                type="file"
                accept="image/*"
                onChange={(e) =>
                  setFile(e.target.files ? e.target.files[0] : null)
                }
              />
            </label>
          </div>
          <select value={status} onChange={(e) => setStatus(e.target.value)}>
            <option value="lost">Lost</option>
            <option value="found">Found</option>
          </select>
          <button type="submit">Submit Item</button>
        </form>
        {message && <p className="message">{message}</p>}
      </section>
    </div>
  );
};

export default Report;
