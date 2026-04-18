export type RouteStop = {
  id: string;
  name: string;
};

export type Route = {
  name: string;
  transport_mode: string;
  direction: string;
  origin: RouteStop;
  destination: RouteStop;
};

export type Trip = {
  trip_id: string;
  start_date: string;
};

export type StopRef = {
  id: string;
  name: string;
};

export type Platform = {
  id: string;
  designation: string;
};

export type Departure = {
  scheduled: string;
  realtime: string;
  delay: number;
  canceled: boolean;
  route: Route;
  trip: Trip;
  stop: StopRef;
  realtime_platform?: Platform | null;
  alerts: unknown[];
};

export type Stop = {
  id: string;
  name: string;
  transport_modes: string[];
  alerts: unknown[];
};

export type DepartureResponse = {
  timestamp: string;
  stops: Stop[];
  departures: Departure[];
};
