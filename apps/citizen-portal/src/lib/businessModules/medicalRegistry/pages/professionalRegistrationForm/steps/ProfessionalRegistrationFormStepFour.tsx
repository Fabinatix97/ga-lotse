/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { Add, DeleteOutlined } from "@mui/icons-material";
import { Button, Grid, IconButton, Sheet, Stack, Typography } from "@mui/joy";
import { useFormikContext } from "formik";
import { Fragment } from "react";

import { FieldArrayWithFocus as FieldArray, FileType } from "@eshg/lib-portal";
import {
  MedicalRegistryCreateProcedureFormValues,
  RequiredDocumentsFormValues,
  shouldEnableSection,
} from "@eshg/medical-registry";
import { ApiCountryCode, ApiTypeOfChange } from "@eshg/medical-registry-api";

import { requiredFieldMessageKey } from "@/lib/businessModules/medicalRegistry/pages/professionalRegistrationForm/ProfessionalRegistrationForm";
import { useTranslation } from "@/lib/i18n/client";
import {
  FileField,
  FileFieldProps,
} from "@/lib/shared/components/form/file/FileField";
import { ContentSheet } from "@/lib/shared/components/layout/contentSheet";
import { createFieldNameMapper } from "@/lib/shared/helpers/form";

const MAX_OTHER_RELEVANT_DOCUMENTS = 3;
const BYTES_PER_MB = 1048576;
const MAX_FILE_SIZE = 25 * BYTES_PER_MB;

export function ProfessionalRegistrationFormStepFour() {
  const values =
    useFormikContext<MedicalRegistryCreateProcedureFormValues>().values;

  const changeType = values.generalInformationForm.changeType;
  const nationality = values.personalInformationForm.nationality;
  const otherRelevantDocuments =
    values.requiredDocumentsForm.otherRelevantDocuments;

  const requiredDocumentsForm =
    createFieldNameMapper<RequiredDocumentsFormValues>("requiredDocumentsForm");

  const { t } = useTranslation([
    "medicalRegistry/professionalRegistrationForm",
  ]);

  return (
    <ContentSheet>
      <Typography level="h2">{t("stepFour.pageTitle")}</Typography>
      <Sheet variant="soft">
        <TranslatedFileField
          name={requiredDocumentsForm("identificationDocument")}
          label={t("stepFour.label.identificationDocument")}
          accept={FileType.Jpeg}
          maxFileSize={MAX_FILE_SIZE}
          required={t(requiredFieldMessageKey)}
        />
      </Sheet>
      {shouldEnableSection("optionalDocuments", changeType) && (
        <Sheet variant="soft">
          <TranslatedFileField
            name={requiredDocumentsForm("license")}
            label={t("stepFour.label.license")}
            accept={FileType.Jpeg}
            maxFileSize={MAX_FILE_SIZE}
            required={
              changeType === ApiTypeOfChange.NewRegistration ||
              changeType === ApiTypeOfChange.ReRegistration
                ? t(requiredFieldMessageKey)
                : undefined
            }
          />
        </Sheet>
      )}
      {shouldEnableSection("optionalDocuments", changeType) &&
        nationality !== ApiCountryCode.De && (
          <Sheet variant="soft">
            <TranslatedFileField
              name={requiredDocumentsForm("workPermit")}
              label={t("stepFour.label.workPermit")}
              accept={FileType.Jpeg}
              maxFileSize={MAX_FILE_SIZE}
              required={t(requiredFieldMessageKey)}
            />
          </Sheet>
        )}

      <FieldArray
        valueLength={otherRelevantDocuments.length}
        name={requiredDocumentsForm("otherRelevantDocuments")}
      >
        {({ push, remove }) => (
          <>
            {otherRelevantDocuments.map((values, index) => (
              <Fragment key={index}>
                <Stack
                  direction="row"
                  gap={2}
                  alignItems="flex-start"
                  sx={{
                    ">:first-child": { flexGrow: 1 },
                  }}
                >
                  <Sheet variant="soft">
                    <TranslatedFileField
                      name={`requiredDocumentsForm.otherRelevantDocuments.${index}`}
                      label={t("stepFour.label.otherRelevantDocument")}
                      accept={FileType.Jpeg}
                      maxFileSize={MAX_FILE_SIZE}
                      required={t(requiredFieldMessageKey)}
                    />
                  </Sheet>

                  <IconButton
                    aria-label={t("stepFour.label.deleteDocument")}
                    color="neutral"
                    variant="outlined"
                    sx={{
                      alignSelf: "center",
                      "--Icon-fontSize": (theme) => theme.fontSize.xl,
                    }}
                    onClick={() => remove(index)}
                  >
                    <DeleteOutlined />
                  </IconButton>
                </Stack>
              </Fragment>
            ))}
            <Grid xxs={6}>
              {otherRelevantDocuments.length < MAX_OTHER_RELEVANT_DOCUMENTS && (
                <Button startDecorator={<Add />} onClick={() => push(null)}>
                  {t("stepFour.label.anotherRelevantDocument")}
                </Button>
              )}
            </Grid>
          </>
        )}
      </FieldArray>
    </ContentSheet>
  );
}

function TranslatedFileField(
  props: Omit<
    FileFieldProps,
    | "placeholder"
    | "placeholderSelected"
    | "fileInformationTranslation"
    | "helperText"
    | "removeFile"
    | "validate"
  >,
) {
  const { t } = useTranslation([
    "medicalRegistry/professionalRegistrationForm",
  ]);

  return (
    <FileField
      name={props.name}
      label={props.label}
      accept={props.accept}
      maxFileSize={props.maxFileSize}
      required={props.required}
      placeholder={t("stepFour.fileField.placeholder")}
      placeholderSelected={t("stepFour.fileField.placeholderSelected")}
      fileInformationTranslation={{
        file: t("stepFour.fileField.file"),
        size: t("stepFour.fileField.size"),
      }}
      helperText={t("stepFour.fileField.helperText")}
      removeFile={t("stepFour.fileField.removeFile")}
    />
  );
}
