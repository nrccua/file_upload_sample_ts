* Using Node v16.13.0
* npm install
* Set required variables at the top of [file_upload_sample.ts](file_upload_sample.ts)
    * URL
    * ORGANIZATION_UID
    * USERNAME
    * PASSWORD
* Update example usage parameters [index.js](index.js)
    * fileType = "enrollment"  # Replace with the desired file type
    * filePath = "sample.csv"  # Replace with the path to your file
    * fileName = "sample.csv"  # Replace with the desired file name
    * fileDescription = "Some description for this file"  # Optional file description
    * originalFileName = "testFile.csv" #File name from the original file uploaded. Signed URL will be generated to save file with this name.


* Run `npm run start`