/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import {
  SidebarWithFormRefProps,
  UseSidebarWithFormRefResult,
  useSidebarWithFormRef,
} from "@eshg/lib-employee-portal";
import { PostDocumentRequest } from "@eshg/official-medical-service-api";

import { usePostDocument } from "@/lib/businessModules/officialMedicalService/api/mutations/employeeOmsProcedureApi";
import {
  AddDocumentForm,
  AddDocumentFormValues,
} from "@/lib/businessModules/officialMedicalService/components/procedures/details/documents/AddDocumentForm";

export function useAddDocumentSidebar(): UseSidebarWithFormRefResult<AddDocumentSidebarProps> {
  return useSidebarWithFormRef({ component: AddDocumentSidebar });
}

interface AddDocumentSidebarProps extends SidebarWithFormRefProps {
  procedureId: string;
}

const INITIAL_VALUES: AddDocumentFormValues = {
  documentTypeDe: "",
  documentTypeEn: undefined,
  helpTextDe: "",
  helpTextEn: undefined,
  mandatoryDocument: false,
  uploadInCitizenPortal: false,
  files: [],
  note: "",
  upload: "later",
};

function AddDocumentSidebar(props: Readonly<AddDocumentSidebarProps>) {
  const postDocument = usePostDocument();

  async function handleSubmit(values: AddDocumentFormValues) {
    const request: PostDocumentRequest = {
      id: props.procedureId,
      postDocumentRequest: {
        documentTypeDe: values.documentTypeDe,
        documentTypeEn: values.documentTypeEn,
        helpTextDe: values.helpTextDe,
        helpTextEn: values.helpTextEn,
        mandatoryDocument: values.mandatoryDocument,
        uploadInCitizenPortal: values.uploadInCitizenPortal,
      },
      files: values.files as Blob[],
      note: values.note,
    };
    await postDocument.mutateAsync(request, {
      onSuccess: () => {
        props.onClose(true);
      },
    });
  }

  return (
    <AddDocumentForm
      title="Dokument anlegen"
      onSubmit={handleSubmit}
      onCancel={props.onClose}
      formRef={props.formRef}
      initialValues={INITIAL_VALUES}
      submitLabel="Anlegen"
    />
  );
}
