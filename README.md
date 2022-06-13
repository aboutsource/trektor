# Trektor 🚜

Mit der Browser-Erweiterung Trektor 🚜 kann das Arbeitszeit-Tracking in Toggl von einer Trello-Karte aus gestartet werden. Sie fügt dazu der Kartenansicht zwei Knöpfe hinzu: »Trek Now« und »Toggl Task hinzufügen«. Beide Knöpfe legen für die Karte einen Task in Toggl an, falls er noch nicht existiert; »Trek Now« startet diesen Task auch sofort. Der Karten-Titel erscheint dann in der Task-Description auf Trello, während der Task-Name/Task-Kürzel (nur) auf der Trello-Karte an das Ende des Titels angehängt wird.

Trektor ist nicht auf den öffentlichen Plattformen von Mozilla und Google Chrome verfügbar, sondern muss in den Browsers aus lokalen Dateien installiert werden, und zwar wir folgt:

# Installation

## Firefox

Firefox akzeptiert nur signierte Add-ons, daher signieren wir jede neue Version, bei diesem Vorgang wird Trekor im gepackten Format gespeichert – eine .xpi-Datei entsteht. Du kannst sie von deinen freundlichen Kollegen bekommen, solange sie noch nicht hier auf Github zum Download angeboten werden. Um Trektor in Firefox zu verwenden, musst du das Add-on aus dieser Datei installieren, statt wie bei anderen Add-ons üblich aus der Mozilla-Platform. Gib dazu in das Adressfeld deines Firefox about:addons ein, klick auf das Zahnrad rechts oben und wähl aus dem Menü »Add-on aus Datei installieren«. Nun muss du nur noch die .xpi-Datei auswählen – fertig installiert.

Als nächstes braucht das Add-on zum Arbeiten noch Zugangstoken für Toggl und Trello. Das kannst du ganz einfach in den Einstellungen des Add-ons machen, das nach der Installation in der Liste auf about:addons unten hinzugefügt worden sein müsste. Die Links in der Einstellungsseite führen dich direkt auf die Seiten, auf denen du Token für Toggl und Trello generieren kannst; besonders einfach ist das, wenn du in diesem Firefox sowieso schon dort eingeloggt bist. Einmal die Token in die Einstellungsfelder kopiert, sollte das Add-on seine Arbeit tun.
