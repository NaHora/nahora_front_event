import {
  createContext,
  Dispatch,
  ReactNode,
  SetStateAction,
  useContext,
  useEffect,
  useState,
} from 'react';
import { key } from '../config/key';
import { EventDTO } from '../dtos';
import { useAuth } from '../hooks/auth';
import api from '../services/api';

type EventProviderProps = {
  children: ReactNode;
};

type EventContextData = {
  isLoading: boolean;
  events: EventDTO[];
  setCurrentEvent: Dispatch<SetStateAction<string>>;
  currentEvent: string;
  getCurrentEventsData: EventDTO;
  getMyEvents: () => void;
};

export const EventContext = createContext({} as EventContextData);

export function EventProvider({ children }: EventProviderProps) {
  const { user } = useAuth();
  const [events, setEvents] = useState([] as EventDTO[]);
  const [isLoading, setIsLoading] = useState(false);
  const [currentEvent, setCurrentEvent] = useState('');

  const getMyEvents = async () => {
    setIsLoading(true);
    try {
      const response = await api.get('/event');
      console.log(response.data);
      setEvents(response.data);

      const myEventSavedStorage = localStorage.getItem(
        key.currentEvent + user.id
      );

      if (myEventSavedStorage) {
        const parsedEvent = JSON.parse(myEventSavedStorage);
        const isValidEvent = response.data.some(
          (event: any) => event.value === parsedEvent.value
        );
        setCurrentEvent(isValidEvent ? parsedEvent : response.data[0].id || {});
      } else if (response.data.length > 0) {
        setCurrentEvent(response.data[0].id);
        localStorage.setItem(
          key.currentEvent + user.id,
          JSON.stringify(response.data[0].id)
        );
      }
    } catch (err) {
      console.error('Erro ao buscar eventos: ', err);
    } finally {
      setIsLoading(false);
    }
  };

  const getCurrentEventsData = events.find(
    (event) => event.id === currentEvent
  ) || {
    id: '',
    name: 'Evento não definido',
    description: '',
    start_date: '',
    end_date: '',
    address: '',
  };

  useEffect(() => {
    if (user?.id) {
      getMyEvents();
    }
  }, [user]);

  return (
    <EventContext.Provider
      value={{
        events,
        isLoading,
        currentEvent,
        setCurrentEvent,
        getCurrentEventsData,
        getMyEvents,
      }}
    >
      {children}
    </EventContext.Provider>
  );
}

export function useEvent(): EventContextData {
  const context = useContext(EventContext);

  if (!context) {
    throw new Error('useEvent deve ser usado dentro de um EventProvider');
  }

  return context;
}
