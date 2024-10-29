/**
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

"use client";

import { ApiFacilityType } from "@eshg/citizen-portal-api/measlesProtection";
import { Alert } from "@eshg/lib-portal/components/Alert";
import { InputField } from "@eshg/lib-portal/components/formFields/InputField";
import { SelectField } from "@eshg/lib-portal/components/formFields/SelectField";
import { createFieldNameMapper } from "@eshg/lib-portal/helpers/form";
import { Grid, Stack, Typography } from "@mui/joy";
import { SxProps } from "@mui/joy/styles/types";
import { useFormikContext } from "formik";

import { FormHeader } from "@/lib/businessModules/measlesProtection/components/reportCase/ReportCaseForm";
import { ReportCaseOverviewCard } from "@/lib/businessModules/measlesProtection/components/reportCase/ReportCaseOverviewCard";
import {
  FacilityFormInputs,
  ReportMeaslesCase,
} from "@/lib/businessModules/measlesProtection/components/reportCase/types";
import { facilityTypeOptions } from "@/lib/businessModules/measlesProtection/shared/translations";
import { useTranslation } from "@/lib/i18n/client";

import { AddressForm, createEmptyAddress } from "./AddressForm";
import {
  ContactPersonForm,
  createEmptyContactPerson,
} from "./ContactPersonForm";

export interface NestedFormProps {
  name: string;
}

export const facilityInitial: FacilityFormInputs = {
  name: "",
  type: "",
  contactAddress: createEmptyAddress(),
  contactPersons: [createEmptyContactPerson()],
  dataOrigin: "EXTERNAL",
};

interface FacilityFormProps extends NestedFormProps {
  onCancel?: () => unknown;
  sx?: SxProps;
}

export function FacilityForm({ onCancel, name, sx }: FacilityFormProps) {
  const {
    isSubmitting,
    values: {
      facility: { name: facilityName, type: facilityType },
    },
  } = useFormikContext<ReportMeaslesCase>();
  const { t } = useTranslation(["measlesProtection/forms"]);
  const fieldName = createFieldNameMapper<FacilityFormInputs>(name);
  const currentContactPerson = 0;

  return (
    <>
      <Stack component="div" gap={2} rowGap={2} sx={sx}>
        <FormHeader>{t("facility.title")}</FormHeader>
        <Grid container xxs={12} justifyContent={"flex-end"}>
          <Typography level="body-xs">{`* ${t("common.requiredField")}`}</Typography>
        </Grid>
        <Grid xxs={12}>
          <Alert message={t("facility.info")} color="primary" />
        </Grid>
        <Grid xxs={12}>
          <InputField
            name={fieldName("name")}
            label={t("facility.fields.facilityName")}
            required={t("facility.fields.facilityName_required")}
          />
        </Grid>
        <Grid xxs={12}>
          <SelectField
            name={fieldName("type")}
            label={t("facility.fields.facilityType")}
            options={facilityTypeOptions(t)}
            required={t("facility.fields.facilityType_required")}
          />
        </Grid>
        {facilityType && facilityType === ApiFacilityType.Other && (
          <Grid xxs={12}>
            <InputField
              name={"otherFacilityTypeInformation"}
              label={t("facility.fields.facilityTypeOther")}
              required="Bitte einen spezifischen anderen Typ angeben."
            />
          </Grid>
        )}
        <Grid container spacing={2}>
          <AddressForm name={fieldName("contactAddress")} />
        </Grid>
        <Grid container spacing={2}>
          <ContactPersonForm
            name={`${fieldName("contactPersons")}.${currentContactPerson}`}
          />
        </Grid>
      </Stack>
      <ReportCaseOverviewCard
        isSubmitting={isSubmitting}
        facilityName={facilityName}
        onCancel={onCancel}
      />
    </>
  );
}
