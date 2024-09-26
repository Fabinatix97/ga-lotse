/**
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { List, ListItem, Stack, Typography, TypographyProps } from "@mui/joy";

import {
  LinkInNewTab,
  StaticTextDocumentPanel,
} from "@/lib/baseModule/components/StaticTextDocumentPanel";

function Emphasis(props: TypographyProps) {
  return <Typography fontWeight={600} {...props} />;
}

export function Accessibility() {
  return (
    <StaticTextDocumentPanel>
      <Typography>
        Diese Erklärung zur digitalen Barrierefreiheit gilt für die unter ep.
        <Emphasis>frankfurt.ga-lotse.de</Emphasis> veröffentlichte Webseite.
        <br />
        <br />
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

      <Stack
        component={"section"}
        aria-labelledby={"agreement-requirements"}
        gap={1}
      >
        <Typography level={"h2"} id={"agreement-requirements"}>
          Stand der Vereinbarkeit mit den Anforderungen
        </Typography>
        <Typography>
          Die Anforderungen der Barrierefreiheit ergeben sich aus § 3 Absätze 1
          bis 4 und § 4 der BITV HE 2019, die auf Grundlage von § 14 des HessBGG
          erlassen wurde.
          <br />
          <br />
          Die Überprüfung der Einhaltung der Anforderungen beruht auf einer am
          23.09.2024 durchgeführten Selbstbewertung.
        </Typography>
      </Stack>

      <Stack component={"section"} aria-labelledby={"accessibility-exemptions"}>
        <Typography level={"h2"} id={"accessibility-exemptions"}>
          Nicht barrierefreie Inhalte{" "}
        </Typography>
        <Typography>
          Aufgrund der Überprüfung ist die <Emphasis>Website</Emphasis> mit den
          zuvor genannten Anforderungen <Emphasis>nur teilweise</Emphasis>{" "}
          vereinbar.
        </Typography>
        <List marker={"disc"}>
          <ListItem>
            <Emphasis>PDF-Dateien sind nicht vollständig barrierefrei</Emphasis>
          </ListItem>
          <ListItem>
            <Emphasis>Nicht alle Schaltflächen haben erkennbaren Text</Emphasis>
          </ListItem>
          <ListItem>
            <Emphasis>
              Es gibt Schaltflächen mit zu kleinen Klickflächen für Touch-Geräte
            </Emphasis>
          </ListItem>
          <ListItem>
            <Emphasis>Nicht alle Formelemente haben eine Beschriftung</Emphasis>
          </ListItem>
        </List>
        <Emphasis>
          Die Stadt Frankfurt am Main arbeitet daran, die barrierefreien
          Angebote weiter auszubauen.
        </Emphasis>
      </Stack>

      <Stack
        component={"section"}
        aria-labelledby={"date-of-accessibility-verification"}
      >
        <Typography level={"h2"} id={"date-of-accessibility-verification"}>
          Datum der Erstellung der Erklärung zur Barrierefreiheit
        </Typography>
        <Typography>
          Diese Erklärung wurde am <Emphasis>23.09.2024</Emphasis> erstellt und
          zuletzt am <Emphasis>23.09.2024</Emphasis> überprüft und aktualisiert.
        </Typography>
      </Stack>

      <Stack component={"section"} id={"feedback-and-suggestions"}>
        <Typography level={"h2"} aria-labelledby={"feedback-and-suggestions"}>
          Feedback und Anfragen zur digitalen Barrierefreiheit
        </Typography>
        <Typography>
          Sie möchten uns noch bestehende Barrieren mitteilen oder nicht
          barrierefreie Inhalte in einem barrierefreien Format anfordern?
          Sprechen Sie unsere verantwortlichen Kontaktpersonen an:
        </Typography>
        <Emphasis>
          Gesundheitsamt Frankfurt am Main
          <br />
          Digitale Zukunft, IT und strategische Planung
          <br />
          +49 (0) 800 -4256873
        </Emphasis>
        <LinkInNewTab href={"mailto:support@ga-lotse.de"}>
          support@ga-lotse.de
        </LinkInNewTab>
      </Stack>

      <Stack component={"section"} aria-labelledby={"feedback-procedure"}>
        <Typography level={"h2"} id={"feedback-procedure"}>
          Durchsetzungsverfahren
        </Typography>
        <Typography>
          Wenn auch nach Ihrem Feedback an den oben genannten Kontakt keine
          zufriedenstellende Lösung gefunden wurde, können Sie die
          Durchsetzungs- und Überwachungsstelle Barrierefreie
          Informationstechnik einschalten. Sie haben nach Ablauf einer Frist von
          sechs Wochen das Recht sich direkt an die Durchsetzungs- und
          Überwachungsstelle zu wenden. Unter Einbeziehung aller Beteiligten
          versucht die Durchsetzungsstelle, die Umstände der fehlenden
          Barrierefreiheit zu ermitteln, damit der Träger diese beheben kann.
        </Typography>
      </Stack>

      <Stack component={"section"} aria-labelledby={"contact"}>
        <Typography level={"h2"} id={"contact"}>
          Durchsetzungs- und Überwachungsstelle Barrierefreie
          Informationstechnik Hessisches Ministerium für Soziales und
          Integration Sitz: Regierungspräsidium Gießen
        </Typography>
        <Typography>
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
          <LinkInNewTab href={"mailto:Durchsetzungsstelle-LBIT@rpgi.hessen.de"}>
            Durchsetzungsstelle-LBIT@rpgi.hessen.de
          </LinkInNewTab>
        </Typography>
      </Stack>

      <LinkInNewTab
        href={
          "https://lbit.hessen.de/Durchsetzungs-und-Ueberwachungsstelle/Durchsetzungsverfahren-beantragen/Formular-Durchsetzungsverfahren"
        }
      >
        Durchsetzung beantragen
      </LinkInNewTab>
    </StaticTextDocumentPanel>
  );
}
