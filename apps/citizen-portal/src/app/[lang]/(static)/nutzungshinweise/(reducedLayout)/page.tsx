/**
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

"use client";

import { Typography } from "@mui/joy";

import { ExternalLink } from "@eshg/lib-portal";

import { TitleAndSheetContentLayout } from "@/lib/shared/components/layout/TitleAndSheetContentLayout";

export default function TermsOfUsePage() {
  return (
    <TitleAndSheetContentLayout pageTitle="Nutzungshinweise für die sichere Benutzung des Online-Portals">
      <Typography>
        Wir empfehlen die Beachtung der folgenden Hinweise zur sicheren
        Benutzung des Online-Portals.
      </Typography>

      <ol>
        <li>
          <strong>Aktuellen Browser und Betriebssystem verwenden</strong>
          <br />
          Um eine optimale Nutzung und Sicherheit zu gewährleisten, empfehlen
          wir die Nutzung eines möglichst aktuellen Browsers und
          Betriebssystems. Das Online-Portal wurde mit den gängigsten Browsern
          (Google Chrome, Mozilla Firefox, Microsoft Edge, Apple Safari) auf
          unterschiedlichen Plattformen (Desktop, Mobile, Smartphone) getestet.
          Regelmäßige Updates schützen vor Sicherheitslücken und stellen sicher,
          dass die Anwendung korrekt funktioniert.
        </li>
        <li>
          <strong>QR-Codes und Zugangscodes sicher verwahren</strong>
          <br />
          Bewahren Sie QR-Codes sowie Zugangscodes sicher auf und teilen Sie
          diese nicht mit unbefugten Personen. Diese Codes sind der Schlüssel zu
          Ihrem Konto mit sensiblen Informationen und sollten daher nur von
          Ihnen selbst genutzt werden.
        </li>
        <li>
          <strong>Gerät bei Nichtbenutzung sperren</strong>
          <br />
          Stellen Sie sicher, dass Ihr Computer, Smartphone oder Tablet bei
          Nichtbenutzung immer gesperrt ist. Dies schützt Ihre Daten vor
          unbefugtem Zugriff, falls Sie Ihr Gerät unbeaufsichtigt lassen.
        </li>
        <li>
          <strong>Browser nach der Nutzung der Anwendung schließen</strong>
          <br />
          Um Ihre Privatsphäre zu schützen, schließen Sie nach der Nutzung der
          Anwendung Ihren Browser. So verhindern Sie, dass sensible Daten im
          Zwischenspeichers Ihres Geräts gespeichert bleiben.
        </li>
      </ol>

      <Typography>
        Weitere Hinweise zur sicheren Nutzung finden Sie auf den{" "}
        <ExternalLink href="https://www.bsi.bund.de/DE/Themen/Verbraucherinnen-und-Verbraucher/Informationen-und-Empfehlungen/Cyber-Sicherheitsempfehlungen/cyber-sicherheitsempfehlungen_node.html">
          Webseiten
        </ExternalLink>{" "}
        des Bundesamts für Sicherheit in der Informationstechnik (BSI).
      </Typography>
    </TitleAndSheetContentLayout>
  );
}
