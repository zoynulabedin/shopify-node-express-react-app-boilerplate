import { sha256 } from "js-sha256";
import { useCallback, useEffect, useMemo, useState } from "react";
import {
  APP_SERVER_URL,
  SHOPIFY_CLIENT_ID,
  SHOPIFY_CLIENT_SECRET,
} from "../constants";
import { Authresponse } from "../api/authenticate";

const Authenticate = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  const searchParams = Object.fromEntries(
    new URLSearchParams(window.location.search)
  );
  console.log("searchParams", searchParams);

  // validate shop url
  const isValidShop = useMemo(() => {
    return /^[a-zA-Z0-9][a-zA-Z0-9\-]*\.myshopify\.com/.test(searchParams.shop);
  }, [searchParams.shop]);

  // validate hmac
  const { hmac, ...restParams } = searchParams;
  const isValidHmac = useMemo(() => {
    if (hmac === undefined) return <h2>Not valid</h2>;

    const queryString = new URLSearchParams(restParams).toString();
    const newHmac = sha256.hmac(SHOPIFY_CLIENT_SECRET, queryString);

    return newHmac === hmac;
  }, [hmac, restParams]);

  // request authentication code
  const authenticate = useCallback(() => {
    (async () => {
      try {
        const { isAuthenticated, accessToken } = await Authresponse.json();

        if (isAuthenticated && accessToken) {
          localStorage.setItem("access-token", accessToken);

          const shopName = searchParams.shop.split(".")[0];
          const redirection_uri = `https://admin.shopify.com/store/${shopName}/apps/${SHOPIFY_CLIENT_ID}`;

          window.location.replace(redirection_uri);
          setIsAuthenticated(true);
          return;
        }
      } catch (error) {
        //
      } finally {
        setLoading(false);
      }
    })();
  }, [searchParams.code, searchParams.shop]);

  useEffect(() => {
    if (!isValidHmac || !isValidShop) return;

    authenticate();
  }, [authenticate, isValidHmac, isValidShop]);

  if (!isValidShop) return <h2>Not valid shop url</h2>;
  if (!isValidHmac) return <h2>not valid</h2>;

  if (!isAuthenticated && !loading) return <h2>Not authenticated</h2>;

  return <h1>Loading...</h1>;
};

export default Authenticate;
