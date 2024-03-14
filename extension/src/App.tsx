import React, { Suspense, lazy, useMemo, useEffect, useRef } from "react";
import {
  Router,
  Route,
  Switch,
  useLocation,
  useHistory,
} from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import routerHistory from "./routerHistory";

import { AuthProvider } from "./hooks/useAuth";
import { BASE_CURRENCY } from "./config/constants/constants";
import { Box, Flex } from "@chakra-ui/layout";
import { get, isEmpty } from "lodash";
import { globalSelector, setCurrency } from "./store/global";
import { PreviewNFTModal } from "./components/PreviewNFTModal";
import { useAppSelector } from "./hooks/useStore";
import { useDispatch } from "react-redux";
import { useFetchGasPrices } from "./hooks/useKrystalServices";
import { useFetchEarnList } from "./hooks/useTokens";
import { useMarket } from "./hooks/useMarket";
import HttpRequest from "./contexts/HttpRequest";
import LoadingPage from "./components/LoadingPage";
import ScrollToTop from "./components/ScrollTop";
import useFetchAppSettings from "./hooks/useFetchAppSettings";
import useFetchCurrencyRate from "./hooks/useFetchCurrencyRate";
import { fetchNetWorth } from "./store/wallets";
import { useFetchTokens } from "./hooks/useFetchTokens";
import Header from "./components/Header";
import { useWallet } from "./hooks/useWallet";
import { usePersistAccount } from "./hooks/usePersistAccount";
import { listenMessage, sendMessage } from "./services/extension";
import { useSearchQuery } from "./hooks/useSearchQuery";
import { DAPP_REQUEST_METHODS } from "./config/constants/dappRequestMethods";
import { trustedAppsSelector } from "src/store/trustedApps";
import useGetPageInfo from "src/hooks/useGetPageInfo";

const Campaign = lazy(() => import("./components/Campaign"));
const Earn = lazy(() => import("./components/Earn"));
const Explore = lazy(() => import("./components/Explore"));
const History = lazy(() => import("./components/History"));
const Market = lazy(() => import("./components/Market"));
const MultiSend = lazy(() => import("./components/MultiSend"));
const Notification = lazy(() => import("./components/Notification"));
const Referral = lazy(() => import("./components/Referral"));
const Reward = lazy(() => import("./components/Reward"));
const Settings = lazy(() => import("./components/Settings"));
const Summary = lazy(() => import("./components/Summary"));
const Supply = lazy(() => import("./components/Earn/Supply"));
const Swap = lazy(() => import("./components/Swap"));
const Token = lazy(() => import("./components/TokenDetailRenew"));
const Transfer = lazy(() => import("./components/Transfer"));
const TrustedApps = lazy(() => import("./components/TrustedApps"));
const SwitchChain = lazy(() => import("./components/DappServices/SwitchChain"));
const ExecuteTransaction = lazy(
  () => import("./components/ExecuteTransaction")
);
const ConfirmConnection = lazy(
  () => import("./components/DappServices/ConfirmConnection")
);
const SignAndSendTx = lazy(() => import("./components/SignAndSendTx"));
const SignRequest = lazy(() => import("./components/SignRequest"));

const HIDDEN_ROUTE = [
  "/switch-chain",
  "/execute-transaction",
  "/confirm-connection",
  "/sign-send-tx",
  "/sign-request",
  "/token",
];

