import { APP_SERVER_URL } from "../constants";
const searchParams = Object.fromEntries(
  new URLSearchParams(window.location.search)
);

export const response = await fetch(`${APP_SERVER_URL}/auth/check-me`, {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
  },
  body: JSON.stringify({ shop: searchParams.shop }),
});
