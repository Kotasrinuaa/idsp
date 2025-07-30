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
import { IDSPRecord } from '@/utils/idspUtils';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

interface DelayBoxPlotProps {
  data: IDSPRecord[];
  title: string;
  description?: string;
}

export function DelayBoxPlot({ data, title, description }: DelayBoxPlotProps) {
  // Calculate delay statistics by disease
  const delayStats = data.reduce((acc, record) => {
    if (record.reporting_delay !== undefined) {
      if (!acc[record.disease_illness_name]) {
        acc[record.disease_illness_name] = [];
      }
      acc[record.disease_illness_name].push(record.reporting_delay);
    }
    return acc;
  }, {} as { [key: string]: number[] });

  const chartData = Object.entries(delayStats).map(([disease, delays]) => {
    delays.sort((a, b) => a - b);
    const avg = delays.reduce((sum, delay) => sum + delay, 0) / delays.length;
    const max = Math.max(...delays);
    const min = Math.min(...delays);
    
    return {
      disease: disease.length > 12 ? `${disease.substring(0, 12)}...` : disease,
      avgDelay: Math.round(avg * 10) / 10,
      maxDelay: max,
      minDelay: min,
      count: delays.length
    };
  }).sort((a, b) => b.avgDelay - a.avgDelay);

  const chartConfig = {
    labels: chartData.slice(0, 8).map(item => item.disease),
    datasets: [
      {
        label: 'Average Delay (days)',
        data: chartData.slice(0, 8).map(item => item.avgDelay),
        backgroundColor: '#ffa500',
        borderColor: '#ffa500',
        borderWidth: 1,
        borderRadius: 4,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        backgroundColor: '#1f2937',
        titleColor: '#9ca3af',
        bodyColor: '#ffffff',
        borderColor: '#374151',
        borderWidth: 1,
        cornerRadius: 8,
        displayColors: false,
        callbacks: {
          afterBody: function(context: any) {
            const dataIndex = context[0].dataIndex;
            const data = chartData[dataIndex];
            return [
              `Range: ${data.minDelay} - ${data.maxDelay} days`,
              `Reports: ${data.count}`
            ];
          }
        }
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
          callback: function(value: any) {
            return value + 'd';
          }
        },
        title: {
          display: true,
          text: 'Days',
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
          <Bar data={chartConfig} options={options} />
        </div>
      </CardContent>
    </Card>
  );
}