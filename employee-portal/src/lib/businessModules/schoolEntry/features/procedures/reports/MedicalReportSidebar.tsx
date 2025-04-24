/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import {
  ButtonBar,
  SidebarActions,
  SidebarContent,
  SidebarForm,
  SidebarWithFormRefProps,
  TextareaField,
  UseSidebarWithFormRefResult,
  useSidebarWithFormRef,
} from "@eshg/lib-employee-portal";
import { useFileDownload } from "@eshg/lib-portal/api/files/download";
import { SubmitButton } from "@eshg/lib-portal/components/buttons/SubmitButton";
import { BooleanSelectField } from "@eshg/lib-portal/components/formFields/BooleanSelectField";
import { useValidators } from "@eshg/lib-portal/hooks/useValidators";
import { Button, Stack } from "@mui/joy";
import { Formik } from "formik";

import { useCreateMedicalReport } from "@/lib/businessModules/schoolEntry/api/mutations/schoolEntryApi";

export function useMedicalReportSidebar(): UseSidebarWithFormRefResult<MedicalReportSidebarProps> {
  return useSidebarWithFormRef({
    component: MedicalReportSidebar,
  });
}

interface MedicalReportSidebarProps extends SidebarWithFormRefProps {
  procedureId: string;
}

interface MedicalReportValues {
  isVisio: boolean;
  remark: string;
}

const initialValues: MedicalReportValues = {
  isVisio: false,
  remark: "",
};

function MedicalReportSidebar(props: MedicalReportSidebarProps) {
  const { validateLength } = useValidators();
  const createMedicalReport = useCreateMedicalReport(props.procedureId);
  const { download } = useFileDownload(createMedicalReport.mutateAsync);

  async function handleSubmit(values: MedicalReportValues) {
    await download(values);
    props.onClose(true);
  }

  return (
    <Formik initialValues={initialValues} onSubmit={handleSubmit}>
      {({ isSubmitting, handleSubmit }) => (
        <SidebarForm ref={props.formRef} onSubmit={handleSubmit}>
          <SidebarContent title="Arztbrief erstellen">
            <Stack gap={2}>
              <BooleanSelectField
                name="isVisio"
                label="Brief für"
                required="Bitte wählen Sie aus an wen der Brief gerichtet ist."
                labelTrue="Augenarzt:in"
                labelFalse="Arzt:in"
              />
              <TextareaField
                name="remark"
                label="Bemerkung"
                validate={validateLength(1, 600)}
                required="Bitte eine Bemerkung angeben."
                sxTextarea={{ minHeight: "473px" }}
              />
            </Stack>
          </SidebarContent>
          <SidebarActions>
            <ButtonBar
              left={
                <Button
                  variant="plain"
                  color="primary"
                  onClick={() => props.onClose()}
                >
                  Abbrechen
                </Button>
              }
              right={
                <SubmitButton submitting={isSubmitting}>Erstellen</SubmitButton>
              }
            />
          </SidebarActions>
        </SidebarForm>
      )}
    </Formik>
  );
}
