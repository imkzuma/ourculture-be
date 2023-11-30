'use strict'

const path = require('path');
const { Storage } = require('@google-cloud/storage');
const nanoid =  require('nanoid');

const pathKey = path.resolve('./serviceaccount.json');

const gcs = new Storage({
  projectId: process.env.projectId,
  keyFilename: pathKey
});

const getPublicUrl = (bucketName, filename) => {
  return `https://storage.googleapis.com/${bucketName}/${filename}`;
}

const uploadToGcs = (req, res, next) => {
  if (!req.files || req.files.length === 0) return next();

  const bucketName = process.env.bucketName;
  const bucket = gcs.bucket(bucketName);

  const uploadedFiles = [];

  const uploadPromises = req.files.map((file) => {
    return new Promise((resolve, reject) => {
      const uniqueId = nanoid(6);
      const fileName =
        req.user.user.username +
        '-' +
        Date.now() +
        '-' +
        uniqueId +
        '.' +
        file.originalname.split('.').pop();
      const gcsFile = bucket.file(fileName);

      const stream = gcsFile.createWriteStream({
        metadata: {
          contentType: file.mimetype,
        },
      });

      stream.on('error', (err) => {
        file.cloudStorageError = err;
        reject(err);
      });

      stream.on('finish', () => {
        file.cloudStorageObject = fileName;
        file.cloudStoragePublicUrl = getPublicUrl(bucketName, fileName);
        uploadedFiles.push(file.cloudStoragePublicUrl);
        resolve();
      });

      stream.end(file.buffer);
    });
  });

  Promise.all(uploadPromises)
    .then(() => {
      req.uploadedFiles = uploadedFiles; // Save the array of object URLs in req.uploadedFiles
      next();
    })
    .catch((err) => {
      next(err);
    });
};

module.exports = { uploadToGcs, getPublicUrl };
