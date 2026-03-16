/**
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import {
  AccessTimeOutlined,
  DateRange,
  DescriptionOutlined,
  FmdGoodOutlined,
} from "@mui/icons-material";
import { Stack } from "@mui/joy";
import { useFormikContext } from "formik";
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";
import { isNonNullish } from "remeda";

import {
  Row,
  formatDate,
  formatPostalCodeAndCity,
  formatStreetAndHouseNumber,
  formatTime,
} from "@eshg/lib-portal";

import { useDepartmentInfo } from "@/lib/businessModules/infectionBriefing/api/queries/publicCitizenApi";
import { AppointmentFormData } from "@/lib/businessModules/infectionBriefing/components/appointment/AppointmentStepper";
import { DangerModal } from "@/lib/businessModules/infectionBriefing/shared/components/DangerModal";
import { MultiStepFormButtonBar } from "@/lib/businessModules/infectionBriefing/shared/components/MultiStepFormButtonBar";
import { useCitizenRoutes } from "@/lib/businessModules/infectionBriefing/shared/routes";
import { useTranslation } from "@/lib/i18n/client";
import { useLocale } from "@/lib/i18n/useLocale";
import { DetailsItem } from "@/lib/shared/components/DetailsItem";
import {
  ContentSheet,
  ContentSheetTitle,
} from "@/lib/shared/components/layout/contentSheet";
import { useScopedRouter } from "@/lib/shared/components/scopedLinks";

export function AppointmentOverview() {
  const routes = useCitizenRoutes();
  const { data: departmentInfo } = useDepartmentInfo();
  const { values, resetForm, setFieldValue } =
    useFormikContext<AppointmentFormData>();
  const router = useScopedRouter();
  const locale = useLocale();
  const { t } = useTranslation("infectionBriefing/forms");

  return (
    <div>
      <ContentSheet>
        <ContentSheetTitle>{t("common.overview_title")}</ContentSheetTitle>
        <Stack gap={2}>
          {isNonNullish(values.appointmentType) ? (
            <Row sx={{ flexWrap: "nowrap" }}>
              <DescriptionOutlined />
              {values.appointmentType === "INFECTION_BRIEFING_NEW"
                ? t("common.newInfectionBriefing")
                : t("common.replacementInfectionBriefing")}
            </Row>
          ) : null}
          <Row sx={{ flexWrap: "nowrap" }}>
            <FmdGoodOutlined />
            <DetailsItem
              label={t("summary.details.location", {
                context: "label",
              })}
              hiddenLabel
              value={`${departmentInfo.name},
                  ${formatStreetAndHouseNumber(departmentInfo)},
                  ${formatPostalCodeAndCity(departmentInfo)}`}
            />
          </Row>
          {isNonNullish(values.appointment?.start) ? (
            <Row sx={{ flexWrap: "nowrap" }}>
              <DateRange />
              {formatDate(values.appointment.start, locale.code)}
            </Row>
          ) : null}
          {isNonNullish(values.appointment) ? (
            <Row sx={{ flexWrap: "nowrap" }}>
              <AccessTimeOutlined />
              {`${formatTime(values.appointment.start, locale.code)} Uhr`}
            </Row>
          ) : null}
        </Stack>
        <MultiStepFormButtonBar
          cancelLabel={t("common.cancel")}
          forwardLabel={t("common.continue")}
          backLabel={t("common.back")}
          submitLabel={t("common.submit")}
        />
      </ContentSheet>
      <DangerModal
        color="danger"
        cancelButtonText={t("summary.cancelModal.cancelButton")}
        confirmButtonText={t("summary.cancelModal.confirmButton")}
        modalTitle={t("summary.cancelModal.modalTitle")}
        modalBody={t("summary.cancelModal.modalBody")}
        open={values.isCancelModalOpen}
        onClick={() => {
          void setFieldValue("isCancelModalOpen", false);
        }}
        onClose={() => void setFieldValue("isCancelModalOpen", false)}
        onConfirm={() => handleConfirmCancel(router)}
      />
    </div>
  );

  function handleConfirmCancel(router: AppRouterInstance) {
    resetForm();
    router.push(routes.overview);
  }
}
