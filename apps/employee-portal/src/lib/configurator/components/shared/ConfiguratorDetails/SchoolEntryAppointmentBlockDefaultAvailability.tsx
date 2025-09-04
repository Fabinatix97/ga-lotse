/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { FormikValues } from "formik";
import { notFound } from "next/navigation";

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
import { useUpdateAppointmentBlockDefaultAvailability } from "@/lib/shared/api/mutations/configurator/useUpdateAppointmentBlockDefaultAvailability";
import { useGetAppointmentBlockDefaultAvailability } from "@/lib/shared/api/queries/configurator/appointmentBlockDefaultAvailability";

enum FormNames {
  AVAILABLE_FOR_CITIZEN = "availableForCitizen",
  AVAILABLE_FOR_BULK_BOOKING = "availableForBulkBooking",
}

export interface SchoolEntryAppointmentBlockDefaultAvailabilityFormModel
  extends FormikValues {
  [FormNames.AVAILABLE_FOR_CITIZEN]: boolean;
  [FormNames.AVAILABLE_FOR_BULK_BOOKING]: boolean;
}

const endpointName: ConfiguratorEndpointName =
  "APPOINTMENT_BLOCK_DEFAULT_AVAILABILITY";

export function SchoolEntryAppointmentBlockDefaultAvailability(props: {
  module: ConfiguratorModuleName;
}) {
  if (!isEndpointSupportedByModule(props.module, endpointName)) {
    notFound();
  }

  return (
    <SchoolEntryAppointmentBlockDefaultAvailabilityForm module={props.module} />
  );
}

function SchoolEntryAppointmentBlockDefaultAvailabilityForm(props: {
  module: ConfiguratorModuleName;
}) {
  const { data: config } = useGetAppointmentBlockDefaultAvailability();
  const onSubmit = useUpdateAppointmentBlockDefaultAvailability();
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
