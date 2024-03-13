import { Box } from "@chakra-ui/layout";
import CampaignHeading from "./CampaignHeading";
// import { ReactComponent as FirstPrizeSvg } from "../../assets/images/icons/1-st.svg";
// import { ReactComponent as SecondPrizeSvg } from "../../assets/images/icons/2-nd.svg";
// import { ReactComponent as ThirdPrizeSvg } from "../../assets/images/icons/3-rd.svg";
// import { useMemo } from "react";
// import { Image, Text } from "@chakra-ui/react";
// import { Flex } from "@chakra-ui/layout";
// import { KRYSTAL_ADMIN_URL } from "../../config/constants/constants";

export default function Reward({ data }: { data: any }) {
  // const tierRewardBlock = useMemo(() => {
  //   if (data.type === "rebate") return null;

  //   return (
  //     <Flex
  //       width="full"
  //       maxW="lg"
  //       m="0 auto"
  //       bg="gray.600"
  //       py="8"
  //       borderRadius={16}
  //       mb="8"
  //     >
  //       <Flex
  //         px="8"
  //         flex="1"
  //         direction="column"
  //         justifyContent="center"
  //         alignItems="center"
  //         borderRight="1px solid #636466"
  //       >
  //         <Image
  //           boxSize="20"
  //           alt=""
  //           src={KRYSTAL_ADMIN_URL + data.token_logo}
  //         />
  //         <Text fontSize="lg" mt="2">
  //           12,345 {data.token_symbol}
  //         </Text>
  //       </Flex>
  //       <Flex
  //         px="8"
  //         flex="2"
  //         direction="column"
  //         justifyContent="center"
  //         alignItems="center"
  //       >
  //         <Flex alignItems="center" mb="3">
  //           <FirstPrizeSvg />
  //           <Text ml="4" fontSize="lg" fontWeight="bold" color="#F2BE37">
  //             {100} {data.token_symbol}
  //           </Text>
  //         </Flex>
  //         <Flex alignItems="center" mb="3">
  //           <SecondPrizeSvg />
  //           <Text ml="4" fontSize="lg">
  //             {100} {data.token_symbol}
  //           </Text>
  //         </Flex>
  //         <Flex alignItems="center">
  //           <ThirdPrizeSvg />
  //           <Text ml="4" fontSize="lg">
  //             {100} {data.token_symbol}
  //           </Text>
  //         </Flex>
  //       </Flex>
  //     </Flex>
  //   );
  // }, [data]);

  return (
    <Box
      width="full"
      backgroundColor="gray.700"
      borderRadius="16"
      p={{ base: 4, md: 8 }}
      textAlign="left"
    >
      <CampaignHeading title="Reward" />
      {/* {tierRewardBlock} */}
      <Box mb="8" dangerouslySetInnerHTML={{ __html: data.prize }} />
      <CampaignHeading title="Term & Conditions" />
      <Box
        mb="8"
        dangerouslySetInnerHTML={{ __html: data.term_and_condition }}
      />
      <CampaignHeading title="Rule" />
      <Box mb="8" dangerouslySetInnerHTML={{ __html: data.rule }} />
      <CampaignHeading title="Other Conditions" />
      <Box mb="8" dangerouslySetInnerHTML={{ __html: data.other_conditions }} />
    </Box>
  );
}
