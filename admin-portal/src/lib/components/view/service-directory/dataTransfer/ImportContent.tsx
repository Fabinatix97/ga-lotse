/**
 * Copyright 2025 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { ApiImportRequest } from "@eshg/admin-portal-api/serviceDirectory";
import { FormPlus } from "@eshg/lib-portal/components/form/FormPlus";
import { Typography } from "@mui/joy";
import { Formik, FormikHelpers } from "formik";
import { Dispatch, SetStateAction, useState } from "react";
import * as v from "valibot";

import { useAdminApi } from "@/lib/api/clients";
import { SubmitButton } from "@/lib/components/button/SubmitButton";
import { FileField } from "@/lib/components/formFields/file/FileField";
import { SubHeader } from "@/lib/components/header/SubHeader";
import { useTranslation } from "@/lib/i18n/client";
import { FileType } from "@/lib/types/FileType";

const ApiAdminActorTypeSchema = v.picklist([
  "GM",
  "FM",
  "LSD",
  "WEB",
  "ZA",
  "ZR",
]);

const ApiAdminCertificateSchema = v.object({
  signatory: v.string(),
  signature: v.string(),
  value: v.string(),
});

const ApiAdminActorMetadataSchema = v.object({
  id: v.string(),
  content: v.optional(v.string()),
  changedAt: v.pipe(
    v.string(),
    v.isoDateTime(),
    v.transform((value) => new Date(value)),
  ),
});

const ApiActorSchema = v.object({
  active: v.boolean(),
  commonName: v.string(),
  currentCertificate: v.optional(ApiAdminCertificateSchema),
  id: v.string(),
  manualCertificate: v.boolean(),
  metadata: v.optional(ApiAdminActorMetadataSchema),
  networkId: v.optional(v.string()),
  previousCertificate: v.optional(ApiAdminCertificateSchema),
  readableName: v.string(),
  type: ApiAdminActorTypeSchema,
});

const ApiAdminOrgUnitTypeSchema = v.picklist(["GA", "LA", "ZD"]);
const ApiAdminFederalStateSchema = v.picklist([
  "BW",
  "BY",
  "BE",
  "BB",
  "HB",
  "HH",
  "HE",
  "MV",
  "NI",
  "NW",
  "RP",
  "SL",
  "SN",
  "ST",
  "SH",
  "TH",
  "DE",
]);

const ApiOrgUnitSchema = v.object({
  active: v.boolean(),
  actors: v.array(ApiActorSchema),
  id: v.string(),
  readableName: v.string(),
  type: ApiAdminOrgUnitTypeSchema,
  federalState: ApiAdminFederalStateSchema,
});

const ApiAdminActorSelectorSchema = v.object({
  actorName: v.optional(v.string()),
  actorType: v.optional(v.string()),
  federalState: v.optional(v.string()),
  orgUnitName: v.optional(v.string()),
  orgUnitType: v.optional(v.string()),
});

const ApiAdminRuleSchema = v.object({
  active: v.boolean(),
  client: ApiAdminActorSelectorSchema,
  description: v.optional(v.string()),
  id: v.string(),
  server: ApiAdminActorSelectorSchema,
});

const ApiImportRequestSchema = v.object({
  orgUnits: v.pipe(
    v.array(ApiOrgUnitSchema),
    v.transform((arr) => new Set(arr)),
  ),
  rules: v.pipe(
    v.array(ApiAdminRuleSchema),
    v.transform((arr) => new Set(arr)),
  ),
});

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
        const parsed = v.safeParse(
          ApiImportRequestSchema,
          JSON.parse(fileContent),
        );
        if (parsed.success) {
          setHasValidationError(false);
          const request: ApiImportRequest = parsed.output;
          await adminApi.postImport(request);
          setIsDbEmpty(false);
        } else {
          setHasValidationError(true);
          // eslint-disable-next-line no-console
          console.error(
            "Parsed data does not match ApiImportRequest type:",
            parsed.issues,
          );
        }
      } catch (error) {
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
        onSubmit={handleSubmit}
        validateOnMount
      >
        {({ isSubmitting, isValid }) => (
          <FormPlus>
            <FileField
              name={"file"}
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
              submitting={isSubmitting}
              disabled={!isDbEmpty || !isValid}
              key="import-sd-config"
            >
              {t("upload")}
            </SubmitButton>
          </FormPlus>
        )}
      </Formik>
    </>
  );
}
