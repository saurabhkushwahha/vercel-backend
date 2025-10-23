const { google } = require("googleapis");
const fs = require("fs");
const path = require("path");

// Folder ID jahan file upload karna hai
const FOLDER_ID = "16ObQgGBcQ7OEV1gaRCBtiPmcZAxo4Vwm";

// OAuth2 client setup
const oauth2Client = new google.auth.OAuth2(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  process.env.GOOGLE_REDIRECT_URI
);

// Scopes for Drive
const SCOPES = ["https://www.googleapis.com/auth/drive.file"];

// Generate auth URL (visit this once to get token)
function generateAuthUrl() {
  return oauth2Client.generateAuthUrl({
    access_type: "offline",
    scope: SCOPES,
  });
}

// Set tokens manually after first login
function setTokens(tokens) {
  oauth2Client.setCredentials(tokens);
}

// Drive instance
const drive = google.drive({ version: "v3", auth: oauth2Client });

// Upload function
async function uploadFile(buffer, fileName, mimeType) {
  try {
    const fileMetadata = { name: fileName, parents: [FOLDER_ID] };
    const media = { mimeType, body: buffer };

    const res = await drive.files.create({
      resource: fileMetadata,
      media: media,
      fields: "id",
    });

    const fileId = res.data.id;

    await drive.permissions.create({
      fileId,
      requestBody: { role: "reader", type: "anyone" },
    });

    return `https://drive.google.com/uc?id=${fileId}&export=download`;
  } catch (err) {
    console.error("❌ Upload failed:", err.message);
    throw err;
  }
}

module.exports = { generateAuthUrl, setTokens, uploadFile };
