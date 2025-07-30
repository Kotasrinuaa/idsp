import { format, parseISO, differenceInDays } from 'date-fns';

export interface IDSPRecord {
  year: number;
  week: number;
  outbreak_starting_date: string;
  reporting_date: string;
  state: string;
  district: string;
  disease_illness_name: string;
  status: string;
  cases: number;
  deaths: number;
  reporting_delay?: number;
}

export interface DashboardStats {
  totalCases: number;
  totalDeaths: number;
  avgReportingDelay: number;
  mostCommonDisease: string;
  mostAffectedState: string;
}

export interface DiseaseData {
  disease: string;
  cases: number;
  deaths: number;
  mortalityRate: number;
}

export interface StateData {
  state: string;
  cases: number;
  deaths: number;
}

export interface TimeSeriesData {
  period: string;
  cases: number;
  deaths: number;
  [key: string]: any;
}

export function parseCSVData(csvText: string): IDSPRecord[] {
  const lines = csvText.trim().split('\n');
  const headers = lines[0].split(',');
  
  return lines.slice(1).map(line => {
    const values = line.split(',');
    const record: any = {};
    
    headers.forEach((header, index) => {
      const value = values[index]?.trim();
      if (header === 'year' || header === 'week' || header === 'cases' || header === 'deaths') {
        record[header] = parseInt(value) || 0;
      } else {
        record[header] = value;
      }
    });
    
    // Calculate reporting delay
    if (record.outbreak_starting_date && record.reporting_date) {
      try {
        const outbreakDate = parseISO(record.outbreak_starting_date);
        const reportingDate = parseISO(record.reporting_date);
        record.reporting_delay = differenceInDays(reportingDate, outbreakDate);
      } catch (error) {
        record.reporting_delay = 0;
      }
    }
    
    return record as IDSPRecord;
  });
}

export function calculateDashboardStats(data: IDSPRecord[]): DashboardStats {
  const totalCases = data.reduce((sum, record) => sum + record.cases, 0);
  const totalDeaths = data.reduce((sum, record) => sum + record.deaths, 0);
  
  const validDelays = data.filter(record => record.reporting_delay !== undefined);
  const avgReportingDelay = validDelays.length > 0 
    ? validDelays.reduce((sum, record) => sum + (record.reporting_delay || 0), 0) / validDelays.length
    : 0;
  
  // Most common disease
  const diseaseCount: { [key: string]: number } = {};
  data.forEach(record => {
    diseaseCount[record.disease_illness_name] = (diseaseCount[record.disease_illness_name] || 0) + record.cases;
  });
  const mostCommonDisease = Object.keys(diseaseCount).length > 0 
    ? Object.keys(diseaseCount).reduce((a, b) => 
        diseaseCount[a] > diseaseCount[b] ? a : b
      )
    : 'No data';
  
  // Most affected state
  const stateCount: { [key: string]: number } = {};
  data.forEach(record => {
    stateCount[record.state] = (stateCount[record.state] || 0) + record.cases;
  });
  const mostAffectedState = Object.keys(stateCount).length > 0 
    ? Object.keys(stateCount).reduce((a, b) => 
        stateCount[a] > stateCount[b] ? a : b
      )
    : 'No data';
  
  return {
    totalCases,
    totalDeaths,
    avgReportingDelay: Math.round(avgReportingDelay * 10) / 10,
    mostCommonDisease,
    mostAffectedState
  };
}

export function getDiseaseData(data: IDSPRecord[]): DiseaseData[] {
  const diseaseMap: { [key: string]: { cases: number; deaths: number } } = {};
  
  data.forEach(record => {
    if (!diseaseMap[record.disease_illness_name]) {
      diseaseMap[record.disease_illness_name] = { cases: 0, deaths: 0 };
    }
    diseaseMap[record.disease_illness_name].cases += record.cases;
    diseaseMap[record.disease_illness_name].deaths += record.deaths;
  });
  
  return Object.entries(diseaseMap)
    .map(([disease, stats]) => ({
      disease,
      cases: stats.cases,
      deaths: stats.deaths,
      mortalityRate: stats.cases > 0 ? (stats.deaths / stats.cases) * 100 : 0
    }))
    .sort((a, b) => b.cases - a.cases);
}

