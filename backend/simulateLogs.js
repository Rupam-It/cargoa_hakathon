const axios = require("axios");

const simulateLogs = async () => {
  const eventTypes = ["INFO", "ERROR", "DEBUG", "WARN"];
  const sourceApps = ["app123", "app456", "app789"];

  for (let i = 0; i < 20; i++) {
    const log = {
      event_type: eventTypes[Math.floor(Math.random() * eventTypes.length)],
      timestamp: new Date().toISOString(),
      source_app_id: sourceApps[Math.floor(Math.random() * sourceApps.length)],
      data_payload: { message: `Random log message #${i}` },
    };

    try {
      const response = await axios.post("http://localhost:3000/api/logs", log);
      console.log("Log created:", response.data);
    } catch (err) {
      console.error("Error creating log:", err.message);
    }
  }
};

simulateLogs();
