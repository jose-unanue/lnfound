## LNFound
Overview

This web application allows users to report lost and found items, submit claims, and request administrative privileges. Admin users can review reports, approve or deny claims, and manage user requests, providing an organized and secure system for tracking lost items.

The app is built with React + TypeScript on the frontend and Firebase (Firestore) for authentication and database management.

## Features
For Normal Users

Report Lost or Found Items: Users can submit items with a description, image, and status (Lost/Found).

View Recent Reports: Recent lost and found items are displayed with images and details.

Submit Claims: Users can claim items they recognize or have found, including uploading identification (e.g., school ID).

Request Admin Access: Users can request admin privileges to help manage items and claims.

For Admin Users

Approve/Deny Admin Requests: Admins can grant or deny admin privileges to users.

Review Reports: Admins can view lost and found reports and manage their status.

Approve/Deny Claims: Admins can verify claims submitted by users and update claim statuses.

Delete Reports: Admins can remove inappropriate or resolved reports from the database.

## Technology Stack

Frontend: React, TypeScript, CSS

Backend / Database: Firebase Firestore

Authentication: Firebase Authentication

## File Structure (Key Files)
src/
├── components/
│   ├── Profile.tsx        # User profile and admin request panel
│   ├── Search.tsx         # Search and browse lost/found reports
│   ├── Claim.tsx          # Submit and manage claims
├── hooks/
│   └── useAuthGuard.ts    # Custom hook for user authentication
├── styles/
│   ├── Profile.css
│   ├── Search.css
│   └── Claim.css
├── firebase/
│   └── firebase.ts        # Firebase config & initialization

## Setup & Installation

Clone the repository

git clone <repository-url>
cd <repository-folder>


Install dependencies

npm install


Firebase Setup

Create a Firebase project.

Enable Firestore and Authentication (Email/Password or preferred method).

Replace the firebase/firebase.ts configuration with your Firebase project credentials.

Run the app

npm start


Access the app

Open http://localhost:3000
 in your browser.

## Notes

The app ensures that users cannot submit duplicate admin requests.

Admin privileges must be explicitly approved by another admin.

All sensitive actions (approving claims, deleting reports) are restricted to admin users.

## Future Improvements

Add notifications for admins and users when reports or claims are updated.

Add pagination for large sets of lost/found items.

Implement role-based routing for better access control.
