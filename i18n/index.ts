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
      Status: 'Status',
      Mode: 'Mode',
      StartingTemperature: 'Starting Temperature',
      Time: 'Time',
      Buttons: {
        SaveControllerConfiguration: 'Save controller configuration',
        ActivateController: 'Activate controller',
      },
    },
    Timer: {},
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
      Status: 'Estado',
      Mode: 'Modo',
      StartingTemperature: 'Temperatura de inicio',
      Time: 'Tiempo',
      Buttons: {
        SaveControllerConfiguration: 'Guardar configuración del sistema',
        ActivateController: 'Activar sistema',
      },
    },
    Timer: {},
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
