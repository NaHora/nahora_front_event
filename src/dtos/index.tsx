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
