'use client';

import { useMemo } from 'react';
import { IDSPRecord } from '@/utils/idspUtils';
import { FilterState, applyFilters } from '@/utils/filterUtils';

export function useFilteredData(data: IDSPRecord[], filters: FilterState) {
  const filteredData = useMemo(() => {
    return applyFilters(data, filters);
  }, [data, filters]);

  return filteredData;
}