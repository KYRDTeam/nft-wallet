import React, { useMemo } from "react";
import { ImageProps } from "@chakra-ui/image";
import { Image } from "@chakra-ui/image";

import BinancePNG from "../../assets/images/tokens/binance.png";
import AvalanchePNG from "../../assets/images/tokens/avalanche.png";
import EthereumPNG from "../../assets/images/tokens/ethereum.png";
import PolygonPNG from "../../assets/images/tokens/polygon.png";
import CronosSVG from "../../assets/images/tokens/cronos.svg";
import FantomSVG from "../../assets/images/tokens/fantom.svg";
import ArbitrumSVG from "../../assets/images/tokens/arbitrum.svg";
import { ChainId } from "../../config/types";

interface ChainIconPropType extends ImageProps {
  chainId: ChainId;
}

export default function ChainIcon({
  chainId = ChainId.MAINNET,
  ...props
}: ChainIconPropType) {
  const IconWrap = useMemo(() => {
    switch (+chainId) {
      case ChainId.AVALANCHE: {
        return AvalanchePNG;
      }
      case ChainId.BSC:
      case ChainId.BSC_TESTNET:
        return BinancePNG;
      case ChainId.MAINNET:
        return EthereumPNG;
      case ChainId.ROPSTEN:
        return EthereumPNG;
      case ChainId.POLYGON:
        return PolygonPNG;
      case ChainId.FANTOM:
        return FantomSVG;
      case ChainId.CRONOS:
        return CronosSVG;
      case ChainId.ARBITRUM:
        return ArbitrumSVG;
      default: {
        return EthereumPNG;
      }
    }
  }, [chainId]);

  return <Image src={IconWrap} {...props} />;
}
