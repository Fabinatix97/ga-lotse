/**
 * Copyright 2025 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import {
  ApiInspectionAvailablePLDRevisionsResponse,
  ApiInspectionPLDRevision,
} from "@eshg/inspection-api";
import {
  CheckboxField,
  FormButtonBar,
  SidebarActions,
  SidebarContent,
  SidebarForm,
  SidebarFormHandle,
} from "@eshg/lib-employee-portal";
import { SelectOption } from "@eshg/lib-portal/components/formFields/SelectOptions";
import { createFieldNameMapper } from "@eshg/lib-portal/helpers/form";
import { NestedFormProps } from "@eshg/lib-portal/types/form";
import { Stack, Typography } from "@mui/joy";
import { Formik, FormikErrors } from "formik";
import { useRef } from "react";

import { useUpdateInspection } from "@/lib/businessModules/inspection/api/mutations/inspection";

export interface PacklistSelectSidebarFormProps {
  onClose: () => void;
  inspectionExternalId: string;
  currentSelectedRevisions: ApiInspectionPLDRevision[];
  availablePldrs: ApiInspectionAvailablePLDRevisionsResponse;
}

interface PacklistSelectFormType {
  selectedRevisionIdsCount: number;
  selectedRevisionIds: Record<string, boolean>;
}

export function PacklistSelectSidebarForm({
  availablePldrs: { revisions },
  inspectionExternalId,
  currentSelectedRevisions,
  onClose,
}: Readonly<PacklistSelectSidebarFormProps>) {
  const sidebarFormRef = useRef<SidebarFormHandle>(null);

  const initialValues: PacklistSelectFormType = {
    selectedRevisionIdsCount: currentSelectedRevisions.length,
    selectedRevisionIds: Object.fromEntries(
      currentSelectedRevisions.map((r) => [r.revisionId, true]),
    ),
  };
  const selectableRevisions = currentSelectedRevisions.concat(revisions);

  function handleClose() {
    sidebarFormRef.current?.resetForm();
    onClose();
  }

  const { mutateAsync: updateInspection } = useUpdateInspection();

  async function handleSubmit({ selectedRevisionIds }: PacklistSelectFormType) {
    const request = {
      packlistDefinitionRevisionIds: Object.entries(selectedRevisionIds)
        .filter(([, isSelected]) => isSelected)
        .map(([revisionId]) => revisionId)
        .sort((v1, v2) => {
          const name1 =
            selectableRevisions.find((s) => s.revisionId === v1)?.name ?? "";
          const name2 =
            selectableRevisions.find((s) => s.revisionId === v2)?.name ?? "";
          return name1?.localeCompare(name2);
        }),
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
      initialValues={initialValues}
      onSubmit={handleSubmit}
      enableReinitialize
    >
      {({ isSubmitting, handleSubmit, setFieldValue, values, errors }) => (
        <SidebarForm onSubmit={handleSubmit} ref={sidebarFormRef}>
          <SidebarContent title={"Packliste auswählen"}>
            <Stack direction="column" spacing={2}>
              <SelectedRevisionsForm
                name="selectedRevisionIds"
                revisions={selectableRevisions}
                setFieldValue={setFieldValue}
                currentValues={values}
                errors={errors}
              />
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

function SelectedRevisionsForm({
  name,
  revisions,
  setFieldValue,
  currentValues,
  errors,
}: NestedFormProps & {
  revisions: ApiInspectionPLDRevision[];
  setFieldValue: (
    fieldName: string,
    fieldValue: boolean | number,
    shouldValidate?: boolean,
  ) => Promise<void | FormikErrors<PacklistSelectFormType>>;
  currentValues: PacklistSelectFormType;
  errors: FormikErrors<PacklistSelectFormType>;
}) {
  const fieldName = createFieldNameMapper(name);
  const availablePLDROptions: SelectOption[] = revisions
    .map((r) => ({
      value: r.revisionId,
      label: `${r.name} (Version ${r.revision})`,
    }))
    .sort((a, b) => a.label.localeCompare(b.label));

  async function handleChange(revisionId: string, isSelected: boolean) {
    const newCount = isSelected
      ? currentValues.selectedRevisionIdsCount + 1
      : Math.max(0, currentValues.selectedRevisionIdsCount - 1);
    await Promise.all([
      setFieldValue(fieldName(revisionId), isSelected),
      setFieldValue("selectedRevisionIdsCount", newCount),
    ]);
  }

  const currentSelectedRevisionIds = Object.keys(
    currentValues.selectedRevisionIds,
  ).filter((revisionId) => currentValues.selectedRevisionIds[revisionId]);

  const clCount = currentSelectedRevisionIds.length;
  const packlistsCountText = `${clCount} ${clCount != 1 ? "Packlisten" : "Packliste"} ausgewählt`;

  return (
    <Stack direction="column" gap={3}>
      <Typography
        color={
          errors.selectedRevisionIdsCount === undefined ? "success" : "danger"
        }
        level="title-md"
        fontWeight="600"
        data-testid="packlists-count"
      >
        {packlistsCountText}
      </Typography>
      <Stack
        direction="column"
        gap={2}
        sx={{ paddingX: 2 }}
        data-testid="packlists"
      >
        {availablePLDROptions.map(({ label, value: revisionId }) => {
          return (
            <CheckboxField
              key={revisionId}
              name={fieldName(revisionId)}
              label={label}
              onChange={async (ev) => {
                await handleChange(revisionId, ev.target.checked);
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
