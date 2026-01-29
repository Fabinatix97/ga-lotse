/**
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { Typography } from "@mui/joy";

import { Row } from "@eshg/lib-portal";

import { useTranslation } from "@/lib/i18n/client";
import { PageTitle } from "@/lib/shared/components/layout/page";

interface AppointmentTitleProps {
  titleId: string;
  stepTitleId: string;
  currentStepIndex: number;
  totalSteps: number;
}

export function AppointmentTitle({
  titleId,
  stepTitleId,
  currentStepIndex,
  totalSteps,
}: AppointmentTitleProps) {
  const { t } = useTranslation("prostituteProtection/forms");

  return (
    <PageTitle titleId={titleId}>
      <Row justifyContent="space-between">
        {t("common.appointment_booking_title")}
        <Row sx={{ alignContent: "center" }}>
          <Typography
            level="h4"
            sx={{ alignContent: "center" }}
            textColor="text.tertiary"
            id={stepTitleId}
          >
            {t("common.current_step", {
              currentStep: currentStepIndex,
              totalSteps: totalSteps,
            })}
          </Typography>
        </Row>
      </Row>
    </PageTitle>
  );
}
