/**
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

"use client";

import { ApiReportingReason } from "@eshg/citizen-portal-api/measlesProtection";
import { Alert } from "@eshg/lib-portal/components/Alert";
import { DateField } from "@eshg/lib-portal/components/formFields/DateField";
import { InputField } from "@eshg/lib-portal/components/formFields/InputField";
import { SelectField } from "@eshg/lib-portal/components/formFields/SelectField";
import { createFieldNameMapper } from "@eshg/lib-portal/helpers/form";
import { validateLength } from "@eshg/lib-portal/helpers/validators";
import { Grid, Stack, Typography } from "@mui/joy";
import { SxProps } from "@mui/joy/styles/types";
import { useFormikContext } from "formik";
import { useEffect, useMemo } from "react";

import Loading from "@/app/[lang]/loading";
import {
  FormHeader,
  FormSectionLabel,
} from "@/lib/businessModules/measlesProtection/components/reportCase/ReportCaseForm";
import { ReportCaseOverviewCard } from "@/lib/businessModules/measlesProtection/components/reportCase/ReportCaseOverviewCard";
import {
  AffectedPersonFormInputs,
  ReportMeaslesCase,
} from "@/lib/businessModules/measlesProtection/components/reportCase/types";
import {
  FIRST_NAME_MAX_LENGTH,
  LAST_NAME_MAX_LENGTH,
} from "@/lib/businessModules/measlesProtection/shared/constants";
import {
  genderOptions,
  reportingReasonOptions,
  roleStatusOptions,
  salutationOptions,
  titleOptions,
} from "@/lib/businessModules/measlesProtection/shared/translations";
import { useTranslation } from "@/lib/i18n/client";
import { TextareaField } from "@/lib/shared/components/form/TextareaField";
import { validateEmail } from "@/lib/shared/helpers/validators";
import { useSearchParam } from "@/lib/shared/hooks/useSearchParam";

import { AddressForm } from "./AddressForm";

export interface NestedFormProps {
  name: string;
}

export function createEmptyAffectedPerson(): AffectedPersonFormInputs {
  return {
    salutation: "",
    title: "",
    firstName: "",
    lastName: "",
    dateOfBirth: "",
    gender: "",
    address: {
      type: "DomesticAddress",
      street: "",
      houseNumber: "",
      addressAddition: "",
      postalCode: "",
      city: "",
      country: "DE",
    },
    emailAddresses: [],
    phoneNumbers: [],
    custodians: [],
    roleStatus: "",
    reportData: {
      reportingDate: "",
      reportingReason: "",
      commentReportingReason: "",
    },
  };
}

interface AffectedPersonFormProps {
  onCancel?: () => unknown;
  sx?: SxProps;
}

export function AffectedPersonForm({ onCancel, sx }: AffectedPersonFormProps) {
  const { t } = useTranslation(["measlesProtection/forms"]);
  const {
    setFieldValue,
    isSubmitting,
    values: {
      facility: { name: facilityName },
      affectedPersons,
    },
  } = useFormikContext<ReportMeaslesCase>();
  const [currentAffectedPersonIndex, setCurrentAffectedPersonIndex] =
    useSearchParam("person", "number");
  const fieldName = createFieldNameMapper<AffectedPersonFormInputs>(
    `affectedPersons.${currentAffectedPersonIndex}`,
  );
  const lastAffectedPersonIndex = useMemo(
    () => (!!affectedPersons.length ? affectedPersons.length - 1 : 0),
    [affectedPersons.length],
  );
  const isValidAffectedPerson = useMemo(() => {
    return (
      currentAffectedPersonIndex >= 0 &&
      currentAffectedPersonIndex <= lastAffectedPersonIndex
    );
  }, [currentAffectedPersonIndex, lastAffectedPersonIndex]);
  const currentAffectedPerson = affectedPersons[currentAffectedPersonIndex];

  useEffect(() => {
    if (!isValidAffectedPerson) {
      setCurrentAffectedPersonIndex(lastAffectedPersonIndex);
    }
  }, [
    setCurrentAffectedPersonIndex,
    lastAffectedPersonIndex,
    isValidAffectedPerson,
  ]);

  return (
    <>
      <Stack component="div" gap={2} rowGap={2} sx={sx}>
        <FormHeader>{`${t("affectedPerson.title")} ${currentAffectedPersonIndex + 1}`}</FormHeader>
        <Grid container xxs={12} justifyContent={"flex-end"}>
          <Typography level="body-xs">{`* ${t("common.requiredField")}`}</Typography>
        </Grid>
        <Grid xxs={12}>
          <Alert message={t("affectedPerson.info")} color="primary" />
        </Grid>
        {!isValidAffectedPerson ? (
          <Loading />
        ) : (
          <Grid container spacing={2}>
            <Grid xxs={12}>
              <SelectField
                name={`affectedPersons.${currentAffectedPersonIndex}.reportData.reportingReason`}
                label={t("affectedPerson.fields.reportingReason")}
                options={reportingReasonOptions(t)}
                required={t("affectedPerson.fields.reportingReason_required")}
              />
            </Grid>
            {currentAffectedPerson &&
              currentAffectedPerson.reportData?.reportingReason ===
                ApiReportingReason.Other && (
                <Grid xxs={12}>
                  <TextareaField
                    name={`affectedPersons.${currentAffectedPersonIndex}.reportData.commentReportingReason`}
                    label={t("affectedPerson.fields.commentReportingReason")}
                    required={t(
                      "affectedPerson.fields.commentReportingReason_required",
                    )}
                  />
                </Grid>
              )}
            <Grid xxs={12}>
              <SelectField
                name={`affectedPersons.${currentAffectedPersonIndex}.roleStatus`}
                label={t("affectedPerson.fields.roleStatus")}
                options={roleStatusOptions(t)}
                required={t("affectedPerson.fields.roleStatus_required")}
              />
            </Grid>
            <FormSectionLabel value={t("affectedPerson.personalDetails")} />
            <Grid xxs={12} xs={6}>
              <SelectField
                name={fieldName("salutation")}
                label={t("common.personalDetails.salutation")}
                options={salutationOptions(t)}
              />
            </Grid>
            <Grid xxs={12} xs={6}>
              <SelectField
                name={fieldName("title")}
                label={t("common.personalDetails.title")}
                options={titleOptions(t)}
              />
            </Grid>
            <Grid xxs={12} xs={6}>
              <InputField
                name={fieldName("firstName")}
                label={t("common.personalDetails.firstName")}
                required={t("common.personalDetails.firstName_required")}
                validate={validateLength(1, FIRST_NAME_MAX_LENGTH)}
              />
            </Grid>
            <Grid xxs={12} xs={6}>
              <InputField
                name={fieldName("lastName")}
                label={t("common.personalDetails.lastName")}
                required={t("common.personalDetails.lastName_required")}
                validate={validateLength(1, LAST_NAME_MAX_LENGTH)}
              />
            </Grid>
            <Grid xxs={12} xs={6}>
              <SelectField
                name={fieldName("gender")}
                label={t("common.personalDetails.gender")}
                options={genderOptions(t)}
              />
            </Grid>
            <Grid xxs={12} xs={6}>
              <DateField
                name={fieldName("dateOfBirth")}
                label={t("common.personalDetails.dateOfBirth")}
                required={t("common.personalDetails.dateOfBirth_required")}
              />
            </Grid>
            <AddressForm name={fieldName("address")} />
            <FormSectionLabel value={t("affectedPerson.contactInfo")} />
            <Grid xxs={12} xs={6}>
              <InputField
                type="email"
                name={fieldName("emailAddresses")}
                label={t("common.personalDetails.emailAddress")}
                onChange={(value) =>
                  setFieldValue(fieldName("emailAddresses"), [value])
                }
                validate={(value) =>
                  validateEmail(
                    Array.isArray(value) ? (value[0] as string) : value,
                    t("common.personalDetails.emailAddress_required"),
                  )
                }
              />
            </Grid>
            <Grid xxs={12} xs={6}>
              <InputField
                type="tel"
                name={fieldName("phoneNumbers")}
                label={t("common.personalDetails.phoneNumber")}
                onChange={(value) =>
                  setFieldValue(fieldName("phoneNumbers"), [value])
                }
              />
            </Grid>
          </Grid>
        )}
      </Stack>
      <ReportCaseOverviewCard
        isSubmitting={isSubmitting}
        facilityName={facilityName}
        cancelLabel={t("common.back")}
        onCancel={onCancel}
        showFacilityContactPerson
      />
    </>
  );
}
