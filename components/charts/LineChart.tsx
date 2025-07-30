'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import { TimeSeriesData } from '@/utils/idspUtils';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

interface LineChartComponentProps {
  data: TimeSeriesData[];
  title: string;
  description?: string;
}

export function LineChartComponent({ data, title, description }: LineChartComponentProps) {
  const chartData = {
    labels: data.map(item => item.period),
    datasets: [
      {
        label: 'Cases',
        data: data.map(item => item.cases),
        borderColor: '#00ffff',
        backgroundColor: '#00ffff',
        borderWidth: 2,
        pointBackgroundColor: '#00ffff',
        pointBorderColor: '#00ffff',
        pointRadius: 4,
        tension: 0.1,
      },
      {
        label: 'Deaths',
        data: data.map(item => item.deaths),
        borderColor: '#ff007f',
        backgroundColor: '#ff007f',
        borderWidth: 2,
        pointBackgroundColor: '#ff007f',
        pointBorderColor: '#ff007f',
        pointRadius: 4,
        tension: 0.1,
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
      <CardContent className="pl-2">
        <div style={{ height: 350 }}>
          <Line data={chartData} options={options} />
        </div>
      </CardContent>
    </Card>
  );
}