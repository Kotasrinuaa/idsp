'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { IDSPRecord } from '@/utils/idspUtils';

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

  return (
    <Card className="col-span-4 border-neon-cyan/20 bg-gray-900/50 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="text-white">{title}</CardTitle>
        {description && <CardDescription className="text-gray-400">{description}</CardDescription>}
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={350}>
          <BarChart data={chartData.slice(0, 8)}>
            <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
            <XAxis 
              dataKey="disease"
              fontSize={12}
              tickLine={false}
              axisLine={false}
              angle={-45}
              textAnchor="end"
              height={80}
              tick={{ fill: '#9CA3AF' }}
            />
            <YAxis
              fontSize={12}
              tickLine={false}
              axisLine={false}
              tickFormatter={(value) => `${value}d`}
              label={{ value: 'Days', angle: -90, position: 'insideLeft' }}
              tick={{ fill: '#9CA3AF' }}
            />
            <Tooltip 
              content={({ active, payload, label }) => {
                if (active && payload && payload.length) {
                  const data = payload[0].payload;
                  return (
                    <div className="rounded-lg border border-gray-600 bg-gray-800 p-2 shadow-sm">
                      <div className="grid grid-cols-2 gap-2">
                        <div className="flex flex-col">
                          <span className="text-[0.70rem] uppercase text-gray-400">
                            Disease
                          </span>
                          <span className="font-bold text-white">
                            {label}
                          </span>
                        </div>
                        <div className="flex flex-col">
                          <span className="text-[0.70rem] uppercase text-gray-400">
                            Avg Delay
                          </span>
                          <span className="font-bold" style={{ color: payload[0].color }}>
                            {data.avgDelay} days
                          </span>
                        </div>
                        <div className="flex flex-col">
                          <span className="text-[0.70rem] uppercase text-gray-400">
                            Range
                          </span>
                          <span className="font-bold text-white">
                            {data.minDelay} - {data.maxDelay} days
                          </span>
                        </div>
                        <div className="flex flex-col">
                          <span className="text-[0.70rem] uppercase text-gray-400">
                            Reports
                          </span>
                          <span className="font-bold text-white">
                            {data.count}
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                }
                return null;
              }}
            />
            <Bar dataKey="avgDelay" fill="#ffa500" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}