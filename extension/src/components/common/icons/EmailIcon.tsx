import { Icon } from "@chakra-ui/react";

export default function EmailIcon({ ...props }) {
  return (
    <Icon
      width="7"
      height="7"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M19 18.9806H5C3.895 18.9806 3 18.0856 3 16.9806V7.01855C3 5.91355 3.895 5.01855 5 5.01855H19C20.105 5.01855 21 5.91355 21 7.01855V16.9816C21 18.0856 20.105 18.9806 19 18.9806V18.9806Z"
        stroke="current"
        strokeOpacity="0.95"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M17 9L12 12L7 9"
        stroke="current"
        strokeOpacity="0.95"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Icon>
  );
}
