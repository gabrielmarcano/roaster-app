import {
  useContext,
  createContext,
  type PropsWithChildren,
  useEffect,
  useState,
  useCallback,
  useRef,
} from 'react';

import {
  CustomEvents,
  IControllerConfig,
  IMotorStates,
  ISensor,
  ITimer,
} from '@/api/types';
import EventSource from 'react-native-sse';
import { useSession } from './sessionContext';
import { useNotificationScheduler } from '@/hooks/useNotificationScheduler';

const SSEContext = createContext<{
  reconnect: () => void;
  isConnected: boolean;
  sensors?: ISensor | undefined;
  time?: ITimer | undefined;
  states?: IMotorStates | undefined;
  controller?: IControllerConfig | undefined;
}>({
  reconnect: () => {},
  isConnected: false,
  sensors: undefined,
  time: undefined,
  states: undefined,
  controller: undefined,
});

export function useSSE() {
  const value = useContext(SSEContext);
  if (process.env.NODE_ENV !== 'production') {
    if (!value) {
      throw new Error('useSSE must be wrapped in a <SSEProvider />');
    }
  }
  return value;
}

export function SSEProvider({ children }: PropsWithChildren) {
  const { session } = useSession();

  const [reconnectKey, setReconnectKey] = useState(0);
  const [isConnected, setIsConnected] = useState(false);
  const [sensors, setSensors] = useState<ISensor | undefined>(undefined);
  const [time, setTime] = useState<ITimer | undefined>(undefined);
  const [states, setStates] = useState<IMotorStates | undefined>(undefined);
  const [controller, setController] = useState<IControllerConfig | undefined>(undefined);

  useNotificationScheduler(time);

  const reconnectTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const backoffRef = useRef(1000);

  // Incrementing reconnectKey tears down the old EventSource and creates a
  // fresh one, also clearing all stale state.
  const reconnect = useCallback(() => setReconnectKey((k) => k + 1), []);

  useEffect(() => {
    if (!session) return;

    const es = new EventSource<CustomEvents>(`http://${session}/events`);

    es.addEventListener('open', () => {
      console.log('Open SSE connection.');
      setIsConnected(true);
      backoffRef.current = 1000; // reset backoff on successful connection
    });

    es.addEventListener('sensors', (event) => {
      if (event.data) setSensors(JSON.parse(event.data) as ISensor);
    });

    es.addEventListener('time', (event) => {
      if (event.data) setTime(JSON.parse(event.data) as ITimer);
    });

    es.addEventListener('states', (event) => {
      if (event.data) setStates(JSON.parse(event.data) as IMotorStates);
    });

    es.addEventListener('controller', (event) => {
      if (event.data) setController(JSON.parse(event.data) as IControllerConfig);
    });

    es.addEventListener('error', (event) => {
      setIsConnected(false);
      if (event.type === 'error') {
        console.error('Connection error:', event.message);
      } else if (event.type === 'exception') {
        console.error('Error:', event.message, event.error);
      }
      // Schedule reconnect with exponential backoff: 1s → 2s → 4s … 30s max
      if (reconnectTimeoutRef.current) clearTimeout(reconnectTimeoutRef.current);
      reconnectTimeoutRef.current = setTimeout(() => {
        reconnectTimeoutRef.current = null;
        backoffRef.current = Math.min(backoffRef.current * 2, 30000);
        setReconnectKey((k) => k + 1);
      }, backoffRef.current);
    });

    es.addEventListener('close', () => {
      console.log('Close SSE connection.');
      setIsConnected(false);
    });

    return () => {
      es.close();
      setIsConnected(false);
      setSensors(undefined);
      setTime(undefined);
      setStates(undefined);
      setController(undefined);
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current);
        reconnectTimeoutRef.current = null;
      }
    };
  }, [session, reconnectKey]);

  return (
    <SSEContext.Provider
      value={{ reconnect, isConnected, sensors, time, states, controller }}
    >
      {children}
    </SSEContext.Provider>
  );
}
