'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Filter, X, ChevronDown, Calendar, MapPin, Building, Brush as Virus, Activity, Skull, CheckSquare, RotateCcw } from 'lucide-react';
import { IDSPRecord } from '@/utils/idspUtils';
import { FilterState, initialFilterState, getFilterOptions, getDistrictsByStates, getActiveFiltersCount } from '@/utils/filterUtils';

interface SidebarFiltersProps {
  data: IDSPRecord[];
  filters: FilterState;
  onFiltersChange: (filters: FilterState) => void;
  className?: string;
}

export function SidebarFilters({ data, filters, onFiltersChange, className = "" }: SidebarFiltersProps) {
  const [openSections, setOpenSections] = useState<{ [key: string]: boolean }>({
    years: true,
    weeks: false,
    location: false,
    disease: false,
    metrics: false,
    status: false,
  });

  const filterOptions = getFilterOptions(data);
  const availableDistricts = getDistrictsByStates(data, filters.states);
  const activeFiltersCount = getActiveFiltersCount(filters);

  const toggleSection = (section: string) => {
    setOpenSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const handleYearChange = (year: number, checked: boolean) => {
    const newYears = checked 
      ? [...filters.years, year]
      : filters.years.filter(y => y !== year);
    
    onFiltersChange({ ...filters, years: newYears });
  };

  const handleStateChange = (state: string, checked: boolean) => {
    const newStates = checked 
      ? [...filters.states, state]
      : filters.states.filter(s => s !== state);
    
    // Clear districts if no states selected or if removing a state
    const newDistricts = newStates.length === 0 
      ? [] 
      : filters.districts.filter(d => getDistrictsByStates(data, newStates).includes(d));
    
    onFiltersChange({ 
      ...filters, 
      states: newStates,
      districts: newDistricts
    });
  };

  const handleDistrictChange = (district: string, checked: boolean) => {
    const newDistricts = checked 
      ? [...filters.districts, district]
      : filters.districts.filter(d => d !== district);
    
    onFiltersChange({ ...filters, districts: newDistricts });
  };

  const handleDiseaseChange = (disease: string, checked: boolean) => {
    const newDiseases = checked 
      ? [...filters.diseases, disease]
      : filters.diseases.filter(d => d !== disease);
    
    onFiltersChange({ ...filters, diseases: newDiseases });
  };

  const handleStatusChange = (status: string, checked: boolean) => {
    const newStatuses = checked 
      ? [...filters.statuses, status]
      : filters.statuses.filter(s => s !== status);
    
    onFiltersChange({ ...filters, statuses: newStatuses });
  };

  const clearAllFilters = () => {
    onFiltersChange({
      ...initialFilterState,
      weeks: { min: filterOptions.minWeek, max: filterOptions.maxWeek },
      casesRange: { min: 0, max: filterOptions.maxCases },
      deathsRange: { min: 0, max: filterOptions.maxDeaths },
    });
  };

  return (
    <Card className={`h-full border-neon-cyan/20 bg-gray-900/50 backdrop-blur-sm ${className}`}>
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center justify-between text-neon-cyan">
          <div className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Filters
          </div>
          {activeFiltersCount > 0 && (
            <Badge variant="secondary" className="bg-neon-pink/20 text-neon-pink border-neon-pink/30">
              {activeFiltersCount}
            </Badge>
          )}
        </CardTitle>
      </CardHeader>
      
      <CardContent className="p-0">
        <ScrollArea className="h-[calc(100vh-200px)]">
          <div className="px-6 space-y-4">
            
            {/* Year Filter */}
            <Collapsible open={openSections.years} onOpenChange={() => toggleSection('years')}>
              <CollapsibleTrigger className="flex w-full items-center justify-between py-2 hover:text-neon-cyan transition-colors">
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  <span className="font-medium">Year</span>
                </div>
                <ChevronDown className={`h-4 w-4 transition-transform ${openSections.years ? 'rotate-180' : ''}`} />
              </CollapsibleTrigger>
              <CollapsibleContent className="space-y-2 pt-2">
                <div className="grid grid-cols-2 gap-2">
                  {filterOptions.years.map(year => (
                    <div key={year} className="flex items-center space-x-2">
                      <Checkbox
                        id={`year-${year}`}
                        checked={filters.years.includes(year)}
                        onCheckedChange={(checked) => handleYearChange(year, checked as boolean)}
                        className="border-gray-600 data-[state=checked]:bg-neon-cyan data-[state=checked]:border-neon-cyan"
                      />
                      <Label htmlFor={`year-${year}`} className="text-sm cursor-pointer">
                        {year}
                      </Label>
                    </div>
                  ))}
                </div>
              </CollapsibleContent>
            </Collapsible>

            <Separator className="bg-gray-700" />

            {/* Week Range Filter */}
            <Collapsible open={openSections.weeks} onOpenChange={() => toggleSection('weeks')}>
              <CollapsibleTrigger className="flex w-full items-center justify-between py-2 hover:text-neon-cyan transition-colors">
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  <span className="font-medium">Week Range</span>
                </div>
                <ChevronDown className={`h-4 w-4 transition-transform ${openSections.weeks ? 'rotate-180' : ''}`} />
              </CollapsibleTrigger>
              <CollapsibleContent className="space-y-3 pt-2">
                <div className="px-2">
                  <Slider
                    value={[filters.weeks.min, filters.weeks.max]}
                    onValueChange={([min, max]) => 
                      onFiltersChange({ ...filters, weeks: { min, max } })
                    }
                    min={filterOptions.minWeek}
                    max={filterOptions.maxWeek}
                    step={1}
                    className="w-full"
                  />
                  <div className="flex justify-between text-xs text-gray-400 mt-1">
                    <span>Week {filters.weeks.min}</span>
                    <span>Week {filters.weeks.max}</span>
                  </div>
                </div>
              </CollapsibleContent>
            </Collapsible>

            <Separator className="bg-gray-700" />

            {/* Location Filter */}
            <Collapsible open={openSections.location} onOpenChange={() => toggleSection('location')}>
              <CollapsibleTrigger className="flex w-full items-center justify-between py-2 hover:text-neon-cyan transition-colors">
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4" />
                  <span className="font-medium">Location</span>
                </div>
                <ChevronDown className={`h-4 w-4 transition-transform ${openSections.location ? 'rotate-180' : ''}`} />
              </CollapsibleTrigger>
              <CollapsibleContent className="space-y-3 pt-2">
                <div>
                  <Label className="text-sm font-medium text-gray-300 mb-2 block">States</Label>
                  <ScrollArea className="h-32 border border-gray-700 rounded-md p-2">
                    <div className="space-y-2">
                      {filterOptions.states.map(state => (
                        <div key={state} className="flex items-center space-x-2">
                          <Checkbox
                            id={`state-${state}`}
                            checked={filters.states.includes(state)}
                            onCheckedChange={(checked) => handleStateChange(state, checked as boolean)}
                            className="border-gray-600 data-[state=checked]:bg-neon-cyan data-[state=checked]:border-neon-cyan"
                          />
                          <Label htmlFor={`state-${state}`} className="text-sm cursor-pointer">
                            {state}
                          </Label>
                        </div>
                      ))}
                    </div>
                  </ScrollArea>
                </div>
                
                {filters.states.length > 0 && (
                  <div>
                    <Label className="text-sm font-medium text-gray-300 mb-2 block">Districts</Label>
                    <ScrollArea className="h-32 border border-gray-700 rounded-md p-2">
                      <div className="space-y-2">
                        {availableDistricts.map(district => (
                          <div key={district} className="flex items-center space-x-2">
                            <Checkbox
                              id={`district-${district}`}
                              checked={filters.districts.includes(district)}
                              onCheckedChange={(checked) => handleDistrictChange(district, checked as boolean)}
                              className="border-gray-600 data-[state=checked]:bg-neon-cyan data-[state=checked]:border-neon-cyan"
                            />
                            <Label htmlFor={`district-${district}`} className="text-sm cursor-pointer">
                              {district}
                            </Label>
                          </div>
                        ))}
                      </div>
                    </ScrollArea>
                  </div>
                )}
              </CollapsibleContent>
            </Collapsible>

            <Separator className="bg-gray-700" />

            {/* Disease Filter */}
            <Collapsible open={openSections.disease} onOpenChange={() => toggleSection('disease')}>
              <CollapsibleTrigger className="flex w-full items-center justify-between py-2 hover:text-neon-cyan transition-colors">
                <div className="flex items-center gap-2">
                  <Virus className="h-4 w-4" />
                  <span className="font-medium">Diseases</span>
                </div>
                <ChevronDown className={`h-4 w-4 transition-transform ${openSections.disease ? 'rotate-180' : ''}`} />
              </CollapsibleTrigger>
              <CollapsibleContent className="space-y-2 pt-2">
                <ScrollArea className="h-40 border border-gray-700 rounded-md p-2">
                  <div className="space-y-2">
                    {filterOptions.diseases.map(disease => (
                      <div key={disease} className="flex items-center space-x-2">
                        <Checkbox
                          id={`disease-${disease}`}
                          checked={filters.diseases.includes(disease)}
                          onCheckedChange={(checked) => handleDiseaseChange(disease, checked as boolean)}
                          className="border-gray-600 data-[state=checked]:bg-neon-cyan data-[state=checked]:border-neon-cyan"
                        />
                        <Label htmlFor={`disease-${disease}`} className="text-sm cursor-pointer">
                          {disease}
                        </Label>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </CollapsibleContent>
            </Collapsible>

            <Separator className="bg-gray-700" />

            {/* Metrics Range Filter */}
            <Collapsible open={openSections.metrics} onOpenChange={() => toggleSection('metrics')}>
              <CollapsibleTrigger className="flex w-full items-center justify-between py-2 hover:text-neon-cyan transition-colors">
                <div className="flex items-center gap-2">
                  <Activity className="h-4 w-4" />
                  <span className="font-medium">Metrics Range</span>
                </div>
                <ChevronDown className={`h-4 w-4 transition-transform ${openSections.metrics ? 'rotate-180' : ''}`} />
              </CollapsibleTrigger>
              <CollapsibleContent className="space-y-4 pt-2">
                <div>
                  <Label className="text-sm font-medium text-gray-300 mb-2 block">Cases Range</Label>
                  <div className="px-2">
                    <Slider
                      value={[filters.casesRange.min, filters.casesRange.max]}
                      onValueChange={([min, max]) => 
                        onFiltersChange({ ...filters, casesRange: { min, max } })
                      }
                      min={0}
                      max={filterOptions.maxCases}
                      step={1}
                      className="w-full"
                    />
                    <div className="flex justify-between text-xs text-gray-400 mt-1">
                      <span>{filters.casesRange.min}</span>
                      <span>{filters.casesRange.max}</span>
                    </div>
                  </div>
                </div>
                
                <div>
                  <Label className="text-sm font-medium text-gray-300 mb-2 block">Deaths Range</Label>
                  <div className="px-2">
                    <Slider
                      value={[filters.deathsRange.min, filters.deathsRange.max]}
                      onValueChange={([min, max]) => 
                        onFiltersChange({ ...filters, deathsRange: { min, max } })
                      }
                      min={0}
                      max={filterOptions.maxDeaths}
                      step={1}
                      className="w-full"
                    />
                    <div className="flex justify-between text-xs text-gray-400 mt-1">
                      <span>{filters.deathsRange.min}</span>
                      <span>{filters.deathsRange.max}</span>
                    </div>
                  </div>
                </div>
              </CollapsibleContent>
            </Collapsible>

            <Separator className="bg-gray-700" />

            {/* Status Filter */}
            <Collapsible open={openSections.status} onOpenChange={() => toggleSection('status')}>
              <CollapsibleTrigger className="flex w-full items-center justify-between py-2 hover:text-neon-cyan transition-colors">
                <div className="flex items-center gap-2">
                  <CheckSquare className="h-4 w-4" />
                  <span className="font-medium">Status</span>
                </div>
                <ChevronDown className={`h-4 w-4 transition-transform ${openSections.status ? 'rotate-180' : ''}`} />
              </CollapsibleTrigger>
              <CollapsibleContent className="space-y-2 pt-2">
                <div className="space-y-2">
                  {filterOptions.statuses.map(status => (
                    <div key={status} className="flex items-center space-x-2">
                      <Checkbox
                        id={`status-${status}`}
                        checked={filters.statuses.includes(status)}
                        onCheckedChange={(checked) => handleStatusChange(status, checked as boolean)}
                        className="border-gray-600 data-[state=checked]:bg-neon-cyan data-[state=checked]:border-neon-cyan"
                      />
                      <Label htmlFor={`status-${status}`} className="text-sm cursor-pointer">
                        {status}
                      </Label>
                    </div>
                  ))}
                </div>
              </CollapsibleContent>
            </Collapsible>
          </div>
        </ScrollArea>
        
        {/* Action Buttons */}
        <div className="p-6 pt-4 border-t border-gray-700 mt-4">
          <div className="flex gap-2">
            <Button 
              onClick={clearAllFilters}
              variant="outline" 
              size="sm" 
              className="flex-1 border-gray-600 hover:border-neon-orange hover:text-neon-orange"
            >
              <RotateCcw className="h-4 w-4 mr-2" />
              Clear All
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}