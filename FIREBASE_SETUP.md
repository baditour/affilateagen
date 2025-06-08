# 🔥 Firebase Setup Guide

## 1. Create Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Create a project"
3. Enter project name: `umrah-agent-app`
4. Enable Google Analytics (optional)
5. Click "Create project"

## 2. Setup Firestore Database

1. In Firebase Console, go to "Firestore Database"
2. Click "Create database"
3. Choose "Start in test mode" (for development)
4. Select location closest to your users
5. Click "Done"

## 3. Setup Authentication

1. Go to "Authentication" in Firebase Console
2. Click "Get started"
3. Go to "Sign-in method" tab
4. Enable "Email/Password" provider
5. Click "Save"

## 4. Get Firebase Configuration

1. Go to Project Settings (gear icon)
2. Scroll down to "Your apps"
3. Click "Web" icon (</>) to add web app
4. Enter app nickname: `umrah-agent-web`
5. Click "Register app"
6. Copy the configuration object

## 5. Update Firebase Config

Replace the config in `app/config/firebase.ts`:

```typescript
const firebaseConfig = {
  apiKey: "your-actual-api-key",
  authDomain: "your-project-id.firebaseapp.com",
  projectId: "your-actual-project-id",
  storageBucket: "your-project-id.appspot.com",
  messagingSenderId: "your-actual-sender-id",
  appId: "your-actual-app-id",
  measurementId: "your-measurement-id"
};
```

## 6. Setup Firestore Security Rules

In Firebase Console > Firestore Database > Rules, replace with:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Agents can read/write their own data
    match /agents/{agentId} {
      allow read, write: if request.auth != null && request.auth.uid == resource.data.userId;
    }
    
    // Agents can read/write their own leads
    match /leads/{leadId} {
      allow read, write: if request.auth != null && 
        (request.auth.uid == resource.data.agentId || 
         request.auth.uid == request.resource.data.agentId);
    }
    
    // Agents can read/write their own commissions
    match /commissions/{commissionId} {
      allow read, write: if request.auth != null && 
        (request.auth.uid == resource.data.agentId || 
         request.auth.uid == request.resource.data.agentId);
    }
  }
}
```

## 7. Database Collections Structure

### Agents Collection
```
agents/
  {agentId}/
    - name: string
    - email: string
    - phone: string
    - userId: string (Firebase Auth UID)
    - commissionRate: number
    - totalCommission: number
    - activeLeads: number
    - joinDate: timestamp
    - status: 'active' | 'inactive' | 'pending'
```

### Leads Collection
```
leads/
  {leadId}/
    - agentId: string
    - customerName: string
    - customerEmail: string
    - customerPhone: string
    - packageType: string
    - status: 'new' | 'contacted' | 'interested' | 'converted' | 'lost'
    - value: number
    - createdAt: timestamp
    - updatedAt: timestamp
```

### Commissions Collection
```
commissions/
  {commissionId}/
    - agentId: string
    - leadId: string
    - amount: number
    - percentage: number
    - status: 'pending' | 'paid' | 'cancelled'
    - createdAt: timestamp
    - paidAt: timestamp (optional)
```

## 8. Test Firebase Connection

1. Start your app: `npm start`
2. Try to register a new agent
3. Check Firebase Console to see if data is created
4. Try to login with the registered account

## 9. Environment Variables (Optional)

Create `.env` file in root directory:

```
EXPO_PUBLIC_FIREBASE_API_KEY=your-api-key
EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN=your-auth-domain
EXPO_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET=your-storage-bucket
EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your-sender-id
EXPO_PUBLIC_FIREBASE_APP_ID=your-app-id
```

Then update `firebase.ts` to use environment variables:

```typescript
const firebaseConfig = {
  apiKey: process.env.EXPO_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.EXPO_PUBLIC_FIREBASE_APP_ID,
};
```

## 10. Features Available

✅ **Authentication**
- User registration with email/password
- User login
- Automatic session management

✅ **Real-time Database**
- Agent profiles
- Lead management
- Commission tracking
- Real-time updates

✅ **Data Operations**
- Create, read, update leads
- Track commissions
- Agent statistics
- Real-time listeners

✅ **Security**
- User-based access control
- Secure Firebase rules
- Data validation

## 11. Next Steps

1. **Setup Firebase project** following steps 1-4
2. **Update configuration** in `app/config/firebase.ts`
3. **Test the app** with registration/login
4. **Customize** database structure as needed
5. **Deploy** to production when ready

## 12. Troubleshooting

**Common Issues:**
- Make sure Firebase config is correct
- Check internet connection
- Verify Firestore rules
- Check browser console for errors
- Ensure authentication is enabled

**Need Help?**
- Check Firebase documentation
- Review console errors
- Test with Firebase emulators
- Contact support if needed
