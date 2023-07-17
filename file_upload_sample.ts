import axios from "axios";
import fetch from "cross-fetch";

import * as fs from "fs";
import * as FormData from "form-data";

const USERNAME = "";
const PASSWORD = "";
const ORGANIZATION_UID = "";
const URL = "";

interface AuthResponse {
  sessionToken: string;
}

interface Fields {
  key: string;
  "x-amz-algorithm": string;
  "x-amz-credential": string;
  "x-amz-date": string;
  "x-amz-security-token": string;
  policy: string;
  "x-amz-signature": string;
}

interface PreSignedData {
  url: string;
  fields: Fields;
  id: string;
}

interface UploadDetails {
  data: PreSignedData;
  status: Number;
}

async function authenticate(): Promise<string> {
  const authUrl = `${URL}/login`;
  const authPayload = {
    userName: USERNAME,
    password: PASSWORD,
    acceptedTerms: true,
  };

  const authResponse = await fetch(authUrl, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(authPayload),
  });

  if (authResponse.status === 200) {
    const authData: AuthResponse = (await authResponse.json()) as AuthResponse;
    return authData.sessionToken;
  } else {
    throw new Error("Authentication failed.");
  }
}

async function getPreSignedData(
  authToken: string,
  fileType: string,
  fileName: string,
  fileDescription: string,
  originalFileName: string
): Promise<PreSignedData> {
  const uploadUrl = `${URL}/files/upload`;
  const uploadHeaders = {
    Authorization: `JWT ${authToken}`,
    Organization: ORGANIZATION_UID,
  };
  const uploadPayload = {
    fileName,
    productType: fileType,
    fileDescription,
    originalFileName,
  };

  try {
    const uploadDetails: UploadDetails = await axios.post(
      uploadUrl,
      uploadPayload,
      {
        headers: uploadHeaders,
      }
    );
    if (uploadDetails.status === 200) {
      return uploadDetails.data;
    } else {
      throw new Error("Failed to get upload details.");
    }
  } catch (error) {
    throw new Error("Failed to get upload details.");
  }
}

export async function uploadFile(
  fileType: string,
  filePath: string,
  fileName: string,
  fileDescription: string,
  originalFileName: string
): Promise<void> {
  try {
    // Get an authentication token by providing credentials
    const authToken: string = await authenticate();

    // Get pre-signed data to upload file to AWS S3
    const preSignedData: PreSignedData = await getPreSignedData(
      authToken,
      fileType,
      fileName,
      fileDescription,
      originalFileName
    );

    // Extract URL and fields from the pre-signed data response
    const { url, fields } = preSignedData;

    // Load file data
    const fileData = fs.readFileSync(filePath);

    // Prepare form data
    const formData = new FormData();
    
    // Append the pre-signed fields data
    Object.entries(fields).forEach(([key, value]) => {
      formData.append(key, String(value));
    });

    // Append fileData
    formData.append("file", fileData);

    const uploadResponse = await axios.post(url, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    if (uploadResponse.status === 204) {
      console.log("File uploaded successfully.");
    } else {
      console.log("Failed to upload file. Status code:", uploadResponse.status);
    }
  } catch (error) {
    console.log("Error:", error.message);
  }
}
