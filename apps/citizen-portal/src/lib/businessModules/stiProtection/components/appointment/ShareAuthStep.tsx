/**
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { Typography } from "@mui/joy";
import assert from "assert";
import { useId } from "react";

import { Alert } from "@eshg/lib-portal";

import { DownloadDocumentCardField } from "@/lib/businessModules/stiProtection/components/shared/DownloadDocumentCardField";
import { useCitizenRoutes } from "@/lib/businessModules/stiProtection/shared/routes";
import { useTranslation } from "@/lib/i18n/client";
import { ConfirmationCheckboxField } from "@/lib/shared/components/form/ConfirmationCheckboxField";
import { useScopedRouter } from "@/lib/shared/components/scopedLinks";

import { useFormData } from "./AppointmentDataContext";
import { AppointmentFormData } from "./AppointmentStepper";
import { parsePin } from "./PinField";
import { StepLayout } from "./StepLayout";
import { StepSubTitle } from "./StepSubTitle";

interface ShareAuthData {
  hasSavedPin: boolean;
  hasDownloadedDoc: boolean;
}
const initialValues = {
  hasSavedPin: false,
  hasDownloadedDoc: false,
} as const;

export function ShareAuthStep() {
  const { t } = useTranslation("stiProtection/forms");
  const router = useScopedRouter();
  const routes = useCitizenRoutes();
  const pinTitleId = useId();

  const [{ accessCode, pin, procedureId }] = useFormData<AppointmentFormData>();
  assert.ok(accessCode);
  assert.ok(pin);

  function onSubmit(_values: ShareAuthData) {
    router.push(routes.personalArea.index(accessCode));
  }

  return (
    <StepLayout
      initialValues={initialValues}
      submit={t("share_auth.submit")}
      onSubmit={onSubmit}
    >
      <StepSubTitle title={t("share_auth.title")} />
      <Typography>{t("share_auth.text")}</Typography>
      <Alert color="warning" message={t("share_auth.notice")} />
      <Typography id={pinTitleId}>{t("share_auth.pin_title")}</Typography>
      <Typography
        level="h3"
        aria-describedby={pinTitleId}
        sx={{ alignSelf: "center" }}
      >
        {parsePin(pin)}
      </Typography>
      <DownloadDocumentCardField
        procedureId={procedureId}
        documentTitle={t("share_auth.auth_document_title")}
        required={t("share_auth.auth_document_required")}
        hint={t("share_auth.auth_document_hint")}
        downloadLabel={t("share_auth.download_button")}
        downloadedLabel={t("share_auth.downloaded_button")}
      />
      <ConfirmationCheckboxField
        name="hasSavedPin"
        label={t("share_auth.confirm_pin_saved")}
        required={t("share_auth.confirm_pin_saved_required")}
      />
    </StepLayout>
  );
}
