/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import {
  PatchCompleteDocumentFileUploadRequest,
  PatchDocumentInformationRequest,
  PatchDocumentNoteRequest,
} from "@eshg/official-medical-service-api";
import { useSuspenseQueries } from "@tanstack/react-query";
import { useState } from "react";

import {
  usePatchCompleteDocumentFileUpload,
  usePatchDocumentInformation,
  usePatchDocumentNote,
} from "@/lib/businessModules/officialMedicalService/api/mutations/omsDocumentApi";
import { useGetAllDocuments } from "@/lib/businessModules/officialMedicalService/api/queries/employeeOmsProcedureApi";
import {
  DocumentForm,
  DocumentFormValues,
} from "@/lib/businessModules/officialMedicalService/components/procedures/details/documents/DocumentForm";
import { EditDocumentInformationForm } from "@/lib/businessModules/officialMedicalService/components/procedures/details/documents/EditDocumentInformationForm";
import { EditDocumentNoteForm } from "@/lib/businessModules/officialMedicalService/components/procedures/details/documents/EditDocumentNoteForm";
import { useConfirmationDialog } from "@/lib/shared/hooks/useConfirmationDialog";
import {
  SidebarWithFormRefProps,
  UseSidebarWithFormRefResult,
  useSidebarWithFormRef,
} from "@/lib/shared/hooks/useSidebarWithFormRef";

import { RejectDocumentForm } from "./RejectDocumentForm";

export function useDocumentSidebar(): UseSidebarWithFormRefResult<DocumentSidebarProps> {
  return useSidebarWithFormRef({ component: DocumentSidebar });
}

interface DocumentSidebarProps extends SidebarWithFormRefProps {
  procedureId: string;
  documentId: string;
  isProcedureFinalized: boolean;
}

export enum DocumentSidebarMode {
  default,
  editInformation,
  editNote,
  reject,
}

function DocumentSidebar({
  documentId,
  procedureId,
  isProcedureFinalized,
  ...props
}: Readonly<DocumentSidebarProps>) {
  const patchCompleteDocumentFileUpload = usePatchCompleteDocumentFileUpload();
  const patchDocumentInformation = usePatchDocumentInformation();
  const patchDocumentNote = usePatchDocumentNote();
  const { openCancelDialog } = useConfirmationDialog();

  const [{ data: allDocuments }] = useSuspenseQueries({
    queries: [useGetAllDocuments(procedureId)],
  });
  const document = allDocuments.find((doc) => doc.id === documentId)!;

  const [mode, setMode] = useState<DocumentSidebarMode>(
    DocumentSidebarMode.default,
  );

  async function handleDocumentSubmit(values: DocumentFormValues) {
    const request: PatchCompleteDocumentFileUploadRequest = {
      id: document.id,
      files: values.files as Blob[],
      note: values.note,
    };

    await patchCompleteDocumentFileUpload.mutateAsync(request, {
      onSuccess: () => {
        props.onClose(true);
      },
    });
  }

  async function handleEditInformation(values: DocumentFormValues) {
    const request: PatchDocumentInformationRequest = {
      id: document.id,
      apiPatchDocumentInformationRequest: {
        documentTypeDe: values.documentTypeDe,
        documentTypeEn: values.documentTypeEn,
        helpTextDe: values.helpTextDe,
        helpTextEn: values.helpTextEn,
        mandatoryDocument: values.mandatoryDocument,
        uploadInCitizenPortal: values.uploadInCitizenPortal,
      },
    };

    await patchDocumentInformation.mutateAsync(request, {
      onSuccess: () => {
        setMode(DocumentSidebarMode.default);
      },
    });
  }

  async function handleEditNote(values: DocumentFormValues) {
    const request: PatchDocumentNoteRequest = {
      id: document.id,
      apiPatchDocumentNoteRequest: {
        note: values.note,
      },
    };

    await patchDocumentNote.mutateAsync(request, {
      onSuccess: () => {
        setMode(DocumentSidebarMode.default);
      },
    });
  }

  function handleCancel() {
    openCancelDialog({
      onConfirm: () => {
        props.onClose(true);
      },
      confirmLabel: "Verwerfen",
      title: "Hochgeladene Dateien verwerfen?",
      description:
        "Wenn Sie fortfahren, werden die von Ihnen hochgeladenen Dateien  nicht gespeichert.",
    });
  }

  const INITIAL_VALUES: DocumentFormValues = {
    documentTypeDe: document.documentTypeDe,
    documentTypeEn: document.documentTypeEn ?? "",
    helpTextDe: document.helpTextDe ?? "",
    helpTextEn: document.helpTextEn ?? "",
    mandatoryDocument: document.mandatoryDocument,
    uploadInCitizenPortal: document.uploadInCitizenPortal,
    files: [],
    note: document.note ?? "",
  };

  return (
    <>
      {mode === DocumentSidebarMode.default && (
        <DocumentForm
          title={document.documentTypeDe}
          onSubmit={handleDocumentSubmit}
          onCancel={handleCancel}
          onClose={props.onClose}
          onEditInformation={() => setMode(DocumentSidebarMode.editInformation)}
          onEditNote={() => setMode(DocumentSidebarMode.editNote)}
          onReject={() => setMode(DocumentSidebarMode.reject)}
          formRef={props.formRef}
          initialValues={INITIAL_VALUES}
          document={document}
          submitLabel="Schließen"
          isProcedureFinalized={isProcedureFinalized}
        />
      )}
      {mode === DocumentSidebarMode.editInformation && (
        <EditDocumentInformationForm
          title="Angaben bearbeiten"
          onSubmit={handleEditInformation}
          onCancel={() => {
            setMode(DocumentSidebarMode.default);
          }}
          formRef={props.formRef}
          initialValues={INITIAL_VALUES}
          submitLabel="Speichern"
        />
      )}
      {mode === DocumentSidebarMode.editNote && (
        <EditDocumentNoteForm
          title="Stichwörter bearbeiten"
          onSubmit={handleEditNote}
          onCancel={() => {
            setMode(DocumentSidebarMode.default);
          }}
          formRef={props.formRef}
          initialValues={INITIAL_VALUES}
          submitLabel="Speichern"
        />
      )}
      {mode === DocumentSidebarMode.reject && (
        <RejectDocumentForm
          onClose={props.onClose}
          formRef={props.formRef}
          document={document}
        />
      )}
    </>
  );
}
