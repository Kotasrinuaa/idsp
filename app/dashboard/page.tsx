'use client';

import { useEffect, useState, useMemo } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { SidebarFilters } from '@/components/SidebarFilters';
import { StatCard } from '@/components/StatCard';
import { LineChartComponent } from '@/components/charts/LineChart';
import { BarChartComponent } from '@/components/charts/BarChart';
import { DonutChart } from '@/components/charts/DonutChart';
import { GroupedBarChart } from '@/components/charts/GroupedBarChart';
import { DelayBoxPlot } from '@/components/charts/DelayBoxPlot';
import { InsightsTab } from '@/components/insights/InsightsTab';
import { useFilteredData } from '@/hooks/useFilteredData';
import { 
  parseCSVData, 
  calculateDashboardStats, 
  getDiseaseData, 
  getStateData, 
  getTimeSeriesData,
  generateInsights,
  IDSPRecord 
} from '@/utils/idspUtils';
import { FilterState, initialFilterState, getFilterOptions } from '@/utils/filterUtils';
import { Activity, Skull, Clock, Brush as Virus, MapPin, Calendar, BarChart3, PieChart, TrendingUp, AlertTriangle, RefreshCw } from 'lucide-react';

export default function Dashboard() {
  const [data, setData] = useState<IDSPRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [granularity, setGranularity] = useState<'weekly' | 'monthly'>('weekly');
  const [filters, setFilters] = useState<FilterState>(initialFilterState);
  
  const filteredData = useFilteredData(data, filters);

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    if (data.length > 0) {
      const options = getFilterOptions(data);
      setFilters(prev => ({
        ...prev,
        weeks: { min: options.minWeek, max: options.maxWeek },
        casesRange: { min: 0, max: options.maxCases },
        deathsRange: { min: 0, max: options.maxDeaths },
      }));
    }
  }, [data]);

  const loadData = async () => {
    try {
      setLoading(true);
      const response = await fetch('/data/sample-idsp.csv');
      const csvText = await response.text();
      const parsedData = parseCSVData(csvText);
      setData(parsedData);
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-black">
        <div className="flex items-center gap-2">
          <RefreshCw className="h-6 w-6 animate-spin text-neon-cyan" />
          <span className="text-white">Loading health surveillance data...</span>
        </div>
      </div>
    );
  }

  const stats = calculateDashboardStats(filteredData);
  const diseaseData = getDiseaseData(filteredData);
  const stateData = getStateData(filteredData);
  const timeSeriesData = getTimeSeriesData(filteredData, granularity);
  const insights = generateInsights(filteredData);

  return (
    <div className="flex h-screen bg-black">
      {/* Left Sidebar - Filters */}
      <div className="w-80 min-w-[320px] border-r border-gray-800 bg-gray-950/50">
        <SidebarFilters
          data={data}
          filters={filters}
          onFiltersChange={setFilters}
          className="h-full"
        />
      </div>

      {/* Right Main Content */}
      <div className="flex-1 overflow-y-auto">
        <div className="space-y-4 p-4 md:p-8 pt-6">
          <div className="flex items-center justify-between space-y-2">
            <div>
              <h2 className="text-3xl font-bold tracking-tight text-white">
                IDSP Health Surveillance Dashboard
              </h2>
              <p className="text-gray-400">
                Comprehensive analysis of disease surveillance data across Indian states and districts
              </p>
            </div>
            <div className="flex items-center space-x-2">
              <Badge variant="outline" className="px-3 py-1 border-neon-cyan/30 text-neon-cyan">
                <Activity className="h-3 w-3 mr-1" />
                {filteredData.length} / {data.length} Records
              </Badge>
              <Button 
                onClick={loadData} 
                variant="outline" 
                size="sm"
                className="border-gray-600 hover:border-neon-cyan hover:text-neon-cyan"
              >
                <RefreshCw className="h-4 w-4 mr-2" />
                Refresh
              </Button>
            </div>
          </div>

          <Tabs defaultValue="overview" className="space-y-4">
            <TabsList className="grid w-full grid-cols-3 bg-gray-900/50 border border-gray-700">
              <TabsTrigger 
                value="overview" 
                className="flex items-center gap-2 data-[state=active]:bg-neon-cyan/20 data-[state=active]:text-neon-cyan"
              >
                <BarChart3 className="h-4 w-4" />
                Overview
              </TabsTrigger>
              <TabsTrigger 
                value="analytics" 
                className="flex items-center gap-2 data-[state=active]:bg-neon-cyan/20 data-[state=active]:text-neon-cyan"
              >
                <PieChart className="h-4 w-4" />
                Analytics
              </TabsTrigger>
              <TabsTrigger 
                value="insights" 
                className="flex items-center gap-2 data-[state=active]:bg-neon-cyan/20 data-[state=active]:text-neon-cyan"
              >
                <TrendingUp className="h-4 w-4" />
                Insights
              </TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-4">
              {/* Stats Cards */}
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
                <StatCard
                  title="Total Cases"
                  value={stats.totalCases.toLocaleString()}
                  description="Across all diseases and states"
                  icon={Activity}
                  className="shadow-lg shadow-neon-cyan/10"
                />
                <StatCard
                  title="Total Deaths"
                  value={stats.totalDeaths.toLocaleString()}
                  description="Mortality across all outbreaks"
                  icon={Skull}
                  className="shadow-lg shadow-neon-pink/10"
                />
                <StatCard
                  title="Avg Reporting Delay"
                  value={`${stats.avgReportingDelay} days`}
                  description="Time between outbreak and report"
                  icon={Clock}
                  className="shadow-lg shadow-neon-orange/10"
                />
                <StatCard
                  title="Most Common Disease"
                  value={stats.mostCommonDisease || 'N/A'}
                  description="Highest case count overall"
                  icon={Virus}
                  className="shadow-lg shadow-neon-green/10"
                />
                <StatCard
                  title="Most Affected State"
                  value={stats.mostAffectedState || 'N/A'}
                  description="Highest total case burden"
                  icon={MapPin}
                  className="shadow-lg shadow-neon-purple/10"
                />
              </div>

              {/* Time Series Chart */}
              <div className="grid gap-4 md:grid-cols-7">
                <Card className="col-span-7 border-neon-cyan/20 bg-gray-900/50 backdrop-blur-sm">
                  <CardHeader className="flex flex-row items-center justify-between">
                    <div>
                      <CardTitle className="text-white">Cases and Deaths Over Time</CardTitle>
                      <CardDescription className="text-gray-400">
                        Temporal trends in disease surveillance data
                      </CardDescription>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant={granularity === 'weekly' ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => setGranularity('weekly')}
                        className={granularity === 'weekly' 
                          ? 'bg-neon-cyan/20 text-neon-cyan border-neon-cyan/30' 
                          : 'border-gray-600 hover:border-neon-cyan hover:text-neon-cyan'
                        }
                      >
                        <Calendar className="h-4 w-4 mr-1" />
                        Weekly
                      </Button>
                      <Button
                        variant={granularity === 'monthly' ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => setGranularity('monthly')}
                        className={granularity === 'monthly' 
                          ? 'bg-neon-cyan/20 text-neon-cyan border-neon-cyan/30' 
                          : 'border-gray-600 hover:border-neon-cyan hover:text-neon-cyan'
                        }
                      >
                        <Calendar className="h-4 w-4 mr-1" />
                        Monthly
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent className="pl-2">
                    <LineChartComponent
                      data={timeSeriesData}
                      title=""
                    />
                  </CardContent>
                </Card>
              </div>

              {/* Bar Charts */}
              <div className="grid gap-4 md:grid-cols-7">
                <BarChartComponent
                  data={diseaseData}
                  title="Top Diseases by Cases"
                  description="Most reported diseases across all states"
                  dataKey="cases"
                  nameKey="disease"
                  color="#00ffff"
                />
                <BarChartComponent
                  data={stateData}
                  title="Top States by Cases"
                  description="States with highest disease burden"
                  dataKey="cases"
                  nameKey="state"
                  color="#ff007f"
                />
              </div>
            </TabsContent>

            <TabsContent value="analytics" className="space-y-4">
              {/* Donut and Grouped Charts */}
              <div className="grid gap-4 md:grid-cols-7">
                <DonutChart
                  data={diseaseData}
                  title="Disease Distribution"
                  description="Proportion of cases by disease type"
                  dataKey="cases"
                  nameKey="disease"
                />
                <GroupedBarChart
                  data={diseaseData}
                  title="Cases vs Deaths by Disease"
                  description="Comparative analysis of morbidity and mortality"
                />
              </div>

              {/* Reporting Delay Analysis */}
              <div className="grid gap-4 md:grid-cols-7">
                <DelayBoxPlot
                  data={filteredData}
                  title="Reporting Delay Analysis"
                  description="Average delay between outbreak start and reporting by disease"
                />
                <Card className="col-span-3 border-neon-cyan/20 bg-gray-900/50 backdrop-blur-sm">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-white">
                      <AlertTriangle className="h-5 w-5 text-neon-orange" />
                      Surveillance Quality Metrics
                    </CardTitle>
                    <CardDescription className="text-gray-400">
                      Key indicators of surveillance system performance
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid gap-4">
                      <div className="flex items-center justify-between p-3 bg-gray-800/50 rounded-lg border border-gray-700">
                        <div>
                          <p className="text-sm font-medium text-white">Timely Reporting Rate</p>
                          <p className="text-xs text-gray-400">Reports within 3 days</p>
                        </div>
                        <Badge variant="secondary" className="bg-neon-cyan/20 text-neon-cyan border-neon-cyan/30">
                          {filteredData.length > 0 ? Math.round((filteredData.filter(d => (d.reporting_delay || 0) <= 3).length / filteredData.length) * 100) : 0}%
                        </Badge>
                      </div>
                      <div className="flex items-center justify-between p-3 bg-gray-800/50 rounded-lg border border-gray-700">
                        <div>
                          <p className="text-sm font-medium text-white">Case Fatality Rate</p>
                          <p className="text-xs text-gray-400">Overall mortality percentage</p>
                        </div>
                        <Badge variant="destructive" className="bg-red-900/50 text-red-300 border-red-700">
                          {stats.totalCases > 0 ? ((stats.totalDeaths / stats.totalCases) * 100).toFixed(1) : 0}%
                        </Badge>
                      </div>
                      <div className="flex items-center justify-between p-3 bg-gray-800/50 rounded-lg border border-gray-700">
                        <div>
                          <p className="text-sm font-medium text-white">Active Surveillance</p>
                          <p className="text-xs text-gray-400">States reporting this period</p>
                        </div>
                        <Badge variant="default" className="bg-neon-green/20 text-neon-green border-neon-green/30">
                          {new Set(filteredData.map(d => d.state)).size} States
                        </Badge>
                      </div>
                      <div className="flex items-center justify-between p-3 bg-gray-800/50 rounded-lg border border-gray-700">
                        <div>
                          <p className="text-sm font-medium text-white">Disease Coverage</p>
                          <p className="text-xs text-gray-400">Unique diseases tracked</p>
                        </div>
                        <Badge variant="outline" className="border-gray-600 text-gray-300">
                          {new Set(filteredData.map(d => d.disease_illness_name)).size} Diseases
                        </Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="insights" className="space-y-4">
              <InsightsTab insights={insights} />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}