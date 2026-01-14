/**
 * Copyright 2026 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { InputField } from "@eshg/lib-portal";

import { validateAnamnesisTemplateTitle } from "@/lib/businessModules/travelMedicine/shared/templateEditor/templateFieldValidation";

export function MedicalHistoryTemplateTitle() {
  const label = "Titel";
  return (
    <InputField
      label
      aria-label={label}
      name="title"
      placeholder="Name der Anamnese"
      validate={validateAnamnesisTemplateTitle()}
      data-testid="medicalHistoryTemplateTitle"
    />
  );
}
