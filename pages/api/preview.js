import mongoose from 'mongoose';

const MONGODB_URI = 'mongodb+srv://dhanushkihub:Cdrvkg5lIQPe25vl@previewtest.098u6.mongodb.net/?retryWrites=true&w=majority&appName=previewTest';

// Connect to MongoDB
const connectDB = async () => {
  if (mongoose.connection.readyState === 0) {
    try {
      await mongoose.connect(MONGODB_URI, {
        serverSelectionTimeoutMS: 5000,
        retryWrites: true
      });
      console.log('MongoDB connected successfully');
    } catch (err) {
      console.error('MongoDB connection error:', err);
      throw err;
    }
  }
};

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    await connectDB();
    const db = mongoose.connection.db;
    const bucket = new mongoose.mongo.GridFSBucket(db, { bucketName: 'projects' });

    // Get distinct project names from the files collection
    const files = await bucket.find({}).toArray();
    const projects = [...new Set(files.map(file => {
      const pathParts = file.filename.split('/');
      return pathParts[0]; // First part is the project name
    }))];

    return res.status(200).json({ projects });

  } catch (error) {
    console.error('Error fetching projects:', error);
    return res.status(500).json({ error: 'Failed to fetch projects' });
  }
}

export const config = {
  api: {
    bodyParser: false,
  },
};