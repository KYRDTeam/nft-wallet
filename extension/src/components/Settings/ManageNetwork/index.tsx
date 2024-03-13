import {
  Box,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  useDisclosure,
  Input,
  InputGroup,
  InputRightElement,
} from "@chakra-ui/react";

import { ChevronLeftIcon, SearchIcon } from "@chakra-ui/icons";
import { useMemo, useState } from "react";
import { NODE } from "src/config/constants/chain";
import { ChainId, ChainNodeDetailType } from "src/config/types";
import NetworkDetail from "./NetworkDetail";

export const ManageNetwork = ({ render }: { render: (onOpen: () => void) => JSX.Element }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [keyword, setKeyword] = useState("");
  const [networkSelected, setNetworkSelected] = useState<ChainNodeDetailType | null>(null);

  const dataInit: ChainNodeDetailType[] = useMemo(() => {
    return Object.keys(NODE).map((idChain) => {
      const id: ChainId = Number(idChain);
      return {
        id: idChain,
        ...NODE[id],
      };
    });
  }, []);

  const filteredNetwork = useMemo(() => {
    return dataInit.filter((e: any) =>
      keyword !== ""
        ? e.name.toLowerCase().indexOf(keyword.toLowerCase()) !== -1 ||
          e.currencySymbol.toLowerCase().indexOf(keyword.toLowerCase()) !== -1
        : true,
    );
  }, [keyword, dataInit]);

  return (
    <>
      {render(onOpen)}
      <Modal isOpen={isOpen} onClose={onClose} isCentered size="full">
        <ModalOverlay backdropFilter="blur(3px) !important;" />
        <ModalContent w="400px" maxWidth="100%">
          <ModalHeader textAlign="center" mt={6} position="relative">
            {!!networkSelected && (
              <ChevronLeftIcon
                position="absolute"
                left="20px"
                top="25%"
                boxSize={8}
                _hover={{ cursor: "pointer" }}
                onClick={() => setNetworkSelected(null)}
              />
            )}
            {!networkSelected ? "Manage Network" : "Detail Network"}
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody p="0">
            {!networkSelected && (
              <Box px="6">
                <InputGroup mb="4">
                  <Input
                    placeholder="Search Name or Symbol"
                    bg="gray.800"
                    size="lg"
                    fontSize="lg"
                    onChange={(event: any) => {
                      setTimeout(() => {
                        setKeyword(event.target.value);
                      });
                    }}
                    _focus={{ bg: "gray.800" }}
                  />
                  <InputRightElement children={<SearchIcon color="whiteAlpha.900" boxSize="5" mt="2" />} />
                </InputGroup>
              </Box>
            )}

            <Box maxH={"calc(100vh - 200px)"} overflow="scroll">
              {!networkSelected &&
                filteredNetwork.map((e: any) => {
                  return (
                    <Box
                      p="4"
                      _hover={{ bg: "gray.800" }}
                      cursor="pointer"
                      borderColor="transparent"
                      borderBottomWidth="1px"
                      borderBottomColor="whiteAlpha.100"
                      key={e.id}
                      onClick={() => setNetworkSelected(e)}
                    >
                      {e.name}
                    </Box>
                  );
                })}
            </Box>
            {!!networkSelected && <NetworkDetail data={networkSelected} />}
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
};
