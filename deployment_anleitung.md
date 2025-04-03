# Deployment Anleitung

Diese Anleitung beschreibt Schritt für Schritt, wie du unser Projekt auf einem Ubuntu-Server aufsetzen kannst.    # Test

---

## 1. Benötigte Dienste installieren

Zuerst aktualisieren wir das System und installieren alle nötigen Pakete:

```bash
sudo apt update && sudo apt upgrade -y
```

### Node.js:
```bash
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt install -y nodejs
```

### PM2:
```bash
sudo npm install -g pm2
```

### Nginx:
```bash
sudo apt install -y nginx
sudo systemctl start nginx
sudo systemctl enable nginx
```

### PostgreSQL:
```bash
sudo apt install -y postgresql postgresql-contrib
sudo systemctl start postgresql
sudo systemctl enable postgresql
```

### Certbot:
```bash
sudo apt install certbot python3-certbot-nginx -y
```

### Git:
```bash
sudo apt install git
```

---

## 2. PostgreSQL einrichten

```bash
sudo -u postgres psql
```

Dann innerhalb der SQL-Konsole:

```sql
CREATE DATABASE dein_db_name;
CREATE USER dein_username WITH PASSWORD 'dein_passwort';
GRANT ALL PRIVILEGES ON DATABASE dein_db_name TO dein_user_name;
\q
```

---

## 3. Projekt klonen

1. Gehe auf: (https://github.com/Max-Hierzer/Development-Diplomarbeit)
2. Klicke auf **Code** und kopiere die URL
3. Dann im Terminal:

```bash
git clone <url>
```

---

## 4. Backend einrichten

```bash
cd Development_Diplomarbeit/backend
npm install
```

### `.env` Datei erstellen:

```bash
nano .env
```

Beispielinhalt:

```
RECAPTCHA_SECRET_KEY=...
USER_EMAIL=...                  # Zum Versand von Einladungs-Mails
USER_PASS=...

# Falls E-Mail über SMTP nicht funktioniert:
MAILERSEND_API_KEY=...          # Alternativer E-Mail-Versand via Mailersend API
MAILERSEND_FROM_EMAIL=noreply@domain
```

### Datenbankverbindung konfigurieren:

```bash
nano config/config.json
```

→ Ändere die `production`-Einträge auf die in Schritt 2 erstellten DB-Zugangsdaten. (username, password, database)

---

## 5. Backend starten mit PM2

```bash
NODE_ENV=production pm2 start app.js --name backend-app
NODE_ENV=production npx sequelize-cli db:seed:all
pm2 startup
pm2 save
```

---

## 6. Frontend Build erstellen

```bash
cd ..
cd frontend
npm install
```


- Startet das Backend in Produktionsumgebung
- Führt DB-Seeds aus (Befüllt initiale Daten)
- Macht PM2 autostart-fähig beim Server-Neustart
### `.env` Datei erstellen:

```bash
nano .env
```

Beispielinhalt:

```
REACT_APP_RECAPTCHA_SITE_KEY=...
REACT_APP_API_URL=https://domain.de   # URL zum Backend
```

→ Danach den Produktionsbuild erzeugen:

```bash
npm run build
```

---

## 7. Nginx konfigurieren

### Neue Nginx-Site anlegen:

```bash
sudo nano /etc/nginx/sites-available/domain_name
```

Inhalt:

```nginx
server {
    listen 80;
    server_name domain_name www.domain_name;

    location / {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

Dann aktivieren:

```bash
sudo ln -s /etc/nginx/sites-available/domain_name /etc/nginx/sites-enabled/
```

Konfiguration testen und Webserver neustarten:

```bash
sudo nginx -t
sudo systemctl restart nginx
```

---

## 8. HTTPS aktivieren mit Certbot

```bash
certbot --nginx -d domain -d www.domain
```

- Gib deine E-Mail-Adresse ein
- Bestätige mit `y`, um Zertifikat automatisch zu erneuern
- `n`, wenn du keine Umleitung von HTTP auf HTTPS möchtest (ansonsten `y`)

---

## ✅ Deployment abgeschlossen!

Dein Projekt sollte jetzt unter deiner Domain mit HTTPS erreichbar sein!
