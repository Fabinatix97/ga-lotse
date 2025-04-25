/**
 * Copyright 2025 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { Stack } from "@mui/joy";
import { useFormikContext } from "formik";
import { useMemo } from "react";
import { isDefined } from "remeda";

import { ApiUserRole } from "@eshg/base-api";
import { ApiObjectType } from "@eshg/inspection-api";
import {
  CheckboxField,
  InformationSheet,
  TextareaField,
  useHasUserRoleCheck,
} from "@eshg/lib-employee-portal";
import { InputField } from "@eshg/lib-portal/components/formFields/InputField";
import { SelectField } from "@eshg/lib-portal/components/formFields/SelectField";

import { FormChecklistDefinitionVersion } from "@/lib/businessModules/inspection/api/mutations/checklistDefinition";

interface ChecklistDefinitionHeaderCardProps {
  version: number | undefined;
  objectTypes: ApiObjectType[];
}

export function ChecklistDefinitionHeaderCard({
  version,
  objectTypes,
}: Readonly<ChecklistDefinitionHeaderCardProps>) {
  const objectTypeOptions = useMemo(
    () =>
      objectTypes.map((item) => ({
        value: item.id,
        label: item.name,
      })),
    [objectTypes],
  );

  const canEditCoreChecklists = useHasUserRoleCheck(
    ApiUserRole.InspectionCorechecklistdefinitionsEdit,
  );

  const isUpdate = isDefined(version) && version >= 1;

  const { values } = useFormikContext<FormChecklistDefinitionVersion>();

  return (
    <InformationSheet>
      <InputField
        name="context.name"
        label="Name der Checkliste"
        required="Bitte geben Sie einen Namen ein."
      />

      <Stack direction="row" gap={4}>
        <CheckboxField
          name="context.deleted"
          label="Als Inaktiv markieren"
          disabled={values.isCoreChecklist && !canEditCoreChecklists}
        />
        <CheckboxField
          name="isCoreChecklist"
          label="Kern-Checkliste"
          disabled={isUpdate || !canEditCoreChecklists}
        />

        {values.isCoreChecklist && (
          <CheckboxField
            name="context.expandable"
            label="Erweiterbar"
            disabled={!canEditCoreChecklists}
          />
        )}
      </Stack>

      <SelectField
        name="objectTypeId"
        label="Objekttyp"
        required="Bitte wählen Sie einen Objekttyp aus."
        placeholder="Objekttyp auswählen"
        disabled={isUpdate}
        options={objectTypeOptions}
      />

      <TextareaField name="context.description" label="Beschreibung" />
    </InformationSheet>
  );
}
