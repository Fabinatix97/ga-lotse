/**
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { InfoOutlined } from "@mui/icons-material";
import { Divider, Stack, Typography } from "@mui/joy";
import { Formik, FormikHelpers } from "formik";
import { isDefined, isEmpty } from "remeda";

import { Alert, FileType, FormPlus, SubmitButton } from "@eshg/lib-portal";
import {
  ApiDocument,
  ApiDocumentStatus,
  PostDocumentCitizenRequest,
} from "@eshg/official-medical-service-api";

import { usePostDocumentCitizen } from "@/lib/businessModules/officialMedicalService/api/mutations/citizenAuthApi";
import { FileSheetIndicator } from "@/lib/businessModules/officialMedicalService/shared/file/FileSheetArray";
import { FileSheetArrayField } from "@/lib/businessModules/officialMedicalService/shared/file/FileSheetArrayField";
import {
  mapFileTypeForOmsFile,
  useMapToFrontendErrorMessage,
} from "@/lib/businessModules/officialMedicalService/shared/file/helpers";
import { useTranslation } from "@/lib/i18n/client";
import { byBreakpoint } from "@/lib/shared/breakpoints";
import {
  ContentSheet,
  ContentSheetTitle,
} from "@/lib/shared/components/layout/contentSheet";
import { useManualTranslation } from "@/lib/shared/hooks/useManualTranslation";

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
      data-testid="documents-form"
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

interface DocumentsCardFormValue {
  files: File[];
}

function DocumentSheet({
  document,
}: Readonly<{
  document: ApiDocument;
}>) {
  const { t } = useTranslation(["officialMedicalService/personalArea"]);
  const postDocumentCitizen = usePostDocumentCitizen();
  const errorMessageMapping = useMapToFrontendErrorMessage();

  const documentType = useManualTranslation({
    de: document.documentTypeDe,
    en: document.documentTypeEn,
  });

  const helpText = useManualTranslation({
    de: document.helpTextDe,
    en: document.helpTextEn,
  });

  async function handleSubmit(
    values: DocumentsCardFormValue,
    helpers: FormikHelpers<DocumentsCardFormValue>,
  ) {
    const request: PostDocumentCitizenRequest = {
      documentId: document.id,
      files: values.files,
    };
    await postDocumentCitizen.mutateAsync(request, {
      onSuccess: () => {
        // reset from to get rid of inputed files that will now be present
        //  in the initialFiles
        helpers.resetForm();
      },
      onError: (error) => {
        helpers.setFieldError("files", errorMessageMapping(error.message));
      },
    });
  }

  const status = document.documentStatus;
  const showAddRemoveButtons = getAddRemoveButtons(status);
  const indicator = getIndicator(status);

  return (
    <Formik<DocumentsCardFormValue>
      initialValues={{ files: [] }}
      onSubmit={handleSubmit}
    >
      {({ isSubmitting, values }) => {
        const showSubmit = values.files.length > 0 && showAddRemoveButtons;
        const label = isEmpty(helpText)
          ? documentType
          : `${documentType} - ${helpText}`;

        return (
          <FormPlus aria-label={label}>
            <FileSheetArrayField
              name="files"
              labels={{
                label: label,
                placeholder: t("documents.files.placeholder"),
                helperText: t("documents.files.helperText"),
                inputSummary: (count: number) =>
                  t("documents.files.inputSummary", {
                    count,
                  }),
                removeAllFiles: t("documents.files.deleteAll"),
                removeFile: (name: string) =>
                  t("documents.files.delete", {
                    name,
                  }),
              }}
              accept={[FileType.Jpeg, FileType.Png, FileType.Pdf]}
              indicator={indicator}
              initialFiles={document.files.map(mapFileTypeForOmsFile)}
              showUploadButton={showAddRemoveButtons}
              showRemoveButtons={showAddRemoveButtons}
              extraInfo={
                showSubmit ? (
                  <Typography
                    startDecorator={<InfoOutlined />}
                    textColor="danger.500"
                  >
                    {t("documents.files.saveDocumentsInfo")}
                  </Typography>
                ) : undefined
              }
              extraButton={
                showSubmit ? (
                  <SubmitButton variant="soft" submitting={isSubmitting}>
                    {t("documents.files.save", {
                      context: document.documentStatus,
                    })}
                  </SubmitButton>
                ) : undefined
              }
            />
          </FormPlus>
        );
      }}
    </Formik>
  );
}

function getAddRemoveButtons(status: ApiDocumentStatus) {
  if (isDefined(status)) {
    return (
      status === ApiDocumentStatus.Missing ||
      status === ApiDocumentStatus.Rejected
    );
  }
  return true;
}

function getIndicator(status: ApiDocumentStatus) {
  if (status === ApiDocumentStatus.Accepted) {
    return FileSheetIndicator.Success;
  }
  if (
    status === ApiDocumentStatus.Missing ||
    status === ApiDocumentStatus.Rejected
  ) {
    return FileSheetIndicator.Error;
  }
  if (status === ApiDocumentStatus.Submitted) {
    return FileSheetIndicator.Pending;
  }
  return undefined;
}
