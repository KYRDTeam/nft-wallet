import { ReactComponent as TwitterSvg } from "src/assets/images/icons/social_network/twitter-new-design.svg";
import { ReactComponent as WorldSvg } from "src/assets/images/icons/social_network/world-icon.svg";
import { ReactComponent as EtherscanSvg } from "src/assets/images/icons/social_network/etherscan-icon.svg";
import { ReactComponent as TelegramSvg } from "src/assets/images/icons/social_network/telegram-new-design.svg";
import { ReactComponent as DiscordSvg } from "src/assets/images/icons/social_network/discord-icon.svg";
import { useAppSelector } from "src/hooks/useStore";
import { globalSelector } from "src/store/global";
import { TokenLinkType } from "src/config/types";
import { Center } from "@chakra-ui/layout";
import { NODE } from "src/config/constants/chain";

type SocialLinkProps = {
  tokenAddr?: string;
  links?: TokenLinkType;
};

export default function SocialLink({ tokenAddr, links }: SocialLinkProps) {
  const { chainId } = useAppSelector(globalSelector);

  return (
    <Center gridGap={3} mt="5">
      {tokenAddr && (
        <a
          href={`${NODE[chainId].scanUrl}/address/${tokenAddr}`}
          target="_blank"
          rel="noreferrer noopener"
          className="btn__link"
        >
          <EtherscanSvg stroke="#fff" />
        </a>
      )}
      {!!links?.homepage && (
        <a
          href={links.homepage}
          target="_blank"
          rel="noreferrer noopener"
          className="btn__link"
        >
          <WorldSvg stroke="#fff" />
        </a>
      )}
      {!!links?.twitterScreenName && (
        <a
          href={links.twitterScreenName}
          target="_blank"
          rel="noreferrer noopener"
          className="btn__link"
        >
          <TwitterSvg stroke="#fff" />
        </a>
      )}
      {!!links?.telegram && (
        <a
          href={links.telegram}
          target="_blank"
          rel="noreferrer noopener"
          className="btn__link"
        >
          <TelegramSvg stroke="#fff" />
        </a>
      )}
      {!!links?.discord && (
        <a
          href={links.discord}
          target="_blank"
          rel="noreferrer noopener"
          className="btn__link"
        >
          <DiscordSvg stroke="#fff" />
        </a>
      )}
    </Center>
  );
}
