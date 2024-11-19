import mongoose from 'mongoose';
import mime from 'mime-types';
import path from 'path';

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

    // Get project name and file path from the URL
    const { slug } = req.query;
    const projectName = slug[0];
    const filePath = slug.slice(1).join('/') || 'index.html';

    // Construct the full file path
    const fullPath = `${projectName}/${filePath}`;
    console.log('Requesting file:', fullPath);

    // Find the file in GridFS
    const files = await bucket.find({ filename: fullPath }).toArray();
    
    if (!files.length) {
      if (!filePath || filePath === 'index.html') {
        // Try to find index.html in the project root
        const indexFiles = await bucket.find({ filename: `${projectName}/index.html` }).toArray();
        if (!indexFiles.length) {
          return res.status(404).json({ error: 'Project or file not found' });
        }
        files[0] = indexFiles[0];
      } else {
        return res.status(404).json({ error: 'File not found' });
      }
    }

    const file = files[0];

    // Determine content type from metadata or file extension
    const contentType = file.metadata?.contentType || 
                       mime.lookup(path.extname(file.filename)) || 
                       'application/octet-stream';
    
    // Set appropriate headers
    res.setHeader('Content-Type', contentType);
    res.setHeader('Cache-Control', 'public, max-age=3600');

    // Special handling for HTML files to rewrite relative URLs
    if (contentType === 'text/html') {
      let htmlContent = '';
      const downloadStream = bucket.openDownloadStream(file._id);
      
      for await (const chunk of downloadStream) {
        htmlContent += chunk.toString('utf8');
      }

      // Rewrite relative URLs to point to our API
      htmlContent = htmlContent.replace(
        /(src|href)=("|')(?!http|\/\/|data:)([^"']*)("|')/g,
        (match, attr, quote, path) => {
          if (path.startsWith('/')) {
            path = path.substring(1);
          }
          return `${attr}=${quote}/api/preview/${projectName}/${path}${quote}`;
        }
      );

      return res.send(htmlContent);
    }

    // Stream non-HTML files directly
    const downloadStream = bucket.openDownloadStream(file._id);
    downloadStream.pipe(res);

  } catch (error) {
    console.error('Error serving file:', error);
    return res.status(500).json({ error: 'Failed to serve file' });
  }
}

export const config = {
  api: {
    bodyParser: false,
    responseLimit: false,
  },
};