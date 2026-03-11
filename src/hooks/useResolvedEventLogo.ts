import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import fallbackEventLogo from '../assets/event-logo.png';
import { useEvent } from '../contexts/EventContext';
import api from '../services/api';

export function useResolvedEventLogo() {
  const { eventId } = useParams<{ eventId?: string }>();
  const { currentEvent, events } = useEvent();
  const [publicLogoUrl, setPublicLogoUrl] = useState<string | null>(null);

  const targetEventId = eventId || currentEvent;
  const currentEventData = events.find(event => event.id === targetEventId);

  useEffect(() => {
    let isMounted = true;

    async function loadEventLogo() {
      if (!targetEventId || currentEventData?.logo_url) {
        if (isMounted) {
          setPublicLogoUrl(null);
        }
        return;
      }

      try {
        const response = await api.get(`/event/public/${targetEventId}`);

        if (isMounted) {
          setPublicLogoUrl(response.data?.logo_url || null);
        }
      } catch (error) {
        if (isMounted) {
          setPublicLogoUrl(null);
        }
      }
    }

    loadEventLogo();

    return () => {
      isMounted = false;
    };
  }, [targetEventId, currentEventData?.logo_url]);

  return currentEventData?.logo_url || publicLogoUrl || fallbackEventLogo;
}
