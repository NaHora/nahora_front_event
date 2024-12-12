export type SelectProps = {
  label: string;
  value: string;
};

export interface EventDTO {
  id: string;
  name: string;
  start_date: string;
  end_date: string;
  max_sales: string;
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
