/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

"use client";

import { Alert } from "@eshg/lib-portal/components/Alert";
import { DateField } from "@eshg/lib-portal/components/formFields/DateField";
import { InputField } from "@eshg/lib-portal/components/formFields/InputField";
import { SelectField } from "@eshg/lib-portal/components/formFields/SelectField";
import { isAdult, toUtcDate } from "@eshg/lib-portal/helpers/dateTime";
import { createFieldNameMapper } from "@eshg/lib-portal/helpers/form";
import { validateLength } from "@eshg/lib-portal/helpers/validators";
import { Add, DeleteOutline } from "@mui/icons-material";
import {
  Button,
  Divider,
  Grid,
  IconButton,
  Sheet,
  Stack,
  Typography,
} from "@mui/joy";
import { SxProps } from "@mui/joy/styles/types";
import { FieldArray, useFormikContext } from "formik";
import { useEffect, useMemo } from "react";
import { isDefined } from "remeda";

import Loading from "@/app/[lang]/loading";
import {
  FormHeader,
  FormSectionLabel,
  getPageNumber,
} from "@/lib/businessModules/measlesProtection/components/reportCase/ReportCaseForm";
import { ReportCaseOverviewCard } from "@/lib/businessModules/measlesProtection/components/reportCase/ReportCaseOverviewCard";
import {
  CustodianFormInputs,
  ReportMeaslesCase,
} from "@/lib/businessModules/measlesProtection/components/reportCase/types";
import { Row } from "@/lib/businessModules/measlesProtection/shared/components/Row";
import {
  FIRST_NAME_MAX_LENGTH,
  LAST_NAME_MAX_LENGTH,
} from "@/lib/businessModules/measlesProtection/shared/constants";
import {
  genderOptions,
  salutationOptions,
  titleOptions,
} from "@/lib/businessModules/measlesProtection/shared/translations";
import { useTranslation } from "@/lib/i18n/client";
import { validateEmail } from "@/lib/shared/helpers/validators";
import { useReplaceSearchParams } from "@/lib/shared/hooks/searchParams/useReplaceSearchParams";
import { useSearchParam } from "@/lib/shared/hooks/useSearchParam";

import { AddressForm, createEmptyAddress } from "./AddressForm";

export interface NestedFormProps {
  name: string;
}

export function createEmptyCustodian(): CustodianFormInputs {
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
  };
}

interface CustodianFormProps extends NestedFormProps {
  onCheckAddressMatch?: (checked: boolean) => void;
}

export function CustodianForm({
  onCheckAddressMatch,
  name,
}: CustodianFormProps) {
  const { t } = useTranslation(["measlesProtection/forms"]);
  const { setFieldValue } = useFormikContext();
  const fieldName = createFieldNameMapper<CustodianFormInputs>(name);

  return (
    <>
      <Grid container spacing={2} data-testid="custodianForm">
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
        <AddressForm
          name={fieldName("address")}
          onCheckAddressMatch={(checked) => {
            if (onCheckAddressMatch) onCheckAddressMatch(checked);
          }}
          addressMatchLabel={t("custodian.address_match")}
        />
        <FormSectionLabel value={t("custodian.contact_info")} />
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
    </>
  );
}

interface CustodianFieldArrayProps extends NestedFormProps {
  onCancel?: () => unknown;
  custodianRequired?: boolean;
  sx?: SxProps;
}

