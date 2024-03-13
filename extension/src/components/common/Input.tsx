import { Input, InputProps } from "@chakra-ui/input";
import { useCallback } from "react";

export default function InputCustom(props: InputProps) {
  const validateKeyChangeWithNumber = useCallback((event) => {
    if (event.target.type === "number" && isNaN(Number(event.target.value))) {
      event.preventDefault();
    }
  }, []);
  return (
    <div>
      <Input
        autoComplete="off"
        bg="gray.900"
        borderColor="transparent"
        borderRadius="xl"
        borderWidth="1px"
        height="36px"
        fontSize="lg"
        onKeyPress={validateKeyChangeWithNumber}
        pl={4}
        {...props}
      />
    </div>
  );
}
