/**
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { useSuspenseQueries } from "@tanstack/react-query";
import { useState } from "react";

import {
  SidebarWithFormRefProps,
  UseSidebarWithFormRefResult,
  useConfirmationDialog,
  useSidebarWithFormRef,
} from "@eshg/lib-employee-portal";
import {
  ApiLanguage,
  PatchCompleteDocumentFileUploadRequest,
  PatchDocumentInformationRequest,
  PatchDocumentNoteRequest,
} from "@eshg/official-medical-service-api";

import {
  usePatchCompleteDocumentFileUpload,
  usePatchDocumentInformation,
  usePatchDocumentNote,
} from "@/lib/businessModules/officialMedicalService/api/mutations/omsDocumentApi";
import { useGetAllDocuments } from "@/lib/businessModules/officialMedicalService/api/queries/employeeOmsProcedureApi";
import {
  DocumentForm,
  DocumentFormInitialFocus,
  DocumentFormValues,
} from "@/lib/businessModules/officialMedicalService/components/procedures/details/documents/DocumentForm";
import { EditDocumentInformationForm } from "@/lib/businessModules/officialMedicalService/components/procedures/details/documents/EditDocumentInformationForm";
import { EditDocumentNoteForm } from "@/lib/businessModules/officialMedicalService/components/procedures/details/documents/EditDocumentNoteForm";
import { mapToApiLanguage, supportedLanguages } from "@/lib/i18n/language";

import { RejectDocumentForm } from "./RejectDocumentForm";

export function useDocumentSidebar(): UseSidebarWithFormRefResult<DocumentSidebarProps> {
  return useSidebarWithFormRef({ component: DocumentSidebar });
}

interface DocumentSidebarProps extends SidebarWithFormRefProps {
  procedureId: string;
  documentId: string;
  isProcedureFinalized: boolean;
}

type DocumentSidebarMode =
  | "default"
  | "editInformation"
  | "editNote"
  | "reject";

function DocumentSidebar({
  documentId,
  procedureId,
  isProcedureFinalized,
  ...props
}: Readonly<DocumentSidebarProps>) {
  const [initialDefaultFocus, setInitialDefaultFocus] =
    useState<DocumentFormInitialFocus>(null);

  const patchCompleteDocumentFileUpload = usePatchCompleteDocumentFileUpload();
  const patchDocumentInformation = usePatchDocumentInformation();
  const patchDocumentNote = usePatchDocumentNote();
  const { openCancelDialog } = useConfirmationDialog();

  const [{ data: allDocuments }] = useSuspenseQueries({
    queries: [useGetAllDocuments(procedureId)],
  });
  const document = allDocuments.find((doc) => doc.id === documentId)!;

  const [mode, setMode] = useState<DocumentSidebarMode>("default");

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
        documentType: supportedLanguages.reduce(
          (acc, lang) => {
            acc[mapToApiLanguage(lang)] = values.documentType[lang];
            return acc;
          },
          {} as Partial<Record<ApiLanguage, string>>,
        ),
        helpText: supportedLanguages.reduce(
          (acc, lang) => {
            acc[mapToApiLanguage(lang)] = values.helpText[lang];
            return acc;
          },
          {} as Partial<Record<ApiLanguage, string>>,
        ),
        mandatoryDocument: values.mandatoryDocument,
        uploadInCitizenPortal: values.uploadInCitizenPortal,
        labCode: values.labCode,
      },
    };

    await patchDocumentInformation.mutateAsync(request, {
      onSuccess: () => {
        setMode("default");
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
        setMode("default");
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
    documentType: supportedLanguages.reduce(
      (acc, lang) => {
        acc[lang] = document.documentType?.[mapToApiLanguage(lang)] ?? "";
        return acc;
      },
      { de: "" } as DocumentFormValues["documentType"],
    ),
    helpText: supportedLanguages.reduce(
      (acc, lang) => {
        acc[lang] = document.helpText?.[mapToApiLanguage(lang)] ?? "";
        return acc;
      },
      { de: "" } as DocumentFormValues["helpText"],
    ),
    mandatoryDocument: document.mandatoryDocument,
    uploadInCitizenPortal: document.uploadInCitizenPortal,
    files: [],
    note: document.note ?? "",
    labCode: document.labCode,
  };

  return (
    <>
      {mode === "default" && (
        <DocumentForm
          title={document.documentType.GERMAN!}
          formRef={props.formRef}
          initialValues={INITIAL_VALUES}
          document={document}
          submitLabel="Schließen"
          isProcedureFinalized={isProcedureFinalized}
          initialFocus={initialDefaultFocus}
          onSubmit={handleDocumentSubmit}
          onCancel={handleCancel}
          onClose={props.onClose}
          onEditInformation={() => setMode("editInformation")}
          onEditNote={() => setMode("editNote")}
          onReject={() => setMode("reject")}
        />
      )}
      {mode === "editInformation" && (
        <EditDocumentInformationForm
          title="Angaben bearbeiten"
          formRef={props.formRef}
          initialValues={INITIAL_VALUES}
          submitLabel="Speichern"
          onSubmit={handleEditInformation}
          onCancel={() => {
            setInitialDefaultFocus("DOCUMENT_DETAILS");
            setMode("default");
          }}
        />
      )}
      {mode === "editNote" && (
        <EditDocumentNoteForm
          title="Stichwörter bearbeiten"
          formRef={props.formRef}
          initialValues={INITIAL_VALUES}
          submitLabel="Speichern"
          onSubmit={handleEditNote}
          onCancel={() => {
            setInitialDefaultFocus("KEYWORD");
            setMode("default");
          }}
        />
      )}
      {mode === "reject" && (
        <RejectDocumentForm
          formRef={props.formRef}
          document={document}
          onClose={props.onClose}
        />
      )}
    </>
  );
}
