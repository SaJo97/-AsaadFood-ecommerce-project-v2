# Asaad Food B2B ehandelhemsida

# Projektbeskrivning:

Detta är en fullstack javascript projekt för en B2B handelhemsida som använder sig av visma för utbetalning. Byggd med MERN (MongoDB, Express, React, Node.js). Den är utformad att hantera produkter och beställningar, inloggning (autentisering), det också finns kontakt möjligheter och information om organistationen samt erbjuder en RESTful API för att interagera med databasen. Backend-lösningen är kopplad till en NoSQL-databas (MongoDB). Frontend-lösningen av projektet är byggd med React och TailwindCSS och utvecklades i Visual Studio Code. Projektet har också en adminsida där man hantera produkter (ändra, ta bort & skapa) och användare (ändra roll & ta bort). Inloggade användare kan ändra lösenord, mobilnummer, fakturaadress, gatuadress, postnummer & stad.

## Funktionalitet

### Backend-lösning erbjuder följande funktioner och testas med POSTMAN:
#### Produkter
* Lista av alla produkter
* Hämta enstaka produkt
* Skapa ny produkt
* Ändra produkt
* Ta bort produkt
#### Användare
* Registrera användare
* Logga in användare
* Hämta och hantera alla användare
* Uppdatera användar roll
* Ta bort användare
* Hämta nuvarande användare
* Kontrollera autentisering
* Uppdatera åtkomsttoken
* Uppdatera användar information
* Logga ut
#### Ordrar
* Skapa en beställning
* Hämta alla ordrar - ej tillagd i frontend
* Hämta specifik order - ej tillagd i frontend
#### Meddelande
* Skapa och skicka meddelande

#### Produkt
* POST /api/product/ - Skapa produkt
* GET /api/product/ - Hämta alla produkter
* GET /api/product/:id - Hämta specifik produkt
* PUT /api/product/:id - Uppdatera produkt
* DELETE /api/product/:id - Ta bort produkt

#### Användare
* POST /api/register - Registrera
* POST /api/login - Logga in
* GET /api/users - Hämta alla användare
* GET /api/users/:id - hämta specifik användare
* PUT /api/users/:id - uppdatera användare info
* PUT /api/users/:id/role - uppdatera användar roll
* DELETE /api/users/:id - ta bort användare
* GET /api/me - kontrollera autentisering
* POST /api/refresh - uppdatera åtkomsttoken
* POST /api/logout - logga ut

#### Ordrar
* POST /api/ - Skapa order
* GET /api/ - Hämta alla ordrar - ej tillag i frontend
* GET /api/:orderId - hämta specifik order - ej tillagd i frontend

#### Meddelande
* POST /api/ - Skapa & skicka meddelande

# Installation
Följ dessa steg för att installera och köra projektet lokalt:
* Klona repositoryt:
* git clone https://github.com/ditt-användarnamn/ditt-repo-namn.git cd ditt-repo-namn

* Skapa en .env-fil i rotmappen(backend) och lägg till dina miljövariabler, inklusive databasanslutning och JWT-hemlighet:

* PORT=din_PORT
* MONGODB_URI=din_mongodb_uri
* ACCESS_TOKEN_SECRET=din_jwt_hemlighet
* REFRESH_TOKEN_SECRET=din_jwt_hemlighet
* NODE_ENV = production
* EMAIL_USER= ditt epost
* EMAIL_PASS= din epost app lösenord - måste genereras
* ADMIN_EMAIL= epost där meddelanden ska skickas till
* VISMA_CLIENT_ID= visma id som kan hämtas från vimsa
* VISMA_CLIENT_SECRET= visma hemlighet som kan hämtas från visma

* Skapa en .env-fil i rotmappen(frontend)
* VITE_PORT = din_port

# Kör detta kommando i terminalen för att installera nödvändiga paket:

### npm run build

## Starta servern:

### npm start

Servern bör nu vara igång på http://localhost:din_PORT/.

## Källor för använda produkter

Bilder som används i detta projekt har hämtats från www.google.se sökt på Basso(logo, produkt & reklam), Mahmood rice(logo & reklam), Double Kangaroo(logo), Sevimli(logo) & SmartChef(logo). Se till att ge korrekt kredit och följa licensvillkor för dessa resurser.

## Teknologier
### Projektet användar följande teknologier:
#### Backend : Node.js, Express, Javascript
#### Frontend : Javascript, React, Tailwind CSS, ShadCn
#### Databas : MongoDB
#### Utvecklingsmiljö: Visual Studio Code