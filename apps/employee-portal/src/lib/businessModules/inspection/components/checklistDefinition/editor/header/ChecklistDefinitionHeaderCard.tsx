/**
 * Copyright 2026 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { Stack } from "@mui/joy";
import { useFormikContext } from "formik";
import { isDefined } from "remeda";

import { ApiUserRole } from "@eshg/base-api";
import {
  ApiObjectType,
  ApiObjectTypeHierarchyTreeNode,
} from "@eshg/inspection-api";
import {
  InformationSheet,
  useHasUserRoleCheck,
} from "@eshg/lib-employee-portal";
import { CheckboxField, InputField, TextareaField } from "@eshg/lib-portal";

import { FormChecklistDefinitionVersion } from "@/lib/businessModules/inspection/api/mutations/checklistDefinition";

import { ObjectTypesSelectField } from "./ObjectTypesSelectField";

interface ChecklistDefinitionHeaderCardProps {
  version: number | undefined;
  objectTypes: ApiObjectType[] | ApiObjectTypeHierarchyTreeNode[];
}

export function ChecklistDefinitionHeaderCard({
  version,
  objectTypes,
}: Readonly<ChecklistDefinitionHeaderCardProps>) {
  const canEditCoreChecklists = useHasUserRoleCheck(
    ApiUserRole.InspectionCorechecklistdefinitionsEdit,
  );

  const isUpdate = isDefined(version) && version >= 1;

  const { values } = useFormikContext<FormChecklistDefinitionVersion>();

  return (
    <InformationSheet role="region" aria-label="Meta-Informationen">
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
      <ObjectTypesSelectField
        name="objectTypeId"
        disabled={isUpdate}
        objectTypes={objectTypes}
      />
      <TextareaField name="context.description" label="Beschreibung" />
    </InformationSheet>
  );
}
