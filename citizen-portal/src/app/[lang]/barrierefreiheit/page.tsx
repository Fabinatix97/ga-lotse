/**
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

"use client";

import { ExternalLink } from "@eshg/lib-portal/components/navigation/ExternalLink";
import { Typography } from "@mui/joy";

import { TitleAndSheetContentLayout } from "@/lib/shared/components/layout/TitleAndSheetContentLayout";

export default function AccessibilityPage() {
  return (
    <TitleAndSheetContentLayout pageTitle="Erklärung zur Barrierefreiheit">
      <Typography>
        Diese Erklärung zur digitalen Barrierefreiheit gilt für die unter
        frankfurt.ga-lotse.de veröffentlichte Webseite.
      </Typography>

      <Typography>
        Als öffentliche Stelle im Sinne der Richtlinie (EU) 2016/2102 sind wir
        bemüht, unsere Websites und mobilen Anwendungen im Einklang mit den
        Bestimmungen des Hessischen Behinderten-Gleichstellungsgesetzes
        (HessBGG) sowie der Hessischen Verordnung über barrierefreie
        Informationstechnik (BITV HE 2019) zur Umsetzung der Richtlinie (EU)
        2016/2102 barrierefrei zugänglich zu machen. Frankfurt.ga-lotse.de ist
        überwiegend mit den derzeit gültigen Vorschriften zur Barrierefreiheit
        (BITV 2.0, 2019/WCAG 2.1) vereinbar. Inhalte und Funktionen, die dem
        derzeit noch nicht vollständig entsprechen, sind nachfolgend aufgeführt.
      </Typography>

      <Typography level="h4" component="h3">
        Stand der Vereinbarkeit mit den Anforderungen
      </Typography>

      <Typography>
        Die Anforderungen der Barrierefreiheit ergeben sich aus § 3 Absätze 1
        bis 4 und § 4 der BITV HE 2019, die auf Grundlage von § 14 des HessBGG
        erlassen wurde.
      </Typography>

      <Typography>
        Die Überprüfung der Einhaltung der Anforderungen beruht auf einer am
        16.09.2024 durchgeführten Selbstbewertung.
      </Typography>

      <Typography level="h4" component="h3">
        Nicht barrierefreie Inhalte
      </Typography>

      <Typography>
        Aufgrund der Überprüfung ist die Website mit den zuvor genannten
        Anforderungen nur teilweise vereinbar.
      </Typography>
      <ul>
        <li>PDF-Dateien sind nicht vollständig barrierefrei </li>
      </ul>

      <Typography>
        Die Stadt Frankfurt am Main arbeitet daran, die barrierefreien Angebote
        weiter auszubauen.
      </Typography>

      <Typography level="h4" component="h3">
        Datum der Erstellung der Erklärung zur Barrierefreiheit
      </Typography>

      <Typography>
        Diese Erklärung wurde am 16.09.2024 erstellt und zuletzt am 23.09.2024
        überprüft und aktualisiert.
      </Typography>

      <Typography level="h4" component="h3">
        Feedback und Anfragen zur digitalen Barrierefreiheit
      </Typography>

      <Typography>
        Sie möchten uns noch bestehende Barrieren mitteilen oder nicht
        barrierefreie Inhalte in einem barrierefreien Format anfordern? Sprechen
        Sie unsere verantwortlichen Kontaktpersonen an:
      </Typography>
      <Typography>
        Gesundheitsamt Frankfurt am Main
        <br />
        Digitale Zukunft, IT und strategische Planung
        <br />
        +49 (0) 800 -4256873
        <br />
        <ExternalLink href="mailto:support@ga-lotse.de">
          support@ga-lotse.de
        </ExternalLink>
        <br />
      </Typography>

      <Typography level="h4" component="h3">
        Durchsetzungsverfahren
      </Typography>

      <Typography>
        Wenn auch nach Ihrem Feedback an den oben genannten Kontakt keine
        zufriedenstellende Lösung gefunden wurde, können Sie die Durchsetzungs-
        und Überwachungsstelle Barrierefreie Informationstechnik einschalten.
        Sie haben nach Ablauf einer Frist von sechs Wochen das Recht sich direkt
        an die Durchsetzungs- und Überwachungsstelle zu wenden. Unter
        Einbeziehung aller Beteiligten versucht die Durchsetzungsstelle, die
        Umstände der fehlenden Barrierefreiheit zu ermitteln, damit der Träger
        diese beheben kann.
      </Typography>

      <Typography>
        <strong>
          Durchsetzungs- und Überwachungsstelle Barrierefreie
          Informationstechnik
        </strong>
        <br />
        <strong>Hessisches Ministerium für Soziales und Integration</strong>
        <br />
        <strong>Sitz: Regierungspräsidium Gießen</strong>
        <br />
        Prof. Dr. Erdmuthe Meyer zu Bexten
        <br />
        Landesbeauftragte für barrierefreie IT
        <br />
        Leiterin der Durchsetzungs- und Überwachungsstelle
        <br />
        Landgraf-Philipp-Platz 1-7
        <br />
        35390 Gießen
        <br />
        Telefon: +49 641 303 - 2901
        <br />
        E-Mail:{" "}
        <ExternalLink href="mailto:Durchsetzungsstelle-LBIT@rpgi.hessen.de">
          Durchsetzungsstelle-LBIT@rpgi.hessen.de
        </ExternalLink>
        <br />
      </Typography>

      <Typography>
        <ExternalLink href="https://lbit.hessen.de/Durchsetzungs-und-Ueberwachungsstelle/Durchsetzungsverfahren-beantragen/Formular-Durchsetzungsverfahren">
          Durchsetzung beantragen
        </ExternalLink>
      </Typography>
    </TitleAndSheetContentLayout>
  );
}
