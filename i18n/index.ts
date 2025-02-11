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
      Configuration: 'Configuration',
      Status: 'Status',
      Mode: 'Mode',
      StartingTemperature: 'Starting Temperature',
      Time: 'Time',
      SavedConfigurations: 'Saved Configurations',
      NamePlaceholder: 'Set the name',
      TemperaturePlaceholder: 'Set the starting temperature',
      TimePlaceholder: 'Set the time in seconds',
      AddNewConfiguration: 'Add new configuration',
      Dialog: {
        NewConfiguration: 'New configuration',
        DeleteConfiguration: 'Delete configuration',
        DeleteConfigurationMessage:
          'Are you sure you want to delete this configuration?',
        Save: 'Save',
        Cancel: 'Cancel',
        Delete: 'Delete',
      },
      Buttons: {
        UseConfiguration: 'Use configuration',
        ActivateController: 'Activate controller',
        StopController: 'Stop controller',
      },
    },
    Timer: {
      Buttons: {
        AddTime: 'Add time',
        ReduceTime: 'Reduce time',
      },
    },
    Settings: {},
    Loading: 'Loading',
    Start: 'Start',
    SignOut: 'Sign Out',
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
      Configuration: 'Configuración',
      Status: 'Estado',
      Mode: 'Modo',
      StartingTemperature: 'Temperatura de inicio',
      Time: 'Tiempo',
      SavedConfigurations: 'Configuraciones guardadas',
      NamePlaceholder: 'Introduce el nombre',
      TemperaturePlaceholder: 'Introduce la temperatura de inicio',
      TimePlaceholder: 'Introduce el tiempo en segundos',
      AddNewConfiguration: 'Anadir nueva configuración',
      Dialog: {
        NewConfiguration: 'Nueva configuración',
        DeleteConfiguration: 'Borrar configuración',
        DeleteConfigurationMessage: 'Está seguro de borrar esta configuración?',
        Save: 'Guardar',
        Cancel: 'Cancelar',
        Delete: 'Borrar',
      },
      Buttons: {
        UseConfiguration: 'Usar configuración',
        ActivateController: 'Activar sistema',
        StopController: 'Detener sistema',
      },
    },
    Timer: {
      Buttons: {
        AddTime: 'Añadir tiempo',
        ReduceTime: 'Reducir tiempo',
      },
    },
    Settings: {},
    Loading: 'Cargando',
    Start: 'Empezar',
    SignOut: 'Cerrar Sesión',
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
