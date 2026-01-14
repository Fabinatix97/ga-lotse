/**
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { Box, Checkbox, Grid, Typography } from "@mui/joy";
import { useFormikContext } from "formik";

import {
  InputField,
  createFieldNameMapper,
  useValidateLength,
  useValidateZipCode,
} from "@eshg/lib-portal";
import {
  ApiCountryCode,
  ApiDomesticAddress,
} from "@eshg/measles-protection-api";

import { FormSectionLabel } from "@/lib/businessModules/measlesProtection/components/reportCase/ReportCaseForm";
import { FacilityContactAddressFormInputs } from "@/lib/businessModules/measlesProtection/components/reportCase/types";
import { useTranslation } from "@/lib/i18n/client";
import { CountryField } from "@/lib/shared/components/form/CountryField";

import { NestedFormProps } from "./AffectedPersonForm";

export function createEmptyAddress(): FacilityContactAddressFormInputs {
  return {
    addressAddition: "",
    city: "",
    country: "DE",
    houseNumber: "",
    postalCode: "",
    street: "",
    type: "DomesticAddress",
  };
}

interface AddressFormProps extends NestedFormProps {
  onCheckAddressMatch?: (checked: boolean) => unknown;
  addressMatchLabel?: string;
}

export function AddressForm({
  onCheckAddressMatch,
  addressMatchLabel,
  name,
}: AddressFormProps) {
  const { t } = useTranslation(["measlesProtection/forms"]);
  const validateLength = useValidateLength();
  const validateZipCode = useValidateZipCode();
  const fieldName = createFieldNameMapper<ApiDomesticAddress>(name);
  const ctx = useFormikContext();

  return (
    <>
      <FormSectionLabel value={t("common.addressForm.label")} />
      {onCheckAddressMatch && addressMatchLabel && (
        <Grid xxs={12}>
          <Box display="flex">
            <Checkbox
              color="primary"
              onChange={({ currentTarget: { checked } }) =>
                onCheckAddressMatch(checked)
              }
            />
            <Typography sx={{ ml: 2 }}>{addressMatchLabel}</Typography>
          </Box>
        </Grid>
      )}
      <Grid xxs={12} xs={8} lg={9}>
        <InputField
          name={fieldName("street")}
          label={t("common.addressForm.street")}
          required={t("common.addressForm.street_required")}
        />
      </Grid>
      <Grid xxs={12} xs={4} lg={3}>
        <InputField
          name={fieldName("houseNumber")}
          label={t("common.addressForm.houseNumber")}
          required={t("common.addressForm.houseNumber_required")}
        />
      </Grid>
      <Grid xxs={12}>
        <InputField
          name={fieldName("addressAddition")}
          label={t("common.addressForm.addressAddition")}
          maxLength={100}
          validate={(value) =>
            value ? validateLength(1, 100)(value) : undefined
          }
        />
      </Grid>
      <Grid xxs={12} xs={4} lg={3}>
        <InputField
          name={fieldName("postalCode")}
          label={t("common.addressForm.postalCode")}
          required={t("common.addressForm.postalCode_required")}
          validate={validateZipCode(
            (ctx.getFieldMeta(fieldName("country")).value as ApiCountryCode) ||
              ApiCountryCode.De,
          )}
        />
      </Grid>
      <Grid xxs={12} xs={8} lg={9}>
        <InputField
          name={fieldName("city")}
          label={t("common.addressForm.city")}
          required={t("common.addressForm.city_required")}
        />
      </Grid>
      <Grid xxs={12}>
        <CountryField
          name={fieldName("country")}
          label={t("common.addressForm.country")}
          required={t("common.addressForm.country_required")}
        />
      </Grid>
    </>
  );
}
