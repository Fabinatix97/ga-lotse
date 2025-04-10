/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import {
  MultiFormButtonBar,
  SidebarActions,
  SidebarForm,
  SidebarFormHandle,
  useConfirmationDialog,
} from "@eshg/lib-employee-portal";
import {
  ApiDocument,
  ApiDocumentStatus,
} from "@eshg/official-medical-service-api";
import { Formik } from "formik";
import { Ref } from "react";

import { useReviewDocument } from "@/lib/businessModules/officialMedicalService/api/mutations/omsDocumentApi";

import { DocumentFormContent } from "./DocumentFormContent";

export interface DocumentFormValues {
  documentTypeDe: string;
  documentTypeEn?: string;
  helpTextDe?: string;
  helpTextEn?: string;
  mandatoryDocument: boolean;
  uploadInCitizenPortal: boolean;
  files?: File[];
  note?: string;
  labCode?: string;
}

interface DocumentFormProps {
  initialValues: DocumentFormValues;
  document: ApiDocument;
  formRef: Ref<SidebarFormHandle>;
  onCancel: () => void;
  onSubmit: (values: DocumentFormValues) => Promise<void>;
  title: string;
  submitLabel: string;
  onEditInformation?: () => void;
  onEditNote?: () => void;
  onReject?: () => void;
  onClose: () => void;
  isProcedureFinalized: boolean;
}

export function DocumentForm(props: Readonly<DocumentFormProps>) {
  const { openConfirmationDialog } = useConfirmationDialog();
  const { mutateAsync: reviewDocument } = useReviewDocument();

  return (
    <Formik
      initialValues={props.initialValues}
      onSubmit={async (values) => {
        if (isCompletableWithConfirmation({ ...props, ...values })) {
          openConfirmationDialog({
            onConfirm: () => props.onSubmit(values),
            title: "Datei-Upload abschließen?",
            confirmLabel: "Abschließen",
            description:
              'Wenn Sie fortfahren, wird der Status auf "Akzeptiert" gesetzt und es können keine weiteren Dateien hinzugefügt werden.',
          });
        } else if (isCompletableWithoutConfirmation({ ...props, ...values })) {
          await props.onSubmit(values);
          props.onClose();
        } else if (needsReview(props)) {
          openConfirmationDialog({
            onConfirm: async () => {
              await reviewDocument({
                id: props.document.id,
                apiPatchDocumentReviewRequest: {
                  result: ApiDocumentStatus.Accepted,
                },
              });
              props.onClose();
            },
            title: "Dokument akzeptieren?",
            confirmLabel: "Akzeptieren",
            description:
              'Wenn Sie fortfahren, wird der Status auf "Akzeptiert" gesetzt und es können keine weiteren Dateien hinzugefügt werden.',
          });
        } else {
          props.onClose();
        }
      }}
      enableReinitialize
    >
      {({ isSubmitting, values }) => {
        const isCompletable =
          isCompletableWithConfirmation({ ...props, ...values }) ||
          isCompletableWithoutConfirmation({ ...props, ...values });
        return (
          <SidebarForm ref={props.formRef}>
            <DocumentFormContent {...props} />
            <SidebarActions>
              {needsReview(props) ? (
                <MultiFormButtonBar
                  onCancel={props.onClose}
                  onReject={props.onReject}
                  submitLabel="Akzeptieren"
                  submitting={isSubmitting}
                />
              ) : isCompletable ? (
                <MultiFormButtonBar
                  submitLabel="Abschließen"
                  onCancel={props.onCancel}
                  submitting={isSubmitting}
                />
              ) : (
                <MultiFormButtonBar
                  submitLabel={props.submitLabel}
                  submitting={isSubmitting}
                />
              )}
            </SidebarActions>
          </SidebarForm>
        );
      }}
    </Formik>
  );
}

function needsReview({ document }: { document: ApiDocument }): boolean {
  return document.documentStatus === ApiDocumentStatus.Submitted;
}

function isCompletableWithConfirmation({
  document,
  files,
}: {
  document: ApiDocument;
  files?: File[];
}): boolean {
  return (
    document.documentStatus !== ApiDocumentStatus.Accepted &&
    !!files &&
    files.length > 0
  );
}

function isCompletableWithoutConfirmation({
  document,
  files,
}: {
  document: ApiDocument;
  files?: File[];
}): boolean {
  return (
    document.documentStatus === ApiDocumentStatus.Rejected &&
    !!files &&
    files.length > 0
  );
}
