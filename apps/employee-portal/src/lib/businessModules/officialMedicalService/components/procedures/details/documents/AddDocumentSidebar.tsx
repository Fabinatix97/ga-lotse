/**
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import {
  SidebarWithFormRefProps,
  UseSidebarWithFormRefResult,
  useSidebarWithFormRef,
} from "@eshg/lib-employee-portal";
import {
  ApiLanguage,
  PostDocumentRequest,
} from "@eshg/official-medical-service-api";

import { usePostDocument } from "@/lib/businessModules/officialMedicalService/api/mutations/employeeOmsProcedureApi";
import {
  AddDocumentForm,
  AddDocumentFormValues,
} from "@/lib/businessModules/officialMedicalService/components/procedures/details/documents/AddDocumentForm";
import { mapToApiLanguage, supportedLanguages } from "@/lib/i18n/language";

export function useAddDocumentSidebar(): UseSidebarWithFormRefResult<AddDocumentSidebarProps> {
  return useSidebarWithFormRef({ component: AddDocumentSidebar });
}

interface AddDocumentSidebarProps extends SidebarWithFormRefProps {
  procedureId: string;
}

const INITIAL_VALUES: AddDocumentFormValues = {
  documentType: {
    de: "",
  },
  helpText: {},
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
      formRef={props.formRef}
      initialValues={INITIAL_VALUES}
      submitLabel="Anlegen"
      onSubmit={handleSubmit}
      onCancel={props.onClose}
    />
  );
}
