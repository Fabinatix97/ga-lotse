/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import {
  CheckCircleOutlined,
  ErrorOutlineOutlined,
  VisibilityOffOutlined,
  VisibilityOutlined,
} from "@mui/icons-material";
import { IconButton, Sheet, Typography } from "@mui/joy";
import { Formik, useFormikContext } from "formik";
import { useReducer, useState } from "react";

import { DetailsSection } from "@eshg/lib-employee-portal";
import { FormPlus, InputField, Row, SubmitButton } from "@eshg/lib-portal";
import { ApiStiProtectionProcedure } from "@eshg/sti-protection-api";

import { usePinCheck } from "@/lib/businessModules/stiProtection/api/queries/identity";

export function CheckPinSection({
  procedure,
}: {
  procedure: ApiStiProtectionProcedure;
}) {
  const [pinToCheck, setPinToCheck] = useState<string | undefined>();
  const isPinValid = usePinCheck(procedure.id, pinToCheck);
  const [checkboxType, toggleCheckboxType] = useReducer(
    (current: "password" | "text") =>
      current === "password" ? "text" : "password",
    "password",
  );

  return (
    <Sheet>
      <DetailsSection title="ID-Check">
        <CheckResult valid={isPinValid.data} />
        <Formik
          initialValues={{ pin: undefined }}
          onSubmit={(form) => setPinToCheck(form.pin)}
        >
          <FormPlus sx={{ display: "contents" }} aria-label="ID-Check">
            <Row sx={{ alignItems: "end" }}>
              <InputField
                label="6-stellige PIN"
                name="pin"
                type={checkboxType}
                required="Geben Sie eine PIN ein."
                endDecorator={
                  <ViewToggle
                    checkboxType={checkboxType}
                    toggleCheckboxType={toggleCheckboxType}
                  />
                }
                autoComplete="off"
                sx={{ overflow: "hidden", flex: 1 }}
                validate={validatePin}
                onChange={() => setPinToCheck(undefined)}
              />
              <CheckButton isSubmitting={isPinValid.isFetching} />
            </Row>
          </FormPlus>
        </Formik>
      </DetailsSection>
    </Sheet>
  );
}

function validatePin(value: string | undefined) {
  if (!value) {
    return;
  }
  if (!/\d+/.test(value)) {
    return "Bitte geben Sie eine numerische PIN ein.";
  }
  if (value.length !== 6) {
    return "Bitte geben Sie eine 6-stellige PIN ein.";
  }
}

function ViewToggle({
  checkboxType,
  toggleCheckboxType,
}: {
  checkboxType: "password" | "text";
  toggleCheckboxType: () => void;
}) {
  return (
    <IconButton aria-hidden onClick={() => toggleCheckboxType()}>
      {checkboxType === "password" ? (
        <VisibilityOutlined />
      ) : (
        <VisibilityOffOutlined />
      )}
    </IconButton>
  );
}

function CheckResult({ valid }: { valid: boolean | undefined }) {
  if (valid === undefined) {
    return;
  }
  let message = "Die eingegebene PIN ist korrekt.";
  let icon = <CheckCircleOutlined color="success" />;
  if (!valid) {
    message = "Die eingegebene PIN ist falsch.";
    icon = <ErrorOutlineOutlined color="danger" />;
  }
  return (
    <Typography sx={{ display: "flex", gap: 1 }}>
      {icon}
      {message}
    </Typography>
  );
}

function CheckButton({ isSubmitting }: { isSubmitting: boolean }) {
  const { errors, getFieldMeta } = useFormikContext<{
    pin: string | undefined;
  }>();
  const meta = getFieldMeta("pin");
  return (
    <SubmitButton
      submitting={isSubmitting}
      sx={{ marginBottom: errors.pin && meta.touched ? 3 : 0 }}
    >
      Prüfen
    </SubmitButton>
  );
}
