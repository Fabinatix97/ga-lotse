/**
 * Copyright 2025 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import {
  ApiTravelTimeUnit,
  ApiTravelType,
} from "@eshg/citizen-portal-api/travelMedicine";
import { TravelExploreOutlined } from "@mui/icons-material";
import { Stack, Typography } from "@mui/joy";
import { useFormikContext } from "formik";

import { InitialAppointmentFormValues } from "@/lib/businessModules/travelMedicine/components/appointment/types";
import { DetailsField } from "@/lib/businessModules/travelMedicine/components/shared/components/DetailsField";
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

export function TravelInformationOverviewDetails() {
  const { t } = useTranslation(["travelMedicine/forms"]);
  const { values } = useFormikContext<InitialAppointmentFormValues>();

  const travelDurationLabel = t(
    "appointmentOverviewSection.values.travelDuration",
  );
  const travelDestinationsLabel = t(
    "appointmentOverviewSection.values.travelDestinations",
    { count: values.travelInformation.travelDestinations.length },
  );
  // const travelStartDateLabel = t(
  //   "appointmentOverviewSection.values.travelStartDate",
  // );

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
    <Stack>
      <DetailsField
        value={
          TRAVEL_TYPES[values.travelInformation.travelType as ApiTravelType]
        }
        icon={<TravelExploreOutlined />}
      />
      {isTravelDataComplete() && (
        <>
          <Typography sx={{ paddingInlineStart: "2.25rem" }}>
            {formatTravelDestinations(
              travelDestinationsLabel,
              travelDestinationsTranslation(
                values.travelInformation.travelDestinations,
              ),
            )}
          </Typography>
          {/*needs feedback from ui team*/}
          {/*<Typography sx={{ paddingInlineStart: "2.25rem" }}>*/}
          {/*  {formatTravelStartDate(*/}
          {/*    travelStartDateLabel,*/}
          {/*    formatDate(new Date(values.travelInformation.travelStartDate)),*/}
          {/*  )}*/}
          {/*</Typography>*/}
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
