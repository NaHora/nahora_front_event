import {
  createContext,
  Dispatch,
  ReactNode,
  SetStateAction,
  useContext,
  useEffect,
  useState,
} from 'react';
import { EventDTO, SelectProps } from '../dtos';
import { useAuth } from '../hooks/auth';
import api from '../services/api';

type EventProviderProps = {
  children: ReactNode;
};

type EventContextData = {
  isLoading: boolean;
  events: SelectProps[];
  setCurrentEvent: Dispatch<SetStateAction<SelectProps>>;
  currentEvent: SelectProps;
  getCurrentEventsData: EventDTO;
};

export const EventContext = createContext({} as EventContextData);

export function EventProvider({ children }: EventProviderProps) {
  const { user } = useAuth();
  const [events, setEvents] = useState([] as SelectProps[]);
  const [isLoading, setIsLoading] = useState(false);
  const [currentEvent, setCurrentEvent] = useState({} as SelectProps);
  const [eventsData, setEventsData] = useState([] as EventDTO[]);

  const getMyEvents = async () => {
    setIsLoading(true);
    try {
      const response = await api.get('/event');

      const newFormatEvents = response.data.map((event: EventDTO) => ({
        value: event.id,
        label: event.name,
      }));

      setEvents(newFormatEvents);
      setEventsData(response.data);

      const myEventSavedStorage = localStorage.getItem('@NaHora:CurrentEvent');

      if (myEventSavedStorage) {
        const parsedEvent = JSON.parse(myEventSavedStorage);
        const isValidEvent = newFormatEvents.some(
          (event: any) => event.value === parsedEvent.value
        );
        setCurrentEvent(isValidEvent ? parsedEvent : newFormatEvents[0] || {});
      } else if (newFormatEvents.length > 0) {
        setCurrentEvent(newFormatEvents[0]);
      }
    } catch (err) {
      console.error('Erro ao buscar eventos: ', err);
    } finally {
      setIsLoading(false);
    }
  };

  // Retorna o evento correspondente ao `currentEvent` ou um objeto padrão
  const getCurrentEventsData = eventsData.find(
    (event) => event.id === currentEvent?.value
  ) || {
    id: '',
    name: 'Evento não definido',
    description: '',
    date: '',
  };

  // Salva o evento atual no localStorage sempre que mudar
  useEffect(() => {
    if (currentEvent?.value) {
      localStorage.setItem(
        '@NaHora:CurrentEvent',
        JSON.stringify(currentEvent)
      );
    }
  }, [currentEvent]);

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
