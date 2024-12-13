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
**Aktuell wichtig:**
* Im backend/models/polls.js die allowNull werte von publish_date und end_date auf true setzten.

* In einer Konsole zu Development-Diplomarbeit\frontend\ navigieren
  und in einer anderen Konsole zu Development-Diplomarbeit\backend\ navigieren
* Im backend Befehl "node app.js" ausführen
* Im frontend Befehl "npm start" ausführen

### 3. Austesten
* Im Browser zu [localhost](http://localhost:3000/) gehen.
* Nutzer erstellen(registrieren)
* Umfragen erstellen und ausprobieren.


