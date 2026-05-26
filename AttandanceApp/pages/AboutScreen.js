import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { MaterialIcons } from '@expo/vector-icons';

export default function AboutScreen() {
  const [permission, requestPermission] = useCameraPermissions();
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const [mahasiswa, setMahasiswa] = useState(null);
  const [loading, setLoading] = useState(false);

  const cameraRef = useRef(null);

  // GANTI sesuai NIM yang ada di database mahasiswa
  const NIM_USER = '0920240025';

  // GANTI sesuai IP laptop kamu
  // Jangan pakai localhost kalau test di HP Expo Go
  const BASE_URL = 'http://10.1.10.110:8080/api/mahasiswa';

  useEffect(() => {
    fetchMahasiswa();
  }, []);

  const fetchMahasiswa = async () => {
    try {
      setLoading(true);

      const response = await fetch(`${BASE_URL}/${NIM_USER}`);

      if (!response.ok) {
        Alert.alert(
          'Data Tidak Ditemukan',
          `Mahasiswa dengan NIM ${NIM_USER} tidak ditemukan di database.`
        );
        setMahasiswa(null);
        return;
      }

      const data = await response.json();
      setMahasiswa(data);
    } catch (error) {
      console.log('FETCH ERROR:', error);
      Alert.alert(
        'Error',
        `Gagal mengambil data mahasiswa dari server.\n\nDetail: ${error.message}`
      );
    } finally {
      setLoading(false);
    }
  };

  const takePicture = async () => {
    if (cameraRef.current) {
      try {
        const photo = await cameraRef.current.takePictureAsync({
          quality: 0.3,
        });

        await uploadPhoto(photo.uri);
      } catch (error) {
        console.log('CAMERA ERROR:', error);
        Alert.alert('Error', 'Gagal mengambil foto selfie.');
      }
    }
  };

  const uploadPhoto = async (uri) => {
    try {
      setLoading(true);

      const formData = new FormData();

      formData.append('nim', NIM_USER);
      formData.append('nama', mahasiswa?.namaMhs || 'Fathur Zaki');
      formData.append('foto', {
        uri: uri,
        name: 'selfie.jpg',
        type: 'image/jpeg',
      });

      const response = await fetch(`${BASE_URL}/upload`, {
        method: 'POST',
        body: formData,

        // Jangan tambahkan Content-Type manual.
        // React Native akan membuat boundary multipart sendiri.
      });

      const resultText = await response.text();

      if (!response.ok) {
        Alert.alert(
          'Error Upload',
          resultText || 'Gagal upload foto ke server.'
        );
        return;
      }

      Alert.alert('Sukses', 'Foto profil tersinkronisasi ke server!');

      setIsCameraOpen(false);

      // Ambil ulang data dari server supaya foto langsung muncul
      await fetchMahasiswa();
    } catch (error) {
      console.log('UPLOAD ERROR:', error);
      Alert.alert(
        'Error',
        `Gagal mengunggah foto ke server.\n\nDetail: ${error.message}`
      );
    } finally {
      setLoading(false);
      setIsCameraOpen(false);
    }
  };

  // Loading
  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" />
        <Text style={styles.infoText}>Memuat data...</Text>
      </View>
    );
  }

  // Tampilan Kamera
  if (isCameraOpen) {
    if (!permission) {
      return (
        <View style={styles.container}>
          <Text>Memuat perizinan...</Text>
        </View>
      );
    }

    if (!permission.granted) {
      return (
        <View style={styles.container}>
          <Text style={styles.infoText}>
            Kami butuh akses kamera untuk selfie profil.
          </Text>

          <TouchableOpacity style={styles.button} onPress={requestPermission}>
            <Text style={styles.buttonText}>Beri Izin Kamera</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.cancelButton}
            onPress={() => setIsCameraOpen(false)}
          >
            <Text style={styles.cancelButtonText}>Batal</Text>
          </TouchableOpacity>
        </View>
      );
    }

    return (
      <View style={styles.container}>
        <CameraView
          style={StyleSheet.absoluteFillObject}
          facing="front"
          ref={cameraRef}
        >
          <View style={styles.cameraOverlay}>
            <View style={styles.captureContainer}>
              <TouchableOpacity
                style={styles.captureButton}
                onPress={takePicture}
              >
                <Text style={styles.captureButtonText}>Ambil & Kirim</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.cancelButton}
                onPress={() => setIsCameraOpen(false)}
              >
                <Text style={styles.cancelButtonText}>Batal</Text>
              </TouchableOpacity>
            </View>
          </View>
        </CameraView>
      </View>
    );
  }

  // Tampilan About / Profil
  return (
    <View style={styles.container}>
      <View style={styles.profileCard}>
        <View style={styles.imageWrapper}>
          {mahasiswa?.fotoMhs ? (
            <Image
              source={{ uri: `data:image/jpeg;base64,${mahasiswa.fotoMhs}` }}
              style={styles.profileImage}
            />
          ) : (
            <View style={styles.iconPlaceholder}>
              <MaterialIcons name="person" size={90} color="#9e9e9e" />
            </View>
          )}
        </View>

        <Text style={styles.nameText}>
          {mahasiswa?.namaMhs || 'Mahasiswa'}
        </Text>

        <Text style={styles.nimText}>
          {mahasiswa?.nimMhs || NIM_USER}
        </Text>

        <TouchableOpacity
          style={styles.button}
          onPress={() => setIsCameraOpen(true)}
        >
          <Text style={styles.buttonText}>Ganti Foto Selfie</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f4f6f9',
    justifyContent: 'center',
    alignItems: 'center',
  },

  profileCard: {
    backgroundColor: 'white',
    width: '85%',
    padding: 30,
    borderRadius: 20,
    alignItems: 'center',
    elevation: 5,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 10,
  },

  imageWrapper: {
    marginBottom: 20,
  },

  profileImage: {
    width: 150,
    height: 150,
    borderRadius: 75,
    borderWidth: 2,
    borderColor: '#0056b3',
  },

  iconPlaceholder: {
    width: 150,
    height: 150,
    borderRadius: 75,
    borderWidth: 2,
    borderColor: '#0056b3',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f1f1f1',
  },

  nameText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },

  nimText: {
    fontSize: 16,
    color: 'gray',
    marginBottom: 20,
  },

  button: {
    backgroundColor: '#0056b3',
    paddingVertical: 12,
    paddingHorizontal: 25,
    borderRadius: 10,
    width: '100%',
    alignItems: 'center',
  },

  buttonText: {
    color: 'white',
    fontWeight: 'bold',
  },

  infoText: {
    marginTop: 15,
    marginBottom: 15,
    textAlign: 'center',
    fontSize: 16,
  },

  cameraOverlay: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'transparent',
  },

  captureContainer: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    alignItems: 'center',
    marginBottom: 40,
  },

  captureButton: {
    backgroundColor: 'white',
    paddingVertical: 15,
    paddingHorizontal: 25,
    borderRadius: 30,
    elevation: 5,
  },

  captureButtonText: {
    fontWeight: 'bold',
    color: 'black',
  },

  cancelButton: {
    backgroundColor: 'rgba(0,0,0,0.6)',
    paddingVertical: 15,
    paddingHorizontal: 25,
    borderRadius: 30,
    marginTop: 10,
  },

  cancelButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
});