export function CustodiansFieldArray({
  onCancel,
  name,
  sx,
  custodianRequired = true,
}: CustodianFieldArrayProps) {
  const { t } = useTranslation(["measlesProtection/forms"]);
  const replaceSearchParams = useReplaceSearchParams();
  const { isSubmitting, values } = useFormikContext<ReportMeaslesCase>();
  const {
    facility: { name: facilityName },
    affectedPersons,
  } = values;
  const [currentAffectedPersonIndex, setCurrentAffectedPersonIndex] =
    useSearchParam("person", "number");
  const currentAffectedPerson =
    values.affectedPersons[currentAffectedPersonIndex];
  const custodians = currentAffectedPerson?.custodians;
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

  useEffect(() => {
    if (!isValidAffectedPerson) {
      setCurrentAffectedPersonIndex(lastAffectedPersonIndex);
    }
  }, [
    setCurrentAffectedPersonIndex,
    lastAffectedPersonIndex,
    isValidAffectedPerson,
  ]);

  useEffect(() => {
    if (!currentAffectedPerson) return;

    if (
      !currentAffectedPerson?.dateOfBirth ||
      isAdult(toUtcDate(currentAffectedPerson?.dateOfBirth))
    ) {
      replaceSearchParams([
        {
          name: "page",
          value: getPageNumber("affectedPerson"),
        },
      ]);
    }
  }, [replaceSearchParams, currentAffectedPerson]);

  return (
    <>
      <Stack component="div" gap={2} rowGap={2} sx={sx}>
        <FormHeader>{t("common.custodian_other")}</FormHeader>
        <Grid container xxs={12} justifyContent={"flex-end"}>
          <Typography level="body-xs">{`* ${t("common.requiredField")}`}</Typography>
        </Grid>
        <Grid xxs={12}>
          <Alert message={t("custodian.info")} color="primary" />
        </Grid>
        {!currentAffectedPerson || !isDefined(custodians) ? (
          <Sheet
            sx={{
              ...sx,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              padding: "5rem",
              mr: 0,
            }}
          >
            <Loading />
          </Sheet>
        ) : (
          <Grid container spacing={2}>
            <FieldArray name={name} validateOnChange={false}>
              {({ push, remove, replace }) => {
                return (
                  <>
                    {currentAffectedPerson.custodians?.map(
                      (custodian, custodianIndex) => {
                        // don't include any values in the key, as this would cause the input fields to lose focus
                        const key = `custodians.${custodianIndex}`;
                        const personIndex =
                          custodianIndex !== 0 || custodians.length > 1
                            ? ` ${custodianIndex + 1}`
                            : "";
                        const sectionHeader = `${t("common.custodian_one")} ${personIndex}`;

                        return (
                          <Grid key={key} xxs={12} marginBottom={1}>
                            <Divider />
                            <Row justifyContent="space-between">
                              <Typography
                                level="body-md"
                                component="h2"
                                paddingTop={3}
                                paddingBottom={3}
                                fontWeight="bold"
                                alignSelf="center"
                              >
                                {sectionHeader}
                              </Typography>
                              {!(custodianIndex == 0 && custodianRequired) && (
                                <IconButton
                                  color="primary"
                                  onClick={() => remove(custodianIndex)}
                                  aria-label={`${sectionHeader} löschen`}
                                >
                                  <DeleteOutline />
                                </IconButton>
                              )}
                            </Row>
                            <CustodianForm
                              name={`${name}.${custodianIndex}`}
                              onCheckAddressMatch={(checked) => {
                                replace(custodianIndex, {
                                  ...custodian,
                                  address: checked
                                    ? currentAffectedPerson.address
                                    : createEmptyAddress(),
                                });
                              }}
                            />
                          </Grid>
                        );
                      },
                    )}
                    <Grid xxs={12}>
                      <Divider />
                    </Grid>
                    <Button
                      onClick={() => push(createEmptyCustodian())}
                      variant="plain"
                      color="primary"
                      startDecorator={<Add />}
                      size={"sm"}
                      sx={{
                        p: 2,
                        "--Button-minHeight": 0,
                        alignSelf: "flex-start",
                      }}
                    >
                      Kontaktperson hinzufügen
                    </Button>
                  </>
                );
              }}
            </FieldArray>
          </Grid>
        )}
      </Stack>
      <ReportCaseOverviewCard
        isSubmitting={isSubmitting}
        facilityName={facilityName}
        cancelLabel={t("common.back")}
        onCancel={onCancel}
        showFacilityContactPerson
        showAffected={{ current: true }}
      />
    </>
  );
}
