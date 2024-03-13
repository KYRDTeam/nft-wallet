import { Image } from "@chakra-ui/image";
import { Box, Center, Text } from "@chakra-ui/layout";
import { NavLink } from "react-router-dom";

import Logo from "../assets/images/logos/krystal.svg";

const Notfound: React.FC = () => {
  return (
    <>
      <Center minH="100vh">
        <Center flexDirection="column">
          <Image src={Logo} w="200px" />

          <Text fontSize="50px" my="40px">
            404 Not Found!
          </Text>
          <Box>
            Back to{" "}
            <NavLink to="/">
              <Text
                textDecoration="underline"
                color="primary.300"
                display="inline"
              >
                Home page
              </Text>
            </NavLink>
          </Box>
        </Center>
      </Center>
    </>
  );
};

export default Notfound;
