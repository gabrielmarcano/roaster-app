import { getLocales } from 'expo-localization';
import { I18n } from 'i18n-js';

const translations = {
  en: {
    SignIn: {
      Start: 'Start',
      EnterYourIP: 'Enter the IP address',
      Example: 'Ex: 192.168.1.10',
      InvalidIP: 'Invalid IP address.',
    },
    Tabs: {
      Dashboard: 'Dashboard',
      Controllers: 'Controllers',
      Timer: 'Timer',
      Settings: 'Settings',
    },
    Dashboard: {
      Temperature: 'Temperature',
      Humidity: 'Humidity',
    },
    Controller: {
      CurrentConfiguration: 'Current Configuration',
      Status: 'Status',
      StartingTemperature: 'Starting Temperature',
      Time: 'Time',
      ControlMotors: 'Control Motors',
      SavedConfigurations: 'Saved Configurations',
      NamePlaceholder: 'Set the name',
      TemperaturePlaceholder: 'Set the starting temperature',
      TimePlaceholder: 'Set the time in seconds',
      AddNewConfiguration: 'Add new configuration',
      Dialog: {
        ConfigurationWithThisNameAlreadyExists:
          'a configuration with this name already exists',
        UseConfiguration: 'Use this configuration',
        NewConfiguration: 'New configuration',
        DeleteConfiguration: 'Delete configuration',
        DeleteConfigurationMessage:
          'Are you sure you want to delete this configuration?',
        Save: 'Save',
        Cancel: 'Cancel',
        Use: 'Use',
        Delete: 'Delete',
      },
      Buttons: {
        UseConfiguration: 'Use configuration',
        Motor1: 'Motor 1',
        Motor2: 'Motor 2',
        Motor3: 'Motor 3',
      },
    },
    Timer: {
      Buttons: {
        // AddTime: 'Add time',
        // ReduceTime: 'Reduce time',
      },
    },
    Settings: {
      Language: 'Language',
      DeviceDefault: 'Device Default',
      Notifications: {
        Title: 'Notifications',
        Enable: 'Enable Notifications',
        Pre30: '30 minutes before',
        Pre20: '20 minutes before',
        Pre10: '10 minutes before',
      },
      Buttons: {
        ActivateSystem: 'Activate System',
        ForceStop: 'Force Stop',
        Restart: 'Restart',
      },
    },
    Notifications: {
      TimerFinished: 'Timer Finished',
      TimerFinishedBody: 'Your roasting timer has finished!',
      PreNotification: 'Timer Reminder',
      MinutesRemaining: '%{minutes} minutes remaining',
    },
    Loading: 'Loading',
  },
  es: {
    SignIn: {
      Start: 'Iniciar',
      EnterYourIP: 'Introduce la dirección IP',
      Example: 'Ejemplo: 192.168.1.10',
      InvalidIP: 'La dirección IP no es válida.',
    },
    Tabs: {
      Dashboard: 'Gráficas',
      Controllers: 'Sistema',
      Timer: 'Temporizador',
      Settings: 'Opciones',
    },
    Dashboard: {
      Temperature: 'Temperatura',
      Humidity: 'Humedad',
    },
    Controller: {
      CurrentConfiguration: 'Configuración Actual',
      Status: 'Estado',
      StartingTemperature: 'Temperatura de inicio',
      Time: 'Tiempo',
      ControlMotors: 'Controlar Motores',
      SavedConfigurations: 'Configuraciones guardadas',
      NamePlaceholder: 'Introduce el nombre',
      TemperaturePlaceholder: 'Introduce la temperatura de inicio',
      TimePlaceholder: 'Introduce el tiempo en segundos',
      AddNewConfiguration: 'Anadir nueva configuración',
      Dialog: {
        ConfigurationWithThisNameAlreadyExists:
          'una configuración con este nombre ya existe',
        UseConfiguration: 'Usar esta configuración',
        NewConfiguration: 'Nueva configuración',
        DeleteConfiguration: 'Borrar configuración',
        DeleteConfigurationMessage: 'Está seguro de borrar esta configuración?',
        Save: 'Guardar',
        Cancel: 'Cancelar',
        Use: 'Usar',
        Delete: 'Borrar',
      },
      Buttons: {
        UseConfiguration: 'Usar configuración',
        Motor1: 'Motor 1',
        Motor2: 'Motor 2',
        Motor3: 'Motor 3',
      },
    },
    Timer: {
      Buttons: {
        // AddTime: 'Añadir tiempo',
        // ReduceTime: 'Reducir tiempo',
      },
    },
    Settings: {
      Language: 'Idioma',
      DeviceDefault: 'Predeterminado del dispositivo',
      Notifications: {
        Title: 'Notificaciones',
        Enable: 'Activar Notificaciones',
        Pre30: '30 minutos antes',
        Pre20: '20 minutos antes',
        Pre10: '10 minutos antes',
      },
      Buttons: {
        ActivateSystem: 'Activar Sistema',
        ForceStop: 'Forzar Detención',
        Restart: 'Reiniciar',
      },
    },
    Notifications: {
      TimerFinished: 'Temporizador Finalizado',
      TimerFinishedBody: '¡Tu temporizador de tueste ha terminado!',
      PreNotification: 'Recordatorio del Temporizador',
      MinutesRemaining: '%{minutes} minutos restantes',
    },
    Loading: 'Cargando',
  },
};

const i18n = new I18n(translations);

// When a value is missing from a language it'll fall back to another language with the key present.
i18n.enableFallback = true;

export const availableLanguages: Record<string, string> = {
  en: 'English',
  es: 'Español',
};

export const deviceLocale =
  getLocales()[0].languageCode ?? 'en';

export default i18n;
