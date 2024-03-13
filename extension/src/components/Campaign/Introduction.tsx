import { Image } from "@chakra-ui/image";
import { Box } from "@chakra-ui/layout";
import { KRYSTAL_ADMIN_URL } from "../../config/constants/constants";
import CampaignHeading from "./CampaignHeading";

export default function Introduction({ data }: { data: any }) {
  return (
    <Box
      width="full"
      backgroundColor="gray.700"
      borderRadius="16"
      p={{ base: 4, md: 8 }}
      textAlign="left"
    >
      <CampaignHeading title="About Company" />
      <Image
        src={KRYSTAL_ADMIN_URL + data.company_image}
        alt=""
        style={{ maxWidth: "100%" }}
      />
      <Box mb="8" dangerouslySetInnerHTML={{ __html: data.about_company }} />
      <CampaignHeading title="About Token" />
      <Box mb="8" dangerouslySetInnerHTML={{ __html: data.about_token }} />
      {!!data.more_information && <CampaignHeading title="More Information" />}
      {!!data.more_information && (
        <Box
          mb="8"
          dangerouslySetInnerHTML={{ __html: data.more_information }}
        />
      )}
    </Box>
  );
}
