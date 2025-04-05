export interface Order {
    id: string;
    name: string;
    address: string;
    age: number;
    gender: string;
    idType: string;
    idNumber: string;
    class: string;
  }
  
  
export interface Schedule {
    id: string;
    destination: string;
    orders: Order[];
  }