import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import { ActivityIndicator, Image, ScrollView, Text, TextInput, TouchableOpacity, useColorScheme, View } from 'react-native';

const API_KEY = 'bd61a17dea674facace111205252705';

export default function WeatherApp() {
  const [city, setCity] = useState('');
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const theme = useColorScheme();
  const isDark = theme === 'dark';

  const fetchWeather = async () => {
    if (!city) return;
    setLoading(true);
    setError('');
    setWeather(null);

    try {
      const response = await fetch(
        `https://api.weatherapi.com/v1/forecast.json?key=${API_KEY}&q=${city}&days=5&aqi=no&alerts=no`
      );
      const data = await response.json();

      if (data.error) {
        setError(data.error.message);
      } else {
        setWeather(data);
      }
    } catch (err) {
      setError('Network error or bad response.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView className={`flex-1 px-5 pt-12 ${isDark ? 'bg-zinc-900' : 'bg-gray-100'}`} contentContainerStyle={{ alignItems: 'center' }}>
      <Text className={`text-2xl font-bold mb-5 ${isDark ? 'text-white' : 'text-black'}`}>Weather App</Text>

      <TextInput
        className={`w-full p-3 rounded-lg border mb-3 ${isDark ? 'bg-zinc-800 text-white border-zinc-700' : 'bg-white text-black border-gray-300'}`}
        placeholder="Enter city name"
        placeholderTextColor={isDark ? '#aaa' : '#666'}
        value={city}
        onChangeText={setCity}
      />

      <TouchableOpacity
        className="bg-blue-500 px-4 py-2 rounded-md"
        onPress={fetchWeather}
      >
        <Text className="text-white font-semibold">Get Weather</Text>
      </TouchableOpacity>

      {loading && <ActivityIndicator size="large" color="#3b82f6" className="mt-5" />}
      {error !== '' && <Text className="text-red-500 mt-3">{error}</Text>}

      {weather && (
        <View className="items-center mt-6 w-full">
          <Text className={`text-xl font-bold mb-2 ${isDark ? 'text-white' : 'text-black'}`}>
            {weather.location.name}, {weather.location.country}
          </Text>
          <Image
            source={{ uri: `https:${weather.current.condition.icon}` }}
            className="w-24 h-24"
          />
          <Text className={`text-5xl font-light ${isDark ? 'text-white' : 'text-black'}`}>{weather.current.temp_c}°C</Text>
          <Text className={`${isDark ? 'text-white' : 'text-black'}`}>{weather.current.condition.text}</Text>

          <View className="flex-row items-center mt-3">
            <Ionicons name="water" size={24} color="skyblue" />
            <Text className="ml-2 text-base text-gray-500">Humidity: {weather.current.humidity}%</Text>
          </View>
          <View className="flex-row items-center mt-1">
            <Ionicons name="speedometer" size={24} color="gray" />
            <Text className="ml-2 text-base text-gray-500">Wind: {weather.current.wind_kph} km/h</Text>
          </View>
          <View className="flex-row items-center mt-1">
            <Ionicons name="sunny" size={24} color="orange" />
            <Text className="ml-2 text-base text-gray-500">UV Index: {weather.current.uv}</Text>
          </View>

          <Text className={`text-lg font-semibold mt-6 mb-2 ${isDark ? 'text-white' : 'text-black'}`}>5-Day Forecast</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} className="mt-1">
            {weather.forecast.forecastday.map((day, index) => (
              <View key={index} className="bg-gray-300 dark:bg-zinc-700 p-3 rounded-lg mr-3 items-center">
                <Text className="text-sm font-semibold dark:text-white text-black">{day.date}</Text>
                <Image
                  source={{ uri: `https:${day.day.condition.icon}` }}
                  className="w-10 h-10 mt-1"
                />
                <Text className="text-base mt-1 dark:text-white text-black">{day.day.avgtemp_c}°C</Text>
              </View>
            ))}
          </ScrollView>
        </View>
      )}
    </ScrollView>
  );
}
