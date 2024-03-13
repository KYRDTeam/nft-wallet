import { useDisclosure } from "@chakra-ui/hooks";
import { Link } from "@chakra-ui/layout";
import {
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalOverlay,
} from "@chakra-ui/modal";
import moment from "moment";
import { useEffect } from "react";
import CampaignJpg from "../../assets/images/campaign/giveaway.jpg";
import isArray from "lodash/isArray";

const AvailableTime = {
  from: new Date("2021-10-28T21:00:00.000+08:00"),
  to: new Date("2021-10-31T23:59:59.000+08:00"),
};

export default function CampaignModal() {
  const { isOpen, onOpen, onClose } = useDisclosure();

  useEffect(() => {
    if (
      moment().isSameOrAfter(AvailableTime.from) &&
      moment().isSameOrBefore(AvailableTime.to)
    ) {
      const openSchedule = JSON.parse(
        window.localStorage.getItem("CAMPAIGN_SCHEDULES") || "[]"
      );

      if (!openSchedule || openSchedule.length === 0) {
        onOpen();
        window.localStorage.setItem(
          "CAMPAIGN_SCHEDULES",
          JSON.stringify([new Date()])
        );
        return;
      }

      // only show 2 times
      if (isArray(openSchedule) && openSchedule.length === 2) return;

      // show second opened after 1 day
      if (moment(openSchedule[0]).isValid()) {
        const fireEventContinueAt = moment(openSchedule[0]).add(1, "d");

        if (
          moment(fireEventContinueAt).isSameOrAfter(AvailableTime.from) &&
          moment(fireEventContinueAt).isSameOrBefore(AvailableTime.to) &&
          moment(fireEventContinueAt).isSameOrBefore(new Date())
        ) {
          onOpen();
          window.localStorage.setItem(
            "CAMPAIGN_SCHEDULES",
            JSON.stringify([openSchedule[0], new Date()])
          );
          return;
        }
      }
    }
  }, [onOpen]);

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      isCentered
      size={window.innerWidth < 500 ? "md" : "4xl"}
    >
      <ModalOverlay backdropFilter="blur(5px)" />
      <ModalContent
        borderRadius="12px"
        height={
          window.innerWidth < 500 ? `${window.innerWidth / 1.7}px` : "500px"
        }
        backgroundColor="transparent"
      >
        <ModalCloseButton />
        <ModalBody
          onClick={() => {
            onClose();
          }}
          as={Link}
          target="_blank"
          href="https://gleam.io/PbhzR/krystalgo-massive-launch-giveaway"
          backgroundImage={`url('${CampaignJpg}')`}
          backgroundSize={window.innerWidth > 500 ? "cover" : "contain"}
          backgroundRepeat="no-repeat"
        />
      </ModalContent>
    </Modal>
  );
}
