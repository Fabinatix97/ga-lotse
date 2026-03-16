/**
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { Button, Stack } from "@mui/joy";
import { useFormikContext } from "formik";
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";

import {
  ButtonLink,
  useFileDownload,
  useMultiStepForm,
} from "@eshg/lib-portal";

import { useInfectionBriefingPublicCitizenApi } from "@/lib/businessModules/infectionBriefing/api/clients";
import { AppointmentFormData } from "@/lib/businessModules/infectionBriefing/components/appointment/AppointmentStepper";
import { DangerModal } from "@/lib/businessModules/infectionBriefing/shared/components/DangerModal";
import { FormSheetTitle } from "@/lib/businessModules/infectionBriefing/shared/components/FormSheet";
import { useCitizenRoutes } from "@/lib/businessModules/infectionBriefing/shared/routes";
import { useTranslation } from "@/lib/i18n/client";
import { ConfirmationCheckboxField } from "@/lib/shared/components/form/ConfirmationCheckboxField";
import { ContentSheet } from "@/lib/shared/components/layout/contentSheet";
import { useScopedRouter } from "@/lib/shared/components/scopedLinks";

export function BookAppointmentButtonBar() {
  const { t } = useTranslation("infectionBriefing/forms");
  const { values, handleSubmit, resetForm, setFieldValue } =
    useFormikContext<AppointmentFormData>();
  const infectionBriefingRoutes = useCitizenRoutes();
  const { goBack } = useMultiStepForm();
  const router = useScopedRouter();
  const publicCitizenApi = useInfectionBriefingPublicCitizenApi();
  const privacyNoticeFile = useFileDownload(() =>
    publicCitizenApi.getPrivacyNoticeRaw(),
  );
  const privacyPolicyFile = useFileDownload(() =>
    publicCitizenApi.getPrivacyPolicyRaw(),
  );

  function handleClick() {
    handleSubmit();
  }

  function handleConfirmCancel(router: AppRouterInstance) {
    resetForm();
    router.push(infectionBriefingRoutes.overview);
  }

  return (
    <div>
      <ContentSheet>
        <Stack gap={2}>
          <FormSheetTitle>{t("summary.data_and_privacy.title")}</FormSheetTitle>
          <ConfirmationCheckboxField
            name="confirmPrivacyNotice"
            label={t("summary.data_and_privacy.confirm_privacy_notice")}
            required={t("summary.data_and_privacy.confirm_required")}
            descriptionText={
              <ButtonLink
                fontSize="sm"
                onClick={() => privacyNoticeFile.download()}
              >
                {t("summary.data_and_privacy.privacy_notice")}
              </ButtonLink>
            }
          />
          <ConfirmationCheckboxField
            name="confirmPrivacyPolicy"
            label={t("summary.data_and_privacy.confirm_privacy_policy")}
            required={t("summary.data_and_privacy.confirm_required")}
            descriptionText={
              <ButtonLink
                fontSize="sm"
                onClick={() => privacyPolicyFile.download()}
              >
                {t("summary.data_and_privacy.privacy_policy")}
              </ButtonLink>
            }
          />
          <Button onClick={handleClick}>{t("common.submit")}</Button>
          <Button variant="outlined" onClick={goBack}>
            {t("common.back")}
          </Button>
          <Button
            color="neutral"
            variant="soft"
            onClick={() => void setFieldValue("isCancelModalOpen", true)}
          >
            {t("common.cancel")}
          </Button>
        </Stack>
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
}
