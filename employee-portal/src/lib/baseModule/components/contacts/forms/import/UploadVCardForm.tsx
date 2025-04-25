/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { Formik } from "formik";
import { Ref } from "react";

import {
  FileField,
  MultiFormButtonBar,
  SidebarActions,
  SidebarContent,
  SidebarForm,
  SidebarFormHandle,
} from "@eshg/lib-employee-portal";
import { FileType } from "@eshg/lib-portal/components/formFields/file/types";

interface UploadForm {
  file: File | null;
}

interface UploadVCardFormProps {
  sidebarFormRef: Ref<SidebarFormHandle>;
  onSubmit: (file: File) => Promise<void>;
  onClose: () => void;
}

export function UploadVCardForm({
  sidebarFormRef,
  onSubmit,
  onClose,
}: UploadVCardFormProps) {
  const initialValues: UploadForm = { file: null };

  return (
    <Formik
      initialValues={initialValues}
      onSubmit={async (values) => {
        await onSubmit(values.file!);
      }}
    >
      {({ isSubmitting }) => (
        <SidebarForm ref={sidebarFormRef}>
          <SidebarContent title={"Kontakt importieren"}>
            <FileField
              name={"file"}
              label={"Wählen Sie eine Datei aus"}
              accept={FileType.Vcf}
              required={"Bitte eine vCard Datei hochladen"}
            />
          </SidebarContent>
          <SidebarActions>
            <MultiFormButtonBar
              submitLabel={"Importieren"}
              submitting={isSubmitting}
              onCancel={onClose}
            />
          </SidebarActions>
        </SidebarForm>
      )}
    </Formik>
  );
}
