import { Icon } from "@chakra-ui/react";

const DefaultTokenIcon = ({ ...props }) => {
  return (
    <Icon
      width="22"
      height="22"
      viewBox="0 0 22 22"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path
        d="M8.70833 20.1667C5.41842 20.1667 2.75 17.4992 2.75 14.2083C2.75 10.9175 5.41842 8.25 8.70833 8.25C11.9992 8.25 14.6667 10.9175 14.6667 14.2083C14.6667 17.4992 11.9992 20.1667 8.70833 20.1667"
        stroke="current"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M8.70833 12.2217V16.1945"
        stroke="current"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M6.72192 14.2083H10.6948"
        stroke="current"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M7.46533 8.38184C8.03733 5.68867 10.428 3.6665 13.2917 3.6665C16.5825 3.6665 19.25 6.334 19.25 9.62484C19.25 12.4894 17.2288 14.8792 14.5347 15.4512"
        stroke="current"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Icon>
  );
};

export default DefaultTokenIcon;
