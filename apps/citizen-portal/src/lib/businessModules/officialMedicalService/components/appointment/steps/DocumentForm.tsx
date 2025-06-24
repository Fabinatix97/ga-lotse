/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { FileType } from "@eshg/lib-portal";

import { FileSheetArrayField } from "@/lib/businessModules/officialMedicalService/shared/file/FileSheetArrayField";
import { FormSheetTitle } from "@/lib/businessModules/travelMedicine/components/shared/components/FormSheet";
import { useTranslation } from "@/lib/i18n/client";
import { byBreakpoint } from "@/lib/shared/breakpoints";
import { ContentSheet } from "@/lib/shared/components/layout/contentSheet";

export function DocumentForm() {
  const { t } = useTranslation(["officialMedicalService/appointment"]);

  return (
    <ContentSheet
      sx={{ paddingX: byBreakpoint({ mobile: 0, desktop: 3 }) }}
      data-testid="documents-form"
    >
      <FormSheetTitle
        requiredTitle={t("common.requiredTitle")}
        sx={{ paddingX: byBreakpoint({ mobile: 2, desktop: 0 }) }}
      >
        {t("documents.title")}
      </FormSheetTitle>
      <FileSheetArrayField
        name="files"
        labels={{
          label: t("documents.fileField.title"),
          placeholder: t("documents.fileField.placeholder"),
          helperText: t("documents.fileField.helperText"),
          inputSummary: (count: number) =>
            t("documents.fileField.inputSummary", {
              count,
            }),
          removeAllFiles: t("documents.fileField.deleteAll"),
          removeFile: (name: string) =>
            t("documents.fileField.delete", {
              name,
            }),
        }}
        accept={[FileType.Jpeg, FileType.Png, FileType.Pdf]}
        required={t("documents.fileField.required")}
      />
    </ContentSheet>
  );
}
