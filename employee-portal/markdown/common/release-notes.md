GA-Lotse ist ein Kooperationsprojekt des Gesundheitsamts Frankfurt am Main mit dem Hessisches Ministerium für Familie, Senioren, Sport, Gesundheit und Pflege.

Finanziert von der Europäischen Union – NextGenerationEU

## GA-Lotse 1.4

_04.12.2024_

Fünfte Release der Anwendung GA-Lotse.

### Einschulungsuntersuchungen:

* Erstellen von Vorgängen
  * Import von bereits erfolgten Untersuchungen für die Statistik
* Planung
  * Massendownload von Einladungen zur Einschulungsuntersuchung

### Begehung:

* Historie von Begehungen
* Posteingänge in Vorgänge umwandeln
* Untersagte Einrichtungen
  * Untersagung einer Einrichtung auslösen
  * Untersagung einer Einrichtung zurücknehmen
  * Filtern nach untersagten Einrichtungen
  * untersagte Einrichtungen exportieren

## GA-Lotse 1.3

_20.11.2024_

Vierter Release der Anwendung GA-Lotse.

### Grundfunktionen:

* Auditlog
  * Aufzeichnung in verschlüsselten Logs
  * Freigabe der Logs nach dem 4-Augen-Prinzip
  * Entschlüsseln der Logs für Personalratsmitglieder
* Kontaktmanagement
  * Zusammenführen von Kontakten

## GA-Lotse 1.2

_04.11.2024_

Dritter Release der Anwendung GA-Lotse.

### Einschulungsuntersuchungen:

* Untersuchungstag
  * Schließen eines Vorgangs nach Abschluss der Untersuchung
  * Wiedereröffnung eines geschlossenen Vorgangs

### Begehung:

* Planung
  * Verwendung von Packlisten um Nichts zu vergessen
* Ausführung
  * Unterstützung von Audionotizen in Checklisten
* Konfiguration
  * Definition von Packlisten pro Objekttyp
  * Definition von Audio-Elementen in Definitionen von Checklisten

## GA-Lotse 1.1

_21.10.2024_

Zweiter Release der Anwendung GA-Lotse.

### Grundfunktionen:

* Anmeldeprotokoll
  * Historie von erfolgreichen und fehlgeschlagenen Loginversuchen
* Aktive Sitzungen
  * Sitzungen einsehen und trennen

### Einschulungsuntersuchungen:

* Erstellen von Vorgängen
  * Vorgangszusammenführung und Duplikateprüfung bei Listenimport
  * Erfassung des Schuljahres an Vorgängen
* Planung
  * Vorgangssuche nach Wissensfaktoren (Vorname, Nachname, Geburtstag)
  * Löschung von leeren Vorgängen
* Untersuchungstag
  * Übersicht über geplante heutige Untersuchungen im Wartezimmer
  * Erstellung von Arztbriefen
  * Erstellung des Schulinfobriefs

## GA-Lotse 1.0

_26.09.2024_

Erster Release der neuen Anwendung GA-Lotse für Gesundheitsämter.

### Einschulungsuntersuchungen:

* Unterstützung der Mitarbeitenden des Gesundheitsamtes bei Planung und Durchführung von Einschulungsuntersuchungen
* Erstellen von Vorgängen
  * Manuelles Anlegen von Vorgängen inklusive Kindern und Personensorgeberechtigten
  * Import von Bürgeramtslisten und Schullisten mithilfe einer Excel-Tabelle, Prüfung auf Duplikate und fehlerhafte Datensätze
  * Zuordnung der Untersuchungsart (Regeluntersuchung, Kann-Kind, Eingangsstufe, Besonderer Förderbedarf), Vorschläge anhand des Alters und Daten aus der Schulliste
  * Anlegen und Zuordnen von Kennungen zu Vorgängen
* Planung
  * Planen von Terminblöcken für die Schuleingangsuntersuchungen
  * Zuordnung von Arzt:innen und MFA zu den Terminblöcken inklusive Verfügbarkeitsprüfung
  * Berücksichtigung unterschiedlicher Untersuchungslängen für Kinder mit potenziell erhöhtem Förderbedarf
  * Manuelle Terminvergabe durch die Mitarbeitenden anhand der zugeordneten Untersuchungsart
  * Automatische Massen-Terminvergabe über die Vorgangsübersicht anhand der zugeordneten Untersuchungsart
  * Erstellung von Einladungen mit QR-Code für den Zugang zum Bürgerportal
  * Terminverschiebung und Selbst-Anamnese im Bürgerportal durch Personensorgeberechtigte
* Untersuchungstag
  * Vervollständigung der von den Personensorgeberechtigten vorausgefüllte Anamnese
  * Erfassung des Impfstatus
  * Erfassung des Hörscreenings, Sehscreenings, der S1-SOPESS-2024-Untersuchung und S1-Befunds
  * Bei körperlichen Untersuchungen und Feststellungen von Handicaps werden mögliche Befunde mithilfe von ICD-10 Codes festgehalten
  * Gewicht, Größe und BMI des Kindes werden mit Referenzperzentilen bewertet
  * Übermittlung der ESU-Kennzahlen an das Statistikmodul

