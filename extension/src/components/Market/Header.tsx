import { SearchIcon } from "@chakra-ui/icons";
import {
  Box,
  Button,
  Flex,
  Input,
  InputGroup,
  InputRightElement,
  Text,
} from "@chakra-ui/react";
import { NavLink } from "react-router-dom";
import {
  DefaultTokenIcon,
  DownloadIcon,
  TransferIcon,
} from "src/components/common/icons";
import { TooltipCommon } from "src/components/common/TooltipCommon";
import { AddCustomTokenModal } from "../common/AddCustomTokenModal";

import QrCodeModal from "../Summary/Portfolio/QrCodeModal";

export const Header = ({
  keyword,
  setKeyword,
}: {
  keyword: string;
  setKeyword: (keyword: string) => void;
}) => {
  return (
    <>
      <Flex
        alignItems={{ base: "flex-start", md: "center" }}
        justifyContent="space-between"
        direction={{ base: "column", md: "row" }}
      >
        <Text fontWeight="bold" fontSize="3xl">
          Market
        </Text>
        <Flex
          mt={{ base: 6, md: 0 }}
          w="full"
          maxW="400px"
          alignItems="center"
          justifyContent={{ base: "space-between", md: "flex-end" }}
        >
          <Box>
            <TooltipCommon label="Transfer Token">
              <Button
                w="9"
                height="9"
                p="0"
                mr="2"
                borderRadius="full"
                colorScheme="primary"
                as={NavLink}
                to="/transfer"
              >
                <TransferIcon stroke="#141927" boxSize="6" />
              </Button>
            </TooltipCommon>
            <QrCodeModal
              render={(onOpen) => (
                <TooltipCommon label="Receive Token">
                  <Button
                    w="9"
                    height="9"
                    p="0"
                    mr="2"
                    borderRadius="full"
                    colorScheme="primary"
                    onClick={onOpen}
                  >
                    <DownloadIcon stroke="#141927" boxSize="6" />
                  </Button>
                </TooltipCommon>
              )}
            />
            <AddCustomTokenModal
              BtnWrapper={({ onClick }: { onClick: () => void }) => (
                <TooltipCommon label="Add custom token">
                  <Button
                    w="9"
                    height="9"
                    p="0"
                    mr="2"
                    borderRadius="full"
                    colorScheme="primary"
                    onClick={onClick}
                  >
                    <DefaultTokenIcon stroke="#141927" boxSize="6" />
                  </Button>
                </TooltipCommon>
              )}
            />
          </Box>
          <InputGroup ml="3" flex="1">
            <Input
              bg="gray.700"
              placeholder="Search"
              value={keyword}
              onChange={(event) => {
                setKeyword(event.target.value);
              }}
            />
            <InputRightElement
              children={<SearchIcon color="whiteAlpha.900" />}
            />
          </InputGroup>
        </Flex>
      </Flex>
    </>
  );
};
