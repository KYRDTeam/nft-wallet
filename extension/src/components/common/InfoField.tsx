import { Box, Flex, Text } from "@chakra-ui/layout";
import { Tooltip } from "@chakra-ui/tooltip";
import { InfoIcon } from "@chakra-ui/icons";
import React from "react";

export default function InfoField({
  title,
  tooltip,
  content,
}: {
  title?: React.ReactElement | string;
  tooltip?: any;
  content: any;
}) {
  return (
    <Flex justify="space-between" my="2">
      <Flex align="center">
        {title && (
          <Text color="whiteAlpha.700" fontSize="sm" mr="1">
            {title}
          </Text>
        )}
        {tooltip && (
          <Tooltip
            label={tooltip}
            hasArrow
            placement="top"
            bg="gray.500"
            color="whiteAlpha.700"
          >
            <InfoIcon boxSize="3" ml="1" color="whiteAlpha.700" />
          </Tooltip>
        )}
      </Flex>
      <Box>{content}</Box>
    </Flex>
  );
}
