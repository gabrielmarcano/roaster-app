import { getLocales } from 'expo-localization';
import { I18n } from 'i18n-js';

const translations = {
  en: {
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
        AddTime: 'Add time',
        ReduceTime: 'Reduce time',
      },
    },
    Settings: {
      Buttons: {
        ForceStop: 'Force Stop',
        ActivateSystem: 'Activate System',
      },
    },
    Loading: 'Loading',
    Start: 'Start',
  },
  es: {
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
        AddTime: 'Añadir tiempo',
        ReduceTime: 'Reducir tiempo',
      },
    },
    Settings: {
      Buttons: {
        ForceStop: 'Forzar Detención',
        ActivateSystem: 'Activar Sistema',
      },
    },
    Loading: 'Cargando',
    Start: 'Empezar',
  },
};

const i18n = new I18n(translations);

// Set the locale once at the beginning of your app.
i18n.locale = getLocales()[0].languageCode ?? 'en';

// When a value is missing from a language it'll fall back to another language with the key present.
i18n.enableFallback = true;

// Manually select a locale
i18n.locale = 'es';

export default i18n;
