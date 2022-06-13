# Trektor 🚜

Mit der Browsererweiterung Trektor 🚜 kann das Arbeitszeit-Tracking in Toggl von einer Trello-Karte aus gestartet werden. Sie fügt dazu der Kartenansicht zwei Knöpfe hinzu: `Trek Now` und `Toggl-Task hinzufügen`. Beide Knöpfe legen für die Karte einen Task in Toggl an, falls er noch nicht existiert; `Trek Now` startet diesen Task auch sofort. Der Karten-Titel erscheint dann in der Task-Description auf Toggl, während das Task-Kürzel (nur) auf Trello an das Ende des Titels angehängt wird.

Trektor ist nicht auf den öffentlichen Plattformen von Mozilla und Google Chrome verfügbar, sondern muss in den Browsern aus lokalen Dateien installiert werden, und zwar wir folgt:

# Installation

## Firefox

Firefox akzeptiert nur signierte Add-ons, daher signieren wir jede neue Version, bei diesem Vorgang wird Trekor in einem gepackten Format abgespeichert, einer .xpi-Datei. Du kannst sie von deinen freundlichen Kollegen bekommen, falls sie noch nicht hier auf Github zum Download angeboten werden. Um Trektor in Firefox zu verwenden, musst du das Add-on aus dieser Datei installieren, statt wie bei anderen Add-ons üblich aus der Mozilla-Platform. Gib dazu in das Adressfeld deines Firefox about:addons und ENTER ein, klick auf das Zahnrad rechts oben und wähl aus dem Menü »Add-on aus Datei installieren«. Nun musst du nur noch die .xpi-Datei auswählen – fertig installiert.

Als nächstes braucht das Add-on zum Arbeiten noch Zugangstoken für Toggl und Trello. Das kannst du ganz einfach in den Einstellungen des Add-ons machen, das nach der Installation in der Liste deiner Add-ons auf about:addons unten hinzugefügt worden ist. Die Links in der Einstellungsseite führen dich direkt auf die Seiten, auf denen du Token für Toggl und Trello generieren kannst; besonders einfach ist das, wenn du sowieso schon dort eingeloggt bist. Einmal die Token in die Einstellungsfelder kopiert, sollte das Add-on seine Arbeit tun.

## Google Chrome/Chromium

Im Gegensatz zu Firefox ist es in Google Chrome/Chromium möglich, ein Repo über alle Neustarts hinweg als lokal gespeicherte Erweitung im Browser zu registrieren. Eine Signierung ist nicht nötig. Also klon* das Repo an einen beliebigen Ort auf deinem Rechner und lass Chrome wissen, wo seine neue Erweiterung liegt: Einmal auf chrome://extensions/ gehen, rechts oben »Entwicklermodus« einschalten, es erscheint eine Schaltfläche »Entpackte Erweiterung laden«, und mithilfe dieser zeigst du Chrome das Verzeichnis, in das du das Repo geklont hast.

  > \* Wenn du nichts mit dem »Klonen eines Repos« anfangen kannst, lad es dir [hier](https://github.com/aboutsource/trektor/archive/refs/heads/main.zip) als Zip-Datei herunter. Entpack es an einen beliebigen Ort und verweis Chrome auf dieses Verzeichnis genau so wie gerade für das Repo-Verzeichnis beschrieben.
    
Als nächstes braucht die Erweiterung zum Arbeiten noch Zugangstoken für Toggl und Trello. Dazu klickst Du auf chrome://extensions/ auf den »Details«-Knopf von Trektor und auf der nächsten Seite auf »Optionen« (weiter unten). Die Links im Options-Popup führen dich direkt auf die Seiten, auf denen du Token für Toggl und Trello generieren kannst; besonders einfach ist das, wenn du sowieso schon dort eingeloggt bist. Einmal die Token in die Einstellungsfelder kopiert, sollte das Add-on seine Arbeit tun.
