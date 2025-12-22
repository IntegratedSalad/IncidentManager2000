# Zarządzanie tokenami OAuth2 - Implementacja

## Przegląd

Implementacja obsługuje Bearer tokens OAuth2 (Microsoft) bez przechowywania ich w sesji NextAuth. Token jest przechowywany w stanie aplikacji i automatycznie dołączany do każdego żądania API.

## Architektura

### 1. NextAuth Konfiguracja (`pages/api/auth/[...nextauth].js`)

- Używa `MicrosoftProvider` z scopami: `openid profile email user.read`
- JWT callback przechowuje token dostępu w JWT
- Session callback przekazuje token do sesji dostępnej na frontendzie
- Strategy: JWT zamiast database session

```javascript
callbacks: {
  async jwt({ token, account }) {
    if (account) {
      token.accessToken = account.access_token
      token.refreshToken = account.refresh_token
    }
    return token
  },
  async session({ session, token }) {
    session.accessToken = token.accessToken
    session.refreshToken = token.refreshToken
    return session
  },
}
```

### 2. AuthContext (`context/AuthContext.tsx`)

Centralny zarząd tokenem aplikacji:

- **accessToken** - przechowywany w stanie React (useState)
- **localStorage** - opcjonalnie (dla rekuperacji sesji)
- Automatycznie wyciąga token z sesji NextAuth
- Dostępny poprzez hook `useAuth()`

```typescript
const [accessToken, setAccessToken] = useState<string | null>(null);

useEffect(() => {
  if (session?.accessToken) {
    setAccessToken(session.accessToken);
    localStorage.setItem('accessToken', session.accessToken);
  } else if (!session) {
    setAccessToken(null);
    localStorage.removeItem('accessToken');
  }
}, [session]);
```

### 3. API Helper (`lib/api.ts`)

Funkcja `fetchWithToken` dołącza automatycznie Bearer token:

```typescript
export const fetchWithToken = async (
  url: string,
  options: RequestInit & { token?: string } = {}
) => {
  const headers = {
    'Content-Type': 'application/json',
    ...(options.headers || {}),
  } as Record<string, string>;

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  return fetch(url, {
    ...options,
    headers,
  });
};
```

Wszystkie funkcje API (incidentAPI, userAPI) przyjmują opcjonalny token:

```typescript
async create(data: any, token?: string) {
  const response = await fetchWithToken(`${API_BASE_URL}/incidents`, {
    method: 'POST',
    body: JSON.stringify(data),
    token,
  });
  if (!response.ok) throw new Error('Failed to create incident');
  return response.json();
}
```

### 4. Hook useAuthenticatedAPI (`lib/useAuthenticatedAPI.ts`)

Upraszcza wywoływanie API z automatycznym tokenem:

```typescript
const { incidentAPI, userAPI, fetchWithToken } = useAuthenticatedAPI();

// Użycie - token jest automatycznie dołączany
await incidentAPI.getAll(); // ← token wzbogacony automatycznie
await incidentAPI.create(data);
```

## Użycie w komponentach

### Przykład: Załadowanie incydentów

```typescript
'use client';

import { useAuth } from '@/context/AuthContext';
import { useAuthenticatedAPI } from '@/lib/useAuthenticatedAPI';
import { useEffect, useState } from 'react';

export default function Home() {
  const { isAuthenticated, accessToken } = useAuth();
  const { incidentAPI } = useAuthenticatedAPI();
  const [incidents, setIncidents] = useState([]);

  useEffect(() => {
    if (accessToken) {
      loadIncidents();
    }
  }, [accessToken]);

  const loadIncidents = async () => {
    try {
      const data = await incidentAPI.getAll(); // ← token automatycznie!
      setIncidents(data);
    } catch (err) {
      console.error('Failed to load incidents:', err);
    }
  };

  return (
    // ...
  );
}
```

### Bezpośredni dostęp do fetchWithToken

```typescript
const { fetchWithToken } = useAuthenticatedAPI();

const response = await fetchWithToken('https://graph.microsoft.com/v1.0/me', {
  method: 'GET',
});
const userData = await response.json();
```

## Flow autoryzacji

```
1. Użytkownik klika "Zaloguj się przez Microsoft"
   ↓
2. NextAuth uzyskuje token dostępu od Microsoftu
   ↓
3. JWT callback przechowuje token w JWT
   ↓
4. Session callback przekazuje token do sesji
   ↓
5. useSession() na frontendzie zwraca session.accessToken
   ↓
6. AuthContext przechowuje token w stanie
   ↓
7. useAuthenticatedAPI() dołącza token do każdego żądania
```

## Bezpieczeństwo

⚠️ **Ważne**: JWT token jest przechowywany w pamięci (RAM) aplikacji. localStorage jest opcjonalny dla rekuperacji sesji.

- Token **NIE** jest wysyłany do backendu w każdym żądaniu (chyba że to żądanie wyraźnie wymaga autoryzacji)
- Token jest dostępny tylko na frontendzie w stanie React
- NextAuth obsługuje automatyczne odświeżanie tokenów (refresh_token)

## Backend - Weryfikacja tokenu

Jeśli backend chce zweryfikować token, może sprawdzić nagłówek `Authorization`:

```typescript
// Backend (np. Next.js API route)
export default async function handler(req, res) {
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) {
    return res.status(401).json({ error: "Brak tokenu dostępu" });
  }

  // Weryfikacja tokenu (np. za pośrednictwem Microsoft Graph)
  const response = await fetch("https://graph.microsoft.com/v1.0/me", {
    headers: { Authorization: `Bearer ${token}` },
  });

  if (!response.ok) {
    return res.status(401).json({ error: "Nieprawidłowy token" });
  }

  const userData = await response.json();
  res.status(200).json({ user: userData });
}
```

## Zmienne środowiskowe

Upewnij się, że `.env.local` zawiera:

```
MICROSOFT_ID=your_client_id
MICROSOFT_SECRET=your_client_secret
NEXTAUTH_SECRET=your_nextauth_secret
NEXTAUTH_URL=http://localhost:3000 (lub production URL)
NEXT_PUBLIC_API_URL=https://your-api.com/api
```

## Migracja istniejącego kodu

Jeśli komponenty używały `incidentAPI` bez tokenu:

```typescript
// Przed
const data = await incidentAPI.getAll();

// Po (automatycznie z useAuthenticatedAPI)
const { incidentAPI } = useAuthenticatedAPI();
const data = await incidentAPI.getAll();
```

Lub bez hooka:

```typescript
// Bezpośredni dostęp (musisz sam przekazać token)
import { useAuth } from '@/context/AuthContext';

const { accessToken } = useAuth();
const data = await incidentAPI.getAll(accessToken);
```

## Testowanie

### 1. Sprawdzenie czy token jest przechowywany

```javascript
// W devtools
console.log(localStorage.getItem('accessToken'));
// lub
const { accessToken } = useAuth(); // w komponencie
console.log(accessToken);
```

### 2. Sprawdzenie czy token jest dołączany do żądań

Otwórz Network tab w DevTools i sprawdź żądania:

```
Authorization: Bearer eyJhbGciOiJSUzI1NiIsInR5cC...
```

### 3. Testowanie z Microsoft Graph API

```typescript
const { fetchWithToken } = useAuthenticatedAPI();

const response = await fetchWithToken('https://graph.microsoft.com/v1.0/me');
const userData = await response.json();
console.log(userData); // Dane profilu użytkownika z Microsoftu
```
