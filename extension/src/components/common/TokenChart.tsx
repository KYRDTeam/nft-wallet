import { get } from "lodash";
import React, { useMemo } from "react";
import { LineChart, Line, YAxis } from "recharts";
import { useAppSelector } from "src/hooks/useStore";
import { globalSelector } from "src/store/global";

const TokenChart = ({
  address,
  ...props
}: {
  address: string;
  [prop: string]: any;
}) => {
  const { market } = useAppSelector(globalSelector);

  const data: any[] = useMemo(() => {
    // @ts-ignore
    const sparkLine = get(market, `${address}.sparkline`, []).map(
      (point: number) => ({ v: point })
    );
    return sparkLine;
  }, [address, market]);

  const color = useMemo(() => {
    if (!data[0] || !data[data.length - 1]) {
      return "#fff";
    }

    const valueChanged = data[data.length - 1].v - data[0].v;
    if (valueChanged === 0) {
      return "#fff";
    }
    if (valueChanged > 0) {
      return "#00e2a4";
    }
    return "#fe6d40";
  }, [data]);

  return (
    <LineChart
      width={100}
      height={50}
      data={data}
      style={{ margin: "0 auto" }}
      {...props}
    >
      <YAxis hide={true} domain={["auto", "auto"]} />
      <Line dataKey="v" stroke={color} dot={false} />
    </LineChart>
  );
};

export default TokenChart;
