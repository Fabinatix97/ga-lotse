/**
 * Copyright 2025 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { TravelExploreOutlined } from "@mui/icons-material";
import { Stack, Typography } from "@mui/joy";
import { useFormikContext } from "formik";

import { useMultiStepForm } from "@eshg/lib-portal";
import { ApiTravelTimeUnit, ApiTravelType } from "@eshg/travel-medicine-api";

import { InitialAppointmentFormValues } from "@/lib/businessModules/travelMedicine/components/appointment/types";
import {
  formatTravelDestinations,
  formatTravelDuration,
  travelDestinationsTranslation,
} from "@/lib/businessModules/travelMedicine/helpers/appointmentFormHelper";
import {
  TRAVEL_TIME_UNITS,
  TRAVEL_TYPES,
} from "@/lib/businessModules/travelMedicine/helpers/translations";
import { useTranslation } from "@/lib/i18n/client";
import { useTranslateCountry } from "@/lib/i18n/useTranslateCountry";
import { DetailsItem } from "@/lib/shared/components/DetailsItem";

export function TravelInformationOverviewDetails() {
  const { t } = useTranslation(["travelMedicine/forms"]);
  const { values } = useFormikContext<InitialAppointmentFormValues>();
  const { translateCountry } = useTranslateCountry();
  const { currentStep } = useMultiStepForm();

  const travelDurationLabel = t("overview.fields.travelDuration");
  const travelDestinationsLabel = t("overview.fields.travelDestinations", {
    count: values.travelInformation.travelDestinations.length,
  });

  function isTravelDataComplete() {
    return (
      values.travelInformation.travelType &&
      values.travelInformation.travelType !== ApiTravelType.NoTravel &&
      values.travelInformation.travelDestinations.length > 0 &&
      values.travelInformation.travelStartDate &&
      values.travelInformation.travelTimeAmount &&
      values.travelInformation.travelTimeUnit
    );
  }

  return (
    <Stack role="listitem">
      {currentStep > 3 && (
        <DetailsItem
          label={t("overview.fields.travelData", {
            context: "label",
          })}
          value={
            TRAVEL_TYPES[values.travelInformation.travelType as ApiTravelType]
          }
          icon={<TravelExploreOutlined />}
          hiddenLabel
        />
      )}
      {currentStep > 4 && isTravelDataComplete() && (
        <>
          <Typography sx={{ paddingInlineStart: "2.25rem" }}>
            {formatTravelDestinations(
              travelDestinationsLabel,
              travelDestinationsTranslation(
                values.travelInformation.travelDestinations,
                translateCountry,
              ),
            )}
          </Typography>
          <Typography sx={{ paddingInlineStart: "2.25rem" }}>
            {formatTravelDuration(
              travelDurationLabel,
              values.travelInformation.travelTimeAmount,
              TRAVEL_TIME_UNITS[
                values.travelInformation.travelTimeUnit as ApiTravelTimeUnit
              ],
            )}
          </Typography>
        </>
      )}
    </Stack>
  );
}
