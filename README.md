# Development-Diplomarbeit
This is the development repository for our diplomarbeit.

## Installations-Guide
### 1. Installation der Angeforderten Programme
* node.js Version 22.11.0
* Postgresql: Folge den Schritten in diesen Guide[w3schools](https://www.w3schools.com/postgresql/postgresql_install.php) 

### 2. Installieren der Dependencies vom Project
* In der Konsole zu Development-Diplomarbeit\frontend\ navigieren.
* Befehl npm install in der Konsole ausführen.
* Starten von pgAdmin Programm zum erstellen der Datenbank.
    * Anmelden
        * Benutzername: postgres
        * Passwort: admin
    * Links Server und PostgreSQL ausklappen.
    * Databases rechtklicken und auf Create klicken.
        * Datenbankname: database_development

* In einer Konsole zu Development-Diplomarbeit\frontend\ navigieren
  und in einer anderen Konsole zu Development-Diplomarbeit\backend\ navigieren
* Im backend Befehl "node app.js" ausführen
* Um Default Roles hinzuzufügen führen Sie in einer weiteren Shell folgenden Befehl aus: "npx sequelize-cli db:seed:all"
* Obiges legt einen admin user (username "admin", password "admin") an; ein alternativer admin kann aber bereits vorab händisch in der Datenbank in der Users tabelle erstellt, dieser kann dann in der Applikation weitere Nutzer Registrieren `TODO: wie ist der bcrypt hash für diesen user korrekt zu erstellen?`.
* Im `backend` ist eine `.env` Datei zu erstellen 
```
RECAPTCHA_SECRET_KEY =
// Wenn Emailversand über smtp: 
USER_EMAIL = 
USER_PASS = 
// Sonst über:
MAILERSEND_API_KEY = 
MAILERSEND_FROM_EMAIL = 
```
So lange kein Emailversand verwendet wird, können die Werte auch leer gelassen werden.
* Im `frontend` ist ebenfalls eine `.env` Datei zu erstellen
```
REACT_APP_RECAPTCHA_SITE_KEY = 
REACT_APP_API_URL = http://localhost:5000
```
Für einen Entwicklungsserver kann der KEY anfangs auch leer gelassen werden.
* Im frontend Befehl "npm start" ausführen

### 3. Austesten
* Im Browser zu [localhost](http://localhost:3000/) gehen.
* Mit username `admin` und password `admin` anmelden
* Nutzer erstellen(registrieren)
* Umfragen erstellen und ausprobieren.


