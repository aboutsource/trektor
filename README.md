# Trektor 🚜

Mit der Browsererweiterung Trektor 🚜 kann das Arbeitszeit-Tracking in Toggl von einer Trello-Karte aus gestartet werden. Trektor fügt dazu der Kartenansicht zwei Knöpfe hinzu: `Trek Now` und `Toggl-Task hinzufügen`. Beide Knöpfe legen für die Karte einen Task in Toggl an, falls er noch nicht existiert; `Trek Now` startet diesen Task auch sofort. Der Karten-Titel erscheint dann in der Task-Description auf Toggl, während das Task-Kürzel (nur) auf Trello an das Ende des Titels angehängt wird.

Trektor ist nicht auf den öffentlichen Plattformen von Mozilla und Google Chrome verfügbar, sondern muss in den Browsern aus lokalen Dateien installiert werden, und zwar wir folgt:

# Installation

## Firefox

Firefox akzeptiert nur signierte Add-ons, daher signieren wir jede neue Version, bei diesem Vorgang wird Trektor in einem gepackten Format abgespeichert, einer .xpi-Datei. Du kannst sie von deinen freundlichen Kollegen bekommen (und vielleicht wird sie in Zukunft auch hier auf Github automatisch zum Download angeboten). Um Trektor in Firefox zu verwenden, musst du das Add-on aus dieser Datei installieren, statt wie bei anderen Add-ons üblich aus der Mozilla-Plattform. Gib dazu in das Adressfeld deines Firefox about:addons und ENTER ein, klick danach auf das Zahnrad rechts oben und wähl schließlich von dem Menü »Add-on aus Datei installieren«. Nun musst du nur noch die .xpi-Datei auswählen – fertig installiert.

Als nächstes braucht das Add-on zum Arbeiten noch Zugangstoken für Toggl und Trello. Das kannst du ganz einfach in den Einstellungen des Add-ons machen, die erreichst du über die drei Punkte im Trektor-Listeneintrag auf about:addons. Die Links in der Einstellungsseite führen dich direkt auf die Seiten, auf denen du Token für Toggl und Trello generieren kannst; besonders einfach ist das, wenn du sowieso schon dort eingeloggt bist. Einmal die Token in die Einstellungsfelder kopiert, sollte das Add-on seine Arbeit tun.

## Google Chrome/Chromium

Im Gegensatz zu Firefox ist es in Google Chrome/Chromium ohne Signierung möglich, ein lokales Repo als Erweitung im Browser zu registrieren, ohne dass sie bei Neustarts verloren geht. Also klon* dir einfach das Repo an einen beliebigen Ort auf deinem Rechner und lass Chrome wissen, wo seine neue Erweiterung liegt: Einmal auf chrome://extensions/ gehen, rechts oben »Entwicklermodus« einschalten, es erscheint eine Schaltfläche »Entpackte Erweiterung laden«, und mithilfe dieser zeigst du Chrome das Verzeichnis, in das du das Repo geklont hast.

  > \* Wenn du nichts mit dem »Klonen eines Repos« anfangen kannst, lad es dir [hier](https://github.com/aboutsource/trektor/archive/refs/heads/main.zip) als Zip-Datei herunter. Entpack es an einen beliebigen Ort und verweis Chrome auf dieses Verzeichnis genau so wie gerade für das Repo-Verzeichnis beschrieben.
    
Als nächstes braucht die Erweiterung zum Arbeiten noch Zugangstoken für Toggl und Trello. Dazu klickst Du auf chrome://extensions/ auf den »Details«-Knopf von Trektor und auf der nächsten Seite auf »Optionen« (recht weit unten). Die Links im Options-Popup führen dich direkt auf die Seiten, auf denen du Token für Toggl und Trello generieren kannst; besonders einfach ist das, wenn du sowieso schon dort eingeloggt bist. Einmal die Token in die Einstellungsfelder kopiert, sollte das Add-on seine Arbeit tun.
