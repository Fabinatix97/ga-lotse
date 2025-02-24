/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { FileType } from "@eshg/lib-portal/components/formFields/file/FileType";

import { FileArrayField } from "@/lib/businessModules/officialMedicalService/shared/file/FileArrayField";
import { FormSheetTitle } from "@/lib/businessModules/travelMedicine/components/shared/components/FormSheet";
import { useTranslation } from "@/lib/i18n/client";
import { byBreakpoint } from "@/lib/shared/breakpoints";
import { ContentSheet } from "@/lib/shared/components/layout/contentSheet";

export function DocumentForm() {
  const { t } = useTranslation(["officialMedicalService/appointment"]);

  return (
    <ContentSheet sx={{ paddingX: byBreakpoint({ mobile: 0, desktop: 3 }) }}>
      <FormSheetTitle requiredTitle={t("common.requiredTitle")}>
        {t("documents.title")}
      </FormSheetTitle>
      <FileArrayField
        name="files"
        labels={{
          label: t("documents.fileField.title"),
          placeholder: t("documents.fileField.placeholder"),
          placeholderSelected: t("documents.fileField.placeholder"),
          helperText: t("documents.fileField.helperText"),
          inputSummary: (count: number) =>
            t("documents.fileField.inputSummary", {
              count: count,
            }),
          removeAllFiles: t("documents.fileField.deleteAll"),
          removeFile: t("documents.fileField.delete"),
        }}
        accept={[FileType.Jpeg, FileType.Png, FileType.Pdf]}
        required={t("documents.fileField.required")}
      />
    </ContentSheet>
  );
}
