/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { Alert } from "@eshg/lib-portal/components/Alert";
import assert from "assert";

import { useCreateAnonymousUser } from "@/lib/businessModules/stiProtection/api/mutations/publicCitizensApi";
import { useTranslation } from "@/lib/i18n/client";

import { useFormData } from "./AppointmentDataContext";
import { AppointmentFormData } from "./AppointmentStepper";
import { PinField, parsePin } from "./PinField";
import { StepLayout } from "./StepLayout";
import { StepSubTitle } from "./StepSubTitle";

interface PinData {
  pin: string;
  repeatedPin: string;
}

const initialValues = {
  pin: "",
  repeatedPin: "",
} as const;

export function PinStep() {
  const { t } = useTranslation("stiProtection/forms");
  const maxDigits = 6;
  function digitLabel(digitNumber: number) {
    return t("pin.digit_label", { digitNumber, maxDigits });
  }

  const [{ procedureId }] = useFormData<AppointmentFormData>();
  assert.ok(procedureId);

  const createAnonymousUser = useCreateAnonymousUser(procedureId);

  async function onSubmit(values: PinData) {
    const { accessCode } = await createAnonymousUser.mutateAsync({
      pin: parsePin(values.pin),
    });
    return { ...values, accessCode };
  }

  return (
    <StepLayout
      initialValues={initialValues}
      onSubmit={onSubmit}
      submit={t("pin.submit")}
    >
      <StepSubTitle title={t("pin.title")} />
      <Alert color="primary" message={t("pin.notice")} />
      <PinField
        name="pin"
        label={t("pin.set_pin")}
        length={maxDigits}
        hint={t("pin.set_pin_hint")}
        required={t("pin.set_pin_required")}
        invalidError={t("pin.set_pin_invalid")}
        digitLabel={digitLabel}
      />
      <PinField
        name="repeatedPin"
        label={t("pin.repeat_pin")}
        comparisonName="pin"
        comparisonError={t("pin.repeat_pin_mismatch")}
        length={maxDigits}
        required={t("pin.repeat_pin_required")}
        digitLabel={digitLabel}
      />
    </StepLayout>
  );
}
