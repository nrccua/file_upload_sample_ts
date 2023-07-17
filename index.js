const { uploadFile } = require('./file_upload_sample');

// Example usage
const fileType = "enrollment";  // Replace with the desired file type;
const filePath = "sample.csv";  // Replace with the path to your file
const fileName = "sample.csv";  // Replace with the desired file name
const fileDescription = "Some description for this file";  // Option file description
const originalFileName = "testFile.csv"; // File name from the original file uploaded. Signed URL will be generated to save file with this name.

uploadFile(fileType, filePath, fileName, fileDescription, originalFileName)
  .catch(error => {
    console.error('Error:', error.message);
  });
  
