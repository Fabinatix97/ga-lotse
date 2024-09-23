/**
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { useFileDownload } from "@eshg/lib-portal/api/files/download";
import { HiddenContainer } from "@eshg/lib-portal/components/HiddenContainer";
import { SubmitButton } from "@eshg/lib-portal/components/buttons/SubmitButton";
import { BooleanSelectField } from "@eshg/lib-portal/components/formFields/BooleanSelectField";
import { validateLength } from "@eshg/lib-portal/helpers/validators";
import { Button, Stack } from "@mui/joy";
import { Formik } from "formik";

import { useCreateMedicalReport } from "@/lib/businessModules/schoolEntry/api/mutations/schoolEntryApi";
import { ButtonBar } from "@/lib/shared/components/buttons/ButtonBar";
import { SidebarForm } from "@/lib/shared/components/form/SidebarForm";
import { TextareaField } from "@/lib/shared/components/formFields/TextareaField";
import { Sidebar } from "@/lib/shared/components/sidebar/Sidebar";
import { SidebarActions } from "@/lib/shared/components/sidebar/SidebarActions";
import { SidebarContent } from "@/lib/shared/components/sidebar/SidebarContent";

interface MedicalReportSidebarProps {
  procedureId: string;
  onClose: () => void;
  open: boolean;
}

interface MedicalReportValues {
  isVisio: boolean;
  remark: string;
}

const initialValues: MedicalReportValues = {
  isVisio: false,
  remark: "",
};

export function MedicalReportSidebar(props: MedicalReportSidebarProps) {
  const createMedicalReport = useCreateMedicalReport(props.procedureId);
  const { downloadContainerRef, download } = useFileDownload(
    createMedicalReport.mutateAsync,
  );

  async function handleSubmit(values: MedicalReportValues) {
    await download(values);
    props.onClose();
  }

  return (
    <Sidebar open={props.open} onClose={props.onClose}>
      <Formik initialValues={initialValues} onSubmit={handleSubmit}>
        {({ isSubmitting, handleSubmit }) => (
          <SidebarForm onSubmit={handleSubmit}>
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
                    onClick={props.onClose}
                  >
                    Abbrechen
                  </Button>
                }
                right={
                  <>
                    <SubmitButton submitting={isSubmitting}>
                      Erstellen
                    </SubmitButton>
                    <HiddenContainer ref={downloadContainerRef} />
                  </>
                }
              />
            </SidebarActions>
          </SidebarForm>
        )}
      </Formik>
    </Sidebar>
  );
}
