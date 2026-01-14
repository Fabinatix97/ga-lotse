/**
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { FormikValues } from "formik";
import { notFound } from "next/navigation";

import {
  OptionalFieldValue,
  mapRequiredValue,
  validateInteger,
  validatePipe,
  validateRange,
} from "@eshg/lib-portal";

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
import { useUpdateAppointmentBlockAvailability } from "@/lib/shared/api/mutations/configurator/useUpdateAppointmentBlockAvailability";
import { useGetAppointmentBlockAvailability } from "@/lib/shared/api/queries/configurator/appointmentBlockDefaultAvailability";

const MIN_0 = 0;
const MAX_365 = 365;

enum FormNames {
  AVAILABLE_FOR_CITIZEN = "availableForCitizen",
  AVAILABLE_FOR_BULK_BOOKING = "availableForBulkBooking",
  BULK_CREATE_MIN_LEAD_TIME = "bulkCreateAppointmentsMinLeadTime",
  CITIZEN_MIN_LEAD_TIME = "citizenFreeAppointmentsMinLeadTime",
  CITIZEN_MAX_LEAD_TIME = "citizenFreeAppointmentsMaxLeadTime",
}

export interface SchoolEntryAppointmentBlockAvailabilityFormModel
  extends FormikValues {
  [FormNames.AVAILABLE_FOR_CITIZEN]: boolean;
  [FormNames.AVAILABLE_FOR_BULK_BOOKING]: boolean;
  [FormNames.BULK_CREATE_MIN_LEAD_TIME]: OptionalFieldValue<number>;
  [FormNames.CITIZEN_MIN_LEAD_TIME]: OptionalFieldValue<number>;
  [FormNames.CITIZEN_MAX_LEAD_TIME]: OptionalFieldValue<number>;
}

const endpointName: ConfiguratorEndpointName = "APPOINTMENT_BLOCK_AVAILABILITY";

export function SchoolEntryAppointmentBlockAvailability(props: {
  module: ConfiguratorModuleName;
}) {
  if (!isEndpointSupportedByModule(props.module, endpointName)) {
    notFound();
  }

  return <SchoolEntryAppointmentBlockAvailabilityForm module={props.module} />;
}

function SchoolEntryAppointmentBlockAvailabilityForm(props: {
  module: ConfiguratorModuleName;
}) {
  const { data: config } = useGetAppointmentBlockAvailability();
  const updateAppointmentBlockAvailability =
    useUpdateAppointmentBlockAvailability();

  async function onSubmit(
    values: SchoolEntryAppointmentBlockAvailabilityFormModel,
  ) {
    await updateAppointmentBlockAvailability.mutateAsync({
      defaultFlags: {
        availableForBulkBooking: values[FormNames.AVAILABLE_FOR_BULK_BOOKING],
        availableForCitizen: values[FormNames.AVAILABLE_FOR_CITIZEN],
      },
      leadTimes: {
        bulkCreateAppointmentsMinLeadTime: mapRequiredValue(
          values[FormNames.BULK_CREATE_MIN_LEAD_TIME],
        ),
        citizenFreeAppointmentsMinLeadTime: mapRequiredValue(
          values[FormNames.CITIZEN_MIN_LEAD_TIME],
        ),
        citizenFreeAppointmentsMaxLeadTime: mapRequiredValue(
          values[FormNames.CITIZEN_MAX_LEAD_TIME],
        ),
      },
    });
  }

  const { currentTabStatus } = useTabStatus({
    moduleName: props.module,
    endpointName,
  });

  const sheets = [
    {
      title: "Standard Terminblock-Verfügbarkeit",
      sections: [
        {
          title: "Voreingestellte Verfügbarkeit von Terminblöcken",
          description:
            "Diese Option konfiguriert nur die voreingestellte Terminblock-Verfügbarkeit beim Anlegen von neuen Terminblöcken. Bei der Terminblock-Anlage können die Optionen frei verändert werden.",
          content: {
            type: "field",
            rows: [
              {
                fields: [
                  {
                    name: FormNames.AVAILABLE_FOR_CITIZEN,
                    type: "checkbox",
                    label: "Verfügbar für Online-Portal",
                  },
                ],
              },
              {
                fields: [
                  {
                    name: FormNames.AVAILABLE_FOR_BULK_BOOKING,
                    type: "checkbox",
                    label: "Verfügbar für Massenterminzuweisung",
                  },
                ],
              },
            ],
          },
        },
        {
          title: "Vorlaufzeiten für das Zuweisen von Terminen",
          content: {
            type: "field",
            rows: [
              {
                fields: [
                  {
                    name: FormNames.BULK_CREATE_MIN_LEAD_TIME,
                    type: "number",
                    label: "Vorlaufzeit für Massenterminzuweisung (in Tagen)",
                    required: "Bitte die Anzahl der Tage angeben.",
                    min: MIN_0,
                    max: MAX_365,
                    validate: validateLeadTime,
                  },
                ],
              },
              {
                fields: [
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
                ],
              },
            ],
          },
        },
      ] satisfies FormSection[],
    },
  ];

  return (
    <ConfiguratorForm
      sheets={sheets}
      initialValues={config}
      status={currentTabStatus}
      onSubmit={onSubmit}
    />
  );
}

const validateLeadTime = validatePipe(
  validateInteger,
  validateRange(MIN_0, MAX_365),
);
