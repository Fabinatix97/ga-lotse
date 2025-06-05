/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { Stack, Typography } from "@mui/joy";
import { PropsWithChildren } from "react";

import { ExternalLink } from "@eshg/lib-portal";

import { StaticTextDocumentPanel } from "@/lib/baseModule/components/StaticTextDocumentPanel";

function Section({
  id,
  title,
  children,
}: PropsWithChildren<{ id: string; title: string }>) {
  return (
    <Stack component="section" aria-labelledby={id} gap={1}>
      <Typography level="h2" id={id}>
        {title}
      </Typography>
      {children}
    </Stack>
  );
}

export function UsageNotes() {
  return (
    <StaticTextDocumentPanel>
      <Section
        id="general-recommendations"
        title="Generelle Empfehlungen zur Nutzung"
      >
        <Typography>
          Wir empfehlen die Beachtung der folgenden Hinweise zur sicheren
          Benutzung des Online-Portals.
        </Typography>
        <Stack component="ol" gap={1}>
          <li>
            <Typography level="title-md">
              Aktuellen Browser und Betriebssystem verwenden
            </Typography>
            <Typography>
              Um eine optimale Nutzung und Sicherheit zu gewährleisten,
              empfehlen wir die Nutzung eines möglichst aktuellen Browsers und
              Betriebssystems. Das Online-Portal wurde mit den gängigsten
              Browsern (Google Chrome, Mozilla Firefox, Microsoft Edge, Apple
              Safari) auf unterschiedlichen Plattformen (Desktop, Mobile,
              Smartphone) getestet. Regelmäßige Updates schützen vor
              Sicherheitslücken und stellen sicher, dass die Anwendung korrekt
              funktioniert.
            </Typography>
          </li>
          <li>
            <Typography level="title-md">
              Gerät bei Nichtbenutzung sperren
            </Typography>
            <Typography>
              Stellen Sie sicher, dass Ihr Computer, Smartphone oder Tablet bei
              Nichtbenutzung immer gesperrt ist. Dies schützt Ihre Daten vor
              unbefugtem Zugriff, falls Sie Ihr Gerät unbeaufsichtigt lassen.
            </Typography>
          </li>
          <li>
            <Typography level="title-md">
              Browser nach der Nutzung der Anwendung schließen
            </Typography>
            <Typography>
              Um Ihre Privatsphäre zu schützen, schließen Sie nach der Nutzung
              der Anwendung Ihren Browser. So verhindern Sie, dass sensible
              Daten im Zwischenspeichers Ihres Geräts gespeichert bleiben.
            </Typography>
          </li>
        </Stack>
        <Typography>
          Weitere Hinweise zur sicheren Nutzung finden Sie auf den{" "}
          <ExternalLink
            href="https://www.bsi.bund.de/DE/Themen/Verbraucherinnen-und-Verbraucher/Informationen-und-Empfehlungen/Cyber-Sicherheitsempfehlungen/cyber-sicherheitsempfehlungen_node.html"
            openInNewTab
          >
            Webseiten
          </ExternalLink>{" "}
          des Bundesamts für Sicherheit in der Informationstechnik (BSI).
        </Typography>
      </Section>

      <Section
        id="passkey-passwordless-logins"
        title="Hinweise zur Nutzung von Passkeys und passwortloser Anmeldung"
      >
        <Typography>
          Zur sicheren Anmeldung am Mitarbeitenden-Portal und Admin-Funktionen
          des Mitarbeitenden-Portals verwendet GA-Lotse passwortlose
          Anmeldeverfahren mittels Passkeys.
          <br />
          <br />
          Bei diesen Verfahren werden zu jeder Anmeldung keine Passwörter
          übermittelt, sondern für jede Anmeldung mittels eines kryptografischen
          Verfahren individuell berechnete Antworten auf kryptografische Fragen.
          <br />
          Da bei der Anmeldung mittels Passkeys bei jeder Anmeldung eine neue
          Antwort berechnet wird, besteht keine Möglichkeit mehr zum Abgreifen
          von Passwörtern mittels Phishing. Darüber hinaus sind Passkeys an eine
          bestimmte Domain gebunden und können nur auf dieser verwendet werden.
        </Typography>
      </Section>

      <Section
        id="passkey-usage-possibilities"
        title="Möglichkeiten der Nutzung von Passkeys"
      >
        <Typography>
          Bei der Nutzung von Passkeys sind verschiedene Optionen möglich.
          <br />
          Vor der Nutzung eines Passkeys muss ein Passkey registriert werden.
          <br />
          Für Mitarbeitende im Mitarbeitendenportal kann immer nur ein Passkey
          pro User registriert werden.
          <br />
          Für die Admin-Funktion ist es möglich, mehrere Passkeys pro User zu
          hinterlegen. Es wird für die Admin-Funktion ausdrücklich empfohlen,
          mehr als einen Passkey zu registrieren. Im Falle eines Verlustes kann
          so das Aussperren von dem Admin-Funktionen verhindert werden.
        </Typography>
      </Section>

      <Section
        id="different-devices-and-logins"
        title="Unterschiedliche Arten von Geräten und Anmeldungen"
      >
        <Typography>
          Zur Nutzung von Passkeys werden die Möglichkeiten mittels FIDO-Token
          (USB-Stick) oder Smartphone (iOS 16+, Android 9+) empfohlen.
          <br />
          Bei der Anmeldung bei GA-Lotse mittels Passkeys ist immer ein zweiter
          Faktor notwendig. Das kann je nach Möglichkeiten des Gerätes eine PIN
          oder die Authentifizierung via Biometrie (Fingerabdruck oder FaceID)
          sein.
          <br />
          Für die Nutzung der Admin-Funktion ist zusätzlich ein Username und
          Passwort notwendig. Admin-Funktion und Mitarbeitendenportal verwenden
          unterschiedliche Passkeys. Diese lassen sich aber auf dem gleichen
          Stick oder Smartphone speichern.
        </Typography>
      </Section>

      <Section id="passkey-registration" title="Registrierung eines Passkeys">
        <Typography>
          Zur Registrierung eines Passkeys erhalten Sie eine E-Mail. Nach Klick
          auf den entsprechenden Registrierungslink können Sie ihren Passkeys
          registrieren.
          <br />
          <br />
          Bei der Registrierung eines Passkeys an GA-Lotse muss ein PIN oder
          eine andere Art von zweitem Faktor hinterlegt werden.
        </Typography>
      </Section>

      <Section
        id="hardware-passkey-usage"
        title="Nutzung von Passkeys mittels Hardware-Token"
      >
        <Typography>
          Passkeys können via USB-Stick mittels FIDO Standard genutzt werden.
          Zur Nutzung wird der Stick an jeweiligen Rechner angesteckt oder via
          NFC mit einem Smartphone verbunden.
          <br />
          Nach dem Verbinden muss eine PIN eingegeben werden.
          <br />
          <br />
          Bei der Nutzung eines Tokens per USB-Verbindung muss oftmals der Stick
          an einer bestimmten Stelle berührt werden, um einen kapazitiven
          Kontakt herzustellen.
        </Typography>
      </Section>

      <Section
        id="smartphone-passkeys"
        title="Nutzung von Passkeys mittels Smartphone"
      >
        <Typography>
          Zur Nutzung von Passkeys mittels Smartphone kann entweder der Passkey
          direkt auf dem Smartphone genutzt werden.
          <br />
          Alternativ kann zur Anmeldung auch ein QR-Code gescannt werden, um
          dann via Bluetooth den Passkey zur Anmeldung zu übertragen.
        </Typography>
      </Section>

      <Section
        id="lost-passkey-protocol"
        title="Umgang mit Verlust eines Passkeys"
      >
        <Typography>
          Bei Verlust eines Passkeys kann der jeweilige Passkey im Admin-Portal
          deaktiviert werden. Der Verlust eines Passkeys ist daher unverzüglich
          zu melden.
        </Typography>
      </Section>

      <Section
        id="passkey-synchronization"
        title="Synchronisation von Passkeys"
      >
        <Typography>
          Es wird nicht empfohlen, Passkeys über Dienste von Dritten (iCloud,
          Google Dienste) zu synchronisieren.
        </Typography>
      </Section>
    </StaticTextDocumentPanel>
  );
}
