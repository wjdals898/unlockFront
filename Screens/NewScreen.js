import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { LineChart } from 'react-native-chart-kit'; // 예시를 위한 차트 라이브러리
import { Svg, Circle } from 'react-native-svg';



function NewScreen({csvData, header}) {
  const [activeComponent, setActiveComponent] = useState('first');
  console.log('csvData : ', csvData);

  return (
    <View style={styles.container}>
      <View style={styles.ChartComponent}>
        <TouchableOpacity style={styles.touchButton} onPress={() => setActiveComponent('first')}>
          <Text style={styles.tabComponent}>마인드맵</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.touchButton2} onPress={() => setActiveComponent('second')}>
          <Text style={styles.tabComponent}>행동</Text>
        </TouchableOpacity>
      </View>
      {activeComponent === 'first' ? <MindComponent header={header} csvData={csvData}/> : <MovementComponent header={header} csvData={csvData}/>}
    </View>
  );
}

function MovementComponent({header, csvData}) {
  const data = {
    labels: header.slice(3),
    datasets: [
      {
        data: Object.values(csvData),
      },
    ],
  };

  return (
    <View>
      {csvData ?
      <LineChart
        data={data}
        width={350}
        height={300}
        yAxisSuffix="%"
        yAxisInterval={1}
        chartConfig={{
          backgroundColor: '#F4BAB2',
          backgroundGradientFrom: '#fb8c00',
          backgroundGradientTo: '#ffa726',
          decimalPlaces: 2,
          color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
        }}
        bezier
        style={{ marginVertical: 8, borderRadius: 16 }}
      /> : null }
    </View>
  );
}

function MindComponent({header, csvData}) {
  console.log(csvData);
  const data = {
    labels: header.slice(3),
    datasets: [
      {
        data: Object.values(csvData),
      },
    ],
  };

  return (
    <View>
      {csvData ?
      <LineChart
        data={data}
        width={350}
        height={300}
        yAxisSuffix="%"
        yAxisInterval={1}
        chartConfig={{
          backgroundColor: '#e26a00',
          backgroundGradientFrom: '#fb8c00',
          backgroundGradientTo: '#ffa726',
          decimalPlaces: 2,
          color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
        }}
        bezier
        style={{ marginVertical: 8, borderRadius: 16 }}
      /> : null }
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
    
  },
  container: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: '#f5fcff',
    width: 370,
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
});

export default NewScreen;
