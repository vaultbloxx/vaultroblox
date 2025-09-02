import axios from "axios";
import dotenv from "dotenv";
dotenv.config();

// Controller to fetch inventory items for a Roblox user
const getUserInventory = async (userID) => {
  // const { userId } = req.params; // Roblox user ID
  // if (!userId) {
  //   return res.status(400).json({ error: "User ID is required" });
  // }

  // Define the API endpoint
  const apiUrl = `https://apis.roblox.com/cloud/v2/users/${userID}/inventory-items`;

  // Request headers
  const headers = {
    "x-api-key": process.env.ROBLOX_ALL_ACCESS_API_KEY,
  };

  // Make the API request
  const response = await axios.get(apiUrl, { headers });

  // Handle successful response
  if (response.status === 200) {
    console.log(response.data);
  } else {
    console.error("Failed to fetch inventory items");
  }
};

getUserInventory("5446822845");
