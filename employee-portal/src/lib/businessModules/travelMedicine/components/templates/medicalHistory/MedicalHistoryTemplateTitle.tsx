/**
 * Copyright 2024 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { InputField } from "@eshg/lib-portal/components/formFields/InputField";

import { validateTemplateTitle } from "@/lib/businessModules/travelMedicine/shared/templateEditor/templateFieldValidation";

export function MedicalHistoryTemplateTitle() {
  return (
    <InputField
      label
      name="title"
      placeholder="Name der Anamnese"
      validate={validateTemplateTitle}
      data-testid="medicalHistoryTemplateTitle"
    />
  );
}
