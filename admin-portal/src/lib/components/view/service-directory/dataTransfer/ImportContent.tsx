/**
 * Copyright 2024 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { ApiImportRequest } from "@eshg/admin-portal-api/serviceDirectory";
import { FormPlus } from "@eshg/lib-portal/components/form/FormPlus";
import { Typography } from "@mui/joy";
import { Formik, FormikHelpers } from "formik";
import { Dispatch, SetStateAction, useState } from "react";
import { z } from "zod";

import { useAdminApi } from "@/lib/api/clients";
import { SubmitButton } from "@/lib/components/button/SubmitButton";
import { FileField } from "@/lib/components/formFields/file/FileField";
import { SubHeader } from "@/lib/components/header/SubHeader";
import { useTranslation } from "@/lib/i18n/client";
import { FileType } from "@/lib/types/FileType";

const ApiAdminActorTypeSchema = z.enum(["GM", "FM", "LSD", "WEB", "ZA", "ZR"]);

const ApiAdminCertificateSchema = z.object({
  signatory: z.string(),
  signature: z.string(),
  value: z.string(),
});

const ApiAdminActorMetadataSchema = z.object({
  id: z.string(),
  content: z.string().optional(),
  changedAt: z.string().datetime().pipe(z.coerce.date()),
});

const ApiActorSchema = z.object({
  active: z.boolean(),
  commonName: z.string(),
  currentCertificate: ApiAdminCertificateSchema.optional(),
  id: z.string(),
  manualCertificate: z.boolean(),
  metadata: ApiAdminActorMetadataSchema.optional(),
  networkId: z.string().optional(),
  previousCertificate: ApiAdminCertificateSchema.optional(),
  readableName: z.string(),
  type: ApiAdminActorTypeSchema,
});

const ApiAdminOrgUnitTypeSchema = z.enum(["GA", "LA", "ZD"]);
const ApiAdminFederalStateSchema = z.enum([
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

const ApiOrgUnitSchema = z.object({
  active: z.boolean(),
  actors: z.array(ApiActorSchema),
  id: z.string(),
  readableName: z.string(),
  type: ApiAdminOrgUnitTypeSchema,
  federalState: ApiAdminFederalStateSchema,
});

const ApiAdminActorSelectorSchema = z.object({
  actorName: z.string().optional(),
  actorType: z.string().optional(),
  federalState: z.string().optional(),
  orgUnitName: z.string().optional(),
  orgUnitType: z.string().optional(),
});

const ApiAdminRuleSchema = z.object({
  active: z.boolean(),
  client: ApiAdminActorSelectorSchema,
  description: z.string().optional(),
  id: z.string(),
  server: ApiAdminActorSelectorSchema,
});

const ApiImportRequestSchema = z.object({
  orgUnits: z.array(ApiOrgUnitSchema).transform((arr) => new Set(arr)),
  rules: z.array(ApiAdminRuleSchema).transform((arr) => new Set(arr)),
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
  const [zodError, setZodError] = useState<boolean>(false);

  async function handleSubmit(
    values: ImportFormData,
    { setSubmitting }: FormikHelpers<ImportFormData>,
  ) {
    if (values.file) {
      try {
        const fileContent = await values.file.text();
        const parsed = ApiImportRequestSchema.safeParse(
          JSON.parse(fileContent),
        );
        if (parsed.success) {
          setZodError(false);
          const request: ApiImportRequest = parsed.data;
          await adminApi.postImport(request);
          setIsDbEmpty(false);
        } else {
          setZodError(true);
          // eslint-disable-next-line no-console
          console.error(
            "Parsed data does not match ApiImportRequest type:",
            parsed.error.errors,
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
            {zodError && (
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
