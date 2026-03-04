import React from 'react';
import { View } from 'react-native';
import { Svg, Circle, Text as SVGText } from 'react-native-svg';

interface CircularProgressProps {
  progressPercent?: number;
  bgColor?: string;
  pgColor?: string;
  textSize?: number;
  textColor?: string;
  size: number;
  strokeWidth: number;
  text?: string;
}

const CircularProgress = (props: CircularProgressProps) => {
  const { size, strokeWidth, text } = props;
  const radius = (size - strokeWidth) / 2;
  const circum = radius * 2 * Math.PI;
  const svgProgress = 100 - (props.progressPercent ?? 0);
  const textSize = props.textSize ?? 10;

  return (
    <View style={{ margin: 5 }}>
      <Svg width={size} height={size}>
        {/* Background Circle */}
        <Circle
          stroke={props.bgColor ?? '#f2f2f2'}
          fill="none"
          cx={size / 2}
          cy={size / 2}
          r={radius}
          strokeWidth={strokeWidth}
        />

        {/* Progress Circle */}
        <Circle
          stroke={props.pgColor ?? '#3b5998'}
          fill="none"
          cx={size / 2}
          cy={size / 2}
          r={radius}
          strokeDasharray={`${circum} ${circum}`}
          strokeDashoffset={radius * Math.PI * 2 * (svgProgress / 100)}
          strokeLinecap="butt"
          transform={`rotate(-90, ${size / 2}, ${size / 2})`}
          strokeWidth={strokeWidth}
        />

        {/* Text */}
        <SVGText
          fontSize={textSize}
          x={size / 2}
          y={size / 2 + (textSize / 2 - 1)}
          textAnchor="middle"
          fill={props.textColor ?? '#333333'}
        >
          {text}
        </SVGText>
      </Svg>
    </View>
  );
};

export default CircularProgress;
