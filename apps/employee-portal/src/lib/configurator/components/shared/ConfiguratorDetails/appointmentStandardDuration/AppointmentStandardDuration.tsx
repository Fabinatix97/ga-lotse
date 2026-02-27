/**
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { FormikValues } from "formik";
import { notFound } from "next/navigation";

import {
  OptionalFieldValue,
  isEmptyString,
  validateInteger,
  validatePipe,
  validateRange,
} from "@eshg/lib-portal";

import { InfectionBriefingAppointmentStandardDuration } from "@/lib/configurator/components/shared/ConfiguratorDetails/appointmentStandardDuration/InfectionBriefingAppointmentStandardDuration";
import { ProstituteProtectionAppointmentStandardDuration } from "@/lib/configurator/components/shared/ConfiguratorDetails/appointmentStandardDuration/ProstituteProtectionAppointmentStandardDuration";
import {
  ConfiguratorForm,
  FormSheet,
} from "@/lib/configurator/components/shared/ConfiguratorForm";
import { ConfiguratorAlertProps } from "@/lib/configurator/components/shared/RenderField";
import { useTabStatus } from "@/lib/configurator/components/shared/hooks/useTabStatus";
import { ConfiguratorModuleName } from "@/lib/configurator/shared/types";

import { MeaslesProtectionAppointmentStandardDuration } from "./MeaslesProtectionAppointmentStandardDuration";
import { OmsAppointmentStandardDuration } from "./OmsAppointmentStandardDuration";
import { SchoolEntryAppointmentStandardDuration } from "./SchoolEntryAppointmentStandardDuration";
import { SexWorkAppointmentStandardDuration } from "./SexWorkAppointmentStandardDuration";
import { StiProtectionAppointmentStandardDuration } from "./StiProtectionAppointmentStandardDuration";
import { TravelMedicineAppointmentStandardDuration } from "./TravelMedicineAppointmentStandardDuration";

export function AppointmentStandardDuration(props: {
  module: ConfiguratorModuleName;
}) {
  switch (props.module) {
    case ConfiguratorModuleName.SchoolEntry:
      return <SchoolEntryAppointmentStandardDuration />;
    case ConfiguratorModuleName.TravelMedicine:
      return <TravelMedicineAppointmentStandardDuration />;
    case ConfiguratorModuleName.MeaslesProtection:
      return <MeaslesProtectionAppointmentStandardDuration />;
    case ConfiguratorModuleName.OfficialMedicalService:
      return <OmsAppointmentStandardDuration />;
    case ConfiguratorModuleName.StiProtection:
      return <StiProtectionAppointmentStandardDuration />;
    case ConfiguratorModuleName.sexWork:
      return <SexWorkAppointmentStandardDuration />;
    case ConfiguratorModuleName.ProstituteProtection:
      return <ProstituteProtectionAppointmentStandardDuration />;
    case ConfiguratorModuleName.InfectionBriefing:
      return <InfectionBriefingAppointmentStandardDuration />;
    default:
      notFound();
  }
}

export interface StandardDurationField<TFormModel> {
  name: keyof TFormModel & string;
  label: string;
  alert?: ConfiguratorAlertProps;
}

const MIN_0 = 0;
const MIN_5 = 5;
const MAX_240 = 240;

export function AppointmentStandardDurationConfiguratorForm<
  TFormModel extends FormikValues,
>(props: {
  moduleName: ConfiguratorModuleName;
  endpointName: string;
  withExtraDuration?: boolean;
  fields: StandardDurationField<TFormModel>[];
  queryHook: () => TFormModel;
  updateHook: () => (params: TFormModel) => Promise<void>;
}) {
  const { currentTabStatus } = useTabStatus({
    moduleName: props.moduleName,
    endpointName: props.endpointName,
  });
  const result = props.queryHook();

  const updateAppointmentStandardDuration = props.updateHook();

  const defaultDurationSheet = {
    title: "Standard-Termindauer",
    sections: [
      {
        content: {
          type: "field",
          rows: props.fields.map((field) => ({
            fields: [
              {
                type: "number",
                name: field.name,
                label: field.label,
                alert: field.alert,
                min: MIN_5,
                max: MAX_240,
                required: "Bitte eine Termindauer eingeben.",
                validate: validateStandardDuration,
              },
            ],
          })),
        },
      },
    ],
  } satisfies FormSheet;

  const extraDurationSheet = {
    title: "Extralänge",
    description:
      "Termine können mit Überlänge angelegt werden. Eine Länge von '0' deaktiviert das Feature.",
    sections: [
      {
        content: {
          type: "field",
          rows: [
            {
              fields: [
                {
                  type: "number",
                  name: "extraDuration",
                  label: "Extralänge in Minuten",
                  min: MIN_0,
                  max: MAX_240,
                  required: "Bitte eine Extralänge eingeben",
                  validate: validatePipe(
                    validateInteger,
                    validateRange(MIN_0, MAX_240),
                    validateMultipleOfFive,
                  ),
                },
              ],
            },
          ],
        },
      },
    ],
  } satisfies FormSheet;

  return (
    <ConfiguratorForm
      sheets={[
        defaultDurationSheet,
        ...(props.withExtraDuration ? [extraDurationSheet] : []),
      ]}
      initialValues={result}
      status={currentTabStatus}
      onSubmit={updateAppointmentStandardDuration}
    />
  );
}

const validateStandardDuration = validatePipe(
  validateInteger,
  validateRange(MIN_5, MAX_240),
  validateMultipleOfFive,
);

function validateMultipleOfFive(value: OptionalFieldValue<number>) {
  if (isEmptyString(value) || value % 5 === 0) return undefined;
  return "Bitte ein Vielfaches von 5 angeben.";
}
