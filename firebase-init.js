// Firebase initialization script for server-side operations
const admin = require('firebase-admin');
const express = require('express');
const router = express.Router();

// Initialize Firebase Admin SDK
// In production, you would use environment variables or a service account key
try {
  if (admin.apps.length === 0) {
    admin.initializeApp({
      // For development, this will use the Firebase emulator if available
      // For production, replace with your actual Firebase project credentials
      projectId: process.env.FIREBASE_PROJECT_ID || 'quality-org-hub',
      // If you have service account credentials JSON file:
      // credential: admin.credential.cert(require('./path-to-service-account.json'))
    });
    
    console.log('Firebase Admin SDK initialized');
  }
} catch (error) {
  console.error('Error initializing Firebase Admin SDK:', error);
}

// Database reference
const db = admin.apps.length ? admin.firestore() : null;

// API Routes for Firebase
// These routes allow the front-end to interact with Firebase through a REST API

// Get all documents from a collection
router.get('/api/firebase/:collection', async (req, res) => {
  try {
    if (!db) {
      return res.status(500).json({ error: 'Firebase not initialized' });
    }
    
    const { collection } = req.params;
    const snapshot = await db.collection(collection).get();
    
    const data = [];
    snapshot.forEach(doc => {
      data.push({
        id: doc.id,
        ...doc.data()
      });
    });
    
    res.json({ data });
  } catch (error) {
    console.error(`Error getting documents from ${req.params.collection}:`, error);
    res.status(500).json({ error: error.message });
  }
});

// Get a document by ID
router.get('/api/firebase/:collection/:id', async (req, res) => {
  try {
    if (!db) {
      return res.status(500).json({ error: 'Firebase not initialized' });
    }
    
    const { collection, id } = req.params;
    const doc = await db.collection(collection).doc(id).get();
    
    if (!doc.exists) {
      return res.status(404).json({ error: 'Document not found' });
    }
    
    res.json({
      id: doc.id,
      ...doc.data()
    });
  } catch (error) {
    console.error(`Error getting document ${req.params.id} from ${req.params.collection}:`, error);
    res.status(500).json({ error: error.message });
  }
});

// Create a document
router.post('/api/firebase/:collection', async (req, res) => {
  try {
    if (!db) {
      return res.status(500).json({ error: 'Firebase not initialized' });
    }
    
    const { collection } = req.params;
    const data = req.body;
    
    // Add timestamps
    const docData = {
      ...data,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      updatedAt: admin.firestore.FieldValue.serverTimestamp()
    };
    
    const docRef = await db.collection(collection).add(docData);
    
    res.status(201).json({
      id: docRef.id,
      ...docData
    });
  } catch (error) {
    console.error(`Error creating document in ${req.params.collection}:`, error);
    res.status(500).json({ error: error.message });
  }
});

// Update a document
router.patch('/api/firebase/:collection/:id', async (req, res) => {
  try {
    if (!db) {
      return res.status(500).json({ error: 'Firebase not initialized' });
    }
    
    const { collection, id } = req.params;
    const updates = req.body;
    
    // Add timestamp
    const updateData = {
      ...updates,
      updatedAt: admin.firestore.FieldValue.serverTimestamp()
    };
    
    await db.collection(collection).doc(id).update(updateData);
    
    // Get updated document
    const doc = await db.collection(collection).doc(id).get();
    
    if (!doc.exists) {
      return res.status(404).json({ error: 'Document not found after update' });
    }
    
    res.json({
      id: doc.id,
      ...doc.data()
    });
  } catch (error) {
    console.error(`Error updating document ${req.params.id} in ${req.params.collection}:`, error);
    res.status(500).json({ error: error.message });
  }
});

// Delete a document
router.delete('/api/firebase/:collection/:id', async (req, res) => {
  try {
    if (!db) {
      return res.status(500).json({ error: 'Firebase not initialized' });
    }
    
    const { collection, id } = req.params;
    
    await db.collection(collection).doc(id).delete();
    
    res.json({ success: true, id });
  } catch (error) {
    console.error(`Error deleting document ${req.params.id} from ${req.params.collection}:`, error);
    res.status(500).json({ error: error.message });
  }
});

