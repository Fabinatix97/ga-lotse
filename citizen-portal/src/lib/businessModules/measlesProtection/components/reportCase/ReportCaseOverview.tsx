/**
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

"use client";

import {
  ApiReportingReason,
  ApiRoleStatus,
} from "@eshg/citizen-portal-api/measlesProtection";
import { DeleteOutline, EditOutlined } from "@mui/icons-material";
import {
  Accordion,
  AccordionDetails,
  AccordionGroup,
  AccordionSummary,
  Box,
  Button,
  Grid,
  GridProps,
  Sheet,
  Stack,
  Typography,
} from "@mui/joy";
import { SxProps } from "@mui/joy/styles/types";
import { useFormikContext } from "formik";
import { ReactNode } from "react";

import {
  FormHeader,
  reportCaseFormPages,
} from "@/lib/businessModules/measlesProtection/components/reportCase/ReportCaseForm";
import { ReportCaseOverviewCard } from "@/lib/businessModules/measlesProtection/components/reportCase/ReportCaseOverviewCard";
import { setReportCaseForm } from "@/lib/businessModules/measlesProtection/helpers/reportCaseForm.storage";
import {
  reportingReasonNames,
  roleStatusNames,
} from "@/lib/businessModules/measlesProtection/shared/translations";
import { useTranslation } from "@/lib/i18n/client";
import { ActionsMenu } from "@/lib/shared/components/buttons/ActionsMenu";
import { useReplaceSearchParams } from "@/lib/shared/hooks/searchParams/useReplaceSearchParams";

import { formatAddress, formatName } from "./helpers";
import { createEmptyAffectedPerson } from "./subforms/AffectedPersonForm";
import { ReportMeaslesCase } from "./types";

function DetailsField({
  value,
  label,
  ...gridProps
}: { label: string; value: string | ReactNode } & GridProps) {
  return (
    <Grid xxs={12} sx={{ wordBreak: "break-word" }} {...gridProps}>
      <Typography level="body-sm" color="neutral">
        {label}
      </Typography>
      <Typography
        level="title-md"
        sx={{ color: "text.primary", fontWeight: 600, mt: 1 }}
      >
        {value}
      </Typography>
    </Grid>
  );
}

interface ReportCaseOverviewProps {
  onCancel?: () => unknown;
  sx?: SxProps;
}

export function ReportCaseOverview({ onCancel, sx }: ReportCaseOverviewProps) {
  const { t } = useTranslation(["measlesProtection/forms"]);
  const { values, setValues, isSubmitting } =
    useFormikContext<ReportMeaslesCase>();
  const replaceSearchParams = useReplaceSearchParams();
  const {
    affectedPersons,
    facility: { name: facilityName },
  } = values;

  async function handleAddAffectedPerson() {
    const nextValues = {
      ...values,
      affectedPersons: [...affectedPersons, createEmptyAffectedPerson()],
    };

    setReportCaseForm(nextValues);
    await setValues(nextValues);

    replaceSearchParams([
      {
        name: "page",
        value: reportCaseFormPages.affectedPerson.pageNumber,
      },
      {
        name: "person",
        value: !!affectedPersons.length ? affectedPersons.length : 0,
      },
    ]);
  }

  async function handleDeleteAffectedPerson(personIndex: number) {
    const nextAffectedPersons = [...affectedPersons];
    nextAffectedPersons.splice(personIndex, 1);
    const nextValues = {
      ...values,
      affectedPersons: nextAffectedPersons,
    };

    await setValues(nextValues);
    setReportCaseForm(nextValues);
  }

  function handleEditAffectedPerson(personIndex: number) {
    replaceSearchParams([
      {
        name: "page",
        value: reportCaseFormPages.affectedPerson.pageNumber,
      },
      {
        name: "person",
        value: personIndex,
      },
    ]);
  }

  return (
    <>
      <Stack component="div" gap={2} rowGap={2} sx={sx}>
        <FormHeader>{t("overview.title")}</FormHeader>
        <AccordionGroup data-testid="affectedPersonsAccordionGroup">
          {affectedPersons.map((affectedPerson, affectedPersonIndex) => {
            return (
              <Accordion
                key={`${affectedPerson.firstName}-${affectedPersonIndex}`}
                sx={{
                  border: "solid 1px lightgrey",
                  borderRadius: "lg",
                  overflow: "hidden",
                  mt: 2,
                }}
              >
                <Box sx={{ position: "relative" }}>
                  <AccordionSummary>
                    <Box sx={{ display: "flex" }}>
                      <Typography
                        level="title-lg"
                        sx={{ p: 1, fontWeight: 600 }}
                      >
                        {formatName(affectedPerson)}
                      </Typography>
                    </Box>
                  </AccordionSummary>
                  <ActionsMenu
                    actionItems={[
                      {
                        label: "Bearbeiten",
                        onClick: () =>
                          handleEditAffectedPerson(affectedPersonIndex),
                        startDecorator: <EditOutlined />,
                        color: "neutral",
                      },
                      {
                        label: "Löschen",
                        onClick: () =>
                          handleDeleteAffectedPerson(affectedPersonIndex),
                        startDecorator: <DeleteOutline />,
                        color: "neutral",
                      },
                    ]}
                    color="neutral"
                    sx={{
                      "--IconButton-size": "1.5rem",
                      position: "absolute",
                      top: "1rem",
                      right: "1.5rem",
                    }}
                  />
                </Box>
                <AccordionDetails>
                  <Sheet
                    sx={{
                      p: 2,
                      borderRadius: "md",
                      backgroundColor: "white",
                    }}
                  >
                    <Grid container xxs={12} rowGap={2}>
                      <DetailsField
                        label={t("common.address")}
                        value={formatAddress(affectedPerson.address)}
                      />
                      {!!affectedPerson?.emailAddresses?.length && (
                        <DetailsField
                          label={t("common.personalDetails.emailAddress")}
                          value={affectedPerson.emailAddresses}
                        />
                      )}
                      {!!affectedPerson?.phoneNumbers?.length && (
                        <DetailsField
                          label={t("common.personalDetails.phoneNumber")}
                          value={affectedPerson.phoneNumbers}
                        />
                      )}
                      <DetailsField
                        label={t("affectedPerson.fields.roleStatus")}
                        value={t(
                          roleStatusNames[
                            affectedPerson.roleStatus as ApiRoleStatus
                          ],
                        )}
                      />
                      <DetailsField
                        label={t("affectedPerson.fields.reportingReason")}
                        value={t(
                          reportingReasonNames[
                            affectedPerson.reportData
                              .reportingReason as ApiReportingReason
                          ],
                        )}
                      />
                    </Grid>
                  </Sheet>
                  {!!affectedPerson.custodians?.length &&
                    affectedPerson.custodians.map(
                      (custodian, custodianIndex) => (
                        <Sheet
                          key={`${custodian.firstName}-${custodianIndex}`}
                          sx={{
                            p: 2,
                            my: 1,
                            borderRadius: "md",
                            backgroundColor: "#F0F4F8",
                          }}
                        >
                          <Grid container xxs={12} rowGap={2}>
                            <Grid xxs={8}>
                              <Typography
                                level="title-lg"
                                sx={{ pt: 1, fontWeight: 600 }}
                              >
                                {`Personensorgeberechtigte ${custodianIndex + 1}`}
                              </Typography>
                            </Grid>
                            <DetailsField
                              label={t("common.name")}
                              value={formatName(custodian)}
                            />
                            <DetailsField
                              label={t("common.address")}
                              value={formatAddress(custodian.address)}
                            />
                            {!!custodian?.emailAddresses?.length && (
                              <DetailsField
                                label={t("common.personalDetails.emailAddress")}
                                value={custodian.emailAddresses}
                              />
                            )}
                            {!!custodian?.phoneNumbers?.length && (
                              <DetailsField
                                label={t("common.personalDetails.phoneNumber")}
                                value={custodian.phoneNumbers}
                              />
                            )}
                          </Grid>
                        </Sheet>
                      ),
                    )}
                </AccordionDetails>
              </Accordion>
            );
          })}
        </AccordionGroup>
      </Stack>
      <ReportCaseOverviewCard
        data-testid="reportMeaslesCaseOverviewCard"
        isSubmitting={isSubmitting}
        facilityName={facilityName}
        showFacilityContactPerson
        showAffected={{ count: true }}
        submitLabel={t("overview.submit", { count: affectedPersons.length })}
        finalSubmit={true}
        onCancel={onCancel}
        actionButton={
          <Button variant="outlined" onClick={handleAddAffectedPerson}>
            {t("overview.reportAdditionalPerson")}
          </Button>
        }
      />
    </>
  );
}
