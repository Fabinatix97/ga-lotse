/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import assert from "assert";

import { Alert } from "@eshg/lib-portal/components/Alert";
import { PortalErrorCode } from "@eshg/lib-portal/errorHandling/PortalErrorCode";

import { useCreateAnonymousUser } from "@/lib/businessModules/stiProtection/api/mutations/publicCitizenApi";
import { useTranslation } from "@/lib/i18n/client";

import { useFormData } from "./AppointmentDataContext";
import { AppointmentFormData } from "./AppointmentStepper";
import { PinField } from "./PinField";
import { StepLayout } from "./StepLayout";
import { StepSubTitle } from "./StepSubTitle";
import { mapToCreateUser } from "./helpers";

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

  const [{ procedureId, ...formData }] = useFormData<AppointmentFormData>();
  assert.ok(procedureId);

  const createAnonymousUser = useCreateAnonymousUser(procedureId);

  async function onSubmit(values: PinData) {
    const results = await createAnonymousUser.mutateAsync(
      mapToCreateUser({
        ...formData,
        ...values,
      }),
    );
    if (results === PortalErrorCode.Conflict) {
      return PortalErrorCode.Conflict;
    }
    const { accessCode, procedureId } = results;
    return { ...values, accessCode, procedureId };
  }

  return (
    <StepLayout
      initialValues={initialValues}
      submit={t("pin.submit")}
      onSubmit={onSubmit}
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
