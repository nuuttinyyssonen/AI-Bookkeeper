import "./global.css";
import { StatusBar } from 'expo-status-bar';
import { Text, View } from 'react-native';

export default function App() {
  return (
    <View className="flex-1 bg-white items-center justify-center">
      <Text className="text-xl font-bold text-slate-800">AI-Bookkeeper</Text>
      <StatusBar style="auto" />
    </View>
  );
}
