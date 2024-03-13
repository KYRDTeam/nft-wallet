import { Icon } from "@chakra-ui/react";

export default function PadAndHammer({ ...props }) {
  return (
    <Icon
      width="5"
      height="7"
      viewBox="0 0 17 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path
        d="M15 10V5.828C15 5.298 14.789 4.789 14.414 4.414L11.586 1.586C11.211 1.211 10.702 1 10.172 1H3C1.895 1 1 1.895 1 3V17C1 18.105 1.895 19 3 19H8"
        stroke="current"
        strokeOpacity="0.95"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M4 7H12"
        stroke="current"
        strokeOpacity="0.95"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M4 10H12"
        stroke="current"
        strokeOpacity="0.95"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M4 13H6"
        stroke="current"
        strokeOpacity="0.95"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M13.5 19.0005C13.5 19.0005 16 17.8005 16 16.0005V13.9005L14.177 13.2445C13.739 13.0865 13.26 13.0865 12.822 13.2445L11 13.9005V16.0005C11 17.8005 13.5 19.0005 13.5 19.0005Z"
        stroke="current"
        strokeOpacity="0.95"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Icon>
  );
}
