'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { TimeSeriesData } from '@/utils/idspUtils';

interface LineChartComponentProps {
  data: TimeSeriesData[];
  title: string;
  description?: string;
}

export function LineChartComponent({ data, title, description }: LineChartComponentProps) {
  return (
    <Card className="col-span-4 border-neon-cyan/20 bg-gray-900/50 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="text-white">{title}</CardTitle>
        {description && <CardDescription className="text-gray-400">{description}</CardDescription>}
      </CardHeader>
      <CardContent className="pl-2">
        <ResponsiveContainer width="100%" height={350}>
          <LineChart data={data} className="[&_.recharts-cartesian-grid-horizontal>line]:stroke-gray-700 [&_.recharts-cartesian-grid-vertical>line]:stroke-gray-700">
            <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
            <XAxis 
              dataKey="period" 
              fontSize={12}
              tickLine={false}
              axisLine={false}
              tick={{ fill: '#9CA3AF' }}
            />
            <YAxis
              fontSize={12}
              tickLine={false}
              axisLine={false}
              tickFormatter={(value) => `${value}`}
              tick={{ fill: '#9CA3AF' }}
            />
            <Tooltip 
              content={({ active, payload, label }) => {
                if (active && payload && payload.length) {
                  return (
                    <div className="rounded-lg border border-gray-600 bg-gray-800 p-2 shadow-sm">
                      <div className="grid grid-cols-2 gap-2">
                        <div className="flex flex-col">
                          <span className="text-[0.70rem] uppercase text-gray-400">
                            Period
                          </span>
                          <span className="font-bold text-white">
                            {label}
                          </span>
                        </div>
                        {payload.map((entry, index) => (
                          <div key={index} className="flex flex-col">
                            <span className="text-[0.70rem] uppercase text-gray-400">
                              {entry.dataKey}
                            </span>
                            <span className="font-bold" style={{ color: entry.color }}>
                              {entry.value}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                }
                return null;
              }}
            />
            <Legend />
            <Line
              type="monotone"
              dataKey="cases"
              strokeWidth={2}
              stroke="#00ffff"
              name="Cases"
              dot={{ fill: "#00ffff" }}
            />
            <Line
              type="monotone"
              dataKey="deaths"
              strokeWidth={2}
              stroke="#ff007f"
              name="Deaths"
              dot={{ fill: "#ff007f" }}
            />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}