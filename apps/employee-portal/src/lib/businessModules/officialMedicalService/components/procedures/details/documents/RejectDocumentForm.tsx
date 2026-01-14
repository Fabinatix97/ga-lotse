/**
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { Stack } from "@mui/joy";
import { Formik } from "formik";
import { Ref } from "react";

import {
  MultiFormButtonBar,
  SidebarActions,
  SidebarContent,
  SidebarForm,
  SidebarFormHandle,
} from "@eshg/lib-employee-portal";
import { Alert, TextareaField } from "@eshg/lib-portal";
import {
  ApiDocument,
  ApiReviewResult,
} from "@eshg/official-medical-service-api";

import { useReviewDocument } from "@/lib/businessModules/officialMedicalService/api/mutations/omsDocumentApi";

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
      enableReinitialize
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
    >
      {({ isSubmitting }) => (
        <SidebarForm ref={formRef}>
          <SidebarContent title="Dokument ablehnen">
            <Stack gap={2} rowGap={2}>
              <Alert
                color="warning"
                message="Bei Ablehnung werden die Dateien dauerhaft gelöscht."
              />
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
