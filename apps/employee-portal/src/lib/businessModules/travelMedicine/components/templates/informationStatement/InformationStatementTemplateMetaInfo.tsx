/**
 * Copyright 2025 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { Stack } from "@mui/joy";

import {
  InputField,
  MultiAutocompleteField,
  SelectOption,
} from "@eshg/lib-portal";
import { ApiDisease } from "@eshg/travel-medicine-api";

import {
  validateInformationStatementTemplateDocumentTitle,
  validateInformationStatementTemplateFileName,
} from "@/lib/businessModules/travelMedicine/shared/templateEditor/templateFieldValidation";

interface TemplateMetaInfoProps {
  allDiseases: ApiDisease[];
}

export function InformationStatementTemplateMetaInfo(
  props: Readonly<TemplateMetaInfoProps>,
) {
  const diseaseOptions: SelectOption<string, string>[] = props.allDiseases.map(
    (value) => ({ label: value.name, value: value.id }),
  );

  return (
    <Stack
      direction="column"
      spacing={2}
      data-testid="information-statement-template-metadata"
      role="group"
      aria-label="Meta-Informationen"
    >
      <InputField
        name="name"
        label="Interner Dateiname"
        validate={validateInformationStatementTemplateFileName()}
      />
      <InputField
        name="title"
        label="Dokumententitel"
        validate={validateInformationStatementTemplateDocumentTitle()}
      />
      <MultiAutocompleteField
        name="diseaseIDs"
        label="Krankheiten"
        options={diseaseOptions}
      />
    </Stack>
  );
}
