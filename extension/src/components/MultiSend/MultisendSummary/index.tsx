import { Box, Divider, Text } from "@chakra-ui/react";
import { isEmpty } from "lodash";
import { Token } from "src/config/types";
import { TokenMultiSendItem } from "./TokenMultiSendItem";

export const MultiSendSummary = ({
  submitButton,
  tokenSummary,
  setTokenApproved,
}: {
  tokenSummary: any[];
  setTokenApproved: ({
    address,
    isApproved,
  }: {
    address: string;
    isApproved: boolean;
  }) => void;
  submitButton: React.ReactElement;
}) => {
  return (
    <Box pt="2">
      <Text pl="6" pb="2">
        Summary
      </Text>
      <Divider />
      <Box
        py="4"
        maxHeight="calc( 100vh - 382px )"
        minHeight="100px"
        overflowY="auto"
      >
        {isEmpty(tokenSummary) && (
          <Text textAlign="center" color="whiteAlpha.500" fontStyle="italic">
            Empty
          </Text>
        )}

        {tokenSummary.map(
          ({ token, amount }: { token: Token; amount: number }, index) => (
            <TokenMultiSendItem
              key={token.address}
              token={token}
              amount={amount}
              checkApprove={(isApproved) => {
                setTokenApproved({ address: token.address, isApproved });
              }}
              borderColor={
                index === tokenSummary.length - 1
                  ? "transparent"
                  : "whiteAlpha.100"
              }
            />
          )
        )}
      </Box>
      <Divider />
      <Box p="6" pb="0">
        {submitButton}
      </Box>
    </Box>
  );
};
