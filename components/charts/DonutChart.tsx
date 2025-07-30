'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';

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

  return (
    <Card className="col-span-3 border-neon-cyan/20 bg-gray-900/50 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="text-white">{title}</CardTitle>
        {description && <CardDescription className="text-gray-400">{description}</CardDescription>}
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={350}>
          <PieChart>
            <Pie
              data={chartData}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={120}
              paddingAngle={2}
              dataKey={dataKey}
              nameKey={nameKey}
            >
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip 
              content={({ active, payload }) => {
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
                            {data[nameKey]}
                          </span>
                        </div>
                        <div className="flex flex-col">
                          <span className="text-[0.70rem] uppercase text-gray-400">
                            Cases
                          </span>
                          <span className="font-bold" style={{ color: payload[0].color }}>
                            {data[dataKey]}
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                }
                return null;
              }}
            />
            <Legend 
              verticalAlign="bottom" 
              height={36}
              formatter={(value) => value.length > 15 ? `${value.substring(0, 15)}...` : value}
              wrapperStyle={{ color: '#ffffff' }}
            />
          </PieChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}