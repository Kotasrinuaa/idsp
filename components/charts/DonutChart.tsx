'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
} from 'chart.js';
import { Doughnut } from 'react-chartjs-2';

ChartJS.register(
  ArcElement,
  Tooltip,
  Legend
);

interface DonutChartProps {
  data: any[];
  title: string;
  description?: string;
  dataKey: string;
  nameKey: string;
}

const COLORS = [
  '#00ffff',
  '#ff007f',
  '#ffa500',
  '#00ff00',
  '#8a2be2',
  '#ff1493',
  '#00ced1',
  '#ffd700',
  '#ff4500',
  '#32cd32'
];

export function DonutChart({ data, title, description, dataKey, nameKey }: DonutChartProps) {
  const chartData = data.slice(0, 8); // Limit to top 8 for better visualization

  const chartConfig = {
    labels: chartData.map(item => item[nameKey]),
    datasets: [
      {
        data: chartData.map(item => item[dataKey]),
        backgroundColor: COLORS.slice(0, chartData.length),
        borderColor: COLORS.slice(0, chartData.length),
        borderWidth: 2,
        cutout: '60%',
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom' as const,
        labels: {
          color: '#ffffff',
          font: {
            size: 12,
          },
          generateLabels: function(chart: any) {
            const data = chart.data;
            if (data.labels.length && data.datasets.length) {
              return data.labels.map((label: string, i: number) => {
                const value = data.datasets[0].data[i];
                const displayLabel = label.length > 15 ? `${label.substring(0, 15)}...` : label;
                return {
                  text: displayLabel,
                  fillStyle: data.datasets[0].backgroundColor[i],
                  strokeStyle: data.datasets[0].backgroundColor[i],
                  lineWidth: 0,
                  hidden: false,
                  index: i,
                };
              });
            }
            return [];
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
        callbacks: {
          label: function(context: any) {
            const label = context.label || '';
            const value = context.parsed;
            return `${label}: ${value}`;
          }
        }
      },
    },
  };

  return (
    <Card className="col-span-3 border-neon-cyan/20 bg-gray-900/50 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="text-white">{title}</CardTitle>
        {description && <CardDescription className="text-gray-400">{description}</CardDescription>}
      </CardHeader>
      <CardContent>
        <div style={{ height: 350 }}>
          <Doughnut data={chartConfig} options={options} />
        </div>
      </CardContent>
    </Card>
  );
}