import React, { useState } from "react";
import {
  Box,
  Container,
  Paper,
  Typography,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Grid,
} from "@mui/material";
import { Bar, Line, Pie } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  PointElement,
  LineElement,
  ArcElement,
} from "chart.js";
import axios from "axios";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  PointElement,
  LineElement,
  ArcElement
);

const Dashboard: React.FC = () => {
  const [, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<any[]>([]);
  const [columns, setColumns] = useState<string[]>([]);
  const [chartType, setChartType] = useState<string>("bar");
  const [xColumn, setXColumn] = useState<string>("");
  const [chartData, setChartData] = useState<any>(null);
  const [fileId, setFileId] = useState<number | null>(null);

  const handleFileUpload = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setFile(file);
    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await axios.post(
        "http://localhost:3001/data/upload",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      setFileId(response.data.id);
      setPreview(response.data.preview);
      setColumns(response.data.columns);
    } catch (error) {
      console.error("Error uploading file:", error);
    }
  };

  const handleChartGeneration = async () => {
    if (!fileId || !xColumn) return;

    try {
      const response = await axios.get(
        `http://localhost:3001/data/${fileId}/chart`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          params: {
            chartType,
            xColumn,
          },
        }
      );
      setChartData(response.data);
    } catch (error) {
      console.error("Error generating chart:", error);
    }
  };

  const handleDownload = async () => {
    if (!fileId) return;

    try {
      const response = await axios.get(
        `http://localhost:3001/data/${fileId}/download`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          responseType: "blob",
        }
      );

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "processed_data.csv");
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      console.error("Error downloading file:", error);
    }
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Grid container spacing={3}>
        <Grid size={12}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Upload Data File
            </Typography>
            <input
              accept=".csv,.xlsx"
              style={{ display: "none" }}
              id="raised-button-file"
              type="file"
              onChange={handleFileUpload}
            />
            <label htmlFor="raised-button-file">
              <Button variant="contained" component="span">
                Upload File
              </Button>
            </label>
          </Paper>
        </Grid>

        {preview.length > 0 && (
          <>
            <Grid size={12}>
              <Paper sx={{ p: 2 }}>
                <Typography variant="h6" gutterBottom>
                  Data Preview
                </Typography>
                <TableContainer>
                  <Table>
                    <TableHead>
                      <TableRow>
                        {columns.map((column) => (
                          <TableCell key={column}>{column}</TableCell>
                        ))}
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {preview.map((row, index) => (
                        <TableRow key={index}>
                          {columns.map((column, index) => (
                            <TableCell key={`${index}-${column}`}>
                              {row[index]}
                            </TableCell>
                          ))}
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </Paper>
            </Grid>

            <Grid size={12}>
              <Paper sx={{ p: 2 }}>
                <Typography variant="h6" gutterBottom>
                  Data Visualization
                </Typography>
                <Box sx={{ mb: 2 }}>
                  <FormControl sx={{ minWidth: 120, mr: 2 }}>
                    <InputLabel>Chart Type</InputLabel>
                    <Select
                      value={chartType}
                      label="Chart Type"
                      onChange={(e) => setChartType(e.target.value)}
                    >
                      <MenuItem value="bar">Bar Chart</MenuItem>
                      <MenuItem value="line">Line Chart</MenuItem>
                      <MenuItem value="pie">Pie Chart</MenuItem>
                    </Select>
                  </FormControl>
                  <FormControl sx={{ minWidth: 120, mr: 2 }}>
                    <InputLabel>Column</InputLabel>
                    <Select
                      value={xColumn}
                      label="X Axis"
                      onChange={(e) => setXColumn(e.target.value)}
                    >
                      {columns.map((column) => (
                        <MenuItem key={column} value={column}>
                          {column}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                  <Button
                    variant="contained"
                    onClick={handleChartGeneration}
                    disabled={!xColumn}
                  >
                    Generate Chart
                  </Button>
                </Box>
                {chartData && (
                  <Box sx={{ height: 400 }}>
                    {chartType === "bar" && <Bar data={chartData.data} />}
                    {chartType === "line" && <Line data={chartData.data} />}
                    {chartType === "pie" && <Pie data={chartData.data} />}
                  </Box>
                )}
              </Paper>
            </Grid>

            <Grid size={12}>
              <Paper sx={{ p: 2 }}>
                <Button variant="contained" onClick={handleDownload}>
                  Download Processed Data
                </Button>
              </Paper>
            </Grid>
          </>
        )}
      </Grid>
    </Container>
  );
};

export default Dashboard;
