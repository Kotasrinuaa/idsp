import { IDSPRecord } from './idspUtils';

export interface FilterState {
  years: number[];
  weeks: { min: number; max: number };
  states: string[];
  districts: string[];
  diseases: string[];
  casesRange: { min: number; max: number };
  deathsRange: { min: number; max: number };
  statuses: string[];
}

export const initialFilterState: FilterState = {
  years: [],
  weeks: { min: 1, max: 52 },
  states: [],
  districts: [],
  diseases: [],
  casesRange: { min: 0, max: 1000 },
  deathsRange: { min: 0, max: 100 },
  statuses: [],
};

export function getFilterOptions(data: IDSPRecord[]) {
  const years = [...new Set(data.map(d => d.year))].sort();
  const states = [...new Set(data.map(d => d.state))].sort();
  const districts = [...new Set(data.map(d => d.district))].sort();
  const diseases = [...new Set(data.map(d => d.disease_illness_name))].sort();
  const statuses = [...new Set(data.map(d => d.status))].sort();
  
  const maxCases = Math.max(...data.map(d => d.cases));
  const maxDeaths = Math.max(...data.map(d => d.deaths));
  const minWeek = Math.min(...data.map(d => d.week));
  const maxWeek = Math.max(...data.map(d => d.week));

  return {
    years,
    states,
    districts,
    diseases,
    statuses,
    maxCases,
    maxDeaths,
    minWeek,
    maxWeek,
  };
}

export function getDistrictsByStates(data: IDSPRecord[], selectedStates: string[]): string[] {
  if (selectedStates.length === 0) {
    return [...new Set(data.map(d => d.district))].sort();
  }
  
  return [...new Set(
    data
      .filter(d => selectedStates.includes(d.state))
      .map(d => d.district)
  )].sort();
}

export function applyFilters(data: IDSPRecord[], filters: FilterState): IDSPRecord[] {
  return data.filter(record => {
    // Year filter
    if (filters.years.length > 0 && !filters.years.includes(record.year)) {
      return false;
    }

    // Week filter
    if (record.week < filters.weeks.min || record.week > filters.weeks.max) {
      return false;
    }

    // State filter
    if (filters.states.length > 0 && !filters.states.includes(record.state)) {
      return false;
    }

    // District filter
    if (filters.districts.length > 0 && !filters.districts.includes(record.district)) {
      return false;
    }

    // Disease filter
    if (filters.diseases.length > 0 && !filters.diseases.includes(record.disease_illness_name)) {
      return false;
    }

    // Cases range filter
    if (record.cases < filters.casesRange.min || record.cases > filters.casesRange.max) {
      return false;
    }

    // Deaths range filter
    if (record.deaths < filters.deathsRange.min || record.deaths > filters.deathsRange.max) {
      return false;
    }

    // Status filter
    if (filters.statuses.length > 0 && !filters.statuses.includes(record.status)) {
      return false;
    }

    return true;
  });
}

export function getActiveFiltersCount(filters: FilterState): number {
  let count = 0;
  
  if (filters.years.length > 0) count++;
  if (filters.weeks.min > 1 || filters.weeks.max < 52) count++;
  if (filters.states.length > 0) count++;
  if (filters.districts.length > 0) count++;
  if (filters.diseases.length > 0) count++;
  if (filters.casesRange.min > 0 || filters.casesRange.max < 1000) count++;
  if (filters.deathsRange.min > 0 || filters.deathsRange.max < 100) count++;
  if (filters.statuses.length > 0) count++;
  
  return count;
}