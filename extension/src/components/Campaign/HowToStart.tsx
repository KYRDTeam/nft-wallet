import { Box } from "@chakra-ui/layout";
import CampaignHeading from "./CampaignHeading";

export default function HowToStart({ data }: { data: any }) {
  return (
    <Box
      width="full"
      backgroundColor="gray.700"
      borderRadius="16"
      p={{ base: 4, md: 8 }}
      textAlign="left"
    >
      <CampaignHeading title="How to Start" />
      <Box mb="8" dangerouslySetInnerHTML={{ __html: data.how_to_start }} />
      {!!data.video_url && (
        <>
          <CampaignHeading title="Video Guide" />
          <Box>
            <iframe
              width="560"
              height="315"
              src={data.video_url}
              title="YouTube video player"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            ></iframe>
          </Box>
        </>
      )}
    </Box>
  );
}
