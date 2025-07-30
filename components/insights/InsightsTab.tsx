'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { ChevronDown, TrendingUp, AlertTriangle, Clock, MapPin } from 'lucide-react';
import { useState } from 'react';

interface InsightsTabProps {
  insights: string[];
}

export function InsightsTab({ insights }: InsightsTabProps) {
  const [openSections, setOpenSections] = useState<{ [key: number]: boolean }>({});

  const toggleSection = (index: number) => {
    setOpenSections(prev => ({
      ...prev,
      [index]: !prev[index]
    }));
  };

  const getInsightIcon = (insight: string) => {
    if (insight.includes('mortality') || insight.includes('deaths')) {
      return <AlertTriangle className="h-4 w-4 text-red-500" />;
    }
    if (insight.includes('delay') || insight.includes('reporting')) {
      return <Clock className="h-4 w-4 text-orange-500" />;
    }
    if (insight.includes('prevalent') || insight.includes('most')) {
      return <TrendingUp className="h-4 w-4 text-blue-500" />;
    }
    return <MapPin className="h-4 w-4 text-green-500" />;
  };

  const getInsightCategory = (insight: string) => {
    if (insight.includes('mortality') || insight.includes('deaths')) {
      return 'High Risk';
    }
    if (insight.includes('delay') || insight.includes('reporting')) {
      return 'Surveillance Gap';
    }
    if (insight.includes('prevalent') || insight.includes('most')) {
      return 'Disease Pattern';
    }
    return 'Geographic Trend';
  };

  const getBadgeVariant = (category: string) => {
    switch (category) {
      case 'High Risk':
        return 'destructive';
      case 'Surveillance Gap':
        return 'secondary';
      case 'Disease Pattern':
        return 'default';
      default:
        return 'outline';
    }
  };

  return (
    <Card className="col-span-full border-neon-cyan/20 bg-gray-900/50 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-white">
          <TrendingUp className="h-5 w-5 text-neon-cyan" />
          AI-Generated Health Surveillance Insights
        </CardTitle>
        <CardDescription className="text-gray-400">
          Automated analysis of disease patterns, reporting efficiency, and risk factors
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {insights.map((insight, index) => {
            const category = getInsightCategory(insight);
            const icon = getInsightIcon(insight);
            
            return (
              <Collapsible key={index}>
                <CollapsibleTrigger
                  onClick={() => toggleSection(index)}
                  className="flex w-full items-center justify-between rounded-lg border border-gray-700 p-4 hover:bg-gray-800/50 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    {icon}
                    <div className="flex items-center gap-2">
                      <Badge 
                        variant={getBadgeVariant(category) as any}
                        className={`${
                          category === 'High Risk' ? 'bg-red-900/50 text-red-300 border-red-700' :
                          category === 'Surveillance Gap' ? 'bg-orange-900/50 text-orange-300 border-orange-700' :
                          category === 'Disease Pattern' ? 'bg-blue-900/50 text-blue-300 border-blue-700' :
                          'bg-gray-800/50 text-gray-300 border-gray-600'
                        }`}
                      >
                        {category}
                      </Badge>
                      <span className="text-sm font-medium text-left text-white">
                        {insight.split(' ').slice(0, 8).join(' ')}...
                      </span>
                    </div>
                  </div>
                  <ChevronDown 
                    className={`h-4 w-4 transition-transform ${
                      openSections[index] ? 'rotate-180' : ''
                    }`} 
                  />
                </CollapsibleTrigger>
                <CollapsibleContent className="px-4 pb-4">
                  <div className="mt-2 p-4 bg-gray-800/30 rounded-md border border-gray-700">
                    <p className="text-sm text-gray-300 leading-relaxed">
                      {insight}
                    </p>
                  </div>
                </CollapsibleContent>
              </Collapsible>
            );
          })}
        </div>
        
        {insights.length === 0 && (
          <div className="text-center py-8">
            <TrendingUp className="h-12 w-12 text-gray-500 mx-auto mb-4" />
            <p className="text-gray-400">No insights available. Please load data to generate analysis.</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}