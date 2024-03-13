import { Icon } from "@chakra-ui/react";
import { useMemo } from "react";

export default function SortIcon({
  sort = "default",
  ...props
}: {
  sort?: "default" | "asc" | "desc";
  [restProp: string]: any;
}) {
  const aboveArrowStroke = useMemo(() => {
    switch (sort) {
      case "desc": {
        return "#1DE9B6";
      }
      default: {
        return "#fff";
      }
    }
  }, [sort]);

  const belowArrowStroke = useMemo(() => {
    switch (sort) {
      case "asc": {
        return "#1DE9B6";
      }
      default: {
        return "#fff";
      }
    }
  }, [sort]);

  return (
    <Icon
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <g opacity="0.75">
        <path
          d="M5.33333 9.3335L7.99999 12.0002L10.6667 9.3335"
          stroke={aboveArrowStroke}
          strokeOpacity="0.95"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M5.33333 6.6665L7.99999 3.99984L10.6667 6.6665"
          stroke={belowArrowStroke}
          strokeOpacity="0.95"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </g>
    </Icon>
  );
}
