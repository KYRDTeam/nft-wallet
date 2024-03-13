import { Box, Flex } from "@chakra-ui/react";
import { transparentize } from "@chakra-ui/theme-tools";
import { useAppSelector } from "src/hooks/useStore";
import { globalSelector } from "src/store/global";
import { get } from "lodash";

export default function AlertBanner() {
  const { appSettings } = useAppSelector(globalSelector);

  const topBanner = get(appSettings, "APP_HEADER_BAR.content");
  if (!topBanner) return <Box />;

  return (
    <Flex
      w="full"
      minH="50px"
      className="alert-banner"
      bg={transparentize("primary.300", 0.3) as any}
      justifyContent="center"
      alignItems="center"
      wordBreak="break-word"
      px={{ base: 4, md: 8 }}
    >
      <Box dangerouslySetInnerHTML={{ __html: topBanner }} />
    </Flex>
  );
}
