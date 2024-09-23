/**
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { Divider, List, ListItem, Stack, Typography } from "@mui/joy";

import { ContentPanel } from "@/lib/shared/components/contentPanel/ContentPanel";

function BulletPointPlain(props: { text: string }) {
  return (
    <ListItem>
      <Typography component="span" level="body-md">
        {props.text}
      </Typography>
    </ListItem>
  );
}

function Module(props: { moduleName: string }) {
  return (
    <Typography level="h4" component="h3">
      {props.moduleName}:
    </Typography>
  );
}

export function ReleaseNotes() {
  return (
    <ContentPanel>
      <Stack gap={2}>
        <Typography level="h2">ESHG 1.0</Typography>
        <Divider />
        <Typography level="title-md">15.08.2024</Typography>
        <Typography level="body-md">
          Erster Release der neuen Anwendung für Gesundheitsämter.
        </Typography>
      </Stack>
      <Stack>
        <Module moduleName="Einschulungsuntersuchungen" />
        <List>
          <ListItem nested>
            <List marker="disc">
              <BulletPointPlain text="Unterstützung der Mitarbeitenden des Gesundheitsamtes bei Planung und Durchführung von Einschulungsuntersuchungen" />
              <ListItem nested>
                <BulletPointPlain text="Erstellen von Vorgängen" />
                <List marker="circle">
                  <BulletPointPlain text="Manuelles Anlegen von Vorgängen inklusive Kindern und Personensorgeberechtigten" />
                  <BulletPointPlain text="Import von Bürgeramtslisten und Schullisten mithilfe einer Excel-Tabelle, Prüfung auf Duplikate und fehlerhafte Datensätze" />
                  <BulletPointPlain text="Zuordnung der Untersuchungsart (Regeluntersuchung, Kann-Kind, Eingangsstufe, Besonderer Förderbedarf), Vorschläge anhand des Alters und Daten aus der Schulliste" />
                  <BulletPointPlain text="Anlegen und Zuordnen von Kennungen zu Vorgängen" />
                </List>
              </ListItem>
              <ListItem nested>
                <BulletPointPlain text="Planung" />
                <List marker="circle">
                  <BulletPointPlain text="Planen von Terminblöcken für die Schuleingangsuntersuchungen" />
                  <BulletPointPlain text="Zuordnung von Artz:innen und MFA zu den Terminblöcken inklusive Verfügbarkeitsprüfung" />
                  <BulletPointPlain text="Berücksichtigung unterschiedlicher Untersuchungslängen für Kinder mit potentiell erhöhtem Förderbedarf" />
                  <BulletPointPlain text="Manuelle Terminvergabe durch die Mitarbeitenden anhand der zugeordneten Untersuchungsart" />
                  <BulletPointPlain text="Automatische Massen-Terminvergabe über die Vorgangsübersicht anhand der zugeordneten Untersuchungsart" />
                  <BulletPointPlain text="Erstellung von Einladungen mit QR-Code für den Zugang zum Bürgerportal" />
                  <BulletPointPlain text="Terminverschiebung und Selbst-Anamnese im Bürgerportal durch Personensorgeberechtigte" />
                </List>
              </ListItem>
              <ListItem nested>
                <BulletPointPlain text="Untersuchungstag" />
                <List marker="circle">
                  <BulletPointPlain text="Vervollständigung der von den Personensorgeberechtigten vorausgefüllte Anamnese" />
                  <BulletPointPlain text="Erfassung des Impfstatus" />
                  <BulletPointPlain text="Erfassung des Hörscreenings, Sehscreenings, der S1-SOPESS-2024-Untersuchung und S1-Befunds" />
                  <BulletPointPlain text="Bei körperlichen Untersuchungen und Feststellungen von Handicaps werden mögliche Befunde mithilfe von ICD-10 Codes festgehalten" />
                  <BulletPointPlain text="Gewicht, Größe und BMI des Kindes werden mit Referenzperzentilen bewertet" />
                  <BulletPointPlain text="Übermittlung der ESU-Kennzahlen an das Statistikmodul" />
                </List>
              </ListItem>
            </List>
          </ListItem>
        </List>
      </Stack>
      <Stack>
        <Module moduleName="Begehungen" />
        <List>
          <ListItem nested>
            <List marker="disc">
              <BulletPointPlain text="Unterstützung der Mitarbeitenden des Gesundheitsamtes bei der Hygieneüberwachung von Einrichtungen" />
              <ListItem nested>
                <BulletPointPlain text="Erstellen von Vorgängen" />
                <List marker="circle">
                  <BulletPointPlain text="Erfassung von Einrichtungen: Name, Objekt-Typ, Adressen, Kontaktmöglichkeiten" />
                  <BulletPointPlain text="Manuelles Anlegen von Vorgängen für Einrichtungen" />
                  <BulletPointPlain text="Automatische Websuche nach neuen Einrichtungen (Quelle OpenSteetMap) und Hinzufügen zur Zentralkartei" />
                  <BulletPointPlain text="Anlegen von Vorgängen für neu gefundene Einrichtungen" />
                </List>
              </ListItem>
              <ListItem nested>
                <BulletPointPlain text="Planung" />
                <List marker="circle">
                  <BulletPointPlain text="Planung des Begehungstermins" />
                  <BulletPointPlain text="Auswahl der anzuwendenden Checklisten" />
                  <BulletPointPlain text="Reservierung von Inventar über die Inventarverwaltung" />
                  <BulletPointPlain text="Buchung von Ressourcen wie Fahrzeuge, Fahrräder, Räume" />
                  <BulletPointPlain text="Aufruf eines Routenplaners" />
                </List>
              </ListItem>
              <ListItem nested>
                <BulletPointPlain text="Ausführung" />
                <List marker="circle">
                  <BulletPointPlain text="Ausfüllen von Checklisten" />
                  <BulletPointPlain text="Hochladen von Bildern" />
                  <BulletPointPlain text="Erfassung weiterer Vorkommnisse" />
                  <BulletPointPlain text="Offline-Modus: Ausführung auch ohne Internet-Verbindung möglich" />
                  <BulletPointPlain text="Abschließen der Begehung, optional mit Erfassung der Unterschrift eines Teilnehmenden" />
                </List>
              </ListItem>
              <ListItem nested>
                <BulletPointPlain text="Erstellung eines Begehungsprotokolls" />
                <List marker="circle">
                  <BulletPointPlain text="Automatische Erstellung eines Begehungsprotokolls mit den ausgefüllten Checklisten und Vorkommnissen" />
                  <BulletPointPlain text="Möglichkeit zur Bearbeitung des Begehungsprotokolls" />
                  <BulletPointPlain text="Erstellung eines PDF-Dokuments für das Begehungsprotokoll" />
                  <BulletPointPlain text="Abschließen der Vorgangs mit Planung eines Nachfolgetermins" />
                </List>
              </ListItem>
              <ListItem nested>
                <BulletPointPlain text="Konfiguration" />
                <List marker="circle">
                  <BulletPointPlain text="Einstellungen für Objekt-Typen, z.B. Wiederholungsintervalle, Standarddauer, Anfahrtszeiten" />
                  <BulletPointPlain text="Definition von versionierbaren Checklisten" />
                  <BulletPointPlain text="Austausch von Checklisten mit Landesamt und anderen Gesundheitsämtern über die zentralen Dienste" />
                </List>
              </ListItem>
            </List>
          </ListItem>
        </List>
      </Stack>
      <Stack>
        <Module moduleName="Statistik" />
        <List>
          <ListItem nested>
            <List marker="disc">
              <BulletPointPlain text="Unterstützung der Gesundheitsberichterstattung durch Werkzeuge zum Erstellen statistischer Auswertungen und Diagramme sowie zur Bewertung und Verbesserung der Qualität von Vorgangsdaten" />
              <ListItem nested>
                <BulletPointPlain text="Erstellung von Statistiken" />
                <List marker="circle">
                  <BulletPointPlain text="Aggregation von Vorgangsdaten der Einschulungsuntersuchung" />
                  <BulletPointPlain text="Auswahl der auszuwertenden Attribute" />
                  <BulletPointPlain text="Festlegen eines Betrachtungszeitraums" />
                  <BulletPointPlain text="Speichern und Anwenden von Vorlagen für die Erstellung von Statistiken" />
                </List>
              </ListItem>
              <ListItem nested>
                <BulletPointPlain text="Tabellenansicht" />
                <List marker="circle">
                  <BulletPointPlain text="Darstellung aller Daten in Tabellenform" />
                  <BulletPointPlain text="Filtern und sortieren der Tabelle" />
                  <BulletPointPlain text="Erstellen und anwenden von Filtervorlagen" />
                  <BulletPointPlain text="Verlinkung von Tabellenzeilen auf Vorgänge" />
                </List>
              </ListItem>
              <ListItem nested>
                <BulletPointPlain text="Erzeugen von Auswertungen und Diagrammen" />
                <List marker="circle">
                  <BulletPointPlain text="Sechs verschiedene Diagrammtypen (Balken-, Kreis-, Streu-, Linien-, Kartendiagramm und Histogramm)" />
                  <BulletPointPlain text="Jeweils verschiedene Konfigurationsoptionen für jeden Diagrammtyp" />
                  <BulletPointPlain text="Erzeugen mehrerer Diagrammversionen mit individuellen Filterkonfigurationen" />
                  <BulletPointPlain text="Auch hier: Erstellen und anwenden von Filtervorlagen" />
                  <BulletPointPlain text="Export von Diagrammen als png/svg-Datei" />
                  <BulletPointPlain text="Export von Diagrammdaten als xlsx-Datei" />
                </List>
              </ListItem>
              <ListItem nested>
                <BulletPointPlain text="Datenqualität" />
                <List marker="circle">
                  <BulletPointPlain text="Übersicht über Vollständigkeit der Daten" />
                  <BulletPointPlain text="Berücksichtigung expliziter Unbekannt-Werte (z.B. 'Weiß nicht')" />
                </List>
              </ListItem>
              <ListItem nested>
                <BulletPointPlain text="Geo Shape-Verwaltung" />
                <List marker="circle">
                  <BulletPointPlain text="Importieren von Geo Shapes für Kartendiagramme aus geojson-Files" />
                  <BulletPointPlain text="Löschen und archivieren (+ Archivierung wieder aufheben) von Geo Shapes" />
                </List>
              </ListItem>
            </List>
          </ListItem>
        </List>
      </Stack>
      <Stack>
        <Module moduleName="Reisemedizinische Impfberatung" />
        <List>
          <ListItem nested>
            <List marker="disc">
              <BulletPointPlain text="Unterstützung bei Impfstoffverwaltung, Terminplanung und Impfdokumentation" />
              <ListItem nested>
                <BulletPointPlain text="Impfstoffverwaltung" />
                <List marker="circle">
                  <BulletPointPlain text="Krankheitenkategorien" />
                  <BulletPointPlain text="Impfstoffe mit Berücksichtigung von Mindestabständen" />
                  <BulletPointPlain text="Bestandsaktualisierung" />
                </List>
              </ListItem>
              <ListItem nested>
                <BulletPointPlain text="Terminplanung" />
                <List marker="circle">
                  <BulletPointPlain text="Terminkontingente pro Terminart" />
                  <BulletPointPlain text="Personalberücksichtigung" />
                  <BulletPointPlain text="Konfigurierbare Terminstandarddauer" />
                </List>
              </ListItem>
              <ListItem nested>
                <BulletPointPlain text="Impfdokumentation" />
                <List marker="circle">
                  <BulletPointPlain text="Planung aller Leistungen für eine anstehende Reise eines Patienten" />
                  <BulletPointPlain text="Aufteilung der Leistungen in Folgetermine" />
                  <BulletPointPlain text="Dokumentation der Durchführung mit Verlaufseinträgen" />
                  <BulletPointPlain text="Generieren von Bescheinigungen für die Krankenkasse" />
                </List>
              </ListItem>
            </List>
          </ListItem>
        </List>
      </Stack>
      <Stack>
        <Module moduleName="Masernschutz" />
        <List>
          <ListItem nested>
            <List marker="disc">
              <BulletPointPlain text="Unterstützung der Mitarbeitenden des Gesundheitsamtes bei der Bearbeitung von Meldungen zu fehlendem Masern-Impfschutz in Einrichtungen" />
              <ListItem nested>
                <BulletPointPlain text="Erstellen und Bearbeiten von Vorgängen im Mitarbeitenden-Portal" />
                <List marker="circle">
                  <BulletPointPlain text="Manuelles Anlegen eines Vorgangs mit zentral verwalteten Personen und Einrichtungen" />
                  <BulletPointPlain text="Erstellen von Nachweisaufforderungen" />
                  <BulletPointPlain text="Erstellen von Terminblöcken für Nachweistermine" />
                  <BulletPointPlain text="Manuelles Buchen, Bearbeiten und Stornieren von Terminen" />
                  <BulletPointPlain text="Dokumentation von Betretungsverboten" />
                  <BulletPointPlain text="Dokumentation von Bußgeldern" />
                  <BulletPointPlain text="Vollständige Dokumentation des Vorgangsverlaufs" />
                </List>
              </ListItem>
              <ListItem nested>
                <BulletPointPlain text="Prozesse im Unternehmensportal" />
                <List marker="circle">
                  <BulletPointPlain text="Vorgangsmeldung durch Einrichtungen" />
                </List>
              </ListItem>
            </List>
          </ListItem>
        </List>
      </Stack>
    </ContentPanel>
  );
}
