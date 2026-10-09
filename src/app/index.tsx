import { useState } from 'react';
import { View, Text, Pressable, Image, ActivityIndicator, ScrollView, StyleSheet, StatusBar } from 'react-native';
import * as ImagePicker from 'expo-image-picker';

const WEBHOOK_URL = process.env.EXPO_PUBLIC_WEBHOOK_URL || 'YOUR_N8N_WEBHOOK_URL';

export default function App() {
  const [photo, setPhoto] = useState<string | null>(null);
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const scanBill = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== 'granted') {
      alert('Camera permission chahincha');
      return;
    }

    const shot = await ImagePicker.launchCameraAsync({
      base64: true,
      quality: 0.5, // small size = fast upload
    });
    if (shot.canceled) return;

    const image = shot.assets[0];
    setPhoto(image.uri);
    setResult(null);
    setLoading(true);

    try {
      const res = await fetch(WEBHOOK_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ image: image.base64 }),
      });
      const data = await res.json();
      setResult(data);
    } catch (e: any) {
      alert('Error: ' + e.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.screen}>
      <StatusBar barStyle="light-content" />

      <ScrollView style={{ flex: 1 }} contentContainerStyle={styles.container}>
        <Text style={styles.title}>🧾 Bill Scanner</Text>

        {photo && <Image source={{ uri: photo }} style={styles.photo} />}
        {loading && <ActivityIndicator size="large" color="#f97316" style={{ marginTop: 20 }} />}

        {result && (
          <View style={styles.card}>
            <Text style={styles.shop}>{result.shop_name || 'Shop name bhetiyena'}</Text>
            <Text style={styles.text}>Bill No: {result.bill_number}   Date: {result.date}</Text>
            {result.items?.map((item: any, i: number) => (
              <Text key={i} style={styles.text}>• {item.name} x{item.qty} = Rs. {item.price}</Text>
            ))}
            <Text style={styles.total}>Total: Rs. {result.total}</Text>
            <Text style={styles.text}>✅ Google Sheet ma save bhayo</Text>
          </View>
        )}
      </ScrollView>

      {/* Button fixed at the bottom */}
      <View style={styles.bottomBar}>
        <Pressable
          style={({ pressed }) => [styles.button, pressed && { opacity: 0.8 }, loading && { opacity: 0.5 }]}
          onPress={scanBill}
          disabled={loading}
        >
          <Text style={styles.buttonText}>
            {loading ? 'AI le padhdai cha...' : 'Bill ko photo khichnus'}
          </Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: '#000000' },
  container: { padding: 20, paddingTop: 60 },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 20, color: '#ffffff' },
  button: {
    backgroundColor: '#f97316',
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: 'center',
  },
  buttonText: { color: '#ffffff', fontSize: 16, fontWeight: 'bold' },
  photo: { width: '100%', height: 300, marginTop: 20, borderRadius: 10 },
  card: { marginTop: 20, padding: 16, backgroundColor: '#1a1a1a', borderRadius: 10, gap: 4 },
  shop: { fontSize: 18, fontWeight: 'bold', color: '#ffffff' },
  text: { color: '#ffffff' },
  total: { fontSize: 18, fontWeight: 'bold', marginTop: 8, color: '#f97316' },
  bottomBar: {
    padding: 20,
    paddingBottom: 60,
    backgroundColor: '#000000',
    borderTopWidth: 1,
    borderTopColor: '#1f1f1f',
  },
});