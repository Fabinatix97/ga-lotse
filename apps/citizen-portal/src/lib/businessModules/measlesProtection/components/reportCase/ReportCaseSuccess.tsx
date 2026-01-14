/**
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { Business, PeopleAltOutlined, TurnLeft } from "@mui/icons-material";
import {
  Box,
  Button,
  Card,
  CardContent,
  Grid,
  Stack,
  Typography,
} from "@mui/joy";
import { SxProps } from "@mui/joy/styles/types";
import { useFormikContext } from "formik";
import { useCallback } from "react";

import { Alert } from "@eshg/lib-portal";

import { useRoutes } from "@/lib/businessModules/measlesProtection/shared/routes";
import { useTranslation } from "@/lib/i18n/client";
import { byBreakpoint } from "@/lib/shared/breakpoints";
import { useScopedRouter } from "@/lib/shared/components/scopedLinks";
import { useReplaceSearchParams } from "@/lib/shared/hooks/searchParams/useReplaceSearchParams";

import {
  FormHeader,
  reportCaseFormPages,
  reportMeaslesCaseFormInitialValues,
} from "./ReportCaseForm";
import { reportCaseOverviewCardStyles } from "./ReportCaseOverviewCard";
import { formatName } from "./helpers";
import { createEmptyContactPerson } from "./subforms/ContactPersonForm";
import { ReportMeaslesCase } from "./types";

const reportCaseSuccessStyles: SxProps = {
  backgroundColor: "white",
  borderRadius: "xl",
  p: 3,
  flex: 1,
  mr: byBreakpoint({
    mobile: 0,
    desktop: 2,
  }),
};

const textPrimaryColor = "var(--joy-palette-text-primary)";

export function ReportCaseSuccess() {
  const { t } = useTranslation(["measlesProtection/forms"]);
  const {
    values: { affectedPersons, facility },
  } = useFormikContext<ReportMeaslesCase>();
  const { name: facilityName, contactPersons } = facility;
  const facilityContactPersonName = formatName(
    contactPersons[0] ?? createEmptyContactPerson(),
  );
  const casesReported = affectedPersons.length;

  return (
    <>
      <Stack component="div" gap={2} rowGap={2} sx={reportCaseSuccessStyles}>
        <Grid xxs={12}>
          <Alert
            message={t("success.message", {
              casesReported: affectedPersons.length,
            })}
            color="success"
          />
        </Grid>
        <FormHeader>{t("common.overview")}</FormHeader>
        <Grid container xxs={12}>
          <Typography level="body-md">{t("success.overview_text")}</Typography>
        </Grid>
        <Grid container xxs={12}>
          <Box sx={{ display: "flex", mt: 1 }}>
            <Business sx={{ color: textPrimaryColor }} />
            <Box
              sx={{ display: "flex", ml: 2, mb: 2, flexDirection: "column" }}
            >
              <Typography>{facilityName}</Typography>
              <Box sx={{ display: "flex", mt: 1 }}>
                <TurnLeft
                  sx={{
                    color: textPrimaryColor,
                    transform: "rotate(180deg)",
                  }}
                />
                <Typography sx={{ ml: 2 }}>
                  {facilityContactPersonName}
                </Typography>
              </Box>
            </Box>
          </Box>
        </Grid>
        <Grid container xxs={12}>
          <Box sx={{ display: "flex", mt: 1 }}>
            <PeopleAltOutlined sx={{ color: textPrimaryColor }} />
            <Typography sx={{ ml: 2 }}>
              {`${casesReported} ${t("common.person", { count: casesReported })}`}
            </Typography>
          </Box>
        </Grid>
      </Stack>
      <ReportCaseSuccessActionsCard />
    </>
  );
}

function ReportCaseSuccessActionsCard() {
  const { t } = useTranslation(["measlesProtection/forms"]);
  const replaceSearchParams = useReplaceSearchParams();
  const router = useScopedRouter();
  const {
    values: { facility, otherFacilityTypeInformation = "" },
    resetForm,
  } = useFormikContext<ReportMeaslesCase>();
  const routes = useRoutes();

  const goToPage = useCallback(
    (page: number) => {
      replaceSearchParams([
        {
          name: "page",
          value: page,
        },
        {
          name: "person",
          value: 0,
        },
      ]);
    },
    [replaceSearchParams],
  );

  return (
    <Card sx={reportCaseOverviewCardStyles} variant="plain">
      <CardContent orientation="vertical">
        <Typography level="h2" sx={{ mb: 2 }}>
          {t("success.what_next_q")}
        </Typography>
        <Stack gap={2}>
          <Button disabled variant="outlined">
            {t("success.viewOpenCases")}
          </Button>
          <Button
            variant="outlined"
            onClick={() => {
              resetForm({
                values: {
                  ...reportMeaslesCaseFormInitialValues,
                  facility,
                  otherFacilityTypeInformation,
                },
              });
              goToPage(reportCaseFormPages.facilityInfo.pageNumber);
            }}
          >
            {t("success.reportAdditionalPerson")}
          </Button>
          <Button
            variant="outlined"
            onClick={() => router.push(routes.organizationPath.overview)}
          >
            {t("success.returnToMeaslesProtectionHome")}
          </Button>
        </Stack>
      </CardContent>
    </Card>
  );
}
