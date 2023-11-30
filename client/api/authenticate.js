import { APP_SERVER_URL } from "../constants";
const searchParams = Object.fromEntries(
  new URLSearchParams(window.location.search)
);

export const Authresponse = await fetch(
  `${APP_SERVER_URL}/auth/get-shopify-token`,
  {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ shop: searchParams.shop, code: searchParams.code }),
  }
);