export function getStateData(data: IDSPRecord[]): StateData[] {
  const stateMap: { [key: string]: { cases: number; deaths: number } } = {};
  
  data.forEach(record => {
    if (!stateMap[record.state]) {
      stateMap[record.state] = { cases: 0, deaths: 0 };
    }
    stateMap[record.state].cases += record.cases;
    stateMap[record.state].deaths += record.deaths;
  });
  
  return Object.entries(stateMap)
    .map(([state, stats]) => ({
      state,
      cases: stats.cases,
      deaths: stats.deaths
    }))
    .sort((a, b) => b.cases - a.cases);
}

export function getTimeSeriesData(data: IDSPRecord[], granularity: 'weekly' | 'monthly' = 'weekly'): TimeSeriesData[] {
  const timeMap: { [key: string]: { cases: number; deaths: number } } = {};
  
  data.forEach(record => {
    let period: string;
    if (granularity === 'weekly') {
      period = `${record.year}-W${record.week.toString().padStart(2, '0')}`;
    } else {
      // Monthly - approximate month from week
      const month = Math.ceil(record.week / 4.33);
      period = `${record.year}-${month.toString().padStart(2, '0')}`;
    }
    
    if (!timeMap[period]) {
      timeMap[period] = { cases: 0, deaths: 0 };
    }
    timeMap[period].cases += record.cases;
    timeMap[period].deaths += record.deaths;
  });
  
  return Object.entries(timeMap)
    .map(([period, stats]) => ({
      period,
      cases: stats.cases,
      deaths: stats.deaths
    }))
    .sort((a, b) => a.period.localeCompare(b.period));
}

export function generateInsights(data: IDSPRecord[]): string[] {
  const insights: string[] = [];
  
  // Disease prevalence by state
  const stateDisease: { [key: string]: { [key: string]: number } } = {};
  data.forEach(record => {
    if (!stateDisease[record.state]) {
      stateDisease[record.state] = {};
    }
    stateDisease[record.state][record.disease_illness_name] = 
      (stateDisease[record.state][record.disease_illness_name] || 0) + record.cases;
  });
  
  // Find top disease per state
  Object.entries(stateDisease).forEach(([state, diseases]) => {
    if (Object.keys(diseases).length > 0) {
      const topDisease = Object.entries(diseases).reduce((a, b) => 
        diseases[a[0]] > diseases[b[0]] ? a : b
      );
      if (topDisease[1] > 20) {
        insights.push(`${topDisease[0]} is most prevalent in ${state} with ${topDisease[1]} cases reported`);
      }
    }
  });
  
  // Reporting delay analysis
  const stateDelays: { [key: string]: number[] } = {};
  data.forEach(record => {
    if (record.reporting_delay !== undefined) {
      if (!stateDelays[record.state]) {
        stateDelays[record.state] = [];
      }
      stateDelays[record.state].push(record.reporting_delay);
    }
  });
  
  Object.entries(stateDelays).forEach(([state, delays]) => {
    const avgDelay = delays.reduce((sum, delay) => sum + delay, 0) / delays.length;
    if (avgDelay > 3) {
      insights.push(`Average reporting delay in ${state} is ${avgDelay.toFixed(1)} days, indicating potential surveillance gaps`);
    }
  });
  
  // High mortality diseases
  const diseaseData = getDiseaseData(data);
  diseaseData.forEach(disease => {
    if (disease.mortalityRate > 5 && disease.cases > 10) {
      insights.push(`${disease.disease} shows concerning mortality rate of ${disease.mortalityRate.toFixed(1)}% with ${disease.cases} total cases`);
    }
  });
  
  return insights.slice(0, 8); // Limit to top 8 insights
}