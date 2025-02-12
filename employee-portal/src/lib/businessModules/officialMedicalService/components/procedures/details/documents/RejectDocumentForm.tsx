/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import {
  ApiDocument,
  ApiReviewResult,
} from "@eshg/official-medical-service-api";
import { WarningAmber } from "@mui/icons-material";
import { Alert, Stack } from "@mui/joy";
import { Formik } from "formik";
import { Ref } from "react";

import { useReviewDocument } from "@/lib/businessModules/officialMedicalService/api/mutations/omsDocumentApi";
import { MultiFormButtonBar } from "@/lib/shared/components/form/MultiFormButtonBar";
import {
  SidebarForm,
  SidebarFormHandle,
} from "@/lib/shared/components/form/SidebarForm";
import { TextareaField } from "@/lib/shared/components/formFields/TextareaField";
import { SidebarActions } from "@/lib/shared/components/sidebar/SidebarActions";
import { SidebarContent } from "@/lib/shared/components/sidebar/SidebarContent";

interface RejectDocumentFormProps {
  document: ApiDocument;
  formRef: Ref<SidebarFormHandle>;
  onClose: (force?: boolean) => void;
}

export function RejectDocumentForm({
  document,
  formRef,
  onClose,
}: Readonly<RejectDocumentFormProps>) {
  const { mutateAsync: reviewDocument } = useReviewDocument();

  return (
    <Formik
      initialValues={{ reasonForRejection: document.reasonForRejection }}
      onSubmit={async (values) => {
        await reviewDocument({
          id: document.id,
          apiPatchDocumentReviewRequest: {
            result: ApiReviewResult.Rejected,
            reasonForRejection: values.reasonForRejection,
          },
        });
        onClose(true);
      }}
      enableReinitialize
    >
      {({ isSubmitting }) => (
        <SidebarForm ref={formRef}>
          <SidebarContent title="Dokument ablehnen">
            <Stack gap={2} rowGap={2}>
              <Alert color={"warning"} startDecorator={<WarningAmber />}>
                Bei Ablehnung werden die Dateien dauerhaft gelöscht.
              </Alert>
              <TextareaField
                name="reasonForRejection"
                label="Ablehnungsgrund"
                required="Bitte geben Sie einen Ablehnungsgrund an"
              />
            </Stack>
          </SidebarContent>
          <SidebarActions>
            <MultiFormButtonBar
              submitLabel="Ablehnen"
              submitting={isSubmitting}
              onCancel={onClose}
            />
          </SidebarActions>
        </SidebarForm>
      )}
    </Formik>
  );
}
