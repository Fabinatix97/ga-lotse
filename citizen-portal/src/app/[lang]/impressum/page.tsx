/**
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

"use client";

import { ExternalLink } from "@eshg/lib-portal/components/navigation/ExternalLink";
import { InternalLink } from "@eshg/lib-portal/components/navigation/InternalLink";
import { Typography } from "@mui/joy";

import { useRoutes } from "@/lib/baseModule/shared/routes";
import { TitleAndSheetContentLayout } from "@/lib/shared/components/layout/TitleAndSheetContentLayout";

export default function ImprintPage() {
  const routes = useRoutes();

  return (
    <TitleAndSheetContentLayout pageTitle="Impressum">
      <Typography level="h4" component="h3">
        Gesamtverantwortung:
      </Typography>
      <Typography>
        Stadt Frankfurt am Main
        <br />
        DER MAGISTRAT
        <br />
        Römerberg 23
        <br />
        60311 Frankfurt am Main
        <br />
        Website: www.frankfurt.de
        <br />
        <br />
        USt-ID: DE 114 110 388
      </Typography>

      <Typography level="h4" component="h3">
        Verantwortung für das GA-Lotse Online-Portal:
      </Typography>
      <Typography>
        Stadt Frankfurt am Main
        <br />
        DER MAGISTRAT
        <br />
        Gesundheitsamt Frankfurt am Main
        <br />
        Abteilung Digitale Zukunft, IT und strategische Planung
        <br />
        Breite Gasse 28
        <br />
        60313 Frankfurt am Main
      </Typography>

      <Typography>
        GA-Lotse ist ein Kooperationsprojekt des Hessischen Ministeriums für
        Familie, Senioren, Sport, Gesundheit und Pflege mit dem Gesundheitsamt
        Frankfurt unter der EU-Förderung NextGenerationEU.
      </Typography>
      <Typography level="h4" component="h3">
        Telefonische Auskünfte:
      </Typography>
      <Typography>
        Informationen erhalten Sie über die Rufnummer: +49 (0) 800 -4256873
      </Typography>

      <Typography level="h4" component="h3">
        Kontakt bei Presseanfragen:
      </Typography>
      <Typography>
        <ExternalLink
          href={`mailto:gesundheitsamt.einheitliche-software@stadt-frankfurt.de`}
        >
          gesundheitsamt.einheitliche-software@stadt-frankfurt.de
        </ExternalLink>
      </Typography>

      <Typography level="h4" component="h3">
        Kontakt bei Fragen zum GA-Lotse Online-Portal:
      </Typography>
      <Typography>
        eMail: gesundheitsamt.einheitliche-software@stadt-frankfurt.de
        <br />
        Die Abteilung Digitale Zukunft, IT und strategische Planung des
        Gesundheitsamtes der Stadt Frankfurt am Main zeichnet für ihre Inhalte
        auf www.ga-lotse.de redaktionell verantwortlich.
      </Typography>

      <Typography level="h4" component="h3">
        Verantwortung:
      </Typography>
      <Typography>
        Stefanie Kaulich, Abteilungsleitung Digitale Zukunft, IT und
        strategische Planung. <br />
        Bei Fragen oder Anregungen zu konkreten Inhalten und Seiten können Sie
        sich gerne an Frau Kaulich oder die unter „Kontakt“ benannte eMail
        wenden.
      </Typography>

      <Typography level="h4" component="h3">
        Technische Realisierung:
      </Typography>
      <Typography>
        Gesundheitsamt der Stadt Frankfurt am Main
        <br />
        Abteilung Digitale Zukunft, IT und strategische Planung
        <br />
        Breite Gasse 28
        <br />
        60313 Frankfurt am Main
      </Typography>

      <Typography level="h4" component="h3">
        Bei Fragen oder Anmerkungen:
      </Typography>
      <Typography>
        gesundheitsamt.einheitliche-software@stadt-frankfurt.de
      </Typography>

      <Typography level="h4" component="h3">
        Hinweise zum Datenschutz:
      </Typography>
      <Typography>
        Informationen zum Datenschutz finden Sie{" "}
        <InternalLink href={routes.privacyPolicy}>hier</InternalLink>.
      </Typography>
    </TitleAndSheetContentLayout>
  );
}
