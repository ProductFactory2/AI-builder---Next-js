import mongoose from 'mongoose';
import { createRouter } from 'next-connect';
import multer from 'multer';
import { Readable } from 'stream';

// MongoDB Atlas connection URI
const MONGODB_URI = 'mongodb+srv://dhanushkihub:Cdrvkg5lIQPe25vl@previewtest.098u6.mongodb.net/?retryWrites=true&w=majority&appName=previewTest';

// Create a robust connection function
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

// Configure multer for file upload
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 50 * 1024 * 1024 // 50MB file size limit
  }
}).array('files');

// Create router
const router = createRouter();

// POST route for file upload
router.post(async (req, res) => {
  try {
    // Ensure database connection
    await connectDB();

    // Wrap multer upload in a promise
    await new Promise((resolve, reject) => {
      upload(req, res, (err) => {
        if (err) {
          console.error('Multer upload error:', err);
          return reject(err);
        }
        resolve();
      });
    });

    // Check if files were uploaded
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ 
        error: 'No files were uploaded.' 
      });
    }

    // Get the MongoDB connection
    const db = mongoose.connection.db;
    
    // Create GridFS bucket
    const bucket = new mongoose.mongo.GridFSBucket(db, {
      bucketName: 'uploads'
    });

    // Upload files to GridFS
    const uploadPromises = req.files.map(file => {
      return new Promise((resolve, reject) => {
        // Create a readable stream from the buffer
        const readableStream = new Readable();
        readableStream.push(file.buffer);
        readableStream.push(null);

        // Create upload stream
        const uploadStream = bucket.openUploadStream(file.originalname, {
          metadata: {
            originalName: file.originalname,
            uploadedAt: new Date(),
            contentType: file.mimetype,
            size: file.size
          }
        });

        // Track upload information
        let uploadedFileInfo = null;

        // Handle stream events
        uploadStream.on('error', (error) => {
          console.error('Upload stream error:', error);
          reject(error);
        });

        uploadStream.on('finish', () => {
          // Retrieve file info after upload
          bucket.find({ filename: file.originalname })
            .toArray((err, files) => {
              if (err) {
                console.error('Error finding uploaded file:', err);
                reject(err);
                return;
              }

              if (files.length === 0) {
                console.error('No file found after upload');
                reject(new Error('No file found after upload'));
                return;
              }

              // Get the most recently uploaded file
              const uploadedFile = files[files.length - 1];

              // Resolve with file information
              resolve({
                filename: uploadedFile.filename,
                originalName: file.originalname,
                size: file.size,
                contentType: file.mimetype,
                fileId: uploadedFile._id
              });
            });
        });

        // Pipe the file buffer to GridFS
        readableStream.pipe(uploadStream);
      });
    });

    // Wait for all files to be uploaded
    const uploadedFiles = await Promise.all(uploadPromises);

    // Send success response
    return res.status(200).json({
      message: 'Files uploaded successfully',
      files: uploadedFiles
    });

  } catch (error) {
    console.error('Upload handler error:', error);
    return res.status(500).json({
      error: 'Error uploading files: ' + error.message
    });
  }
});

// Global error handler
router.use((err, req, res, next) => {
  console.error('Unhandled error:', err);
  res.status(500).json({
    error: 'Unexpected server error: ' + err.message
  });
});

export const config = {
  api: {
    bodyParser: false, // Disable default body parser
  },
};

export default router.handler();