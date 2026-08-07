import React from 'react';
import { UIComponent, ThemeConfig } from '../types';
import { ChartCard } from './ChartCard';
import { CalculatorCard } from './CalculatorCard';
import { TableCard } from './TableCard';
import { FormCard } from './FormCard';
import { KanbanCard } from './KanbanCard';
import { AlertCard } from './AlertCard';
import { ActionListCard } from './ActionListCard';
import { ImageCard } from './ImageCard';
import { RestaurantGridCard } from './RestaurantGridCard';
import { FoodCategoryGrid } from './FoodCategoryGrid';
import { FoodMenuCard } from './FoodMenuCard';

interface ComponentRendererProps {
  component: UIComponent;
  theme?: ThemeConfig;
  onStateChange?: (newVals: Record<string, any>) => void;
  device?: 'desktop' | 'tablet' | 'mobile';
}

export const ComponentRenderer: React.FC<ComponentRendererProps> = ({ component, theme, onStateChange, device }) => {
  switch (component.type) {
    case 'chart':
      return <ChartCard component={component} theme={theme} device={device} />;
    case 'calculator':
      return <CalculatorCard component={component} theme={theme} onStateChange={onStateChange} device={device} />;
    case 'table':
      return <TableCard component={component} theme={theme} device={device} />;
    case 'form':
      return <FormCard component={component} theme={theme} onSubmitAction={onStateChange} device={device} />;
    case 'kanban':
      return <KanbanCard component={component} theme={theme} device={device} />;
    case 'alert':
      return <AlertCard component={component} theme={theme} device={device} />;
    case 'action_list':
      return <ActionListCard component={component} theme={theme} device={device} />;
    case 'image':
      return <ImageCard component={component} theme={theme} device={device} />;
    case 'restaurant_list':
      return <RestaurantGridCard component={component} theme={theme} />;
    case 'food_category_grid':
      return <FoodCategoryGrid component={component} theme={theme} />;
    case 'food_menu':
      return <FoodMenuCard component={component} theme={theme} />;
    default:
      return (
        <div className="bg-zinc-900 border border-zinc-800 p-4 rounded-xl text-xs text-zinc-400">
          Unknown Component Type: {(component as any).type}
        </div>
      );
  }
};
