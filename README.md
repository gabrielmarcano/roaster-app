<h1 align="center">
  Roaster App
</h1>

<p align="center">
  A real-time mobile companion for the <a href="../pyroaster">pyroaster</a> ESP32 IoT roasting controller.
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Expo-55-000020?logo=expo&logoColor=white" />
  <img src="https://img.shields.io/badge/React_Native-0.83-61DAFB?logo=react&logoColor=white" />
  <img src="https://img.shields.io/badge/TypeScript-5.9-3178C6?logo=typescript&logoColor=white" />
  <img src="https://img.shields.io/badge/platform-iOS%20%7C%20Android-lightgrey" />
</p>

---

## Overview

Roaster App connects to a [pyroaster](../pyroaster) device over Wi-Fi and provides live monitoring and control of a coffee or nut roasting session. It receives real-time sensor data via Server-Sent Events (SSE) and lets you manage the timer, motors, and roasting presets from your phone.

---

## Features

- **Live sensor dashboard** — real-time temperature and humidity charts updated every second via SSE
- **Circular timer** — HH:MM:SS countdown with +60 s / −60 s controls
- **Motor control** — toggle three independent motors (burner, fan, drum)
- **Roasting presets** — create, apply, and delete named configs (starting temperature + duration)
- **Offline preset creation** — presets created without a connection are queued locally and synced automatically on reconnect
- **Push notifications** — timer-finish alert plus optional 30 / 20 / 10 minute pre-notifications
- **Auto-reconnect** — exponential backoff (1 s → 30 s max) with a live connection indicator in the header
- **Bilingual UI** — English and Spanish, switchable at runtime
- **Dark Material Design 3** theme throughout

---

## Tech Stack

| Layer | Library |
|---|---|
| Framework | [Expo](https://expo.dev) SDK 55 / React Native 0.83 |
| Language | TypeScript 5.9 |
| Navigation | Expo Router v4 (file-based) |
| UI | [React Native Paper](https://reactnativepaper.com) (Material Design 3) |
| Server state | [TanStack Query](https://tanstack.com/query) v5 |
| HTTP | Axios |
| Real-time | `react-native-sse` (SSE) |
| Storage | `expo-secure-store` |
| Notifications | `expo-notifications` |
| Charts | `react-native-gifted-charts` |
| i18n | `i18n-js` v4 |

---

## Project Structure

```
roaster-app/
├── app/
│   ├── (tabs)/
│   │   ├── index.tsx          # Dashboard — live sensor charts
│   │   ├── controllers.tsx    # Motors + roasting presets
│   │   ├── timer.tsx          # Circular countdown timer
│   │   └── settings.tsx       # Language, notifications, device controls
│   ├── sign-in.tsx            # Device IP entry / session setup
│   └── _layout.tsx            # Root provider tree
├── api/
│   ├── api.ts                 # Axios request functions
│   ├── queries.ts             # TanStack Query hooks
│   └── types.ts               # Shared TypeScript types
├── components/
│   ├── CircularProgress.tsx   # SVG ring timer display
│   ├── TemperatureChart.tsx
│   └── HumidityChart.tsx
├── contexts/
│   ├── sseContext.tsx         # SSE connection + auto-reconnect
│   ├── sessionContext.tsx     # Device IP / auth
│   ├── localConfigContext.tsx # Offline preset queue
│   ├── notificationsContext.tsx
│   └── localeContext.tsx
├── hooks/
│   ├── useNotificationScheduler.ts
│   └── useSyncPendingConfigs.ts
└── i18n/index.ts              # English + Spanish translations
```

---

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org) ≥ 18
- A physical device or emulator running iOS or Android
- A [pyroaster](../pyroaster) device on the same Wi-Fi network (or its AP hotspot)

### Install

```bash
npm install
```

### Run (Expo Go / development)

```bash
npm start          # opens Expo DevTools
npm run android    # launch on Android
npm run ios        # launch on iOS
```

> **Note:** Push notifications require a custom dev build, not Expo Go.

### Build (custom dev client via EAS)

```bash
npx eas build --profile development --platform android
```

---

## Connecting to the Device

On the sign-in screen, enter the IP address of your pyroaster device:

- **AP mode (direct):** `192.168.4.1` — the ESP32 acts as its own hotspot
- **STA mode (router):** the IP assigned by your router — check the device LCD or your router's DHCP table

The session is stored securely on-device so you only need to sign in once.

---

## Backend

This app is the companion to **[pyroaster](../pyroaster)**, a MicroPython server running on an ESP32. See its README for hardware setup, pin wiring, and firmware flashing instructions.

---

## License

Private project — all rights reserved.
