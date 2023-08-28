# webunits-google-calendar

### #Projektidee

Dieses Projekt synchronisiert die Webbunits-Kalender mit dem öffentlichen Google-Kalender. Dadurch können Benutzer sich in den Kalender einloggen und den Kalender direkt von jeder Kalender-App aus abrufen, die sie verwenden.

### #Verwendung

0. Zuerst musst du die Pakete mit dem Befehl `npm install` herunterladen.
1. Anschließend musst du eine neue Anwendung in der Google Console-Dienst und einen OAuth2-Client erstellen.
2. Verwende dann den Befehl `npm run oauth`, um einen Link zu erstellen, der es dir ermöglicht, die Anwendung von dem Konto aus auszuführen, das du steuern möchtest.
3. Nach dem Anmelden wird der Benutzer auf die Seite weitergeleitet, die du im OAuth2-Client festgelegt hast. Du kannst den Wert des Codes in diesem Link finden.
4. Danach benötigst du GOOGLE_REFRESHTOKEN. Du kannst es über den Befehl `npm run token` erhalten, aber zuerst musst du den Wert von GOOGLE_AUTHORIZATION_CODE in der env-Datei  festlegen.
5. Kopiere diesen Wert und füge ihn in die env-Datei ein.
6. Du musst auch einen öffentlichen Google-Kalender erstellen und seinen Namen in der env-Datei (im Feld GOOGLE_PUBLIC_CALENDAR_NAME) angeben.

> Die Datei .env.example enthält alle Informationen, die du zum Starten  des Projekts benötigst.
> 
> Nachdem du dies getan hast, kannst du die cron-Funktion verwenden, um das Skript alle zwei Stunden auszuführen, um die Änderungen zu synchronisieren.

### #WeitereDetails

- Das Skript verwendet die API von Webbunits, um die Kalender abzurufen.
- Die Kalender werden in JSON-Format konvertiert und dann in den Google-Kalender hochgeladen.
- Das Skript wird alle zwei Stunden ausgeführt, um sicherzustellen, dass die Kalender immer aktuell sind.