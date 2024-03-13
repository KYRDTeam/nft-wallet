import { Icon } from "@chakra-ui/react";

const DefaultIconNotificationIcon = ({ ...props }) => {
  return (
    <Icon
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      {...props}
    >
      <g fill="none" fillRule="evenodd">
        <g>
          <g>
            <g>
              <g>
                <path
                  d="M0 0L24 0 24 24 0 24z"
                  transform="translate(-342 -117) translate(327 100) translate(15 17)"
                />
                <g
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="1.5"
                >
                  <path
                    stroke="#ffffffb3"
                    d="M6 0c3.315 0 6 2.685 6 6s-2.685 6-6 6-6-2.685-6-6 2.685-6 6-6"
                    transform="translate(-342 -117) translate(327 100) translate(15 17) translate(3 2)"
                  />
                  <path
                    stroke="#ffffffb3"
                    d="M15 12c1.657 0 3 1.342 3 3 0 1.657-1.343 3-3 3-1.658 0-3-1.343-3-3 0-1.658 1.342-3 3-3"
                    transform="translate(-342 -117) translate(327 100) translate(15 17) translate(3 2)"
                  />
                  <path
                    stroke="#ffffffb3"
                    d="M6 16c1.105 0 2 .895 2 2s-.895 2-2 2-2-.895-2-2 .895-2 2-2"
                    transform="translate(-342 -117) translate(327 100) translate(15 17) translate(3 2)"
                  />
                </g>
              </g>
            </g>
          </g>
        </g>
      </g>
    </Icon>
  );
};

export default DefaultIconNotificationIcon;
