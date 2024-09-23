/**
 * Copyright 2024 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { InputField } from "@eshg/lib-portal/components/formFields/InputField";
import { SelectField } from "@eshg/lib-portal/components/formFields/SelectField";
import { Stack } from "@mui/joy";
import { useMemo } from "react";
import { isDefined } from "remeda";

import { useGetObjectTypes } from "@/lib/businessModules/inspection/api/queries/objectTypes";
import { TextareaField } from "@/lib/shared/components/formFields/TextareaField";

interface PacklistDefinitionHeaderCardProps {
  readOnlyMode: boolean;
  revision: number | undefined;
}

export function PacklistDefinitionHeaderCard({
  readOnlyMode,
  revision,
}: Readonly<PacklistDefinitionHeaderCardProps>) {
  const { data: objectTypes } = useGetObjectTypes();

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
