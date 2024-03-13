import React from "react";

import { Box } from "@chakra-ui/layout";
import { useHistory } from "react-router-dom";
import ArrowBackIcon from "src/components/icons/ArrowBack";

const ButtonGoBack = ({ ...props }: any) => {
  const history = useHistory();

  return (
    <Box
      cursor="pointer"
      onClick={() => {
        history.push("/");
      }}
      _hover={{
        opacity: 0.7,
      }}
      {...props}
    >
      <ArrowBackIcon />
    </Box>
  );
};

export default ButtonGoBack;
