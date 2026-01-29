/**
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import {
  AccessTimeOutlined,
  DateRange,
  MedicalServicesOutlined,
} from "@mui/icons-material";
import { Stack } from "@mui/joy";
import { formatDate } from "date-fns";
import { useFormikContext } from "formik";
import { isNonNullish } from "remeda";

import { Row } from "@eshg/lib-portal";

import { AppointmentFormValues } from "@/lib/businessModules/officialMedicalService/components/appointment/AppointmentForm";
import { MultiStepFormButtonBar } from "@/lib/businessModules/officialMedicalService/shared/MultiStepFormButtonBar";
import { useCitizenRoutes } from "@/lib/businessModules/prostituteProtection/shared/routes";
import { useTranslation } from "@/lib/i18n/client";
import { useLocale } from "@/lib/i18n/useLocale";
import {
  ContentSheet,
  ContentSheetTitle,
} from "@/lib/shared/components/layout/contentSheet";

export function AppointmentOverview() {
  const { t } = useTranslation("prostituteProtection/forms");
  const locale = useLocale();
  const routes = useCitizenRoutes();
  const landingPageRoute = routes.overview;
  const { values } = useFormikContext<AppointmentFormValues>();

  const concernLabel = t("common.overview_header");

  return (
    <ContentSheet>
      <ContentSheetTitle>{t("common.overview_title")}</ContentSheetTitle>
      <Stack gap={2}>
        <Row sx={{ flexWrap: "nowrap" }}>
          <MedicalServicesOutlined /> {concernLabel}
        </Row>
        {isNonNullish(values.appointment?.start) ? (
          <Row sx={{ flexWrap: "nowrap" }}>
            <DateRange />
            {formatDate(values.appointment?.start, "EEEE, d. MMMM y", {
              locale,
            })}
          </Row>
        ) : null}
        {isNonNullish(values.appointment) ? (
          <Row sx={{ flexWrap: "nowrap" }}>
            <AccessTimeOutlined />
            {formatDate(values.appointment.start, "HH:mm", { locale })}
          </Row>
        ) : null}
      </Stack>
      <MultiStepFormButtonBar
        href={landingPageRoute}
        cancelLabel={t("common.cancel")}
        forwardLabel={t("common.continue")}
        backLabel={t("common.back")}
        submitLabel={t("common.submit")}
      />
    </ContentSheet>
  );
}
