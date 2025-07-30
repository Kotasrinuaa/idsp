'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

interface GroupedBarChartProps {
  data: any[];
  title: string;
  description?: string;
}

export function GroupedBarChart({ data, title, description }: GroupedBarChartProps) {
  const chartData = {
    labels: data.slice(0, 10).map(item => item.disease),
    datasets: [
      {
        label: 'Cases',
        data: data.slice(0, 10).map(item => item.cases),
        backgroundColor: '#00ffff',
        borderColor: '#00ffff',
        borderWidth: 1,
        borderRadius: 2,
      },
      {
        label: 'Deaths',
        data: data.slice(0, 10).map(item => item.deaths),
        backgroundColor: '#ff007f',
        borderColor: '#ff007f',
        borderWidth: 1,
        borderRadius: 2,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: true,
        labels: {
          color: '#ffffff',
          font: {
            size: 12,
          },
        },
      },
      tooltip: {
        backgroundColor: '#1f2937',
        titleColor: '#9ca3af',
        bodyColor: '#ffffff',
        borderColor: '#374151',
        borderWidth: 1,
        cornerRadius: 8,
        displayColors: true,
      },
    },
    scales: {
      x: {
        grid: {
          color: '#374151',
          drawBorder: false,
        },
        ticks: {
          color: '#9ca3af',
          font: {
            size: 12,
          },
        },
      },
      y: {
        grid: {
          color: '#374151',
          drawBorder: false,
        },
        ticks: {
          color: '#9ca3af',
          font: {
            size: 12,
          },
        },
      },
    },
  };

  return (
    <Card className="col-span-4 border-neon-cyan/20 bg-gray-900/50 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="text-white">{title}</CardTitle>
        {description && <CardDescription className="text-gray-400">{description}</CardDescription>}
      </CardHeader>
      <CardContent>
        <div style={{ height: 350 }}>
          <Bar data={chartData} options={options} />
        </div>
      </CardContent>
    </Card>
  );
}