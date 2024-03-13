import { Button } from "@chakra-ui/button";
import { useConst } from "@chakra-ui/hooks";
import { Box, Center, Flex, Heading, SimpleGrid } from "@chakra-ui/layout";
import { ReactComponent as Earn1SVG } from "../../assets/images/icons/earn-1.svg";
import { ReactComponent as Earn2SVG } from "../../assets/images/icons/earn-2.svg";
import { ReactComponent as Earn3SVG } from "../../assets/images/icons/earn-3.svg";
import { ReactComponent as Earn4SVG } from "../../assets/images/icons/earn-4.svg";
import { useAppDispatch, useAppSelector } from "../../hooks/useStore";
import { globalSelector, setPreviewEarnPage } from "../../store/global";
import EarnList from "./EarnList";

const Earn = () => {
  const dispatch = useAppDispatch();

  const { isShowPreviewEarnPage } = useAppSelector(globalSelector);
  const listPreview = useConst([
    {
      text: "Supply tokens to earn interest (APY). Withdraw anytime.",
      icon: Earn1SVG,
    },
    {
      text: "Earn bonus rewards with auto-farming of governance tokens on top of interest from supplying.",
      icon: Earn2SVG,
    },
    {
      text: "Don’t worry if you don’t have the required token. Easily swap from any token to the required token before supplying.",
      icon: Earn3SVG,
    },
    {
      text: "Swap and supply in a single transaction to save on gas fees.",
      icon: Earn4SVG,
    },
  ]);

  return (
    <Flex py="10" px="5" justify="center">
      <Box maxW="100%">
        {isShowPreviewEarnPage ? (
          <>
            <Heading as="h2" size="lg" mb="10" textAlign="center">
              Earn interest on stable coins
            </Heading>

            <Center>
              <SimpleGrid
                columns={{ base: 1, md: 2, lg: 3, xl: 4 }}
                spacing={5}
              >
                {listPreview.map((item) => (
                  <Center
                    w="250px"
                    h="356px"
                    bg="gray.700"
                    borderRadius="xl"
                    p="8"
                    flexDir="column"
                    key={item.text}
                  >
                    <Box textAlign="center" opacity="0.75">
                      {item.text}
                    </Box>
                    <Box as={item.icon} mt="auto" />
                  </Center>
                ))}
              </SimpleGrid>
            </Center>
            <Center mt="10">
              <Button
                colorScheme="primary"
                w="300px"
                maxW="100%"
                onClick={() => dispatch(setPreviewEarnPage(false))}
              >
                Explore
              </Button>
            </Center>
          </>
        ) : (
          <EarnList />
        )}
      </Box>
    </Flex>
  );
};

export default Earn;
