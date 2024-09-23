/**
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { ApiMeaslesProtectionProcedure } from "@eshg/employee-portal-api/measlesProtection";
import { useSnackbar } from "@eshg/lib-portal/components/snackbar/SnackbarProvider";
import { Stack } from "@mui/joy";
import { useFormikContext } from "formik";
import { forwardRef, useImperativeHandle, useRef } from "react";

import { useUpdateProcedureMutation } from "@/lib/businessModules/measlesProtection/api/mutations/procedures";
import { OverlayBoundary } from "@/lib/shared/components/boundaries/OverlayBoundary";
import { FormButtonBar } from "@/lib/shared/components/form/FormButtonBar";
import { SidebarFormHandle } from "@/lib/shared/components/form/SidebarForm";
import { Sidebar } from "@/lib/shared/components/sidebar/Sidebar";
import { SidebarActions } from "@/lib/shared/components/sidebar/SidebarActions";
import { SidebarContent } from "@/lib/shared/components/sidebar/SidebarContent";

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
      <SidebarContent title={"Zusatzinfos"}>
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
