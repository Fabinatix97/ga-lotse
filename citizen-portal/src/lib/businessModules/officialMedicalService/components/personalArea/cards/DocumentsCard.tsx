/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { Alert } from "@eshg/lib-portal/components/Alert";
import { FileType } from "@eshg/lib-portal/components/formFields/file/types";
import {
  ApiDocument,
  ApiDocumentStatus,
  PostDocumentCitizenRequest,
} from "@eshg/official-medical-service-api";
import { Divider, Stack } from "@mui/joy";
import { Formik } from "formik";
import { isEmpty } from "remeda";

import { usePostDocumentCitizen } from "@/lib/businessModules/officialMedicalService/api/mutations/citizenAuthApi";
import { FileSheetArrayField } from "@/lib/businessModules/officialMedicalService/shared/file/FileSheetArrayField";
import { mapFileTypeForOmsFile } from "@/lib/businessModules/officialMedicalService/shared/file/helpers";
import { useManualTranslation } from "@/lib/businessModules/officialMedicalService/shared/useManualTranslation";
import { useTranslation } from "@/lib/i18n/client";
import { byBreakpoint } from "@/lib/shared/breakpoints";
import {
  ContentSheet,
  ContentSheetTitle,
} from "@/lib/shared/components/layout/contentSheet";

function DocumentAlert({ document }: { document: ApiDocument }) {
  const { t } = useTranslation(["officialMedicalService/personalArea"]);

  const isMissing = document.documentStatus === ApiDocumentStatus.Missing;
  const isRejected = document.documentStatus === ApiDocumentStatus.Rejected;
  const isSubmitted = document.documentStatus === ApiDocumentStatus.Submitted;

  return (
    <>
      {isMissing && (
        <Alert
          message={t("documents.alert.message", {
            context: ApiDocumentStatus.Missing,
          })}
          color="primary"
        />
      )}
      {isRejected && (
        <Alert
          title={t("documents.alert.title", {
            context: ApiDocumentStatus.Rejected,
          })}
          message={document.reasonForRejection}
          color="danger"
        />
      )}
      {isSubmitted && (
        <Alert
          title={t("documents.alert.title", {
            context: ApiDocumentStatus.Submitted,
          })}
          message={t("documents.alert.message", {
            context: ApiDocumentStatus.Submitted,
          })}
          color="warning"
        />
      )}
    </>
  );
}

export function DocumentsCard({
  documents,
}: Readonly<{
  documents: ApiDocument[];
}>) {
  const { t } = useTranslation(["officialMedicalService/personalArea"]);

  return (
    <ContentSheet
      data-testid={"documents-form"}
      sx={{ paddingX: byBreakpoint({ mobile: 0, desktop: 3 }) }}
    >
      <ContentSheetTitle sx={{ px: byBreakpoint({ mobile: 2, desktop: 0 }) }}>
        {t("documents.title")}
      </ContentSheetTitle>
      {documents.map((document, index) => (
        <Stack key={index} gap={3} data-testid="document-form">
          <DocumentAlert document={document} />
          <DocumentSheet key={document.id} document={document} />
          {index < documents.length - 1 && <Divider orientation="horizontal" />}
        </Stack>
      ))}
    </ContentSheet>
  );
}

function DocumentSheet({
  document,
}: Readonly<{
  document: ApiDocument;
}>) {
  const { t } = useTranslation(["officialMedicalService/personalArea"]);
  const postDocumentCitizen = usePostDocumentCitizen();

  const documentType = useManualTranslation({
    de: isEmpty(document.helpTextDe)
      ? document.documentTypeDe
      : `${document.documentTypeDe} - ${document.helpTextDe}`,
    en: isEmpty(document.helpTextEn)
      ? document.documentTypeEn
      : `${document.documentTypeEn} - ${document.helpTextEn}`,
  });

  async function handleFileUpload(files: unknown) {
    const request: PostDocumentCitizenRequest = {
      documentId: document.id,
      files: files as Blob[],
    };
    await postDocumentCitizen.mutateAsync(request);
  }

  return (
    <Formik
      initialValues={{ files: document.files.map(mapFileTypeForOmsFile) }}
      onSubmit={handleFileUpload}
    >
      <FileSheetArrayField
        name="files"
        labels={{
          label: documentType,
          placeholder: t("documents.files.placeholder"),
          helperText: t("documents.files.helperText"),
          inputSummary: (count: number) =>
            t("documents.files.inputSummary", {
              count,
            }),
          removeAllFiles: t("documents.files.deleteAll"),
          removeFile: t("documents.files.delete"),
        }}
        accept={[FileType.Jpeg, FileType.Png, FileType.Pdf]}
        mode={document.documentStatus}
        handleFileUpload={handleFileUpload}
      />
    </Formik>
  );
}
