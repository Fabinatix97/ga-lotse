/**
 * Copyright 2025 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import {
  ApiInspectionAvailableCLDVersionsResponse,
  ApiInspectionCLDVersion,
} from "@eshg/employee-portal-api/inspection";
import { SelectOption } from "@eshg/lib-portal/components/formFields/SelectOptions";
import { createFieldNameMapper } from "@eshg/lib-portal/helpers/form";
import { NestedFormProps } from "@eshg/lib-portal/types/form";
import { Lock } from "@mui/icons-material";
import { Stack, Typography } from "@mui/joy";
import { Formik, FormikErrors } from "formik";
import { useRef } from "react";

import { useUpdateInspection } from "@/lib/businessModules/inspection/api/mutations/inspection";
import { FormButtonBar } from "@/lib/shared/components/form/FormButtonBar";
import {
  SidebarForm,
  SidebarFormHandle,
} from "@/lib/shared/components/form/SidebarForm";
import { CheckboxField } from "@/lib/shared/components/formFields/CheckboxField";
import { SidebarActions } from "@/lib/shared/components/sidebar/SidebarActions";
import { SidebarContent } from "@/lib/shared/components/sidebar/SidebarContent";

export interface ChecklistSelectSidebarFormProps {
  onClose: () => void;
  inspectionExternalId: string;
  currentSelectedNonCoreVersions: ApiInspectionCLDVersion[];
  availableCldvs: ApiInspectionAvailableCLDVersionsResponse;
}

interface ChecklistSelectFormType {
  selectedVersionIdsCount: number;
  selectedVersionIds: Record<string, boolean>;
}

export function ChecklistSelectSidebarForm({
  availableCldvs: { versions, coreVersions, isExpandable },
  inspectionExternalId,
  currentSelectedNonCoreVersions,
  onClose,
}: Readonly<ChecklistSelectSidebarFormProps>) {
  const sidebarFormRef = useRef<SidebarFormHandle>(null);

  const initial_values: ChecklistSelectFormType = {
    selectedVersionIdsCount: currentSelectedNonCoreVersions.length,
    selectedVersionIds: Object.fromEntries(
      currentSelectedNonCoreVersions.map((v) => [v.versionId, true]),
    ),
  };
  const selectableVersions = currentSelectedNonCoreVersions.concat(versions);

  function validate({ selectedVersionIdsCount }: ChecklistSelectFormType) {
    const errors: FormikErrors<ChecklistSelectFormType> = {};
    if (selectedVersionIdsCount === 0 && coreVersions.length === 0) {
      errors.selectedVersionIdsCount =
        "Bitte mindestens eine Checkliste auswählen.";
    }
    return errors;
  }

  function handleClose() {
    sidebarFormRef.current?.resetForm();
    onClose();
  }

  const { mutateAsync: updateInspection } = useUpdateInspection();

  async function handleSubmit({ selectedVersionIds }: ChecklistSelectFormType) {
    const isExpandable = !coreVersions.some(
      (coreCldv) => !coreCldv.isExpandable,
    );

    const request = {
      checklistDefinitionVersionIds: isExpandable
        ? Object.entries(selectedVersionIds)
            .filter(([, isSelected]) => isSelected)
            .map(([versionId]) => versionId)
            .sort((v1, v2) => {
              const name1 =
                selectableVersions.find((s) => s.versionId === v1)?.name ?? "";
              const name2 =
                selectableVersions.find((s) => s.versionId === v2)?.name ?? "";
              return name1?.localeCompare(name2);
            })
        : [],
    };

    await updateInspection(
      {
        id: inspectionExternalId,
        apiUpdateInspectionRequest: request,
      },
      {
        onSuccess: handleClose,
      },
    );
  }

  return (
    <Formik
      initialValues={initial_values}
      onSubmit={handleSubmit}
      enableReinitialize
      validate={validate}
    >
      {({ isSubmitting, handleSubmit, setFieldValue, values, errors }) => (
        <SidebarForm onSubmit={handleSubmit} ref={sidebarFormRef}>
          <SidebarContent title={"Checkliste auswählen"}>
            <Stack direction="column" spacing={2}>
              {isExpandable && (
                <SelectedVersionsForm
                  name="selectedVersionIds"
                  versions={selectableVersions}
                  setFieldValue={setFieldValue}
                  currentValues={values}
                  errors={errors}
                />
              )}
              {coreVersions.length > 0 && (
                <Stack direction="column" data-testid={"core-checklists"}>
                  <Typography>
                    Es werden folgende Kernchecklisten hinzugefügt:
                  </Typography>
                  {coreVersions.map((coreCldv) => (
                    <Typography
                      sx={{ display: "flex" }}
                      level="body-md"
                      key={coreCldv.versionId}
                    >
                      {coreCldv.name + " (Version "}
                      {!coreCldv.isExpandable && <Lock />}
                      {coreCldv.version + ")"}
                    </Typography>
                  ))}
                </Stack>
              )}
            </Stack>
          </SidebarContent>
          <SidebarActions>
            <FormButtonBar
              submitLabel="Speichern"
              submitting={isSubmitting}
              onCancel={handleClose}
            />
          </SidebarActions>
        </SidebarForm>
      )}
    </Formik>
  );
}

function SelectedVersionsForm({
  name,
  versions,
  setFieldValue,
  currentValues,
  errors,
}: NestedFormProps & {
  versions: ApiInspectionCLDVersion[];
  setFieldValue: (
    fieldName: string,
    fieldValue: boolean | number,
    shouldValidate?: boolean,
  ) => Promise<void | FormikErrors<ChecklistSelectFormType>>;
  currentValues: ChecklistSelectFormType;
  errors: FormikErrors<ChecklistSelectFormType>;
}) {
  const fieldName = createFieldNameMapper(name);
  const availableCLDVOptions: SelectOption[] = versions
    .map((v) => ({
      value: v.versionId,
      label: `${v.name} (Version ${v.version})`,
    }))
    .sort((a, b) => a.label.localeCompare(b.label));

  async function handleChange(versionId: string, isSelected: boolean) {
    const newCount = isSelected
      ? currentValues.selectedVersionIdsCount + 1
      : Math.max(0, currentValues.selectedVersionIdsCount - 1);
    await Promise.all([
      setFieldValue(fieldName(versionId), isSelected),
      setFieldValue("selectedVersionIdsCount", newCount),
    ]);
  }

  const currentSelectedVersionIds = Object.keys(
    currentValues.selectedVersionIds,
  ).filter((versionId) => currentValues.selectedVersionIds[versionId]);

  const clCount = currentSelectedVersionIds.length;
  const checklistsCountText = `${clCount} ${clCount != 1 ? "Checklisten" : "Checkliste"} ausgewählt`;

  return (
    <Stack direction="column" gap={3}>
      <Typography
        color={
          errors.selectedVersionIdsCount === undefined ? "success" : "danger"
        }
        level="title-md"
        fontWeight="600"
        data-testid="checklists-count"
      >
        {checklistsCountText}
      </Typography>
      <Stack
        direction="column"
        gap={2}
        sx={{ paddingX: 2 }}
        data-testid="checklists"
      >
        {availableCLDVOptions.map(({ label, value: versionId }) => {
          return (
            <CheckboxField
              key={versionId}
              name={fieldName(versionId)}
              label={label}
              onChange={async (ev) => {
                await handleChange(versionId, ev.target.checked);
              }}
              size="md"
              variant="outlined"
            />
          );
        })}
      </Stack>
    </Stack>
  );
}
