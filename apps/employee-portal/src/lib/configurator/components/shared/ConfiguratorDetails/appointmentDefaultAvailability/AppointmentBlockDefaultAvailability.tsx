/**
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { FormikValues } from "formik";
import { notFound } from "next/navigation";

import {
  OptionalFieldValue,
  validateInteger,
  validatePipe,
  validateRange,
} from "@eshg/lib-portal";

import { ProstituteProtectionAppointmentBlockAvailability } from "@/lib/configurator/components/shared/ConfiguratorDetails/appointmentDefaultAvailability/ProstituteProtectionAppointmentBlockAvailability";
import { SchoolEntryAppointmentBlockAvailability } from "@/lib/configurator/components/shared/ConfiguratorDetails/appointmentDefaultAvailability/SchoolEntryAppointmentBlockAvailability";
import {
  ConfiguratorForm,
  FormSection,
} from "@/lib/configurator/components/shared/ConfiguratorForm";
import { useTabStatus } from "@/lib/configurator/components/shared/hooks/useTabStatus";
import { ConfiguratorModuleName } from "@/lib/configurator/shared/types";

export function AppointmentBlockAvailability(
  props: Readonly<{
    module: ConfiguratorModuleName;
  }>,
) {
  switch (props.module) {
    case ConfiguratorModuleName.SchoolEntry:
      return <SchoolEntryAppointmentBlockAvailability />;
    case ConfiguratorModuleName.ProstituteProtection:
      return <ProstituteProtectionAppointmentBlockAvailability />;
    default:
      notFound();
  }
}

export enum FormNames {
  AVAILABLE_FOR_CITIZEN = "availableForCitizen",
  AVAILABLE_FOR_BULK_BOOKING = "availableForBulkBooking",
  BULK_CREATE_MIN_LEAD_TIME = "bulkCreateAppointmentsMinLeadTime",
  CITIZEN_MIN_LEAD_TIME = "citizenFreeAppointmentsMinLeadTime",
  CITIZEN_MAX_LEAD_TIME = "citizenFreeAppointmentsMaxLeadTime",
}

export interface AppointmentBlockAvailabilityFormModel extends FormikValues {
  [FormNames.AVAILABLE_FOR_CITIZEN]: boolean;
  [FormNames.AVAILABLE_FOR_BULK_BOOKING]: boolean;
  [FormNames.BULK_CREATE_MIN_LEAD_TIME]: OptionalFieldValue<number>;
  [FormNames.CITIZEN_MIN_LEAD_TIME]: OptionalFieldValue<number>;
  [FormNames.CITIZEN_MAX_LEAD_TIME]: OptionalFieldValue<number>;
}

const MIN_0 = 0;
const MAX_365 = 365;

export function AppointmentBlockDefaultAvailabilityForm(props: {
  moduleName: ConfiguratorModuleName;
  fields: FormNames[];
  queryHook: () => AppointmentBlockAvailabilityFormModel;
  updateHook: () => (
    params: AppointmentBlockAvailabilityFormModel,
  ) => Promise<void>;
}) {
  const result = props.queryHook();
  const updateAppointmentDefaultAvailability = props.updateHook();

  const { currentTabStatus } = useTabStatus({
    moduleName: props.moduleName,
    endpointName: "APPOINTMENT_BLOCK_AVAILABILITY",
  });
  const showLeadTimeSection =
    props.fields.includes(FormNames.BULK_CREATE_MIN_LEAD_TIME) ||
    props.fields.includes(FormNames.CITIZEN_MIN_LEAD_TIME) ||
    props.fields.includes(FormNames.CITIZEN_MAX_LEAD_TIME);

  return (
    <ConfiguratorForm
      sheets={[
        {
          title: "Standard Terminblock-Verfügbarkeit",
          sections: [
            ...[
              {
                title: "Voreingestellte Verfügbarkeit von Terminblöcken",
                description:
                  "Diese Option konfiguriert nur die voreingestellte Terminblock-Verfügbarkeit beim Anlegen von neuen Terminblöcken. Bei der Terminblock-Anlage können die Optionen frei verändert werden.",
                content: {
                  type: "field",
                  rows: [
                    {
                      fields: props.fields.includes(
                        FormNames.AVAILABLE_FOR_CITIZEN,
                      )
                        ? [
                            {
                              name: FormNames.AVAILABLE_FOR_CITIZEN,
                              type: "checkbox",
                              label: "Verfügbar für Online-Portal",
                            },
                          ]
                        : [],
                    },
                    {
                      fields: props.fields.includes(
                        FormNames.AVAILABLE_FOR_BULK_BOOKING,
                      )
                        ? [
                            {
                              name: FormNames.AVAILABLE_FOR_BULK_BOOKING,
                              type: "checkbox",
                              label: "Verfügbar für Massenterminzuweisung",
                            },
                          ]
                        : [],
                    },
                  ],
                },
              },
            ],
            ...(showLeadTimeSection ? [leadTimesSection(props.fields)] : []),
          ] as FormSection[],
        },
      ]}
      initialValues={result}
      status={currentTabStatus}
      onSubmit={updateAppointmentDefaultAvailability}
    />
  );
}

function leadTimesSection(fields: FormNames[]): FormSection {
  return {
    title: "Vorlaufzeiten für das Zuweisen von Terminen",
    content: {
      type: "field",
      rows: [
        {
          fields: fields.includes(FormNames.BULK_CREATE_MIN_LEAD_TIME)
            ? [
                {
                  name: FormNames.BULK_CREATE_MIN_LEAD_TIME,
                  type: "number",
                  label: "Vorlaufzeit für Massenterminzuweisung (in Tagen)",
                  required: "Bitte die Anzahl der Tage angeben.",
                  min: MIN_0,
                  max: MAX_365,
                  validate: validateLeadTime,
                },
              ]
            : [],
        },
        {
          fields: fields.includes(FormNames.CITIZEN_MIN_LEAD_TIME)
            ? [
                {
                  name: FormNames.CITIZEN_MIN_LEAD_TIME,
                  type: "number",
                  label:
                    "Start Buchungszeitraum für Online-Portal Terminzuweisung (in Tagen)",
                  required: "Bitte die Anzahl der Tage angeben.",
                  min: MIN_0,
                  max: MAX_365,
                  validate: validateLeadTime,
                },
                {
                  name: FormNames.CITIZEN_MAX_LEAD_TIME,
                  type: "number",
                  label:
                    "Ende Buchungszeitraum für Online-Portal Terminzuweisung (in Tagen)",
                  required: "Bitte die Anzahl der Tage angeben.",
                  min: MIN_0,
                  max: MAX_365,
                  validate: validateLeadTime,
                },
              ]
            : [],
        },
      ],
    },
  };
}

const validateLeadTime = validatePipe(
  validateInteger,
  validateRange(MIN_0, MAX_365),
);
