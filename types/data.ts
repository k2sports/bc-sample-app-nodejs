export interface FormData {
  isEnabled: boolean;
  hideFreeShipping: any[];
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
