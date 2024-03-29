import { Container, Flex, Link, Text } from "@chakra-ui/layout";
import { useHistory } from "react-router";
import { ArrowBackIcon } from "./icons";

const Navigator = () => {
  const history = useHistory();
  return (
    <Container maxW="container.lg">
      <Flex height="20" alignItems="center">
        <Link
          display="flex"
          alignItems="center"
          onClick={() => {
            history.goBack();
          }}
        >
          <ArrowBackIcon />
          <Text marginLeft="4" color="gray.100">
            Go back
          </Text>
        </Link>
      </Flex>
    </Container>
  );
};
export default Navigator;