const App: React.FC = () => {
  const dispatch = useDispatch();
  const { account } = useWallet();
  const history = useHistory();
  const { queries } = useSearchQuery();
  const { pageInfo, loading } = useGetPageInfo();

  const currentRoute = history.location.pathname;
  const { trustedApps } = useAppSelector(trustedAppsSelector);
  usePersistAccount();
  useFetchCurrencyRate();
  useFetchEarnList();
  useFetchTokens();
  useFetchGasPrices();
  useMarket();
  useFetchAppSettings();

  const onLoadRef = useRef(true);

  // Fetch total balance for summary page
  // Only force fetching when first visit page (onload)
  useEffect(() => {
    if (!account) return;

    dispatch(fetchNetWorth({ address: account, isForceSync: false }));

    if (onLoadRef.current === true) {
      setTimeout(() => {
        dispatch(
          fetchNetWorth({
            address: account,
            isForceSync: true,
          })
        );
      }, 2000);
      onLoadRef.current = false;
    }
  }, [account, dispatch]);

  const location = useLocation();

  const background = useMemo(
    () => get(location, "state.background"),
    [location]
  );

  const { chainId, currency } = useAppSelector(globalSelector);

  useEffect(() => {
    if (!currency || !BASE_CURRENCY[chainId].includes(currency)) {
      dispatch(setCurrency("usd"));
    }
  }, [chainId, currency, dispatch]);

  useEffect(() => {
    listenMessage();
  }, []);

  useEffect(() => {
    sendMessage({ type: "set_chain_id", chainId });
  }, [chainId]);

  useEffect(() => {
    if (!account || isEmpty(queries) || loading || !pageInfo) {
      return;
    }
    if (
      [
        DAPP_REQUEST_METHODS.ETH_ACCOUNTS,
        DAPP_REQUEST_METHODS.ETH_REQUEST_ACCOUNTS,
      ].includes(queries.method)
    ) {
      // if (!trustedApps[account]?.find((app: any) => app.domain === pageInfo.domain)) {
      history.push("/confirm-connection");
      // }
    }
  }, [account, history, loading, pageInfo, queries, trustedApps]);

  useEffect(() => {
    if (isEmpty(queries)) {
      return;
    }

    if (queries.method === DAPP_REQUEST_METHODS.ETH_SEND_TRANSACTION) {
      history.push("/sign-send-tx");
    }
    if (queries.method === DAPP_REQUEST_METHODS.PERSONAL_SIGN) {
      history.push("/sign-request");
    }
    if (queries.method === DAPP_REQUEST_METHODS.WALLET_SWITCH_ETH_CHAIN) {
      history.push("/switch-chain");
    }
  }, [history, queries]);

  return (
    <>
      <ScrollToTop />
      {!HIDDEN_ROUTE.includes(currentRoute) && <Header />}
      <Flex>
        <Box flex="1" minW="0">
          <AuthProvider>
            <Suspense fallback={<LoadingPage />}>
              <HttpRequest>
                <>
                  <Switch location={background || location}>
                    <Route path="/" exact component={Summary} />
                    <Route path="/transfer" exact component={Transfer} />
                    <Route path="/multi-send" exact component={MultiSend} />
                    <Route path="/summary" exact component={Summary} />
                    <Route path="/r/:referralCode" exact component={Summary} />
                    <Route path="/swap" exact component={Swap} />
                    <Route path="/token" exact component={Token} />
                    <Route path="/earn" exact component={Earn} />
                    <Route path="/supply" exact component={Supply} />
                    <Route path="/explore" exact component={Explore} />
                    <Route path="/market" exact component={Market} />
                    <Route path="/history" exact component={History} />
                    <Route path="/campaign" exact component={Campaign} />
                    <Route path="/referral" exact component={Referral} />
                    <Route path="/rewards" exact component={Reward} />
                    <Route path="/settings" exact component={Settings} />
                    <Route
                      path="/notifications"
                      exact
                      component={Notification}
                    />
                    <Route path="/trusted-apps" exact component={TrustedApps} />
                    <Route
                      path="/sign-send-tx"
                      exact
                      component={SignAndSendTx}
                    />
                    <Route path="/sign-request" exact component={SignRequest} />
                    <Route path="/switch-chain" exact component={SwitchChain} />
                    <Route
                      path="/nft/:collectibleAddress/:tokenId"
                      component={PreviewNFTModal}
                    />
                    <Route path="/switch-chain" exact component={SwitchChain} />
                    <Route
                      path="/execute-transaction"
                      exact
                      component={ExecuteTransaction}
                    />
                    <Route
                      path="/confirm-connection"
                      exact
                      component={ConfirmConnection}
                    />
                    <Route component={Summary} />
                  </Switch>
                  {background && (
                    <Route
                      path="/nft/:collectibleAddress/:tokenId"
                      component={PreviewNFTModal}
                    />
                  )}
                </>
              </HttpRequest>
            </Suspense>
          </AuthProvider>
        </Box>
      </Flex>
      <ToastContainer theme="dark" />
    </>
  );
};

const WrappedAppWithBrowserRouter = () => {
  return (
    <Router history={routerHistory}>
      <App />
    </Router>
  );
};

export default WrappedAppWithBrowserRouter;
