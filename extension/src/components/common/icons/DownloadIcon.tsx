import { Icon } from "@chakra-ui/react";

const DownloadIcon = ({ ...props }) => {
  return (
    <Icon
      width="20"
      height="20"
      viewBox="0 0 20 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path
        d="M4.99659 6.18213H4.54545C3.5409 6.18213 2.72726 6.99577 2.72726 8.00031V14.3639C2.72726 15.3685 3.5409 16.1821 4.54545 16.1821H15.4545C16.4591 16.1821 17.2727 15.3685 17.2727 14.3639V8.00031C17.2727 6.99577 16.4591 6.18213 15.4545 6.18213H15.0205"
        stroke="current"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M9.99999 1.81836V11.8184"
        stroke="current"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M7.27362 10.0003L9.99998 12.7275L12.7273 10.0003"
        stroke="current"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Icon>
  );
};

export default DownloadIcon;
