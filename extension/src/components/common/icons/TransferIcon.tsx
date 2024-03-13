import { Icon } from "@chakra-ui/react";

const TransferIcon = ({ ...props }) => {
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
        d="M8 8H4"
        stroke="current"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M8.11 15.9802L4 16.0002"
        stroke="current"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M8.11 12H2"
        stroke="current"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M13.116 12.7429L11.804 16.0239C11.455 16.8979 12.395 17.7269 13.218 17.2699L21.658 12.5809C22.113 12.3279 22.113 11.6739 21.658 11.4209L13.218 6.7319C12.395 6.2749 11.454 7.1039 11.804 7.9779L13.116 11.2589C13.307 11.7339 13.307 12.2659 13.116 12.7429Z"
        stroke="current"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Icon>
  );
};

export default TransferIcon;
