import mongoose from 'mongoose';
import { createRouter } from 'next-connect';
import multer from 'multer';
import { Readable } from 'stream';

const MONGODB_URI = process.env.MONGODB_URI;

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
}).fields([
  { name: 'files', maxCount: 100 },
  { name: 'paths', maxCount: 100 }
]);

const router = createRouter();

router.post(async (req, res) => {
  try {
    await connectDB();

    await new Promise((resolve, reject) => {
      upload(req, res, (err) => {
        if (err) {
          console.error('Multer upload error:', err);
          return reject(err);
        }
        resolve();
      });
    });

    if (!req.files?.files || req.files.files.length === 0) {
      return res.status(400).json({ 
        error: 'No files were uploaded.' 
      });
    }

    const projectName = req.body.projectName || 'unnamed-project';
    const filePaths = req.body.paths || [];
    const uploadedFiles = req.files.files;

    console.log('Project Name:', projectName);
    console.log('Paths:', filePaths);
    console.log('Files:', uploadedFiles.map(f => f.originalname));

    const db = mongoose.connection.db;
    const bucket = new mongoose.mongo.GridFSBucket(db, {
      bucketName: 'projects'
    });

    const uploadPromises = uploadedFiles.map((file, index) => {
      return new Promise((resolve, reject) => {
        const readableStream = new Readable();
        readableStream.push(file.buffer);
        readableStream.push(null);

        // Use the corresponding path from filePaths array
        const relativePath = filePaths[index] || file.originalname;
        const fullPath = `${projectName}/${relativePath}`;

        const uploadStream = bucket.openUploadStream(fullPath, {
          metadata: {
            projectName,
            relativePath,
            originalName: file.originalname,
            uploadedAt: new Date(),
            contentType: file.mimetype,
            size: file.size
          }
        });

        uploadStream.on('error', (error) => {
          console.error('Upload stream error:', error);
          reject(error);
        });

        uploadStream.on('finish', () => {
          resolve({
            filename: fullPath,
            originalName: file.originalname,
            relativePath,
            size: file.size,
            contentType: file.mimetype,
            fileId: uploadStream.id
          });
        });

        readableStream.pipe(uploadStream);
      });
    });

    const uploadedResults = await Promise.all(uploadPromises);

    return res.status(200).json({
      message: 'Project directory uploaded successfully',
      project: projectName,
      files: uploadedResults
    });

  } catch (error) {
    console.error('Upload handler error:', error);
    return res.status(500).json({
      error: 'Error uploading project directory: ' + error.message
    });
  }
});

router.use((err, req, res, next) => {
  console.error('Unhandled error:', err);
  res.status(500).json({
    error: 'Unexpected server error: ' + err.message
  });
});

export const config = {
  api: {
    bodyParser: false,
  },
};

export default router.handler();