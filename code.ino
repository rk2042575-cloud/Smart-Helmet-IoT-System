#include <WiFi.h>
#include <HTTPClient.h>
#include <DHT.h>
#include <Adafruit_BMP280.h>
#include <TinyGPS++.h>

// ---------------- WIFI ----------------
#define WIFI_SSID "Redmi Note 10S"
#define WIFI_PASSWORD "neelam01"

// ---------------- FIREBASE ----------------
String BASE_URL = "https://smart-helmet-7183d-default-rtdb.firebaseio.com/helmets/helmet1";

// ---------------- SENSORS ----------------
#define DHTPIN 27
#define DHTTYPE DHT11

DHT dht(DHTPIN, DHTTYPE);
Adafruit_BMP280 bmp;

TinyGPSPlus gps;
HardwareSerial gpsSerial(1);

// ---------------- SEND JSON (SINGLE PUSH) ----------------
void sendToFirebase(String json) {
  if (WiFi.status() != WL_CONNECTED) return;

  HTTPClient http;
  String url = BASE_URL + ".json";

  http.begin(url);
  http.addHeader("Content-Type", "application/json");

  int code = http.PUT(json);

  Serial.print("Firebase update => ");
  Serial.println(code);

  http.end();
}

// ---------------- SETUP ----------------
void setup() {
  Serial.begin(115200);

  dht.begin();

  if (!bmp.begin(0x76)) {
    Serial.println("BMP ERROR");
    while (1);
  }

  gpsSerial.begin(9600, SERIAL_8N1, 4, 2);

  WiFi.begin(WIFI_SSID, WIFI_PASSWORD);

  Serial.print("Connecting WiFi");
  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }

  Serial.println("\nWiFi Connected");
}

// ---------------- LOOP ----------------
void loop() {

  while (gpsSerial.available()) {
    gps.encode(gpsSerial.read());
  }

  float temp = dht.readTemperature();
  float hum = dht.readHumidity();
  float pressure = bmp.readPressure() / 100.0;

  float lat = gps.location.isValid() ? gps.location.lat() : 0.0;
  float lng = gps.location.isValid() ? gps.location.lng() : 0.0;

  bool emergency = false;  // later you will connect button

  // ---------------- BUILD JSON ----------------
  String json = "{";
  json += "\"temperature\":" + String(temp, 2) + ",";
  json += "\"humidity\":" + String(hum, 2) + ",";
  json += "\"pressure\":" + String(pressure, 2) + ",";
  json += "\"lat\":" + String(lat, 6) + ",";
  json += "\"lng\":" + String(lng, 6) + ",";
  json += "\"status\":\"online\",";
  json += "\"emergency\":" + String(emergency ? "true" : "false");
  json += "}";

  Serial.println(json);

  sendToFirebase(json);

  delay(2000);
}