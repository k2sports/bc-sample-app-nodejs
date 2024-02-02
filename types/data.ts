export interface FormData {
  isEnabled: boolean;
  hideFreeShippingGroups: any[];
  showRecommendedMethod: boolean;
}

export interface TableItem {
  id: number;
  name: string;
  price: number;
  stock: number;
}

export interface ListItem extends FormData {
  id: number;
}

export interface StringKeyValue {
  [key: string]: string;
}

export interface StoreSettings {
  isEnabled: number;
  hideFreeShippingGroups: string;
  showRecommendedMethod: number;
}
