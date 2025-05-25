import React from 'react';

export interface NavItem {
  path: string;
  name: string;
  // FIX: Specified SVGProps for icon to allow className to be cloned.
  icon: React.ReactElement<React.SVGProps<SVGSVGElement>>;
}

export interface ChartDataPoint {
  name: string;
  value: number;
  [key: string]: any; // For additional properties like pv, amt for recharts
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'ai';
  text: string;
  timestamp: number;
}