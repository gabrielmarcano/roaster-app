import {
  useContext,
  createContext,
  type PropsWithChildren,
  useEffect,
  useState,
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

const SSEContext = createContext<{
  eventSource?: EventSource | undefined;
  sensors?: ISensor | undefined;
  time?: ITimer | undefined;
  states?: IMotorStates | undefined;
  controller?: IControllerConfig | undefined;
}>({
  eventSource: undefined,
  sensors: undefined,
  time: undefined,
  states: undefined,
  controller: undefined,
});

// This hook can be used to access the user info.
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

  const [eventSource, setEventSource] = useState<
    EventSource<CustomEvents> | undefined
  >(undefined);

  const [sensors, setSensors] = useState<ISensor | undefined>(undefined);
  const [time, setTime] = useState<ITimer | undefined>(undefined);
  const [states, setStates] = useState<IMotorStates | undefined>(undefined);
  const [controller, setController] = useState<IControllerConfig | undefined>(
    undefined,
  );

  useEffect(() => {
    const es = new EventSource<CustomEvents>(`http://${session}/events`);

    setEventSource(es);

    es.addEventListener('open', (event) => {
      console.log('Open SSE connection.');
    });

    es.addEventListener('sensors', (event) => {
      if (event.data) {
        const sensorData: ISensor = JSON.parse(event.data);
        setSensors(sensorData);
      }
    });

    es.addEventListener('time', (event) => {
      if (event.data) {
        const timeData: ITimer = JSON.parse(event.data);
        setTime(timeData);
      }
    });

    es.addEventListener('states', (event) => {
      if (event.data) {
        const statesData: IMotorStates = JSON.parse(event.data);
        setStates(statesData);
      }
    });

    es.addEventListener('controller', (event) => {
      if (event.data) {
        const controllerData: IControllerConfig = JSON.parse(event.data);
        setController(controllerData);
      }
    });

    es.addEventListener('error', (event) => {
      if (event.type === 'error') {
        console.error('Connection error:', event.message);
      } else if (event.type === 'exception') {
        console.error('Error:', event.message, event.error);
      }
    });

    es.addEventListener('close', (event) => {
      console.log('Close SSE connection.');
    });

    // Clean up the EventSource on component unmount
    return () => {
      es.close();
      setEventSource(undefined);
    };
  }, [session]);

  return (
    <SSEContext.Provider
      value={{
        eventSource,
        sensors,
        time,
        states,
        controller,
      }}
    >
      {children}
    </SSEContext.Provider>
  );
}
