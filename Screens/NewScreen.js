import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, processColor  } from 'react-native';
import { LineChart, Bu } from 'react-native-chart-kit'; // 예시를 위한 차트 라이브러리
import { BubbleChart } from 'react-native-charts-wrapper';
import Plotly from 'react-native-plotly';
import { VictoryChart, VictoryLabel, VictoryScatter, VictoryTheme, VictoryArea, VictoryZoomContainer } from 'victory-native';

const NewScreen = ({mindData, mindHeader, moveData}) => {
  const [activeComponent, setActiveComponent] = useState('first');

  return (
    <View style={styles.container}>
      <View style={styles.ChartComponent}>
        <TouchableOpacity 
          style={[styles.touchButton, activeComponent === 'first' && styles.selectedButton]} 
          onPress={() => setActiveComponent('first')}>
            <Text style={styles.tabComponent}>마인드맵</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.touchButton2, activeComponent === 'second' && styles.selectedButton2]} 
          onPress={() => setActiveComponent('second')}>
            <Text style={styles.tabComponent}>행동</Text>
        </TouchableOpacity>
      </View>
      {activeComponent === 'first' ? <MindComponent header={mindHeader} csvData={mindData}/> : <MovementComponent csvData={moveData}/>}
    </View>
  );
}

function MovementComponent({csvData}) {
  if (csvData.length === 0) {
    return null; // 빈 배열이면 아무것도 렌더링하지 않음
  }
  const data = csvData.map(item => (
    {
      x: item.time,
      y: item.mag_mean,
    }
  ));
  console.log('movedata : ', data);

  return (
    <View style={styles.container}>
      <VictoryChart
        minDomain={{y:0}}
        theme={VictoryTheme.material}
        animate={{duration: 1000, easing: "sinInOut"}}
        containerComponent={
          <VictoryZoomContainer responsive={false}
            zoomDimension="x"/>
        }
      >
        <VictoryArea
          style={{data: {fill: '#e26a00'}}}
          interpolation="natural"
          data={data}
        />
      </VictoryChart>
    </View>
  );
}

const MindComponent = ({header, csvData}) => {
  console.log('mind화면 : ', csvData);

  // useEffect(() => {
  //   console.log('csvData 업데이트 그래프 컴포넌트');
  // }, [data]);

  if (csvData.length === 0) {
    return null; // 빈 배열이면 아무것도 렌더링하지 않음
  }
  const data1 = csvData.map(item => (
    {
      x: item.x + item.y*600,
      y: item.y + item.x*40,
      amount: Math.abs(item.x-item.y),
    }
  ));
  console.log('data1 : ', data1);

  const label = csvData.map(item => (
    item[""]
  ));
  console.log('label : ', label);

  // const x_data = csvData.map(item => (
  //   item.x
  // ));
  // console.log('x : ', x_data);
  // const y_data = csvData.map(item => (
  //   item.y
  // ));
  // console.log('y : ', y_data);
  const data = [
    {
      x:[39, 28, 8, 7, 28, 39],
      y: [39, 28, 8, 7, 28, 39],
      type: 'scatter',
      mode: 'lines+markers',
      marker: {color: 'red'},
    }
  ];

  return (
    <View style={styles.container}>
      {csvData ?
        <VictoryChart
          theme={VictoryTheme.material}
          domain={{x:[-200,200], y:[-100,100]}}
          
          //animate={{duration: 2000, easing: "circleIn"}}
        >
          <VictoryScatter
            style={{
              parent: {border: "1px solid #ccc"},
              data: {fill: "#c43a31", fillOpacity: 0.6, stroke: '#c43a31', strokeWidth: 3}, 
              labels: {fill: 'black', fontSize: 14}}}
            bubbleProperty="amount"
            maxBubbleSize={40}
            minBubbleSize={10}
            data={data1}
            labels={label}
            labelComponent={<VictoryLabel dy={1}/>}
          />
        </VictoryChart>
        : <Text>차트가 없습니다.</Text>
      }
    </View>
  );
}

const ChartScreen = () => {
  const [selectedGraphIndex, setSelectedGraphIndex] = useState(null);

  const graphData = [
    [20, 45, 28, 80, 99, 43, 55], // 예시 데이터 1
    [65, 20, 75, 35, 50, 70, 90], // 예시 데이터 2
    // ... (나머지 예시 데이터)
  ];

  const handleGraphButtonPress = (index) => {
    setSelectedGraphIndex(index);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Different Graphs</Text>
      
      <View style={styles.graphButtonsContainer}>
        {graphData.map((data, index) => (
          <TouchableOpacity
            key={index}
            onPress={() => handleGraphButtonPress(index)}
            style={[
              styles.graphButton,
              index === selectedGraphIndex && styles.selectedGraphButton,
            ]}
          >
            <Text style={styles.graphButtonText}>Graph {index + 1}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <View style={styles.chartContainer}>
        {selectedGraphIndex !== null && (
          <LineChart
            data={{
              labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'],
              datasets: [{ data: graphData[selectedGraphIndex] }],
            }}
            width={300}
            height={200}
            yAxisSuffix="°C"
            chartConfig={{
              backgroundColor: '#e26a00',
              backgroundGradientFrom: '#fb8c00',
              backgroundGradientTo: '#ffa726',
              decimalPlaces: 2, // optional, defaults to 2dp
              color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
            }}
            bezier
          />
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  ChartComponent: {
    flexDirection: 'row',
    width:"100%",
    marginBottom: 0,
  },
  container: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: '#f5fcff',
    width: '100%',
    marginBottom: 20,
    borderRadius: 10,
  },
  touchButton: {
    backgroundColor: '#E3EEF3',
    padding: 8,
    borderTopLeftRadius: 10,
    width:"49.9%",
    borderWidth: 1,
    borderColor:'white',
  },
  selectedButton: {
    backgroundColor: '#A9C3D0',
    padding: 8,
    borderTopLeftRadius: 10,
    width:"49.9%",
    borderWidth: 1,
    borderColor:'white',
  },
  touchButton2: {
    display: 'flex',
    backgroundColor: '#E3EEF3',
    padding: 8,
    borderTopRightRadius: 10,
    width:"49.9%",
    borderWidth: 1,
    marginLeft: 1,
    borderColor:'white',
  },
  selectedButton2: {
    display: 'flex',
    backgroundColor: '#A9C3D0',
    padding: 8,
    borderTopRightRadius: 10,
    width:"49.9%",
    borderWidth: 1,
    marginLeft: 1,
    borderColor:'white',
  },
  tabComponent: {
    fontSize: 17,
    textAlign: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  graphButtonsContainer: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  graphButton: {
    padding: 10,
    marginHorizontal: 5,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#ddd',
    backgroundColor: '#f9f9f9',
  },
  selectedGraphButton: {
    backgroundColor: '#007aff',
  },
  graphButtonText: {
    fontSize: 16,
    color: '#333',
  },
  chartContainer: {
    borderWidth: 1,
    borderColor: '#ddd',
    padding: 10,
    width: '80%',
  },
  Container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  chart: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
});


export default NewScreen;
