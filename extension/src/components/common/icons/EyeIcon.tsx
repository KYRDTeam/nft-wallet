import { Icon } from "@chakra-ui/react";
import React from "react";

const EyeIcon = ({ ...props }) => {
  return (
    <Icon
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M3.118 12.467C2.961 12.176 2.961 11.823 3.118 11.532C5.01 8.033 8.505 5 12 5C15.495 5 18.99 8.033 20.882 11.533C21.039 11.824 21.039 12.177 20.882 12.468C18.99 15.967 15.495 19 12 19C8.505 19 5.01 15.967 3.118 12.467Z"
        stroke="white"
        strokeOpacity="0.95"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M14.1213 9.87868C15.2929 11.0502 15.2929 12.9497 14.1213 14.1213C12.9497 15.2929 11.0502 15.2929 9.87866 14.1213C8.70709 12.9497 8.70709 11.0502 9.87866 9.87868C11.0502 8.70711 12.9497 8.70711 14.1213 9.87868"
        stroke="white"
        strokeOpacity="0.95"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Icon>
  );
};

export default EyeIcon;
