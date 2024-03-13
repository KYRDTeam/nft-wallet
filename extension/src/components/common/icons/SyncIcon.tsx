import { Box, Icon, keyframes } from "@chakra-ui/react";

const spin = keyframes`
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
`;

const SyncIcon = ({
  isLoading,
  ...props
}: {
  isLoading?: boolean;
  [restProp: string]: any;
}) => {
  const animation = isLoading ? spin : undefined;

  return (
    <Box animation={`${animation} 4s linear infinite`}>
      <Icon
        width="22"
        height="22"
        viewBox="0 0 22 22"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        {...props}
      >
        <path
          d="M18.326 11.0293C18.3187 12.8965 17.6101 14.761 16.1856 16.1855C13.3219 19.0492 8.67809 19.0492 5.81442 16.1855C5.30476 15.6759 4.89042 15.1085 4.56226 14.5071"
          stroke="#E8EDEC"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M3.67033 10.8807C3.69967 9.04367 4.41283 7.21584 5.81442 5.81425C8.67808 2.95059 13.3219 2.95059 16.1856 5.81425C16.6953 6.32392 17.1096 6.89134 17.4378 7.49267"
          stroke="#E8EDEC"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M14.6236 7.49377H17.864V4.25244"
          stroke="#E8EDEC"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M7.37642 14.5059H4.136V17.7472"
          stroke="#E8EDEC"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </Icon>
    </Box>
  );
};

export default SyncIcon;
