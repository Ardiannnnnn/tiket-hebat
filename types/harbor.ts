export interface Harbor {
    id: number;
    harbor_name: string;
    status: string;
    year_operation: string;
    created_at: string;
    updated_at: string;
  }
  
  export interface HarborResponse {
    status: boolean;
    message: string;
    data: Harbor[];
  }
  