/**
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import {
  ApiReportingReason,
  ApiRoleStatus,
} from "@eshg/citizen-portal-api/measlesProtection";
import { SubmitButton } from "@eshg/lib-portal/components/buttons/SubmitButton";
import {
  Business,
  FmdGoodOutlined,
  NotificationImportantOutlined,
  PeopleAltOutlined,
  PersonOutline,
  TurnLeft,
  WorkOutline,
} from "@mui/icons-material";
import { Box, Button, Card, CardContent, Stack, Typography } from "@mui/joy";
import { SxProps } from "@mui/joy/styles/types";
import { useFormikContext } from "formik";
import { ReactElement } from "react";

import {
  reportingReasonNames,
  roleStatusNames,
} from "@/lib/businessModules/measlesProtection/shared/translations";
import { useTranslation } from "@/lib/i18n/client";
import { useSearchParam } from "@/lib/shared/hooks/useSearchParam";

import { formatAddress } from "./helpers";
import { ReportMeaslesCase } from "./types";

export const reportCaseOverviewCardStyles: SxProps = {
  minWidth: {
    xxs: "250px",
    sm: "400px",
  },
  maxWidth: {
    xxs: "100%",
    sm: "400px",
  },
  overflow: "auto",
  mb: {
    xxs: 2,
    md: 0,
  },
  alignSelf: {
    md: "flex-start",
  },
};

const iconColor = "var(--joy-palette-text-primary)";

interface ReportCaseOverviewCardProps {
  onCancel?: () => unknown;
  onSubmit?: () => unknown;
  actionButton?: ReactElement;
  cancelLabel?: string;
  facilityName: string;
  isSubmitting: boolean;
  showFacilityContactPerson?: boolean;
  showAffected?: {
    count?: boolean;
    current?: boolean;
  };
  submitDisabled?: boolean;
  submitLabel?: string;
}

export function ReportCaseOverviewCard({
  onCancel,
  onSubmit,
  actionButton,
  cancelLabel,
  facilityName,
  isSubmitting = false,
  showFacilityContactPerson = false,
  showAffected = {
    count: false,
    current: false,
  },
  submitDisabled = false,
  submitLabel,
}: ReportCaseOverviewCardProps) {
  const { t } = useTranslation();
  const {
    values: {
      affectedPersons,
      facility: { contactPersons },
    },
  } = useFormikContext<ReportMeaslesCase>();
  const [currentAffectedPersonIndex] = useSearchParam("person", "number");
  const currentAffectedPerson = affectedPersons[currentAffectedPersonIndex];

  return (
    <Card sx={reportCaseOverviewCardStyles} variant="plain">
      <CardContent orientation="vertical">
        <Typography
          level="h4"
          sx={{ fontSize: { xxs: "1.125rem", sm: "1.5rem" } }}
        >
          {t("common.overview")}
        </Typography>
        <Box sx={{ display: "flex", my: 1 }}>
          <Business sx={{ color: iconColor }} />
          <Box sx={{ display: "flex", ml: 2, flexDirection: "column" }}>
            <Typography>{facilityName}</Typography>
            {showFacilityContactPerson &&
              contactPersons &&
              contactPersons[0] && (
                <Box sx={{ display: "flex", mt: 1 }}>
                  <TurnLeft
                    sx={{
                      color: iconColor,
                      transform: "rotate(180deg)",
                    }}
                  />
                  <Typography sx={{ ml: 2 }}>
                    {`${contactPersons[0]?.firstName} ${contactPersons[0]?.lastName}`}
                  </Typography>
                </Box>
              )}
          </Box>
        </Box>
        {showAffected.count && (
          <Box
            sx={{ display: "flex", mb: 1 }}
            data-testid="affectedPersonsCount"
          >
            <PeopleAltOutlined sx={{ color: iconColor }} />
            <Typography sx={{ ml: 2 }}>
              {`${affectedPersons.length} ${t("common.person", { count: affectedPersons.length })}`}
            </Typography>
          </Box>
        )}
        {showAffected.current && currentAffectedPerson && (
          <>
            <Box sx={{ display: "flex", mb: 1 }}>
              <NotificationImportantOutlined sx={{ color: iconColor }} />
              <Typography sx={{ ml: 2 }}>
                {
                  reportingReasonNames[
                    currentAffectedPerson?.reportData
                      .reportingReason as ApiReportingReason
                  ]
                }
              </Typography>
            </Box>
            <Box sx={{ display: "flex", mb: 1 }}>
              <WorkOutline sx={{ color: iconColor }} />
              <Typography sx={{ ml: 2 }}>
                {
                  roleStatusNames[
                    currentAffectedPerson?.roleStatus as ApiRoleStatus
                  ]
                }
              </Typography>
            </Box>
            <Box sx={{ display: "flex", mb: 1 }}>
              <PersonOutline sx={{ color: iconColor }} />
              <Typography sx={{ ml: 2 }}>
                {`${currentAffectedPerson.firstName} ${currentAffectedPerson.lastName}`}
              </Typography>
            </Box>
            <Box sx={{ display: "flex", mb: 1 }}>
              <FmdGoodOutlined sx={{ color: iconColor }} />
              <Typography sx={{ ml: 2 }}>
                {formatAddress(currentAffectedPerson.address)}
              </Typography>
            </Box>
          </>
        )}
        <Stack gap={3}>
          <SubmitButton
            onClick={onSubmit}
            submitting={isSubmitting}
            disabled={submitDisabled}
          >
            {submitLabel ?? t("common.continue")}
          </SubmitButton>
          {actionButton}
          <Button onClick={onCancel} variant="soft" color="neutral">
            {cancelLabel ?? t("common.cancel")}
          </Button>
        </Stack>
      </CardContent>
    </Card>
  );
}
