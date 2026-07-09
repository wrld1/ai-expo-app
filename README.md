# Description

Мобільний клієнт, побудований на базі **React Native** та **Expo**. Він має 3 основні сторінки: аналіз страви, історія сканувань та налаштування персонального профілю (вік, стать, алергії). Основні сторінки лежать в (app), компоненти для них в папці Components, логіка посилання/обробки реквесту в api/analyze.ts

# Welcome to your Expo app 👋

This is an [Expo](https://expo.dev) project created with [`create-expo-app`](https://www.npmjs.com/package/create-expo-app).

## Get started

1. Install dependencies

   ```bash
   npm install
   ```

2. Тестував локально з Expo Go, тому в env треба вказувати ip мережі щоб додаток коректно працював:

```
EXPO_PUBLIC_API_URL=http://<ВАШ_IP_АДРЕС>:3000
```

3. Start the app

   ```bash
   npx expo start
   ```

Ви можете відкрити застосунок за допомогою додатку Expo Go на вашому смартфоні (просканувавши QR-код)

---

In the output, you'll find options to open the app in a

- [development build](https://docs.expo.dev/develop/development-builds/introduction/)
- [Android emulator](https://docs.expo.dev/workflow/android-studio-emulator/)
- [iOS simulator](https://docs.expo.dev/workflow/ios-simulator/)
- [Expo Go](https://expo.dev/go), a limited sandbox for trying out app development with Expo
