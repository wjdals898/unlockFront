import React, { useEffect, useState } from 'react';
import { View } from 'react-native';
import Svg, { Circle } from 'react-native-svg';
import * as d3 from 'd3';

const XYPlot = ({ data }) => {
  const [svgData, setSvgData] = useState(null);

  useEffect(() => {
    // 데이터 변환 및 스케일 설정
    const xScale = d3.scaleLinear().domain([0, 100]).range([0, 300]);
    const yScale = d3.scaleLinear().domain([0, 100]).range([0, 300]);

    const circles = data.map((d, index) => (
      <Circle
        key={index}
        cx={xScale(d.x)}
        cy={yScale(d.y)}
        r={5} // 원의 반지름 설정
        fill="blue" // 원의 색상 설정
      />
    ));

    setSvgData(circles);
  }, [data]);

  return (
    <View>
      <Svg width={300} height={300}>
        {svgData}
      </Svg>
    </View>
  );
};

export default XYPlot;