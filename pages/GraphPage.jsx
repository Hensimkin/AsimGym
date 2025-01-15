import React from "react";
import { View, Text, ScrollView, Dimensions } from "react-native";
import { LineChart } from "react-native-chart-kit";

const GraphPage = ({ route }) => {
  const { exerciseName, logs } = route.params;

  const renderGraph = (label, data, yAxisSuffix) => {
    return (
      <LineChart
        data={{
          labels: data.map((_, index) => index + 1),
          datasets: [{ data }],
        }}
        width={Dimensions.get("window").width - 40} 
        height={220}
        yAxisSuffix={yAxisSuffix}
        chartConfig={{
          backgroundColor: "#e26a00",
          backgroundGradientFrom: "#fb8c00",
          backgroundGradientTo: "#ffa726",
          decimalPlaces: 2,
          color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
          labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
          style: { borderRadius: 16 },
          propsForDots: { r: "6", strokeWidth: "2", stroke: "#ffa726" },
        }}
        style={{ marginVertical: 8, borderRadius: 16 }}
      />
    );
  };

  return (
    <ScrollView contentContainerStyle={{ padding: 20 }}>
      <Text style={{ fontSize: 18, marginBottom: 10 }}>
        Graphs for {exerciseName}
      </Text>

      <Text style={{ fontSize: 16, marginTop: 10 }}>Duration (Time)</Text>
      {renderGraph(
        "Duration",
        logs.map((log) => parseFloat(log.duration)),
        "s"
      )}

      {Object.keys(logs[0].exercises).map((exerciseName, index) => (
        <View key={index}>
          <Text style={{ fontSize: 16, marginTop: 10 }}>{exerciseName}</Text>

          <Text style={{ fontSize: 14 }}>Sets</Text>
          {renderGraph(
            "Sets",
            logs.map((log) => parseFloat(log.exercises[exerciseName].sets)),
            ""
          )}

          <Text style={{ fontSize: 14 }}>Reps</Text>
          {renderGraph(
            "Reps",
            logs.map((log) => parseFloat(log.exercises[exerciseName].reps)),
            ""
          )}

          <Text style={{ fontSize: 14 }}>Weight</Text>
          {renderGraph(
            "Weight",
            logs.map((log) => parseFloat(log.exercises[exerciseName].weight)),
            "kg"
          )}
        </View>
      ))}
    </ScrollView>
  );
};

export default GraphPage;
