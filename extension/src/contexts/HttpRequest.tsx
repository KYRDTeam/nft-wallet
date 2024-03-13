import { get } from "lodash";
import { KRYSTAL_API } from "src/config/constants/constants";
import { ChainId } from "src/config/types";
import useAuth from "src/hooks/useAuth";
import { useAppSelector } from "src/hooks/useStore";
// import { useWallet } from "src/hooks/useWallet";
import { globalSelector } from "src/store/global";
import { CachePolicies, IncomingOptions, Provider } from "use-http";

export default function HttpRequest({
  children,
}: {
  children: React.ReactElement;
}) {
  // const { chainId } = useWallet();
  const { chainId } = useAppSelector(globalSelector);

  const { logout } = useAuth();

  const options: IncomingOptions = {
    interceptors: {
      request: async ({
        options,
        url,
        path,
        route,
      }: {
        options: any;
        url?: string | undefined;
        path?: string | undefined;
        route?: string | undefined;
      }) => {
        const accessTokenData = JSON.parse(
          // @ts-ignore
          window.localStorage.getItem("ACCESS_TOKEN") || null
        );

        const accessToken = get(accessTokenData, "accessToken");

        if (accessToken) {
          options.headers.Authorization = `Bearer ${accessToken}`;
        }

        return options;
      },
      response: async ({ response }: { response: any }) => {
        const res = response;
        if (res?.status === 401) {
          setTimeout(() => {
            logout();
          });
        }
        return res;
      },
    },
    cachePolicy: CachePolicies.NO_CACHE,
  };

  return (
    <Provider url={KRYSTAL_API[chainId as ChainId]} options={options}>
      {children}
    </Provider>
  );
}
