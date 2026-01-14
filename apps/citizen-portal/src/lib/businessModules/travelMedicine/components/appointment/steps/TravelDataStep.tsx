/**
 * Copyright 2026 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { Stack } from "@mui/joy";
import { useFormikContext } from "formik";

import {
  DateField,
  NumberField,
  SelectField,
  validateIntegerAnd,
  validateRange,
} from "@eshg/lib-portal";
import { ApiTravelType } from "@eshg/travel-medicine-api";

import { InitialAppointmentFormValues } from "@/lib/businessModules/travelMedicine/components/appointment/types";
import { CountryFieldMulti } from "@/lib/businessModules/travelMedicine/components/shared/CountryFieldMulti";
import {
  FormSheet,
  FormSheetTitle,
} from "@/lib/businessModules/travelMedicine/components/shared/components/FormSheet";
import { VACCINATION_CONSULTATION_TRAVEL_TIME_UNITS } from "@/lib/businessModules/travelMedicine/helpers/options";
import { validateTodayOrFutureDate } from "@/lib/businessModules/travelMedicine/helpers/validators";
import { useTranslation } from "@/lib/i18n/client";

const MIN_TRAVEL_TIME = 1;
const MAX_TRAVEL_TIME = 1000;

export function TravelDataStep() {
  const { t } = useTranslation(["travelMedicine/forms"]);
  const { values } = useFormikContext<InitialAppointmentFormValues>();

  return (
    <FormSheet data-testid="travel-data-content-form">
      <FormSheetTitle requiredTitle={t("common.requiredTitle")}>
        {t("travelDataFormContent.title")}
      </FormSheetTitle>
      <Stack gap={2}>
        <CountryFieldMulti
          name="travelInformation.travelDestinations"
          label={t("travelDataFormContent.fields.travelDestinations")}
          required={
            values.travelInformation.travelType !== ApiTravelType.NoTravel
              ? t("travelDataFormContent.fields.travelDestinations_required")
              : undefined
          }
        />
        <DateField
          name="travelInformation.travelStartDate"
          label={t("travelDataFormContent.fields.travelStartDate")}
          required={
            values.travelInformation.travelType !== ApiTravelType.NoTravel
              ? t("travelDataFormContent.fields.travelStartDate_required")
              : undefined
          }
          validate={validateTodayOrFutureDate}
        />
        <NumberField
          name="travelInformation.travelTimeAmount"
          label={t("travelDataFormContent.fields.travelTimeAmount")}
          required={
            values.travelInformation.travelType !== ApiTravelType.NoTravel
              ? t("travelDataFormContent.fields.travelTimeAmount_required")
              : undefined
          }
          validate={validateIntegerAnd(
            validateRange(MIN_TRAVEL_TIME, MAX_TRAVEL_TIME),
          )}
          min={MIN_TRAVEL_TIME}
          max={MAX_TRAVEL_TIME}
        />
        <SelectField
          name="travelInformation.travelTimeUnit"
          label={t("travelDataFormContent.fields.travelTimeUnit")}
          options={VACCINATION_CONSULTATION_TRAVEL_TIME_UNITS}
          required={
            values.travelInformation.travelType !== ApiTravelType.NoTravel
              ? t("travelDataFormContent.fields.travelTimeUnit_required")
              : undefined
          }
        />
      </Stack>
    </FormSheet>
  );
}
