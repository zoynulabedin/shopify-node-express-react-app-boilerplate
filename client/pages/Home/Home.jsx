import { useCallback, useEffect, useMemo, useState } from "react";
import { sha256 } from "js-sha256";
import {
  APP_CLIENT_URL,
  SHOPIFY_CLIENT_ID,
  SHOPIFY_CLIENT_SECRET,
  SHOPIFY_SCOPES,
} from "../../constants";
import { response } from "../../api/authCheck";
const Home = () => {
  const [isAuthenticat, setIsAuthenticat] = useState(false);
  const searchParams = Object.fromEntries(
    new URLSearchParams(window.location.search)
  );
  // validate shop url
  const isValidShopUrl = useMemo(() => {
    return /^[a-zA-Z0-9][a-zA-Z0-9\-]*\.myshopify\.com/.test(searchParams.shop);
  }, [searchParams.shop]);

  // validate hmac
  const { hmac, ...restParams } = searchParams;
  const isValidHmac = useMemo(() => {
    if (hmac === undefined) return <h2>Not Valid</h2>;
    const queryString = new URLSearchParams(restParams).toString();
    const newHmac = sha256.hmac(SHOPIFY_CLIENT_SECRET, queryString);
    return newHmac === hmac;
  }, [hmac, restParams]);

  const authenticate = useCallback(() => {
    (async () => {
      const responsData = response;
      const { isAuthenticated, accessToken } = await responsData.json();
      console.log(
        `authenticated: ${isAuthenticated} accessToken: ${accessToken}`
      );
      if (isAuthenticated || accessToken) {
        localStorage.setItem("accessToken", accessToken);
        setIsAuthenticat(true);
        return;
      }
      const redirect_uri = `${APP_CLIENT_URL}/authenticate`;
      const state = Date.now();
      const authorizationUrl = `https://${searchParams.shop}/admin/oauth/authorize?client_id=${SHOPIFY_CLIENT_ID}&scope=${SHOPIFY_SCOPES}&redirect_uri=${redirect_uri}&state=${state}`;

      localStorage.setItem("state", state);
      window.location.replace(authorizationUrl);
    })();
  }, [searchParams.shop]);

  useEffect(() => {
    if (!isValidHmac || !isValidShopUrl) return;
    authenticate();
  }, [authenticate, isValidHmac, isValidShopUrl]);
  if (!isValidShopUrl) return <h2>Not valid shop url</h2>;
  if (!isValidHmac) return <h2>not valid</h2>;

  if (!isAuthenticat) return <h1>Loading...</h1>;
  return (
    <div className="text-center">
      <h1 className=" bg-green-900 text-5xl">Home page</h1>
    </div>
  );
};

export default Home;
