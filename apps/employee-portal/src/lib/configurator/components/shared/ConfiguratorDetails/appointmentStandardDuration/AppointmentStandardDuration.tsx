/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { FormikValues } from "formik";
import { notFound } from "next/navigation";

import { validateIntegerAnd, validateRange } from "@eshg/lib-portal";

import { ConfiguratorForm } from "@/lib/configurator/components/shared/ConfiguratorForm";
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
const MAX_240 = 240;

export function AppointmentStandardDurationConfiguratorForm<
  TFormModel extends FormikValues,
>(props: {
  moduleName: ConfiguratorModuleName;
  endpointName: string;
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

  return (
    <ConfiguratorForm
      sheets={[
        {
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
                      min: MIN_0,
                      max: MAX_240,
                      required: "Bitte eine Termindauer eingeben.",
                      validate: validateIntegerAnd(
                        validateRange(MIN_0, MAX_240),
                      ),
                    },
                  ],
                })),
              },
            },
          ],
        },
      ]}
      initialValues={result}
      status={currentTabStatus}
      onSubmit={updateAppointmentStandardDuration}
    />
  );
}
