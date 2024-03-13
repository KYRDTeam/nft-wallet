import { TokenTagType } from "src/config/types";
import { ReactComponent as PromotionSvg } from "src/assets/images/icons/promotion.svg";
import { ReactComponent as ScamSvg } from "src/assets/images/icons/scam.svg";
import { ReactComponent as VerifiedSvg } from "src/assets/images/icons/verifiedIcon.svg";

export default function TokenTag({ type }: { type?: TokenTagType }) {
  switch (type) {
    case "PROMOTION":
      return <PromotionSvg title="Promotion Token" />;
    case "VERIFIED":
      return <VerifiedSvg title="Verified Token" />;
    case "SCAM":
      return <ScamSvg title="Scam Token" />;
    case "UNVERIFIED":
      return null;
    default:
      return null;
  }
}
