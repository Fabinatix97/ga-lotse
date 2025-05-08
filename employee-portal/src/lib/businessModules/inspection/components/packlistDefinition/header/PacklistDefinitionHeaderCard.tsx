/**
 * Copyright 2025 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { Stack } from "@mui/joy";
import { useMemo } from "react";
import { isDefined } from "remeda";

import { ApiObjectType } from "@eshg/inspection-api";
import { InputField } from "@eshg/lib-portal/components/formFields/InputField";
import { SelectField } from "@eshg/lib-portal/components/formFields/SelectField";
import { TextareaField } from "@eshg/lib-portal/components/formFields/TextareaField";

interface PacklistDefinitionHeaderCardProps {
  readOnlyMode: boolean;
  revision: number | undefined;
  objectTypes: ApiObjectType[];
}

export function PacklistDefinitionHeaderCard({
  readOnlyMode,
  revision,
  objectTypes,
}: Readonly<PacklistDefinitionHeaderCardProps>) {
  const objectTypeOptions = useMemo(
    () =>
      objectTypes.map((item) => ({
        value: item.id,
        label: item.name,
      })),
    [objectTypes],
  );

  const isUpdate = isDefined(revision) && revision >= 1;

  return (
    <Stack spacing={2}>
      <InputField
        name="name"
        label="Name der Packliste"
        readOnly={readOnlyMode}
        required="Bitte geben Sie einen Namen ein."
      />

      <SelectField
        name="objectTypeId"
        label="Objekttyp"
        required="Bitte wählen Sie einen Objekttyp aus."
        placeholder="Objekttyp auswählen"
        disabled={readOnlyMode || isUpdate}
        options={objectTypeOptions}
      />

      <TextareaField
        name="description"
        label="Beschreibung"
        readOnly={readOnlyMode}
      />
    </Stack>
  );
}
