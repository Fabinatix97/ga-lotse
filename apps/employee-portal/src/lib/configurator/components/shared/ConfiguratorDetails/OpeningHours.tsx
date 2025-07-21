/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { List, ListItem } from "@mui/joy";
import { FormikValues } from "formik";

import {
  ConfiguratorForm,
  FormSection,
} from "@/lib/configurator/components/shared/ConfiguratorForm";
import { OpeningHoursFieldValue } from "@/lib/configurator/components/shared/OpeningHoursField";
import { useTabStatus } from "@/lib/configurator/components/shared/hooks/useTabStatus";
import { ConfiguratorModuleName } from "@/lib/configurator/shared/types";
import { useUpdateOpeningHours } from "@/lib/shared/api/mutations/configurator/useUpdateOpeningHours";
import { useGetOpeningHours } from "@/lib/shared/api/queries/configurator/openingHours";

enum FormNames {
  ENGLISH = "opening_hours_english",
  GERMAN = "opening_hours_german",
}

export interface OpeningHoursFormModel extends FormikValues {
  [FormNames.GERMAN]: OpeningHoursFieldValue;
  [FormNames.ENGLISH]: OpeningHoursFieldValue;
}

export function OpeningHours(props: { module: ConfiguratorModuleName }) {
  const initialValues = useGetOpeningHours(props.module);
  const onSubmit = useUpdateOpeningHours(props.module);
  const { currentTabStatus } = useTabStatus({
    moduleName: props.module,
    endpointName: "OPENING_HOURS",
  });

  function getSections(language: "english" | "german") {
    return [
      {
        content: {
          type: "field",
          rows: [
            {
              fields: [
                {
                  type: "openinghours",
                  name: `opening_hours_${language}`,
                  english: language === "english",
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
          sections: getSections("german"),
        },
        {
          title: "Öffnungszeiten der Fachabteilung (Englisch)",
          description: "Ergänzen Sie hier die englische Übersetzung.",
          sections: getSections("english"),
        },
      ]}
      initialValues={initialValues}
      status={currentTabStatus}
      onSubmit={onSubmit}
    />
  );
}
