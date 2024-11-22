import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';
import axios from 'axios';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';

// Register necessary Chart.js components
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const App = () => {
  const [logs, setLogs] = useState([]);
  const [chartData, setChartData] = useState({
    labels: [],
    datasets: [
      {
        label: 'Event Logs',
        data: [],
        fill: false,
        borderColor: 'rgb(75, 192, 192)',
        tension: 0.1
      }
    ]
  });

  useEffect(() => {
    // Fetch logs from backend API
    axios.get('http://localhost:3000/api/logs')
      .then(response => {
        const eventLogs = response.data.logs;
        setLogs(eventLogs);

        // Prepare chart data based on the logs
        const labels = eventLogs.map(log => log.timestamp);
        const data = eventLogs.map(log => log.event_type);  // You can modify this based on what data you want to visualize
        setChartData(prevState => ({
          ...prevState,
          labels: labels,
          datasets: [{
            ...prevState.datasets[0],
            data: data,
          }]
        }));
      })
      .catch(error => {
        console.error('Error fetching logs:', error);
      });
  }, []);  // Empty dependency array to run this effect only once after the first render

  return (
    <div>
      <h1>Event Logging Dashboard</h1>
      <div>
        <h2>Log Visualization</h2>
        <Line data={chartData} />
      </div>
      <div>
        <h2>Logs</h2>
        <ul>
          {logs.map((log, index) => (
            <li key={index}>
              <strong>{log.event_type}</strong>: {log.timestamp} - {JSON.stringify(log.data_payload)}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

ReactDOM.render(<App />, document.getElementById('root'));