// Utility function to check Firebase connection
router.get('/api/firebase/status/check', (req, res) => {
  if (db) {
    res.json({ status: 'connected' });
  } else {
    res.status(500).json({ status: 'disconnected', error: 'Firebase not initialized' });
  }
});

// Verify Firebase connectivity with a test write operation
router.get('/api/firebase/status', async (req, res) => {
  try {
    if (!db) {
      return res.status(500).json({ 
        status: 'disconnected', 
        error: 'Firebase not initialized',
        ready: false,
        timestamp: new Date().toISOString()
      });
    }
    
    // Try to access a collection to verify connection
    const testRef = db.collection('_connection_test').doc('test');
    await testRef.set({ timestamp: admin.firestore.FieldValue.serverTimestamp() });
    const testDoc = await testRef.get();
    
    // Clean up the test document
    await testRef.delete();
    
    res.json({
      status: 'connected',
      ready: true,
      timestamp: new Date().toISOString(),
      test: testDoc.exists
    });
  } catch (error) {
    console.error('Error verifying Firebase connection:', error);
    
    res.status(500).json({ 
      status: 'error', 
      error: error.message,
      ready: false,
      timestamp: new Date().toISOString()
    });
  }
});

// Reset all Firebase data (dangerous operation)
router.post('/api/firebase/reset', async (req, res) => {
  try {
    if (!db) {
      return res.status(500).json({ error: 'Firebase not initialized' });
    }
    
    // Verify the request body
    const { confirmed } = req.body;
    
    if (!confirmed) {
      return res.status(400).json({ error: 'Reset operation requires confirmation' });
    }
    
    // Get all collections
    const collections = [
      'personnel',
      'teams',
      'clients',
      'skills',
      'processes',
      'raci',
      'resourceAllocations',
      'scenarios'
    ];
    
    // Delete all documents in each collection
    for (const collectionName of collections) {
      const snapshot = await db.collection(collectionName).get();
      
      // No documents to delete
      if (snapshot.empty) {
        console.log(`Collection ${collectionName} is already empty`);
        continue;
      }
      
      // Delete in batches of 500 (Firestore limit)
      const batchSize = 500;
      let batch = db.batch();
      let count = 0;
      
      snapshot.forEach(doc => {
        batch.delete(doc.ref);
        count++;
        
        // Commit batch when it reaches the limit
        if (count >= batchSize) {
          console.log(`Committing batch of ${count} deletes for ${collectionName}`);
          batch.commit();
          batch = db.batch();
          count = 0;
        }
      });
      
      // Commit any remaining deletes
      if (count > 0) {
        console.log(`Committing final batch of ${count} deletes for ${collectionName}`);
        await batch.commit();
      }
      
      console.log(`Deleted all documents in collection ${collectionName}`);
    }
    
    res.json({ 
      success: true, 
      message: 'All Firebase data has been reset',
      collections
    });
  } catch (error) {
    console.error('Error resetting Firebase data:', error);
    res.status(500).json({ error: error.message });
  }
});

// Bulk operations
router.post('/api/firebase/batch', async (req, res) => {
  try {
    if (!db) {
      return res.status(500).json({ error: 'Firebase not initialized' });
    }
    
    const { operations } = req.body;
    
    if (!operations || !Array.isArray(operations)) {
      return res.status(400).json({ error: 'Invalid operations format' });
    }
    
    const batch = db.batch();
    const timestamp = admin.firestore.FieldValue.serverTimestamp();
    
    operations.forEach(op => {
      const { type, collection, id, data } = op;
      
      if (!type || !collection) {
        throw new Error('Invalid operation format');
      }
      
      if (type === 'create') {
        const docRef = id ? db.collection(collection).doc(id) : db.collection(collection).doc();
        batch.set(docRef, {
          ...data,
          createdAt: timestamp,
          updatedAt: timestamp
        });
      } else if (type === 'update' && id) {
        const docRef = db.collection(collection).doc(id);
        batch.update(docRef, {
          ...data,
          updatedAt: timestamp
        });
      } else if (type === 'delete' && id) {
        const docRef = db.collection(collection).doc(id);
        batch.delete(docRef);
      }
    });
    
    await batch.commit();
    
    res.json({ success: true });
  } catch (error) {
    console.error('Error performing batch operations:', error);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router; 