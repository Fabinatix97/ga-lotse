/**
 * Copyright 2024 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { ApiUserRole } from "@eshg/employee-portal-api/base";
import { InputField } from "@eshg/lib-portal/components/formFields/InputField";
import { SelectField } from "@eshg/lib-portal/components/formFields/SelectField";
import { Stack } from "@mui/joy";
import { useFormikContext } from "formik";
import { useMemo } from "react";
import { isDefined } from "remeda";

import { FormChecklistDefinitionVersion } from "@/lib/businessModules/inspection/api/mutations/checklistDefinition";
import { useGetObjectTypes } from "@/lib/businessModules/inspection/api/queries/objectTypes";
import { CheckboxField } from "@/lib/shared/components/formFields/CheckboxField";
import { TextareaField } from "@/lib/shared/components/formFields/TextareaField";
import { InformationSheet } from "@/lib/shared/components/infoTile/InformationSheet";
import { useHasUserRoleCheck } from "@/lib/shared/hooks/useAccessControl";

interface ChecklistDefinitionHeaderCardProps {
  readOnlyMode: boolean;
  version: number | undefined;
}

export function ChecklistDefinitionHeaderCard({
  readOnlyMode,
  version,
}: Readonly<ChecklistDefinitionHeaderCardProps>) {
  const { data: objectTypes } = useGetObjectTypes();

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
        readOnly={readOnlyMode}
        required="Bitte geben Sie einen Namen ein."
      />

      <Stack direction="row" gap={4}>
        <CheckboxField
          name="context.deleted"
          label="Als gelöscht markieren"
          disabled={
            readOnlyMode || (values.isCoreChecklist && !canEditCoreChecklists)
          }
        />
        <CheckboxField
          name="isCoreChecklist"
          label="Kern-Checkliste"
          disabled={readOnlyMode || isUpdate || !canEditCoreChecklists}
        />

        {values.isCoreChecklist && (
          <CheckboxField
            name="context.expandable"
            label="Erweiterbar"
            disabled={readOnlyMode || !canEditCoreChecklists}
          />
        )}
      </Stack>

      <SelectField
        name="objectTypeId"
        label="Objekttyp"
        required="Bitte wählen Sie einen Objekttyp aus."
        placeholder="Objekttyp auswählen"
        disabled={readOnlyMode || isUpdate}
        options={objectTypeOptions}
      />

      <TextareaField
        name="context.description"
        label="Beschreibung"
        readOnly={readOnlyMode}
      />
    </InformationSheet>
  );
}
