import { useCallback, useState } from "react";
import { useInterval } from "@chakra-ui/hooks";

import { Timer } from "../config/types";

type TimerPropsType = {
  startTime?: Date;
  endTime: Date;
};

type TimerReturnType = {
  status: Timer;
  time: {
    days: number;
    hours: number;
    minutes: number;
    seconds: number;
  };
};

const DAY_TO_MS = 24 * 60 * 60 * 1000;
const HOUR_TO_MS = 1 * 60 * 60 * 1000;
const MINUTE_TO_MS = 60 * 1000;

const useTimer = (props: TimerPropsType): TimerReturnType => {
  const [status, setStatus] = useState<Timer>(Timer.PLANNING);

  const [time, setTime] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  const calculateTime = useCallback(() => {
    const startTime = new Date(props.startTime ? props.startTime : Date.now()).getTime();
    const endTime = new Date(props.endTime).getTime();
    const currentTime = new Date().getTime();

    let waitTime = -1;
    if (currentTime < startTime) {
      setStatus(Timer.PLANNING);
      waitTime = startTime - currentTime;
    } else if (currentTime < endTime) {
      setStatus(Timer.GOING_IN);
      waitTime = endTime - currentTime;
    } else {
      setStatus(Timer.ENDED);
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
  }, [props.startTime, props.endTime]);

  useInterval(calculateTime, 1000);

  return { status, time };
};

export default useTimer;
