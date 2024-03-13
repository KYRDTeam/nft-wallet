import { Flex, Text, useInterval } from "@chakra-ui/react";
import { isNaN } from "lodash";
import { useCallback, useState } from "react";

const DAY_TO_MS = 24 * 60 * 60 * 1000;
const HOUR_TO_MS = 1 * 60 * 60 * 1000;
const MINUTE_TO_MS = 60 * 1000;

const timeToString = (number: number) => {
  return `0${number}`.slice(-2);
};

export default function CampaignCountDown({ data }: { data: any }) {
  const [status, setStatus] = useState<string>("");
  const [time, setTime] = useState({
    days: NaN,
    hours: NaN,
    minutes: NaN,
    seconds: NaN,
  });

  const calculateTime = useCallback(() => {
    if (!data || !data.start_time || !data.end_time) return;
    const startTime = new Date(data.start_time).getTime();
    const endTime = new Date(data.end_time).getTime();
    const currentTime = new Date().getTime();

    let waitTime = -1;
    if (currentTime < startTime) {
      setStatus("Start in");
      waitTime = startTime - currentTime;
    } else if (currentTime < endTime) {
      setStatus("Ends in");
      waitTime = endTime - currentTime;
    } else if (currentTime > endTime) {
      setStatus("Ended");
      waitTime = endTime - currentTime;
    }

    if (waitTime < 0) {
      setTime({
        days: 0,
        hours: 0,
        minutes: 0,
        seconds: 0,
      });
      return;
    }

    const days = Math.floor(waitTime / DAY_TO_MS);

    const hours = Math.floor((waitTime - days * DAY_TO_MS) / HOUR_TO_MS);

    const minutes = Math.floor(
      (waitTime - days * DAY_TO_MS - hours * HOUR_TO_MS) / MINUTE_TO_MS
    );

    const seconds = Math.floor(
      (waitTime -
        days * DAY_TO_MS -
        hours * HOUR_TO_MS -
        minutes * MINUTE_TO_MS) /
        1000
    );

    setTime({
      days,
      hours,
      minutes,
      seconds,
    });
  }, [data]);

  useInterval(() => {
    calculateTime();
  }, 1000);

  return (
    <Flex
      direction="column"
      alignItems="center"
      justifyContent="center"
      width="full"
    >
      <Text>{status}</Text>
      <Flex>
        <Flex
          direction="column"
          m="2"
          justifyContent="center"
          alignItems="center"
        >
          <Text fontSize="3xl" fontWeight="bold">
            {isNaN(time?.days) ? "--" : timeToString(time.days)}
          </Text>
          <Text fontSize="sm" color="whiteAlpha.600">
            Days
          </Text>
        </Flex>
        <Flex
          direction="column"
          m="2"
          justifyContent="center"
          alignItems="center"
        >
          <Text fontSize="3xl" fontWeight="bold">
            {isNaN(time?.hours) ? "--" : timeToString(time.hours)}
          </Text>
          <Text fontSize="sm" color="whiteAlpha.600">
            Hours
          </Text>
        </Flex>
        <Flex
          direction="column"
          m="2"
          justifyContent="center"
          alignItems="center"
        >
          <Text fontSize="3xl" fontWeight="bold">
            {isNaN(time?.minutes) ? "--" : timeToString(time.minutes)}
          </Text>
          <Text fontSize="sm" color="whiteAlpha.600">
            Minutes
          </Text>
        </Flex>
        <Flex
          direction="column"
          m="2"
          justifyContent="center"
          alignItems="center"
        >
          <Text fontSize="3xl" fontWeight="bold">
            {isNaN(time?.seconds) ? "--" : timeToString(time.seconds)}
          </Text>
          <Text fontSize="sm" color="whiteAlpha.600">
            Seconds
          </Text>
        </Flex>
      </Flex>
    </Flex>
  );
}
