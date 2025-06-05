/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { FormikValues } from "formik";
import { notFound } from "next/navigation";
import { useMemo } from "react";

import { OptionalFieldValue, validateHexColorCode } from "@eshg/lib-portal";
import { ApiLocationSelectionMode } from "@eshg/school-entry-api";

import {
  ConfiguratorForm,
  FormSection,
} from "@/lib/configurator/components/shared/ConfiguratorForm";
import { useTabStatus } from "@/lib/configurator/components/shared/hooks/useTabStatus";
import { isEndpointSupportedByModule } from "@/lib/configurator/shared/config";
import {
  ConfiguratorEndpointName,
  ConfiguratorModuleName,
} from "@/lib/configurator/shared/types";
import { useUpdateSchoolEntry } from "@/lib/shared/api/mutations/configurator/useUpdateSchoolEntry";
import { useGetSchoolEntryConfig } from "@/lib/shared/api/queries/configurator/schoolEntry";

enum FormNames {
  LOCATION_SELECTION_MODE = "locationSelectionMode",
  DIRECT_PROCEDURE_TYPE_ASSIGNMENT = "directProcedureTypeAssignmentOnImport",
  PDF_DOCUMENT_ACCENT_COLOR = "pdfDocumentAccentColor",
}

export interface SchoolEntryFormModel extends FormikValues {
  [FormNames.LOCATION_SELECTION_MODE]: OptionalFieldValue<ApiLocationSelectionMode>;
  [FormNames.DIRECT_PROCEDURE_TYPE_ASSIGNMENT]: boolean;
  [FormNames.PDF_DOCUMENT_ACCENT_COLOR]: string;
}

const endpointName: ConfiguratorEndpointName = "SCHOOL_ENTRY";

export function SchoolEntry(props: { module: ConfiguratorModuleName }) {
  if (!isEndpointSupportedByModule(props.module, endpointName)) {
    notFound();
  }

  return <SchoolEntryConfiguratorForm module={props.module} />;
}

function SchoolEntryConfiguratorForm(props: {
  module: ConfiguratorModuleName;
}) {
  const { data: config } = useGetSchoolEntryConfig();
  const onSubmit = useUpdateSchoolEntry();
  const { currentTabStatus } = useTabStatus({
    moduleName: props.module,
    endpointName,
  });

  const sheets = useMemo(
    () => [
      {
        title: "Fachliche Einstellungen",
        sections: [
          {
            content: {
              type: "field",
              rows: [
                {
                  fields: [
                    {
                      name: FormNames.LOCATION_SELECTION_MODE,
                      label: "Untersuchungsstandort",
                      alert: {
                        color: "warning",
                        message: config.locationSelectionModeReadOnly
                          ? "Es sind keine Änderungen mehr möglich, da bereits mindestens ein Terminblock erstellt wurde."
                          : "Änderungen an den Einstellungen sind nur möglich, solange noch kein Terminblock erstellt wurde.",
                      },
                      type: "radio",
                      required:
                        "Bitte wählen Sie einen Untersuchungsstandort aus.",
                      readonly: config.locationSelectionModeReadOnly,
                      options: [
                        {
                          value: ApiLocationSelectionMode.None,
                          label:
                            "Untersuchungen finden in einem einzigen Gesundheitsamt statt.",
                        },
                        {
                          value: ApiLocationSelectionMode.School,
                          label:
                            "Untersuchungen finden in der einzuschulenden Schule statt.",
                        },
                        {
                          value: ApiLocationSelectionMode.HealthDepartment,
                          label:
                            "Es gibt mehrere zuständige Gesundheitsamt-Stellen.",
                          infoLabel:
                            "Die Standorte, in denen die Untersuchungen stattfinden, müssen zuerst als Kontakt angelegt werden. Danach können die Standorte in der Terminplanung angegeben werden.",
                        },
                      ],
                    },
                  ],
                },
              ],
            },
          },
          {
            title: "Vorgangsimport",
            alert: {
              color: "warning",
              message: config.directProcedureTypeAssignmentOnImportReadOnly
                ? "Es sind keine Änderungen mehr möglich, da bereits mindestens ein Vorgang erstellt wurde."
                : "Änderungen an den Einstellungen sind nur möglich, solange noch kein Vorgang erstellt wurde.",
            },
            description:
              "Aktivieren Sie diese Option, wenn kein Bürgeramtsimport nötig oder vorhanden ist, um die Daten direkt nach dem Schullistenimport zu vervollständigen.",
            content: {
              type: "field",
              rows: [
                {
                  fields: [
                    {
                      name: FormNames.DIRECT_PROCEDURE_TYPE_ASSIGNMENT,
                      type: "checkbox",
                      label: "Direkter Vorgangsimport",
                      readonly:
                        config.directProcedureTypeAssignmentOnImportReadOnly,
                    },
                  ],
                },
              ],
            },
          },
        ] satisfies FormSection[],
      },
      {
        title: "Farbakzent für Dokumente",
        description:
          "Definieren Sie den Farbton als HEX-Code, der für Akzente auf Dokumenten verwendet wird.",
        sections: [
          {
            content: {
              type: "field",
              rows: [
                {
                  fields: [
                    {
                      name: FormNames.PDF_DOCUMENT_ACCENT_COLOR,
                      label: "HEX-Code",
                      type: "text",
                      required: "Bitte geben Sie einen HEX-Farbcode an.",
                      placeholder: "#000000",
                      validate: validateHexColorCode(
                        "Bitte einen gültigen HEX-Farbcode angeben.",
                      ),
                    },
                  ],
                },
              ],
            },
          },
        ] satisfies FormSection[],
      },
    ],
    [
      config.directProcedureTypeAssignmentOnImportReadOnly,
      config.locationSelectionModeReadOnly,
    ],
  );

  return (
    <ConfiguratorForm
      sheets={sheets}
      initialValues={config.values}
      status={currentTabStatus}
      onSubmit={onSubmit}
    />
  );
}
