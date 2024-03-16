import { Box, Text, Container, SimpleGrid, Button, Flex, Link, useMediaQuery } from "@chakra-ui/react";
import React from "react";
import { NavLink } from "react-router-dom";
import { AddCustomTokenModal } from "../common/AddCustomTokenModal";
import {
  PadAndHammerIcon,
  PadAndPencilIcon,
  StackIcon,
  DefaultTokenIcon,
  EmailIcon,
  HelpIcon,
} from "../common/icons";
import { ManageTokensModal } from "./ManageTokensModal";
import { Link as ReactLink } from "react-router-dom";
import { ReactComponent as TrustedAppsIcon } from "src/assets/images/icons/trusted-apps.svg";
import ExportSecret from "../Header/ExportSecret";
// import { ReactComponent as WorldSvg } from "src/assets/images/icons/social_network/world-icon.svg";
import { ReactComponent as Contact } from "src/assets/images/icons/contact_setting.svg";
import { ManageContact } from "./ManageContact";
import HeaderPage from "../HeaderPage";

const Block = ({ title, children }: { title?: string; children: React.ReactElement }) => {
  return (
    <Box bg="gray.700" borderRadius="16" px="6" py={2} mb="4">
      <Text color="whiteAlpha.500" fontWeight="bold" mb="2">
        {title}
      </Text>
      <Flex direction="column" alignItems="flex-start">
        {children}
      </Flex>
    </Box>
  );
};

const ButtonLink = ({
  icon,
  children,
  ...props
}: {
  icon: React.ReactElement;
  children: React.ReactNode;
  [restProp: string]: any;
}) => {
  return (
    <Button
      leftIcon={<Box w="6">{icon}</Box>}
      colorScheme="white"
      as={NavLink}
      variant="link"
      my="2"
      to="#"
      fontSize="md"
      outline="0"
      _hover={{
        color: "primary.200",
        svg: { stroke: "primary.200" },
        outline: "0",
        path: { stroke: "primary.200" },
      }}
      _focus={{
        outline: "0",
      }}
      {...props}
    >
      {children}
    </Button>
  );
};

const Settings = () => {
  const [isMobile] = useMediaQuery("(max-width: 720px)");

  return (
    <Container mb="8" maxW="3xl">
      <HeaderPage title="Settings" props={{ mb: "5" }} />
      <SimpleGrid columns={isMobile ? 1 : 2} columnGap={4}>
        <Box>
          <Block>
            <>
              {/* <ListWalletsModal
                  render={(onOpen) => (
                    <ButtonLink onClick={onOpen} icon={<WalletIcon stroke="whiteAlpha.900" />} as={Link}>
                      Manage Wallets
                    </ButtonLink>
                  )}
                /> */}
              <ManageContact
                render={(onOpen) => (
                  <ButtonLink icon={<Contact stroke="#fff" />} onClick={onOpen}>
                    Contacts
                  </ButtonLink>
                )}
              />
            </>
          </Block>
          {/* <Block title="NETWORK">
              <ManageNetwork
                render={(onOpen) => (
                  <ButtonLink icon={<WorldSvg stroke="#fff" />} onClick={onOpen}>
                    Manage Network
                  </ButtonLink>
                )}
              />
            </Block> */}
          <Block>
            <>
              <AddCustomTokenModal
                BtnWrapper={({ onClick }: { onClick: () => void }) => (
                  <ButtonLink icon={<DefaultTokenIcon stroke="whiteAlpha.900" />} onClick={onClick}>
                    Add Custom Tokens
                  </ButtonLink>
                )}
              />

              {/* Manage Tokens */}
              <ManageTokensModal
                render={(onOpen) => (
                  <ButtonLink icon={<StackIcon stroke="whiteAlpha.900" />} onClick={onOpen}>
                    Manage Tokens
                  </ButtonLink>
                )}
              />
            </>
          </Block>
          <Block>
            <ButtonLink icon={<TrustedAppsIcon />}>
              <Link as={ReactLink} to="/trusted-apps" _hover={{ textDecoration: "none" }}>
                Trusted Apps
              </Link>
            </ButtonLink>
          </Block>
          <Block>
            <>
              <ButtonLink
                icon={<HelpIcon stroke="whiteAlpha.900" />}
                target="_blank"
                as={Link}
                href="https://docs.krystal.app/"
              >
                Help Center
              </ButtonLink>
              <ButtonLink icon={<EmailIcon stroke="whiteAlpha.900" />} href="mailto:support@krystal.app" as={Link}>
                Email
              </ButtonLink>
            </>
          </Block>
        </Box>
        <Box>
          <Block>
            <>
              <ButtonLink
                icon={<PadAndPencilIcon stroke="whiteAlpha.900" />}
                as={Link}
                target="_blank"
                href="https://files.krystal.app/terms.pdf"
              >
                Terms of Use
              </ButtonLink>
              <ButtonLink
                icon={<PadAndHammerIcon stroke="whiteAlpha.900" />}
                as={Link}
                target="_blank"
                href="https://files.krystal.app/privacy.pdf"
              >
                Privacy Policy
              </ButtonLink>
            </>
          </Block>
        </Box>
      </SimpleGrid>
      <Box pr={2}>
        <ExportSecret
          render={(onOpen) => (
            <Button
              bgColor="#F45532"
              w="100%"
              borderRadius="16px"
              mb={2}
              _hover={{ bgColor: "red.700" }}
              onClick={onOpen}
            >
              Reveal Secret Recovery Phrase
            </Button>
          )}
          type="SRP"
        />
      </Box>
    </Container>
  );
};

export default Settings;
