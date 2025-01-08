/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { Stack, Typography } from "@mui/joy";
import { PropsWithChildren } from "react";

import {
  LinkInNewTab,
  StaticTextDocumentPanel,
} from "@/lib/baseModule/components/StaticTextDocumentPanel";

function Section({
  title,
  id,
  sourceHref,
  hint,
  children,
}: PropsWithChildren<{
  title: string;
  id: string;
  sourceHref: string;
  hint?: string;
}>) {
  return (
    <Stack component={"section"} aria-labelledby={id}>
      <Typography component={"h2"} level={"title-md"} id={id}>
        {title}
      </Typography>
      <Typography>{children}</Typography>
      <LinkInNewTab href={sourceHref}>Herkunft</LinkInNewTab>
      {hint && <Typography sx={{ marginTop: 1 }}>{hint}</Typography>}
    </Stack>
  );
}

export function Acknowledgements() {
  return (
    <StaticTextDocumentPanel>
      GA-Lotse verwendet die folgenden externen Ressourcen und Datenbanken:
      <Section
        id={"street-directory"}
        title={"Straßenverzeichnis der Stadt Frankfurt am Main"}
        sourceHref={
          "https://www.offenedaten.frankfurt.de/dataset/strassenverzeichnis-der-stadt-frankfurt-am-main"
        }
        hint={
          "Hinweis: An den Daten wurden an zwei Stellen Veränderungen vorgenommen. Zwei Straßen wurden entfernt."
        }
      >
        Datenlizenz Deutschland Namensnennung
      </Section>
      <Section
        id={"osm-map-data-extracts"}
        title={"Open Street Map Data Extracts"}
        sourceHref={"https://download.geofabrik.de/"}
      >
        CC BY-SA 2.0
      </Section>
      <Section
        title={"Open Street Map Umrechnung Straßen / Geokoordinaten"}
        id={"osm-geocoordinate-resolver"}
        sourceHref={"https://nominatim.openstreetmap.org/"}
      >
        CC BY-SA 3.0
      </Section>
      <Section
        id={"osm-route-planner"}
        title={"Open Street Map Routenplaner"}
        sourceHref={"https://routing.openstreetmap.de/"}
      >
        CC BY-SA 3.0
      </Section>
      <Section
        title={"ICD-10 Codes"}
        id={"icd-10-codes"}
        sourceHref={
          "https://klassifikationen.bfarm.de/icd-10-gm/kode-suche/htmlgm2024/index.htm"
        }
      >
        Die Erstellung erfolgt unter Verwendung der maschinenlesbaren Fassung
        des Bundesinstituts für Arzneimittel und Medizinprodukte (BfArM).
      </Section>
      <Section
        title={
          "Referenzperzentile für anthropometrische Maßzahlen und Blutdruck aus der Studie zur Gesundheit von Kindern und Jugendlichen in Deutschland (KiGGS)"
        }
        id={"kiggs-reference"}
        sourceHref={"http://dx.doi.org/10.25646/3179"}
      >
        2013, Neuhauser, Hannelore and Schienkiewitz, Anja and Rosario, Angelika
        Schaffrath and Dortschy, Reinhard and Kurth, Bärbel-Maria
      </Section>
      <Stack
        component={"section"}
        aria-labelledby={"software-dependencies"}
        gap={2}
      >
        <Typography level={"h2"} id={"software-dependencies"}>
          Verwendete Libraries
        </Typography>
        <Typography>
          Verwendete Open Source Bibliotheken finden sich in den jeweiligen
          Paketen im Repository auf{" "}
          <LinkInNewTab
            href={"https://gitlab.opencode.de/ga-lotse/ga-lotse-code"}
          >
            OpenCoDE
          </LinkInNewTab>
          .
        </Typography>
      </Stack>
    </StaticTextDocumentPanel>
  );
}
