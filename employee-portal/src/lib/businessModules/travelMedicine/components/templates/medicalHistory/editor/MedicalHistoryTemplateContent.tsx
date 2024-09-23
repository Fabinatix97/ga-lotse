/**
 * Copyright 2024 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { ApiMedicalHistoryTemplateSection } from "@eshg/employee-portal-api/travelMedicine/models";
import { InputField } from "@eshg/lib-portal/components/formFields/InputField";
import { Box, Sheet } from "@mui/joy";

import { TemplateSectionList } from "@/lib/businessModules/travelMedicine/components/templates/medicalHistory/editor/sections/TemplateSectionList";
import { validateTemplateTitle } from "@/lib/businessModules/travelMedicine/components/templates/medicalHistory/editor/templateFieldValidation";

export function MedicalHistoryTemplateContent(
  props: Readonly<{
    sections: ApiMedicalHistoryTemplateSection[];
  }>,
) {
  return (
    <Box sx={{ pt: 3, pr: 3, pb: 15, pl: 3, height: "100%", overflow: "auto" }}>
      <Sheet>
        <InputField
          label
          name="title"
          placeholder="Name der Anamnese"
          validate={validateTemplateTitle}
          data-testid="medicalHistoryTemplateTitle"
        />
      </Sheet>
      <TemplateSectionList sections={props.sections} />
    </Box>
  );
}
