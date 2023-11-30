import asyncHandler from "express-async-handler";
import ShopModel from "../models/ShopSchema.js";
import jwt from "jsonwebtoken";
import fetch from "node-fetch";

export const AuthCheckController = asyncHandler(async (req, res) => {
  const { shop: shopQuery } = req.body;

  const shop = await ShopModel.findOne({ domain: shopQuery });

  if (!shop) console.log(shop);
  return res.status(404).json({
    isAuthenticated: false,
    accessToken: null,
  });

  const accessToken = jwt.sign(
    {
      shop: shop._id,
    },
    process.env.SHOPIFY_CLIENT_SECRET
  );
  console.log(`AccessToken: ${accessToken}`);
  return res.json({
    accessToken: accessToken,
    isAuthenticated: true,
  });
});

export const AuthenticateController = asyncHandler(async (req, res) => {
  const { shop: shopQuery, code } = req.body;

  const authUrl = `https://${shopQuery}/admin/oauth/access_token?code=${code}&client_id=${process.env.SHOPIFY_CLIENT_ID}&client_secret=${process.env.SHOPIFY_CLIENT_SECRET}`;

  const response = await fetch(authUrl, {
    method: "POST",
    headers: {
      "content-type": "application/json",
    },
  });

  const { access_token, scope } = await response.json();
  const shop = await ShopModel.create({
    domain: shopQuery,
    password: access_token,
    scope: scope,
  });

  if (!shop)
    return res.json({
      isAuthenticated: false,
      accessToken: null,
    });

  const accessToken = jwt.sign(
    { shop: shop._id },
    process.env.SHOPIFY_CLIENT_SECRET
  );

  return res.json({
    accessToken,
    isAuthenticated: true,
  });
});
