export type ComponentType = 
  | 'chart' 
  | 'form' 
  | 'table' 
  | 'kanban' 
  | 'calculator' 
  | 'alert' 
  | 'action_list'
  | 'image'
  | 'restaurant_list'
  | 'food_category_grid'
  | 'food_menu';

export interface MetricItem {
  id: string;
  label: string;
  value: string | number;
  change?: string;
  trend?: 'up' | 'down' | 'neutral';
  subtext?: string;
  format?: 'currency' | 'number' | 'percentage' | 'text';
  sparkline?: number[];
  icon?: string;
}

export interface ChartKeyConfig {
  key: string;
  name: string;
  color: string;
  fillOpacity?: number;
}

export interface ChartComponentData {
  id: string;
  type: 'chart';
  chartType: 'line' | 'bar' | 'area' | 'pie' | 'radial';
  title: string;
  subtitle?: string;
  xAxisKey?: string;
  dataKeys: ChartKeyConfig[];
  data: Array<Record<string, any>>;
  grid?: boolean;
}

export interface FormField {
  id: string;
  name: string;
  label: string;
  fieldType: 'text' | 'number' | 'select' | 'slider' | 'switch' | 'textarea' | 'date';
  placeholder?: string;
  defaultValue?: any;
  options?: Array<{ label: string; value: string }>;
  min?: number;
  max?: number;
  step?: number;
  unit?: string;
  targetFieldToUpdate?: string;
  required?: boolean;
}

export interface FormComponentData {
  id: string;
  type: 'form';
  title: string;
  description?: string;
  submitLabel?: string;
  fields: FormField[];
}

export interface TableColumn {
  key: string;
  label: string;
  type?: 'text' | 'badge' | 'currency' | 'progress' | 'date' | 'avatar' | 'number';
  badgeColorMap?: Record<string, string>;
}

export interface TableActionButton {
  id: string;
  label: string;
  icon?: string;
  action: string;
}

export interface TableComponentData {
  id: string;
  type: 'table';
  title: string;
  description?: string;
  searchable?: boolean;
  exportable?: boolean;
  columns: TableColumn[];
  data: Array<Record<string, any>>;
  actionButtons?: TableActionButton[];
}

export interface KanbanItem {
  id: string;
  columnId: string;
  title: string;
  subtitle?: string;
  tags?: string[];
  assignee?: string;
  priority?: 'low' | 'medium' | 'high';
}

export interface KanbanColumn {
  id: string;
  title: string;
  color?: string;
}

export interface KanbanComponentData {
  id: string;
  type: 'kanban';
  title: string;
  columns: KanbanColumn[];
  items: KanbanItem[];
}

export interface CalculatorInput {
  id: string;
  label: string;
  value: number;
  min: number;
  max: number;
  step?: number;
  unit?: string;
}

export interface CalculatorOutput {
  id: string;
  label: string;
  formulaDescription: string;
  format: 'currency' | 'number' | 'percentage';
  calculatedValue: number;
  multiplier?: number;
  formula?: string;
}

export interface CalculatorComponentData {
  id: string;
  type: 'calculator';
  title: string;
  description?: string;
  inputs: CalculatorInput[];
  outputs: CalculatorOutput[];
}

export interface AlertCardComponentData {
  id: string;
  type: 'alert';
  title: string;
  message: string;
  severity: 'info' | 'warning' | 'success' | 'error';
  timestamp?: string;
  actionLabel?: string;
}

export interface ActionListItem {
  id: string;
  title: string;
  description: string;
  icon?: string;
  buttonText: string;
  category?: string;
}

export interface ActionListComponentData {
  id: string;
  type: 'action_list';
  title: string;
  actions: ActionListItem[];
}

export interface ImageComponentData {
  id: string;
  type: 'image';
  title: string;
  description?: string;
  url: string;
  aspectRatio?: 'video' | 'square' | 'wide' | 'original';
  height?: string;
}

export interface RestaurantItem {
  id: string;
  name: string;
  cuisine: string;
  rating: number;
  reviewsCount?: string;
  deliveryTime: string;
  distance?: string;
  priceForTwo: string;
  offerBadge?: string;
  imageUrl: string;
  isVegOnly?: boolean;
  isPromoted?: boolean;
}

export interface RestaurantListComponentData {
  id: string;
  type: 'restaurant_list';
  title: string;
  subtitle?: string;
  restaurants: RestaurantItem[];
}

export interface FoodCategoryItem {
  id: string;
  name: string;
  icon?: string;
  imageUrl?: string;
  offerText?: string;
  color?: string;
}

export interface FoodCategoryGridComponentData {
  id: string;
  type: 'food_category_grid';
  title: string;
  categories: FoodCategoryItem[];
}

export interface FoodMenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  rating?: number;
  imageUrl?: string;
  isVeg: boolean;
  isBestseller?: boolean;
  category?: string;
}

export interface FoodMenuComponentData {
  id: string;
  type: 'food_menu';
  title: string;
  subtitle?: string;
  items: FoodMenuItem[];
}

export type UIComponent =
  | ChartComponentData
  | FormComponentData
  | TableComponentData
  | KanbanComponentData
  | CalculatorComponentData
  | AlertCardComponentData
  | ActionListComponentData
  | ImageComponentData
  | RestaurantListComponentData
  | FoodCategoryGridComponentData
  | FoodMenuComponentData;

export interface LayoutSection {
  id: string;
  title?: string;
  gridCols?: 1 | 2 | 3 | 4;
  components: UIComponent[];
}

export interface WorkflowItem {
  id: string;
  name: string;
  trigger: string;
  actionType: 'notification' | 'recalculate' | 'export' | 'webhook' | 'email_alert';
  status: 'active' | 'paused';
  lastRun?: string;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp?: string;
  sectionsUpdated?: number;
}

export interface ThemeConfig {
  accentColor: string; // 'emerald' | 'indigo' | 'violet' | 'amber' | 'rose' | 'sky' | 'cyan' | 'blue' | 'purple' | 'slate' | 'teal' | 'coral';
  style: 'modern' | 'minimal' | 'dense' | 'glass';
  mode?: 'light' | 'dark' | 'warm' | 'slate';
  fontFamily?: string;
  borderRadius?: 'none' | 'sm' | 'md' | 'lg' | 'xl' | 'full';
  primaryHex?: string;
  bgHex?: string;
  surfaceHex?: string;
  fontHeading?: string;
  fontBody?: string;
}

export interface DynamicUISchema {
  id: string;
  title: string;
  description: string;
  category: string;
  theme: ThemeConfig;
  metrics: MetricItem[];
  layout: LayoutSection[];
  initialState: Record<string, any>;
  workflows?: WorkflowItem[];
  generatedPrompt?: string;
  messages?: ChatMessage[];
}

export interface PresetTemplate {
  id: string;
  title: string;
  description: string;
  category: string;
  icon: string;
  prompt: string;
  schema?: DynamicUISchema;
}
