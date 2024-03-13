import { Text } from "@chakra-ui/layout";

export default function CampaignHeading({ title }: { title: string }) {
  return (
    <Text
      fontSize="lg"
      display="flex"
      alignItems="center"
      mb="4"
      _after={{
        content: `""`,
        display: "block",
        flex: 1,
        height: "1px",
        marginLeft: 2,
        marginTop: 2,
        background: "gray.600",
      }}
    >
      {title}
    </Text>
  );
}
