export interface Harbor {
    id: number;
    name: string;
    created_at: string;
    updated_at: string;
  }
  
  export interface HarborResponse {
    status: boolean;
    message: string;
    data: Harbor[];
  }
  