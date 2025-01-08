/**
 * Copyright 2025 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { ApiDisease } from "@eshg/employee-portal-api/travelMedicine";
import { InputField } from "@eshg/lib-portal/components/formFields/InputField";
import { SelectOption } from "@eshg/lib-portal/components/formFields/SelectOptions";
import { MultiAutocompleteField } from "@eshg/lib-portal/components/formFields/autocomplete/MultiAutocompleteField";
import { validateLength } from "@eshg/lib-portal/helpers/validators";
import { Stack } from "@mui/joy";

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
    >
      <InputField
        name="name"
        label="Interner Dateiname"
        required="Bitte einen Namen angeben."
        validate={validateLength(0, 200)}
      />
      <InputField
        name="title"
        label="Dokumententitel"
        required="Bitte einen Titel angeben."
        validate={validateLength(0, 200)}
      />
      <MultiAutocompleteField
        name="diseaseIDs"
        label="Krankheiten"
        options={diseaseOptions}
      />
    </Stack>
  );
}
