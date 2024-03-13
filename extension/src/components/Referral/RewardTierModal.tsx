import {
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  Table,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
} from "@chakra-ui/react";
import { get, isEmpty } from "lodash";
import { useEffect, useState } from "react";
import { RewardTier } from "src/config/types";
import { formatNumber } from "src/utils/helper";
import { fetchRewardTier } from "src/utils/krystalService";

export default function RewardTierModal({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  const [rewardTiers, setRewardTiers] = useState<RewardTier[]>([]);

  useEffect(() => {
    async function getRewardTier() {
      const data = await fetchRewardTier();
      if (get(data, "tiers")) {
        setRewardTiers(get(data, "tiers"));
      }
    }

    if (isEmpty(rewardTiers) && isOpen) {
      getRewardTier();
    }
  }, [isOpen, rewardTiers]);

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="lg" isCentered>
      <ModalOverlay backdropFilter="blur(3px) !important;" />
      <ModalContent borderRadius="16">
        <ModalHeader textAlign="center">Level Details</ModalHeader>
        <ModalCloseButton
          bg="transparent"
          border="0"
          variant="link"
          fontSize="md"
          cursor="pointer"
          color="white.200"
        />
        <ModalBody pb="6">
          <Table>
            <Thead>
              <Tr>
                <Th
                  bg="gray.800"
                  color="whiteAlpha.500"
                  borderTopLeftRadius="16"
                  borderBottomLeftRadius="16"
                  border="0"
                  py="4"
                >
                  Level
                </Th>
                <Th
                  bg="gray.800"
                  color="whiteAlpha.500"
                  border="0"
                  textAlign="center"
                >
                  Trading Volume (USD)
                </Th>
                <Th
                  bg="gray.800"
                  color="whiteAlpha.500"
                  border="0"
                  textAlign="center"
                  borderTopRightRadius="16"
                  borderBottomRightRadius="16"
                >
                  Reward (BUSD)
                </Th>
              </Tr>
            </Thead>
            <Tbody fontSize="md">
              {/* {loading && <Loading />} */}
              {rewardTiers.map((rewardLevel) => (
                <Tr key={rewardLevel.level}>
                  <Td border="0" py="3">
                    {rewardLevel.level}
                  </Td>
                  <Td border="0" py="3" textAlign="right">
                    ${formatNumber(rewardLevel.volume)}
                  </Td>
                  <Td border="0" py="3" textAlign="right">
                    {rewardLevel.reward}
                  </Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
}
