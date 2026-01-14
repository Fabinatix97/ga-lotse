/**
 * Copyright 2026 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { TravelExploreOutlined } from "@mui/icons-material";
import { useFormikContext } from "formik";

import { useMultiStepForm } from "@eshg/lib-portal";
import { ApiTravelTimeUnit, ApiTravelType } from "@eshg/travel-medicine-api";

import { InitialAppointmentFormValues } from "@/lib/businessModules/travelMedicine/components/appointment/types";
import { travelDestinationsTranslation } from "@/lib/businessModules/travelMedicine/helpers/appointmentFormHelper";
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
    <>
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
          <DetailsItem
            label={t("overview.fields.travelDestinations", {
              count: values.travelInformation.travelDestinations.length,
            })}
            value={travelDestinationsTranslation(
              values.travelInformation.travelDestinations,
              translateCountry,
            )}
            slotProps={{
              stack: { direction: "row", gap: 0.66, sx: { paddingLeft: 5 } },
              label: { level: "body-md" },
            }}
          />
          <DetailsItem
            label={t("overview.fields.travelDuration_label")}
            value={t("overview.fields.travelDuration_value", {
              travelTimeAmount: values.travelInformation.travelTimeAmount,
              travelTimeUnit:
                TRAVEL_TIME_UNITS[
                  values.travelInformation.travelTimeUnit as ApiTravelTimeUnit
                ],
            })}
            slotProps={{
              stack: { direction: "row", gap: 0.66, sx: { paddingLeft: 5 } },
              label: { level: "body-md" },
            }}
          />
        </>
      )}
    </>
  );
}
