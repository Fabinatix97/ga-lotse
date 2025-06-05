/**
 * Copyright 2025 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { Stack } from "@mui/joy";
import { FormikValues, useFormikContext } from "formik";

import { RadioGroupField } from "@eshg/lib-portal";
import { ApiTravelType } from "@eshg/travel-medicine-api";

import {
  FormSheet,
  FormSheetTitle,
} from "@/lib/businessModules/travelMedicine/components/shared/components/FormSheet";
import { RadioSheet } from "@/lib/businessModules/travelMedicine/components/shared/components/RadioSheet";
import { TRAVEL_TYPES } from "@/lib/businessModules/travelMedicine/helpers/translations";
import { useTranslation } from "@/lib/i18n/client";

export function TravelTypeStep() {
  const { t } = useTranslation(["travelMedicine/forms"]);
  const { setFieldValue } = useFormikContext<FormikValues>();

  const travelTypes = [
    ApiTravelType.Vacation,
    ApiTravelType.Business,
    ApiTravelType.Backpack,
    ApiTravelType.NoTravel,
  ];
  return (
    <FormSheet data-testid="travel-type-content-form">
      <FormSheetTitle>{t("travelTypeFormContent.title")}</FormSheetTitle>
      <RadioGroupField
        name="travelInformation.travelType"
        required={t("travelTypeFormContent.error")}
        onChange={async (value) => {
          if (value === ApiTravelType.NoTravel) {
            await setFieldValue("travelInformation.travelDestinations", []);
            await setFieldValue("travelInformation.travelStartDate", "");
            await setFieldValue("travelInformation.travelTimeAmount", "");
            await setFieldValue("travelInformation.travelTimeUnit", "");
          }
        }}
      >
        <Stack gap={2}>
          {travelTypes.map((val) => (
            <RadioSheet
              key={`travelInformation.travelType.${val}`}
              label={`${TRAVEL_TYPES[val]}`}
              value={val}
              radioProps={{
                sx: (theme) => ({
                  label: { ...theme.typography["title-md"] },
                  alignItems: "center",
                }),
              }}
            />
          ))}
        </Stack>
      </RadioGroupField>
    </FormSheet>
  );
}
