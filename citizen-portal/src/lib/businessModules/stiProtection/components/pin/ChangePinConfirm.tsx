/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { Typography } from "@mui/joy";
import { useFormikContext } from "formik";
import { useTranslation } from "react-i18next";

import { Alert } from "@eshg/lib-portal/components/Alert";
import { SubmitButton } from "@eshg/lib-portal/components/buttons/SubmitButton";

import { parsePin } from "@/lib/businessModules/stiProtection/components/appointment/PinField";
import { ConfirmationCheckboxField } from "@/lib/shared/components/form/ConfirmationCheckboxField";
import {
  ContentSheet,
  ContentSheetTitle,
} from "@/lib/shared/components/layout/contentSheet";
import { TwoColumnGrid } from "@/lib/shared/components/layout/grid";

import { ChangePinFormData } from "./ChangePinPage";

export function ChangePinConfirm() {
  const { t } = useTranslation("stiProtection/pin");
  const { isSubmitting, values } = useFormikContext<ChangePinFormData>();

  return (
    <TwoColumnGrid
      content={
        <ContentSheet>
          <ContentSheetTitle>{t("confirm.title")}</ContentSheetTitle>
          <Alert color="warning" message={t("confirm.info")} />
          <Typography>{t("confirm.text")}</Typography>
          <Typography fontWeight="bold" textAlign="center">
            {parsePin(values.newPin ?? "")}
          </Typography>
          <ConfirmationCheckboxField
            name="hasConfirmedPin"
            label={t("confirm.check")}
            required={t("confirm.error")}
          />
        </ContentSheet>
      }
      sidePanel={
        <ContentSheet sx={{ gridArea: "sidebar" }}>
          <SubmitButton submitting={isSubmitting}>
            {t("confirm.link_label")}
          </SubmitButton>
        </ContentSheet>
      }
    />
  );
}
