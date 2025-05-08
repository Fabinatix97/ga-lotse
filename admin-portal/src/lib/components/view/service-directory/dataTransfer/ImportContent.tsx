/**
 * Copyright 2025 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { Typography } from "@mui/joy";
import { Formik, FormikHelpers } from "formik";
import { Dispatch, SetStateAction, useState } from "react";

import { FormPlus } from "@eshg/lib-portal/components/form/FormPlus";
import {
  ApiImportRequest,
  ApiImportRequestFromJSON,
} from "@eshg/service-directory-api";

import { useAdminApi } from "@/lib/api/clients";
import { SubmitButton } from "@/lib/components/button/SubmitButton";
import { FileField } from "@/lib/components/formFields/file/FileField";
import { SubHeader } from "@/lib/components/header/SubHeader";
import { useTranslation } from "@/lib/i18n/client";
import { FileType } from "@/lib/types/FileType";

interface ImportFormData {
  file: File | null;
}

interface ImportContentProps {
  isDbEmpty: boolean | undefined;
  setIsDbEmpty: Dispatch<SetStateAction<boolean | undefined>>;
}

export function ImportContent({
  isDbEmpty,
  setIsDbEmpty,
}: Readonly<ImportContentProps>) {
  const adminApi = useAdminApi();
  const { t } = useTranslation();
  const [hasValidationError, setHasValidationError] = useState<boolean>(false);

  async function handleSubmit(
    values: ImportFormData,
    { setSubmitting }: FormikHelpers<ImportFormData>,
  ) {
    if (values.file) {
      try {
        const fileContent = await values.file.text();
        const request: ApiImportRequest = ApiImportRequestFromJSON(
          JSON.parse(fileContent),
        );
        await adminApi.postImport(request);
        setHasValidationError(false);
        setIsDbEmpty(false);
      } catch (error) {
        setHasValidationError(true);
        // eslint-disable-next-line no-console
        console.error("Fetched error for postImport():", error);
      }
    }
    setSubmitting(false);
  }

  return (
    <>
      <Typography level="body-sm" fontStyle="italic">
        Es liegt noch keine Konfiguration vor.
      </Typography>
      <SubHeader header={t("importHeader")} />
      <Formik<ImportFormData>
        initialValues={{ file: null }}
        validateOnMount
        onSubmit={handleSubmit}
      >
        {({ isSubmitting, isValid }) => (
          <FormPlus>
            <FileField
              name="file"
              label={t("importConfigLabel")}
              placeholder={t("selectImportConfig")}
              accept={FileType.Json}
              required={t("fileRequired")}
            />
            {hasValidationError && (
              <Typography level="body-sm" color="warning">
                Das JSON-Dokument konnte nicht korrekt verarbeitet werden. Bitte
                auf Korrektheit prüfen.
              </Typography>
            )}
            <SubmitButton
              key="import-sd-config"
              submitting={isSubmitting}
              disabled={!isDbEmpty || !isValid}
            >
              {t("upload")}
            </SubmitButton>
          </FormPlus>
        )}
      </Formik>
    </>
  );
}
