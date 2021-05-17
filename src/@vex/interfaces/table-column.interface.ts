export interface TableColumn<T> {
  label: string;
  property: keyof T | string;
  type: 'text' | 'date' | 'actions';
  visible?: boolean;
  cssClasses?: string[];
}
