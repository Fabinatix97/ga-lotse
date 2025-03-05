/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { FileType } from "@eshg/lib-portal/components/formFields/file/FileType";
import { ApiDocument } from "@eshg/official-medical-service-api";

import { FileSheetArray } from "@/lib/businessModules/officialMedicalService/shared/file/FileSheetArray";
import { useManualTranslation } from "@/lib/businessModules/officialMedicalService/shared/useManualTranslation";
import { FormSheetTitle } from "@/lib/businessModules/travelMedicine/components/shared/components/FormSheet";
import { useTranslation } from "@/lib/i18n/client";
import { byBreakpoint } from "@/lib/shared/breakpoints";
import { ContentSheet } from "@/lib/shared/components/layout/contentSheet";

export function ProcedureDocumentForm({
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
      <FormSheetTitle>{t("documents.title")}</FormSheetTitle>
      {documents.map((document) => (
        <DocumentSheet key={document.id} document={document} />
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

  const documentType = useManualTranslation({
    de: document.documentTypeDe,
    en: document.documentTypeEn,
  });

  const helpText = useManualTranslation({
    de: document.helpTextDe,
    en: document.helpTextEn,
  });

  return (
    <FileSheetArray
      files={document.files}
      accept={[FileType.Jpeg, FileType.Png, FileType.Pdf]}
      labels={{
        label: documentType,
        placeholder: t("documents.files.placeholder"),
        helperText: helpText ?? t("documents.files.helperText"),
        inputSummary: (count: number) =>
          t("documents.files.inputSummary", {
            count,
          }),
        removeAllFiles: t("documents.files.deleteAll"),
        removeFile: t("documents.files.delete"),
      }}
    />
  );
}
