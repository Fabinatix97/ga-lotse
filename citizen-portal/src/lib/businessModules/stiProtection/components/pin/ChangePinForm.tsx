/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { useFormikContext } from "formik";
import { useTranslation } from "react-i18next";

import { Alert, InternalLinkButton, SubmitButton } from "@eshg/lib-portal";

import { PinField } from "@/lib/businessModules/stiProtection/components/appointment/PinField";
import { useCitizenRoutes } from "@/lib/businessModules/stiProtection/shared/routes";
import {
  ContentSheet,
  ContentSheetTitle,
} from "@/lib/shared/components/layout/contentSheet";
import { TwoColumnGrid } from "@/lib/shared/components/layout/grid";

import { ChangePinFormData } from "./ChangePinPage";

export function ChangePinForm() {
  const { t } = useTranslation("stiProtection/pin");
  const { isSubmitting } = useFormikContext<ChangePinFormData>();
  const citizenRoutes = useCitizenRoutes();
  const maxDigits = 6;
  function digitLabel(digitNumber: number) {
    return t("form.digit_label", { digitNumber, maxDigits });
  }

  return (
    <TwoColumnGrid
      content={
        <ContentSheet>
          <ContentSheetTitle>{t("form.title")}</ContentSheetTitle>
          <Alert color="primary" message={t("form.info")} />
          <PinField
            name="currentPin"
            label={t("form.current_pin.label")}
            length={maxDigits}
            hint={t("form.current_pin.hint")}
            required={t("form.current_pin.required")}
            invalidError={t("form.current_pin.invalid")}
            digitLabel={digitLabel}
          />
          <PinField
            name="newPin"
            label={t("form.new_pin.label")}
            length={maxDigits}
            hint={t("form.new_pin.hint")}
            required={t("form.new_pin.required")}
            invalidError={t("form.new_pin.invalid")}
            digitLabel={digitLabel}
          />
          <PinField
            name="repeatedPin"
            label={t("form.repeated_pin.label")}
            comparisonName="newPin"
            comparisonError={t("form.repeated_pin.comparison_error")}
            length={maxDigits}
            required={t("form.repeated_pin.required")}
            digitLabel={digitLabel}
          />
        </ContentSheet>
      }
      sidePanel={
        <ContentSheet>
          <SubmitButton submitting={isSubmitting}>
            {t("form.button_label")}
          </SubmitButton>
          <InternalLinkButton
            variant="outlined"
            href={citizenRoutes.personalArea.index(undefined)}
          >
            {t("form.cancel")}
          </InternalLinkButton>
        </ContentSheet>
      }
    />
  );
}
