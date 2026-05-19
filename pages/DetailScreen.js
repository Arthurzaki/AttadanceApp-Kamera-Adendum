import React from "react";
import { View, Text, SafeAreaView, StyleSheet } from "react-native";

export default function DetailScreen({ route }) {
  const { dataPresensi } = route.params;

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.title}>
          {dataPresensi.matakuliah || dataPresensi.course || "Mobile Programming"}
        </Text>

        <View style={styles.row}>
          <Text style={styles.label}>Tanggal:</Text>
          <Text style={styles.value}>
            {dataPresensi.tanggal || dataPresensi.date || "-"}
          </Text>
        </View>

        <View style={styles.row}>
          <Text style={styles.label}>Jam:</Text>
          <Text style={styles.value}>
            {dataPresensi.jamPresensi || "-"}
          </Text>
        </View>

        <View style={styles.row}>
          <Text style={styles.label}>Status:</Text>
          <Text
            style={[
              styles.value,
              dataPresensi.status === "Present" ? styles.present : styles.absent,
            ]}
          >
            {dataPresensi.status || "-"}
          </Text>
        </View>

        <View style={styles.row}>
          <Text style={styles.label}>Ruangan:</Text>
          <Text style={styles.value}>
            {dataPresensi.ruangan || dataPresensi.room || "-"}
          </Text>
        </View>

        <View style={styles.row}>
          <Text style={styles.label}>Dosen Pengampu:</Text>
          <Text style={styles.value}>
            {dataPresensi.dosen || dataPresensi.lecturer || "-"}
          </Text>
        </View>

        <View style={styles.row}>
          <Text style={styles.label}>Pertemuan:</Text>
          <Text style={styles.value}>
            {dataPresensi.pertemuan || "-"}
          </Text>
        </View>

        <View style={styles.row}>
          <Text style={styles.label}>Kode MK:</Text>
          <Text style={styles.value}>
            {dataPresensi.kodeMk || "-"}
          </Text>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F5F5F5", padding: 20 },
  card: { backgroundColor: "white", padding: 20, borderRadius: 10, elevation: 3 },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
    paddingBottom: 15,
    marginBottom: 15,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 12,
    gap: 10,
  },
  label: { fontSize: 14, color: "gray" },
  value: {
    flex: 1,
    textAlign: "right",
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
  },
  present: { color: "green" },
  absent: { color: "red" },
});