import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  SafeAreaView,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { CameraView, useCameraPermissions } from "expo-camera";

const Home = () => {
  const [permission, requestPermission] = useCameraPermissions();
  const [isScanning, setIsScanning] = useState(true);
  const [isCheckedIn, setIsCheckedIn] = useState(false);

  // GANTI IP INI SESUAI IPv4 LAPTOP LU
  const BASE_URL = "http://10.207.130.26:8080/api/attendance";

  const handleBarcodeScanned = ({ data }) => {
    if (!isScanning) return;

    setIsScanning(false);

    Alert.alert(
      "QR Code Terdeteksi",
      `Data QR:\n${data}\n\nApakah ingin Check In?`,
      [
        {
          text: "Batal",
          style: "cancel",
          onPress: () => setIsScanning(true),
        },
        {
          text: "Ya, Check In",
          onPress: () => handleCheckIn(data),
        },
      ]
    );
  };

  const handleCheckIn = async (qrData) => {
    try {
      let parsedQR = {};

      try {
        parsedQR = JSON.parse(qrData);
      } catch (error) {
        parsedQR = {
          matakuliah: "Mobile Programming",
          dosen: "Tim Dosen TRPL",
        };
      }

      const payload = {
        nim: "0920240025",
        nama: "Zaki Fathur",
        kodeMk: parsedQR.kodeMk || "PRG6",
        matakuliah: parsedQR.matakuliah || "Mobile Programming",
        pertemuan: parsedQR.pertemuan || "7",
        ruangan: parsedQR.ruangan || "Lab 3",
        dosen: parsedQR.dosen || "Tim Dosen TRPL",
        tanggal: new Date().toISOString().split("T")[0],
        jamPresensi: new Date().toLocaleTimeString("id-ID"),
        status: "Present",
      };

      const response = await fetch(BASE_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error("Gagal menyimpan presensi");
      }

      setIsCheckedIn(true);
      Alert.alert("Sukses", "Berhasil Check In dan data tersimpan.");
    } catch (error) {
      console.log(error);
      Alert.alert("Error", "Gagal mengirim data ke backend.");
    } finally {
      setIsScanning(true);
    }
  };

  if (!permission) {
    return (
      <SafeAreaView style={styles.center}>
        <Text>Memuat izin kamera...</Text>
      </SafeAreaView>
    );
  }

  if (!permission.granted) {
    return (
      <SafeAreaView style={styles.center}>
        <MaterialIcons name="camera-alt" size={60} color="#4A80F0" />
        <Text style={styles.permissionText}>
          Aplikasi membutuhkan akses kamera untuk scan QR Code presensi.
        </Text>

        <TouchableOpacity style={styles.buttonActive} onPress={requestPermission}>
          <Text style={styles.buttonText}>Izinkan Kamera</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <CameraView
        style={StyleSheet.absoluteFillObject}
        facing="back"
        barcodeScannerSettings={{
          barcodeTypes: ["qr"],
        }}
        onBarcodeScanned={isScanning && !isCheckedIn ? handleBarcodeScanned : undefined}
      />

      <View style={styles.overlay}>
        <View style={styles.headerBox}>
          <Text style={styles.headerTitle}>Attendance App</Text>
          <Text style={styles.headerSubTitle}>Scan QR Code Presensi</Text>
        </View>

        <View style={styles.scanBox} />

        <Text style={styles.scanText}>
          Arahkan kamera ke QR Code dosen
        </Text>

        {isCheckedIn && (
          <View style={styles.successBox}>
            <MaterialIcons name="check-circle" size={45} color="#4CAF50" />
            <Text style={styles.successText}>CHECKED IN</Text>
          </View>
        )}

        {!isScanning && !isCheckedIn && (
          <TouchableOpacity
            style={styles.retryButton}
            onPress={() => setIsScanning(true)}
          >
            <Text style={styles.buttonText}>Scan Lagi</Text>
          </TouchableOpacity>
        )}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    backgroundColor: "#F5F5F5",
  },
  permissionText: {
    textAlign: "center",
    fontSize: 16,
    marginVertical: 20,
    color: "#333",
  },
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.45)",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  headerBox: {
    position: "absolute",
    top: 60,
    alignItems: "center",
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#FFF",
  },
  headerSubTitle: {
    fontSize: 15,
    color: "#DDD",
    marginTop: 5,
  },
  scanBox: {
    width: 250,
    height: 250,
    borderWidth: 4,
    borderColor: "#4A80F0",
    borderRadius: 16,
    backgroundColor: "transparent",
  },
  scanText: {
    color: "#FFF",
    fontSize: 16,
    marginTop: 25,
    textAlign: "center",
    fontWeight: "bold",
  },
  buttonActive: {
    backgroundColor: "#4A80F0",
    paddingVertical: 13,
    paddingHorizontal: 25,
    borderRadius: 8,
    alignItems: "center",
  },
  retryButton: {
    backgroundColor: "#FF9800",
    paddingVertical: 13,
    paddingHorizontal: 25,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 20,
  },
  buttonText: {
    color: "#FFF",
    fontWeight: "bold",
  },
  successBox: {
    marginTop: 25,
    backgroundColor: "#FFF",
    padding: 18,
    borderRadius: 12,
    alignItems: "center",
  },
  successText: {
    color: "#4CAF50",
    fontWeight: "bold",
    fontSize: 18,
    marginTop: 5,
  },
});

export default Home;