### Begehungen:

* Unterstützung der Mitarbeitenden des Gesundheitsamtes bei der Hygieneüberwachung von Einrichtungen
* Erstellen von Vorgängen
  * Erfassung von Einrichtungen: Name, Objekt-Typ, Adressen, Kontaktmöglichkeiten
  * Manuelles Anlegen von Vorgängen für Einrichtungen
  * Automatische Websuche nach neuen Einrichtungen (Quelle OpenSteetMap) und Hinzufügen zum Stammdaten-Konverter
  * Anlegen von Vorgängen für neu gefundene Einrichtungen
* Planung
  * Planung des Begehungstermins
  * Auswahl der anzuwendenden Checklisten
  * Reservierung von Inventar über die Inventarverwaltung
  * Buchung von Ressourcen wie Fahrzeuge, Fahrräder, Räume
  * Aufruf eines Routenplaners
* Ausführung
  * Ausfüllen von Checklisten
  * Hochladen von Bildern
  * Erfassung weiterer Vorkommnisse
  * Offline-Modus: Ausführung auch ohne Internetverbindung möglich
  * Abschließen der Begehung, optional mit Erfassung der Unterschrift eines Teilnehmenden
* Erstellung eines Begehungsprotokolls
  * Automatische Erstellung eines Begehungsprotokolls mit den ausgefüllten Checklisten und Vorkommnissen
  * Möglichkeit zur Bearbeitung des Begehungsprotokolls
  * Erstellung eines PDF-Dokuments für das Begehungsprotokoll
  * Abschließen des Vorgangs mit Planung eines Nachfolgetermins
* Konfiguration
  * Einstellungen für Objekt-Typen, z.B. Wiederholungsintervalle, Standarddauer, Anfahrtszeiten
  * Definition von versionierbaren Checklisten
  * Austausch von Checklisten mit Landesamt und anderen Gesundheitsämtern über die zentralen Dienste

### Statistik:

* Unterstützung der Gesundheitsberichterstattung durch Werkzeuge zum Erstellen statistischer Auswertungen und Diagramme sowie zur Bewertung und Verbesserung der Qualität von Vorgangsdaten
* Erstellung von Statistiken
  * Aggregation von Vorgangsdaten der Einschulungsuntersuchung
  * Auswahl der auszuwertenden Attribute
  * Festlegen eines Betrachtungszeitraums
  * Speichern und Anwenden von Vorlagen für die Erstellung von Statistiken
* Tabellenansicht
  * Darstellung aller Daten in Tabellenform
  * Filtern und sortieren der Tabelle
  * Erstellen und anwenden von Filtervorlagen
  * Verlinkung von Tabellenzeilen auf Vorgänge
* Erzeugen von Auswertungen und Diagrammen
  * Sechs verschiedene Diagrammtypen (Balken-, Kreis-, Streu-, Linien-, Kartendiagramm und Histogramm)
  * Jeweils verschiedene Konfigurationsoptionen für jeden Diagrammtyp
  * Erzeugen mehrerer Diagrammversionen mit individuellen Filterkonfigurationen
  * Auch hier: Erstellen und anwenden von Filtervorlagen
  * Export von Diagrammen als png/svg-Datei
  * Export von Diagrammdaten als xlsx-Datei
* Datenqualität
  * Übersicht über Vollständigkeit der Daten
  * Berücksichtigung expliziter Unbekannt-Werte (z.B. 'Weiß nicht')
* Geo Shape-Verwaltung
  * Importieren von Geo Shapes für Kartendiagramme aus geojson-Files
  * Löschen und archivieren (+ Archivierung wieder aufheben) von Geo Shapes

### Reisemedizinische Impfberatung:

* Unterstützung bei Impfstoffverwaltung, Terminplanung und Impfdokumentation
* Impfstoffverwaltung
  * Krankheitenkategorien
  * Impfstoffe mit Berücksichtigung von Mindestabständen
  * Bestandsaktualisierung
* Terminplanung
  * Terminkontingente pro Terminart
  * Personalberücksichtigung
  * Konfigurierbare Terminstandarddauer
* Impfdokumentation
  * Planung aller Leistungen für eine anstehende Reise eines Patienten
  * Aufteilung der Leistungen in Folgetermine
  * Dokumentation der Durchführung mit Verlaufseinträgen
  * Generieren von Bescheinigungen für die Krankenkasse

### Masernschutz:

* Unterstützung der Mitarbeitenden des Gesundheitsamtes bei der Bearbeitung von Meldungen zu fehlendem Masern-Impfschutz in Einrichtungen
* Erstellen und Bearbeiten von Vorgängen im Mitarbeitenden-Portal
  * Manuelles Anlegen eines Vorgangs mit zentral verwalteten Personen und Einrichtungen
  * Erstellen von Nachweisaufforderungen
  * Erstellen von Terminblöcken für Nachweistermine
  * Manuelles Buchen, Bearbeiten und Stornieren von Terminen
  * Dokumentation von Betretungsverboten
  * Dokumentation von Bußgeldern
  * Vollständige Dokumentation des Vorgangsverlaufs
* Prozesse im Unternehmensportal
  * Vorgangsmeldung durch Einrichtungen
