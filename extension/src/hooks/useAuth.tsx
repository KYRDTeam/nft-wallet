import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { KRYSTAL_API } from "src/config/constants/constants";
import { ChainId } from "src/config/types";
import { walletsSelector } from "src/store/wallets";
import { login } from "src/utils/krystalService";

import { useSign } from "./useSign";
import { useAppSelector } from "./useStore";
import { useWallet } from "./useWallet";

interface AuthContextType {
  accessToken: string;
  loading: boolean;
  login: () => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType>({
  accessToken: "",
  loading: false,
  login: () => {},
  logout: () => {},
});

export const AuthProvider = ({
  children,
}: {
  children: React.ReactElement;
}) => {
  const { currentWallet } = useAppSelector(walletsSelector);
  const [accessToken, setAccessToken] = useState("");
  const [loading, setLoading] = useState<boolean>(false);
  const { account, chainId } = useWallet();
  const { sign } = useSign();

  // handle initial access token when loading.
  useEffect(() => {
    const accessTokenData = JSON.parse(
      // @ts-ignore
      window.localStorage.getItem("ACCESS_TOKEN") || null
    );

    if (!accessTokenData || (account && accessTokenData?.account !== account)) {
      window.localStorage.removeItem("ACCESS_TOKEN");
      setAccessToken("");
    }

    if (account && accessTokenData?.account === account) {
      setAccessToken(accessTokenData?.accessToken);
    }
  }, [account]);

  const handleLogin = useCallback(async () => {
    if (!account) return;
    setLoading(true);

    const timestamp = Math.floor(Date.now() / 1000);
    const message = `${account}_${timestamp}`;

    const signature = await sign(message, account, "");

    if (!signature) {
      setLoading(false);
      return;
    }

    const accessToken = await login(
      KRYSTAL_API[chainId as ChainId],
      account,
      timestamp,
      signature
    );

    if (accessToken) {
      setAccessToken(accessToken);
      window.localStorage.setItem(
        "ACCESS_TOKEN",
        JSON.stringify({ accessToken, account })
      );
    }

    setLoading(false);
  }, [account, chainId, sign]);

  const logout = useCallback(() => {
    window.localStorage.removeItem("ACCESS_TOKEN");
    setAccessToken("");
  }, []);

  const prevWallet = useRef(currentWallet);

  useEffect(() => {
    if (prevWallet.current && prevWallet.current !== currentWallet) {
      logout();
    }
    prevWallet.current = currentWallet;
  }, [currentWallet, logout]);

  return (
    <AuthContext.Provider
      value={{
        accessToken,
        login: handleLogin,
        logout,
        loading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default function useAuth() {
  return useContext(AuthContext);
}
