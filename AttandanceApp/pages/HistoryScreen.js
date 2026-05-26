import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  SafeAreaView,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";

export default function HistoryScreen({ navigation }) {
  const [historyData, setHistoryData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // GANTI IP INI SESUAI IPv4 LAPTOP LU
  const BASE_URL = "http://10.207.130.26:8080/api/attendance";

  const fetchHistory = async () => {
    try {
      const response = await fetch(BASE_URL);
      const result = await response.json();

      setHistoryData(result.content || []);
    } catch (error) {
      console.log("ERROR FETCH HISTORY:", error);
    } finally {
      setIsLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    fetchHistory();
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={styles.item}
      onPress={() => navigation.navigate("Detail", { dataPresensi: item })}
    >
      <View style={{ flex: 1 }}>
        <Text style={styles.course}>
          {item.matakuliah || "Mobile Programming"}
        </Text>

        <Text style={styles.date}>
          {item.tanggal || "-"} - {item.jamPresensi || "-"}
        </Text>

        <Text style={styles.room}>
          {item.ruangan || "Ruangan belum tersedia"}
        </Text>
      </View>

      <Text style={item.status === "Present" ? styles.present : styles.absent}>
        {item.status}
      </Text>

      <MaterialIcons name="chevron-right" size={24} color="#999" />
    </TouchableOpacity>
  );

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#4285F4" />
        <Text style={styles.loaderText}>Memuat riwayat presensi...</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        data={historyData}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderItem}
        contentContainerStyle={styles.content}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        ListEmptyComponent={
          <Text style={styles.emptyText}>Belum ada riwayat presensi.</Text>
        }
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F5F5F5" },
  content: { padding: 20 },
  item: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "white",
    padding: 15,
    borderRadius: 8,
    marginBottom: 10,
    elevation: 2,
  },
  course: { fontSize: 16, fontWeight: "bold", color: "#333" },
  date: { fontSize: 12, color: "gray", marginTop: 4 },
  room: { fontSize: 12, color: "#555", marginTop: 3 },
  present: { color: "green", fontWeight: "bold", marginRight: 5 },
  absent: { color: "red", fontWeight: "bold", marginRight: 5 },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loaderText: { marginTop: 10, color: "#666", fontSize: 12 },
  emptyText: { textAlign: "center", color: "#777", marginTop: 40 },
});