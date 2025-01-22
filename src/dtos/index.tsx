export type SelectProps = {
  label: string;
  value: string;
};

export interface EventDTO {
  id: string;
  name: string;
  start_date: string;
  end_date: string;
  address: string;
  start_time: string;
  end_time: string;
}

export interface LotsDTO {
  id: string;
  max_sales: number;
  amount: number;
  start_date: string;
  end_date: string;
  event_id: string;
  start_time: string;
  end_time: string;
}

export interface User {
  id: string;
  name: string;
  celphone: string;
  isPrivate: boolean;
  email: string;
  avatar_url: string;
  gender: string;
}

export interface EnterpriseDTO {
  active: number;
  address: string;
  area: string;
  close_hour: string;
  id: string;
  isPrivate: number;
  lat: string;
  logo: string;
  logo_url: string;
  long: string;
  name: string;
  open_hour: string;
  owner_id: string;
  phone: string;
  primary_color: string;
  secondary_color: string;
}

export interface CategoryByEventDTO {
  id: string;
  athlete_number: number;
  name: string;
  teams: TeamsDTO[];
}
export interface TeamsDTO {
  id: string;
  active: boolean;
  name: string;
  box: string;
  athletes: AthleteDto[];
}
type AthleteDto = {
  id: string;
  name: string;
};
export interface LotsByValueDTO {
  id: string;
  amount: number;
  max_sales: number;
  payments: PaymentsDTO[];
  start_date: Date;
  end_date: Date;
}

export interface PaymentsDTO {
  id: string;
  amount: number;
  fee: number;
  payment_method: string;
  total: number;
  status: string;
  payment_date: Date;
  installments: number;
}

export interface ShirtSizeDTO {
  gender: string;
  shirt_size: string;
  count: number;
}
