import React, { useMemo } from "react";
import { View } from "react-native";
import Svg, { Circle, Line, Polygon } from "react-native-svg";

export type RadarData = {
  data: {
    value: number;
    label: string;
  }[];
  colour: string;
};

type Props = {
  radarData: RadarData[];
  size: number;
};

type Point = [number, number];

const svgY = (degrees: number) => degrees + 180;

const degToRadians = (deg: number) => deg * (Math.PI / 180.0);

const calculateEdgePointFn =
  (center: number, radius: number) =>
  (degree: number, scale = 1): Point => {
    const degreeInRadians = degToRadians(degree);
    const degreeInRadiansY = degToRadians(svgY(degree));
    return [
      center + Math.cos(degreeInRadians) * radius * scale,
      center + Math.sin(degreeInRadiansY) * radius * scale,
    ];
  };

export default (props: Props) => {
  const viewBoxSize = props.size || 120;
  const viewBoxCenter = viewBoxSize * 0.5;
  const radius = viewBoxSize * 0.4;

  const calculateEdgePoint = useMemo(
    () => calculateEdgePointFn(viewBoxCenter, radius),
    [radius],
  );

  return (
    <View className="flex flex-1 items-center justify-center">
      <Svg
        className="h-full w-full"
        viewBox={`0 0 ${viewBoxSize} ${viewBoxSize}`}
      >
        <Circle
          cx={viewBoxCenter}
          cy={viewBoxCenter}
          r={radius}
          stroke="black"
          strokeOpacity="0.2"
          strokeWidth="0.2"
          fill="#F5F5F5"
        />

        {[0, 1, 2].map((i) => (
          <Circle
            key={`circle_outline_${i}`}
            cx={viewBoxCenter}
            cy={viewBoxCenter}
            r={(i + 1) * radius * 0.25}
            stroke="black"
            strokeOpacity="0.2"
            strokeWidth="0.2"
            fill="transparent"
          />
        ))}

        {[0, 1, 2].map((i) => (
          <Line
            key={`crosshair_${i}`}
            x1={calculateEdgePoint(i * 60)[0]}
            y1={calculateEdgePoint(i * 60)[1]}
            x2={calculateEdgePoint(i * 60 + 180)[0]}
            y2={calculateEdgePoint(i * 60 + 180)[1]}
            stroke="black"
            strokeOpacity="0.2"
            strokeWidth="0.2"
            fill="transparent"
          />
        ))}

        {props.radarData.map((radarData) => (
          <Polygon
            stroke={radarData.colour}
            strokeWidth={1}
            fill={radarData.colour}
            fillOpacity={0.5}
            points={`${radarData.data.map((r, i) => {
              const edgePoint = calculateEdgePoint(i * 60, r.value / 100);
              return `${edgePoint[0]},${edgePoint[1]}`;
            })}`}
          />
        ))}
      </Svg>
    </View>
  );
};
