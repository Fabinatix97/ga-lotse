/**
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { List, ListItem } from "@mui/joy";
import { FormikValues } from "formik";

import { useUpdateOpeningHours } from "@/lib/configurator/api/mutations/useUpdateOpeningHours";
import { useGetOpeningHours } from "@/lib/configurator/api/queries/openingHours";
import {
  ConfiguratorForm,
  FormSection,
} from "@/lib/configurator/components/shared/ConfiguratorForm";
import { OpeningHoursFieldValue } from "@/lib/configurator/components/shared/OpeningHoursField";
import { useTabStatus } from "@/lib/configurator/components/shared/hooks/useTabStatus";
import { ConfiguratorModuleName } from "@/lib/configurator/shared/types";
import {
  SupportedLanguage,
  languageLabel,
  supportedLanguages,
} from "@/lib/i18n/language";

export interface OpeningHoursFormModel extends FormikValues {
  openingHours: Record<SupportedLanguage, OpeningHoursFieldValue>;
}

export function OpeningHours(props: { module: ConfiguratorModuleName }) {
  const initialValues = useGetOpeningHours(props.module);
  const onSubmit = useUpdateOpeningHours(props.module);
  const { currentTabStatus } = useTabStatus({
    moduleName: props.module,
    endpointName: "OPENING_HOURS",
  });

  function getSections(language: SupportedLanguage) {
    return [
      {
        content: {
          type: "field",
          rows: [
            {
              fields: [
                {
                  type: "openinghours",
                  name: `openingHours.${language}`,
                  required: language === "de",
                },
              ],
            },
          ],
        },
      },
    ] satisfies FormSection[];
  }

  return (
    <ConfiguratorForm
      sheets={[
        {
          title: "Öffnungszeiten der Fachabteilung (Deutsch)",
          description: (
            <List
              marker="disc"
              sx={{
                "--ListItem-minHeight:": 0,
                "--ListItem-paddingY:": 0,
                "--ListItem-paddingLeft:": 0,
              }}
            >
              <ListItem>
                Geben Sie Wochentag und Zeitfenster separat an.
              </ListItem>
              <ListItem>
                Lassen Sie einzelne Eingabefelder pro Zeile frei, um Leerräume
                zu erzeugen.
              </ListItem>
              <ListItem>
                Definieren Sie optional Zusatzinformationen wie Angaben zur
                Terminvereinbarung
              </ListItem>
            </List>
          ),
          sections: getSections("de"),
        },
        ...supportedLanguages
          .filter((it) => it !== "de")
          .map((lang) => ({
            title: `Öffnungszeiten der Fachabteilung (${languageLabel[lang]})`,
            description: "Ergänzen Sie hier Ihre Übersetzung.",
            sections: getSections(lang),
          })),
      ]}
      initialValues={initialValues}
      status={currentTabStatus}
      onSubmit={onSubmit}
    />
  );
}
