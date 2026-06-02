import { useEffect, useState } from "react"
import { ref, onValue } from "firebase/database"
import { db } from "./firebase"

export default function App() {
  const [data, setData] = useState({})

  useEffect(() => {
    const r = ref(db, "/")

    return onValue(r, (snapshot) => {
      setData(snapshot.val() || {})
    })
  }, [])

  const helmet = data?.helmets || {}

  const temp = Number(helmet.temperature || 0)
  const humidity = Number(helmet.humidity || 0)
  const pressure = Number(helmet.pressure || 0)

  const tempStatus =
    temp >= 40 ? "DANGER" :
    temp >= 35 ? "WARNING" :
    "SAFE"

  const humidityStatus =
    humidity >= 70 ? "WARNING" : "SAFE"

  const pressureStatus =
    pressure <= 960 ? "DANGER" : "SAFE"

  const overallStatus =
    helmet.emergency
      ? "EMERGENCY"
      : tempStatus === "DANGER" || pressureStatus === "DANGER"
      ? "DANGER"
      : tempStatus === "WARNING" || humidityStatus === "WARNING"
      ? "WARNING"
      : "SAFE"

  const mapUrl =
    helmet.lat && helmet.lng
      ? `https://www.google.com/maps?q=${helmet.lat},${helmet.lng}`
      : "#"

  return (
    <div style={styles.page}>

      {/* Helmet Watermark */}
      <div style={styles.watermark}>🪖</div>

      {/* Header */}
      <div style={styles.header}>
        <div>
          <h1>🪖 SMART HELMET CONTROL ROOM</h1>
          <p>Industrial Worker Safety Monitoring System</p>
        </div>

        <div style={styles.statusPanel}>
          <div style={styles.lamp(overallStatus)} />
          <h2>{overallStatus}</h2>
        </div>
      </div>

      {/* Sensor Cards */}
      <div style={styles.cardGrid}>

        <Card
          title="🌡 Temperature"
          value={`${temp} °C`}
          status={tempStatus}
          color="#ffe5e5"
        />

        <Card
          title="💧 Humidity"
          value={`${humidity} %`}
          status={humidityStatus}
          color="#e6f4ff"
        />

        <Card
          title="🌪 Pressure"
          value={`${pressure} hPa`}
          status={pressureStatus}
          color="#e8ffe8"
        />

        <Card
          title="🪖 Helmet Status"
          value={helmet.status || "offline"}
          status={helmet.status === "online" ? "ACTIVE" : "OFFLINE"}
          color="#fff5d6"
        />

      </div>

      {/* Main Content */}
      <div style={styles.main}>

        {/* Map Section */}
        <div style={styles.mapSection}>

          <h2>📍 Live GPS Location</h2>

          <iframe
            title="map"
            width="100%"
            height="450"
            src={`https://maps.google.com/maps?q=${helmet.lat},${helmet.lng}&z=15&output=embed`}
            style={{ border: 0, borderRadius: 15 }}
          />

          <div style={styles.locationInfo}>
            <p><b>Latitude:</b> {helmet.lat}</p>
            <p><b>Longitude:</b> {helmet.lng}</p>

            <a
              href={mapUrl}
              target="_blank"
              rel="noreferrer"
            >
              🌍 Open Full Google Maps
            </a>
          </div>

        </div>

        {/* Right Panel */}
        <div style={styles.sidePanel}>

          <h2>🚨 Emergency Panel</h2>

          <a href="tel:+918492910319">
            <button style={styles.button}>
              📞 Call Tulsi Sharma
            </button>
          </a>

          <a href="sms:+918492910319">
            <button style={styles.button}>
              💬 Send SMS
            </button>
          </a>

          <button style={styles.button}>
            🚑 Ambulance
          </button>

          <button style={styles.button}>
            🚒 Fire Brigade
          </button>

          <div style={styles.alertBox}>
            <h3>System Health</h3>

            <p>Temperature: {tempStatus}</p>
            <p>Humidity: {humidityStatus}</p>
            <p>Pressure: {pressureStatus}</p>
            <p>Status: {helmet.status}</p>
            <p>Emergency: {String(helmet.emergency)}</p>
          </div>

        </div>

      </div>

    </div>
  )
}

function Card({ title, value, status, color }) {
  return (
    <div
      style={{
        background: color,
        borderRadius: 20,
        width: 280,
        height: 180,
        padding: 20,
        boxShadow: "0 4px 12px rgba(0,0,0,0.12)",
      }}
    >
      <h3>{title}</h3>

      <h2>{value}</h2>

      <div
        style={{
          marginTop: 15,
          fontWeight: "bold",
        }}
      >
        {status}
      </div>
    </div>
  )
}

const styles = {
  page: {
    minHeight: "100vh",
    background: "#f8f4e8",
    padding: 20,
    fontFamily: "Arial",
    position: "relative",
  },

  watermark: {
    position: "fixed",
    right: 20,
    bottom: 0,
    fontSize: 350,
    opacity: 0.05,
    zIndex: 0,
  },

  header: {
    background: "white",
    borderRadius: 20,
    padding: 20,
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
    marginBottom: 20,
    position: "relative",
    zIndex: 1,
  },

  statusPanel: {
    textAlign: "center",
  },

  lamp: (status) => ({
    width: 20,
    height: 20,
    borderRadius: "50%",
    margin: "0 auto",
    background:
      status === "SAFE"
        ? "green"
        : status === "WARNING"
        ? "orange"
        : "red",
  }),

  cardGrid: {
    display: "flex",
    flexWrap: "wrap",
    gap: 20,
    marginBottom: 20,
    position: "relative",
    zIndex: 1,
  },

  main: {
    display: "flex",
    gap: 20,
    alignItems: "flex-start",
    position: "relative",
    zIndex: 1,
  },

  mapSection: {
    flex: 3,
    background: "white",
    borderRadius: 20,
    padding: 20,
    boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
  },

  locationInfo: {
    marginTop: 15,
    fontSize: 18,
  },

  sidePanel: {
    flex: 1,
    background: "white",
    borderRadius: 20,
    padding: 20,
    boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
    minWidth: 300,
  },

  button: {
    width: "100%",
    padding: 15,
    marginBottom: 10,
    borderRadius: 10,
    border: "none",
    cursor: "pointer",
    fontSize: 16,
    background: "#f0f0f0",
  },

  alertBox: {
    marginTop: 20,
    padding: 15,
    borderRadius: 15,
    background: "#f7f7f7",
  },
}