import { useEffect, useMemo, useState } from "react";
import {
  YAxis,
  Tooltip,
  ResponsiveContainer,
  XAxis,
  LineChart,
  Line,
  ReferenceLine,
} from "recharts";
import { TokenChartData } from "src/config/types";
import moment from "moment";
import { formatNumber } from "src/utils/helper";
import { Box } from "@chakra-ui/layout";
import { transparentize } from "@chakra-ui/theme-tools";

type TokenChartProps = {
  data: TokenChartData[];
  chartDays: number;
  color: string;
};

export default function TokenChart(props: TokenChartProps) {
  const [dateFormat, setDateFormat] = useState("HH:mm");

  useEffect(() => {
    if (props.chartDays === 7) {
      setDateFormat("ddd DD");
    } else if (props.chartDays === 30 || props.chartDays === 90) {
      setDateFormat("DD/MM");
    } else if (props.chartDays === 365) {
      setDateFormat("M/YYYY");
    }
  }, [props.chartDays]);

  function renderTooltip(props: any) {
    if (props.active && props.payload && props.payload.length) {
      return (
        <Box bg={transparentize("gray.800", 0.5) as any} p="3">
          <Box>{`${moment(props.payload[0].payload.date).format(
            "ddd DD MMM YYYY H:m:s"
          )}`}</Box>
          <Box>
            <span className="fw-700 mr-1">Price: </span>
            <span>{`${formatNumber(props.payload[0].payload.price, 2)}`}</span>
          </Box>
        </Box>
      );
    }

    return null;
  }

  const maxMin = useMemo(() => {
    let max: number = props.data[0].price || 0;
    let min: number = props.data[0].price || 0;
    props.data.forEach((priceBlock: any) => {
      if (priceBlock.price > max) {
        max = priceBlock.price;
      }
      if (priceBlock.price < min) {
        min = priceBlock.price;
      }
    });

    return { max, min };
  }, [props.data]);

  return (
    <div>
      <ResponsiveContainer width="100%" height={250}>
        <LineChart
          width={1000}
          height={250}
          data={props.data}
          margin={{ right: 0, left: 0 }}
        >
          <ReferenceLine
            y={maxMin.max}
            label={{
              value: formatNumber(maxMin.max, 5),
              fontSize: 12,
              fill: "#ffffff50",
              position: "insideBottomLeft",
            }}
            stroke="#3b3e3c"
            strokeDasharray="3 3"
          />
          <ReferenceLine
            y={maxMin.min}
            label={{
              value: formatNumber(maxMin.min, 5),
              fontSize: 12,
              fill: "#ffffff50",
              position: "insideTopLeft",
            }}
            stroke="#3b3e3c"
            strokeDasharray="3 3"
          />
          <YAxis
            hide
            mirror={true}
            domain={["bottom", "top"]}
            // color="#a4abbb"
            // tickCount={3}
            // interval="preserveStartEnd"
            padding={{ top: 20, bottom: 20 }}
            // tick={{ fill: "#a4abbb", fontSize: 12 }}
          />
          <XAxis
            dataKey="date"
            interval="preserveStartEnd"
            tickLine={false}
            tickMargin={7}
            minTickGap={50}
            tick={{ fill: "#a4abbb", fontSize: 12 }}
            tickFormatter={(value: number) =>
              `${moment(value).format(dateFormat)}`
            }
          />
          <Tooltip content={(props) => renderTooltip(props)} />
          <Line
            type="monotone"
            dataKey="price"
            stroke={props.color}
            dot={<></>}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
