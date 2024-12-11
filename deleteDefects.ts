import axios from "axios";
import * as dotenv from "dotenv";

dotenv.config();

const API_TOKEN = process.env.QASE_API_TOKEN;
const PROJECT_CODE = process.env.PROJECT_CODE;

if (!API_TOKEN || !PROJECT_CODE) {
  console.error(
    "Missing API token or project code. Please check your .env file."
  );
  process.exit(1);
}

const QASE_API_URL = "https://api.qase.io/v1";

const deleteAllDefects = async () => {
  try {
    // Step 1: Test API token permissions
    console.log("Checking permissions...");
    const testResponse = await axios.get(
      `${QASE_API_URL}/defect/${PROJECT_CODE}`,
      {
        headers: {
          "Content-Type": "application/json",
          Token: API_TOKEN,
        },
      }
    );

    if (!testResponse.data.status) {
      console.error(
        "API token does not have the necessary permissions. Please check the token."
      );
      return;
    }

    console.log("Permissions are valid. Fetching defects...");

    // Step 2: Get all defects
    const defects = testResponse.data.result.entities;

    if (!defects || defects.length === 0) {
      console.log("No defects found to delete.");
      return;
    }

    console.log(`Found ${defects.length} defects. Deleting them...`);

    // Step 3: Delete defects
    for (const defect of defects) {
      const defectId = defect.id;
      try {
        await axios.delete(
          `${QASE_API_URL}/defect/${PROJECT_CODE}/${defectId}`,
          {
            headers: {
              "Content-Type": "application/json",
              Token: API_TOKEN,
            },
          }
        );
        console.log(`Deleted defect with ID: ${defectId}`);
      } catch (deleteError) {
        console.error(
          `Failed to delete defect with ID ${defectId}:`,
          deleteError.response?.data || deleteError.message
        );
      }
    }

    console.log("All defects have been deleted.");
  } catch (error) {
    console.error(
      "Error fetching or deleting defects:",
      error.response?.data || error.message
    );
  }
};

deleteAllDefects();
