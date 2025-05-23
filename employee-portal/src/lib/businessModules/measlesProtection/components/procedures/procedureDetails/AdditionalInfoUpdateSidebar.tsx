/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { Stack } from "@mui/joy";
import { useFormikContext } from "formik";
import { forwardRef, useImperativeHandle, useRef } from "react";

import {
  FormButtonBar,
  OverlayBoundary,
  Sidebar,
  SidebarActions,
  SidebarContent,
  SidebarFormHandle,
} from "@eshg/lib-employee-portal";
import { useSnackbar } from "@eshg/lib-portal";
import { ApiMeaslesProtectionProcedure } from "@eshg/measles-protection-api";

import { useUpdateProcedureMutation } from "@/lib/businessModules/measlesProtection/api/mutations/procedures";

import {
  ProcedureForm,
  UpdateProcedureSectionFields,
  UpdateProcedureSectionFieldsProps,
} from "./UpdateProcedureSection";
import {
  UPDATE_PROCEDURE_SUCCESS_MESSAGE,
  UpdateProcedureForm,
  ValidUpdateProcedureForm,
  mapAdditionalInfoFormToApi,
  mapProcedureToAdditionalInfoForm,
} from "./helpers";

type AdditionalInfoUpdateSidebarProps = Readonly<{
  onClose: () => unknown;
  isOpen: boolean;
  procedure: ApiMeaslesProtectionProcedure;
}>;
export function AdditionalInfoUpdateSidebar({
  onClose,
  isOpen,
  procedure,
}: AdditionalInfoUpdateSidebarProps) {
  const formRef = useRef<SidebarFormHandle>(null);
  const initialValues: UpdateProcedureForm =
    mapProcedureToAdditionalInfoForm(procedure);

  const snackbar = useSnackbar();

  const updateProcedure = useUpdateProcedureMutation({
    onSuccess: () => {
      onClose();
      snackbar.confirmation(UPDATE_PROCEDURE_SUCCESS_MESSAGE);
    },
  });
  function handleUpdate(values: ValidUpdateProcedureForm) {
    return updateProcedure.mutate({
      id: procedure.id,
      data: mapAdditionalInfoFormToApi(values),
    });
  }
  function handleCancel() {
    onClose();
    formRef.current?.resetForm();
  }

  return (
    <Sidebar open={isOpen} onClose={handleCancel}>
      <OverlayBoundary>
        <ProcedureForm
          submitProcedure={handleUpdate}
          initialValues={initialValues}
        >
          <AdditionalInfoUpdateSidebarFields
            ref={formRef}
            onCancel={handleCancel}
          />
        </ProcedureForm>
      </OverlayBoundary>
    </Sidebar>
  );
}
type AdditionalInfoUpdateSidebarFieldsProps = Readonly<{
  onCancel: () => unknown;
}> &
  UpdateProcedureSectionFieldsProps;

const AdditionalInfoUpdateSidebarFields = forwardRef<
  Pick<SidebarFormHandle, "resetForm" | "dirty">,
  AdditionalInfoUpdateSidebarFieldsProps
>(function ({ onCancel }: AdditionalInfoUpdateSidebarFieldsProps, ref) {
  const { resetForm, dirty } = useFormikContext();
  useImperativeHandle(ref, () => ({ resetForm, dirty }));

  return (
    <>
      <SidebarContent title="Zusatzinfos">
        <Stack gap={3}>
          <UpdateProcedureSectionFields />
        </Stack>
      </SidebarContent>
      <SidebarActions>
        <FormButtonBar
          submitting={false}
          submitLabel="Speichern"
          onCancel={onCancel}
        />
      </SidebarActions>
    </>
  );
});
AdditionalInfoUpdateSidebarFields.displayName =
  "AdditionalInfoUpdateSidebarFields";
