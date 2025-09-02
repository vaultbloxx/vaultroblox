import { asyncHandler } from "../utils/asyncHandler.js";
import { Robux } from "../models/robux.model.js";
import { User } from "../models/user.model.js";
import { Limited } from "../models/limited.model.js";
import { redis } from "../config/redis.js";
import { RecentSold } from "../models/recentSold.model.js";
import mongoose from "mongoose";
import fetch from "node-fetch";

const getRobux = asyncHandler(async (req, res) => {
  try {
    const cachedRobux = await redis.get("robuxPrice");

    if (cachedRobux) {
      return res.status(200).json(JSON.parse(cachedRobux));
    }

    const robuxData = await Robux.findOne(); // Get only ONE document

    if (!robuxData) {
      return res.status(404).json({ error: "Robux data not found" });
    }

    await redis.set("robuxPrice", JSON.stringify(robuxData), "EX", 30 * 60);

    res.status(200).json(robuxData); // Return as an object, not an array
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
});

const getShop = asyncHandler(async (req, res) => {
  try {
    const username = req.params.username;
    const user = await User.findOne({ username }).select("-password");

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    res.status(200).json(user);
  } catch (error) {
    console.log("Error getting shop:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

const getShopLimiteds = asyncHandler(async (req, res) => {
  try {
    const username = req.params.username;

    const user = await User.findOne({ username }).select("-password");
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    const limiteds = await Limited.find({ sellerId: user._id })
      .populate({
        path: "sellerId",
        select: "username verified _id",
      })
      .sort({
        createdAt: -1,
      });
    res.status(200).json(limiteds);
  } catch (error) {
    console.log("Error getting shop limiteds:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

const getLimiteds = asyncHandler(async (req, res) => {
  let { min, max, sort, skip = 0, limit = 10, search } = req.query;
  const query = { sold: false }; // Fetch only unsold items
  const sortOptions = {};

  // Convert values properly
  min = min ? Number(min) : null;
  max = max ? Number(max) : null;

  // Apply Price Range Filtering
  if (min !== null || max !== null) {
    query.price = {};
    if (min !== null) query.price.$gte = min;
    if (max !== null) query.price.$lte = max;
  }

  // Search functionality
  if (search) {
    query.name = { $regex: search, $options: "i" };
  }

  // Sorting Logic
  if (sort === "rhtl") sortOptions.rap = -1; // Rap High to Low
  if (sort === "rlth") sortOptions.rap = 1; // Rap Low to High
  if (sort === "phtl") sortOptions.price = -1; // Price High to Low
  if (sort === "plth") sortOptions.price = 1; // Price Low to High

  try {
    const cacheKey = `limiteds:min:${min}:max:${max}:sort:${sort}:search:${search}:skip:${skip}:limit:${limit}`;
    const cachedData = await redis.get(cacheKey);

    if (cachedData) {
      return res.status(200).json(JSON.parse(cachedData));
    }

    const limiteds = await Limited.find(query)
      .sort(sortOptions)
      .skip(Number(skip))
      .limit(Number(limit))
      .populate({
        path: "sellerId",
        select: "username verified _id",
      });

    await redis.set(cacheKey, JSON.stringify(limiteds), "EX", 60 * 2); // Cache for 2 minutes

    res.status(200).json(limiteds);
  } catch (error) {
    console.error("Error fetching limiteds:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

const getRecentlySold = asyncHandler(async (req, res) => {
  try {
    const cachedRecentlySold = await redis.get("recentlySold");

    if (cachedRecentlySold) {
      return res.status(200).json(JSON.parse(cachedRecentlySold));
    }
    const recentlySold = await RecentSold.find().sort({ createdAt: -1 });
    await redis.set(
      "recentlySold",
      JSON.stringify(recentlySold),
      "EX",
      30 * 60
    );
    res.status(200).json(recentlySold);
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
});

const getAllBanners = asyncHandler(async (req, res) => {
  try {
    const cachedBanners = await redis.get("allBanners");
    if (cachedBanners) {
      return res.status(200).json(JSON.parse(cachedBanners));
    }

    const banners = await mongoose.connection
      .collection("banners")
      .aggregate([
        {
          $lookup: {
            from: "users", // target collection
            localField: "sellerId", // banner field
            foreignField: "_id", // user field
            as: "sellerId",
          },
        },
        { $unwind: "$sellerId" }, // flatten array so sellerId becomes an object
        {
          $project: {
            _id: 1,
            name: 1,
            image: 1,
            price: 1,
            rap: 1,
            likes: 1,
            sold: 1,
            createdAt: 1,
            updatedAt: 1,
            __v: 1,
            "sellerId._id": 1,
            "sellerId.username": 1,
            "sellerId.verified": 1,
          },
        },
        { $sort: { createdAt: -1 } },
      ])
      .toArray();

    if (banners.length > 0) {
      await redis.set("allBanners", JSON.stringify(banners), "EX", 10 * 60);
    }

    res.status(200).json(banners);
  } catch (error) {
    console.error(error);
    res.status(400).json({ error: "Internal Server Error" });
  }
});

const checkRobloxItem = async (req, res) => {
  try {
    const { url, total } = req.body;
    if (!url)
      return res
        .status(400)
        .json({ error: "Please remove the current url and give it again." });
    if (!total) return res.status(400).json({ error: "Missing amount" });

    let id, type;

    if (url.includes("game-pass")) {
      type = "gamepass";
      id = url.match(/game-pass\/(\d+)/)?.[1];
    } else if (url.includes("bundles")) {
      type = "bundle";
      id = url.match(/bundles\/(\d+)/)?.[1];
    } else if (url.includes("catalog")) {
      type = "catalog";
      id = url.match(/catalog\/(\d+)/)?.[1];
    }

    if (!id) return res.status(400).json({ error: "Invalid Roblox URL" });

    let normalized, thumbUrl;

    if (type === "gamepass") {
      const details = await fetch(
        `https://apis.roblox.com/game-passes/v1/game-passes/${id}/product-info`
      ).then((r) => r.json());

      // ✅ Roblox sends "errors" array when something is wrong
      if (details.errors && details.errors.length > 0) {
        const errorCode = details.errors[0].code;

        if (errorCode === 0) {
          return res.status(404).json({ error: "Gamepass not found" });
        }

        // fallback for other Roblox error codes
        return res.status(400).json({
          error: "Failed to fetch gamepass",
          details: details.errors,
        });
      }
      // ✅ check if for sale
      if (details.IsForSale === false) {
        return res.status(400).json({ error: "Gamepass is not for sale" });
      }

      if (details.PriceInRobux !== parseFloat(total)) {
        return res.status(400).json({
          error: `Price mismatch. Gamepass price should be ${total}. But it's ${details.PriceInRobux}`,
        });
      }

      const thumb = await fetch(
        `https://thumbnails.roblox.com/v1/game-passes?gamePassIds=${id}&size=150x150&format=Png&isCircular=false`
      ).then((r) => r.json());
      thumbUrl = thumb?.data?.[0]?.imageUrl;

      normalized = {
        id,
        type,
        name: details.Name,
        price: details.PriceInRobux ?? null,
        creator: {
          id: details.Creator.Id,
          name: details.Creator.Name,
        },
        thumbnail: thumbUrl,
      };
    }

    if (type === "catalog" || type === "bundle") {
      const itemType = type === "catalog" ? "Asset" : "Bundle";
      const details = await fetch(
        `https://catalog.roblox.com/v1/catalog/items/${id}/details?itemType=${itemType}`
      ).then((r) => r.json());

      // ✅ Roblox sends "errors" array when something is wrong
      if (details.errors && details.errors.length > 0) {
        const errorCode = details.errors[0].code;

        if (errorCode === 21) {
          return res.status(404).json({ error: "Product not found" });
        }

        // fallback for other Roblox error codes
        return res.status(400).json({
          error: "Failed to fetch product",
          details: details.errors,
        });
      }

      // ✅ check if for sale
      if (!details.isPurchasable) {
        return res.status(400).json({ error: `${type} is not for sale` });
      }

      if (details.price !== parseFloat(total)) {
        return res.status(400).json({
          error: `Price mismatch. Product price should be ${total}. But it's ${details.price}`,
        });
      }

      const thumb = await fetch(
        type === "catalog"
          ? `https://thumbnails.roblox.com/v1/assets?assetIds=${id}&size=150x150&format=Png&isCircular=false`
          : `https://thumbnails.roblox.com/v1/bundles/thumbnails?bundleIds=${id}&size=300x300&format=Png&isCircular=false`
      ).then((r) => r.json());
      thumbUrl = thumb?.data?.[0]?.imageUrl;

      normalized = {
        id,
        type,
        name: details.name,
        price: details.price ?? null,
        creator: {
          id: details.creatorTargetId,
          name: details.creatorName,
        },
        thumbnail: thumbUrl,
      };
    }

    return res.json(normalized);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch Roblox item" });
  }
};

export {
  getRobux,
  getShop,
  getShopLimiteds,
  getLimiteds,
  getRecentlySold,
  getAllBanners,
  checkRobloxItem,
};
