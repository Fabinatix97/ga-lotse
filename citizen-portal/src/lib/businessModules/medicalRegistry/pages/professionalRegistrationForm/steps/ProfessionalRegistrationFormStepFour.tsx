/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import {
  ApiCountryCode,
  ApiTypeOfChange,
} from "@eshg/citizen-portal-api/medicalRegistry";
import {
  EmployeeInformationFormValues,
  GeneralInformationFormValues,
  PersonalInformationFormValues,
  RequiredDocumentsFormValues,
} from "@eshg/lib-portal/businessModules/medicalRegistry/medicalRegistryCreateProcedureFormValues";
import { shouldEnable } from "@eshg/lib-portal/businessModules/medicalRegistry/sections";
import { FileType } from "@eshg/lib-portal/components/formFields/file/FileType";
import { validateFile } from "@eshg/lib-portal/helpers/validators";
import { Add, DeleteOutlined } from "@mui/icons-material";
import { Button, Grid, IconButton, Sheet, Stack, Typography } from "@mui/joy";
import { FieldArray, useField } from "formik";
import { Fragment } from "react";

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
  const requiredDocumentsForm =
    createFieldNameMapper<RequiredDocumentsFormValues>("requiredDocumentsForm");

  const [otherRelevantDocuments] = useField<File[]>(
    requiredDocumentsForm("otherRelevantDocuments"),
  );

  const employeeInformationForm =
    createFieldNameMapper<EmployeeInformationFormValues>(
      "employeeInformationForm",
    );

  const [employeesEmployed] = useField<boolean>(
    employeeInformationForm("employeesEmployed"),
  );

  const personalInformationForm =
    createFieldNameMapper<PersonalInformationFormValues>(
      "personalInformationForm",
    );

  const [nationality] = useField<ApiCountryCode>(
    personalInformationForm("nationality"),
  );

  const generalInformationForm =
    createFieldNameMapper<GeneralInformationFormValues>(
      "generalInformationForm",
    );

  const [changeType] = useField<ApiTypeOfChange>(
    generalInformationForm("changeType"),
  );

  const { t } = useTranslation([
    "medicalRegistry/professionalRegistrationForm",
  ]);

  return (
    <Stack spacing={3}>
      <ContentSheet>
        <Typography level="h2">
          {t("stepFour.contentSheetOne.pageTitle")}
        </Typography>
        <Sheet variant="soft">
          <TranslatedFileField
            name={requiredDocumentsForm("identificationDocument")}
            label={t("stepFour.contentSheetOne.label.identificationDocument")}
            accept={FileType.Jpeg}
            required={t(requiredFieldMessageKey)}
            validate={validateFile(FileType.Jpeg.extensions, MAX_FILE_SIZE)}
          />
        </Sheet>
        {shouldEnable("optionalDocuments", changeType.value) && (
          <Sheet variant="soft">
            <TranslatedFileField
              name={requiredDocumentsForm("license")}
              label={t("stepFour.contentSheetOne.label.license")}
              accept={FileType.Jpeg}
              validate={validateFile(FileType.Jpeg.extensions, MAX_FILE_SIZE)}
            />
          </Sheet>
        )}
        {shouldEnable("optionalDocuments", changeType.value) &&
          nationality.value !== ApiCountryCode.De && (
            <Sheet variant="soft">
              <TranslatedFileField
                name={requiredDocumentsForm("workPermit")}
                label={t("stepFour.contentSheetOne.label.workPermit")}
                accept={FileType.Jpeg}
                required={t(requiredFieldMessageKey)}
                validate={validateFile(FileType.Jpeg.extensions, MAX_FILE_SIZE)}
              />
            </Sheet>
          )}

        {shouldEnable("optionalDocuments", changeType.value) && (
          <FieldArray name={requiredDocumentsForm("otherRelevantDocuments")}>
            {({ push, remove }) => (
              <>
                {otherRelevantDocuments.value.map((values, index) => (
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
                          label={t(
                            "stepFour.contentSheetOne.label.otherRelevantDocument",
                          )}
                          accept={FileType.Jpeg}
                          required={t(requiredFieldMessageKey)}
                          validate={validateFile(
                            FileType.Jpeg.extensions,
                            MAX_FILE_SIZE,
                          )}
                        />
                      </Sheet>

                      <IconButton
                        aria-label="Dokument löschen"
                        color="neutral"
                        variant="outlined"
                        sx={{
                          marginTop: "27px",
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
                  {otherRelevantDocuments.value.length <
                    MAX_OTHER_RELEVANT_DOCUMENTS && (
                    <Button onClick={() => push(null)} startDecorator={<Add />}>
                      {t(
                        "stepFour.contentSheetOne.label.anotherRelevantDocument",
                      )}
                    </Button>
                  )}
                </Grid>
              </>
            )}
          </FieldArray>
        )}
      </ContentSheet>

      {shouldEnable("employees", changeType.value) &&
        employeesEmployed.value && (
          <ContentSheet>
            <Typography level="h2">
              {t("stepFour.contentSheetTwo.pageTitle")}
            </Typography>
            <Typography level="body-md">
              {t("stepFour.contentSheetTwo.hint")}
            </Typography>
            <Sheet variant="soft">
              <TranslatedFileField
                name={employeeInformationForm("employeesFile")}
                label={t("stepFour.contentSheetTwo.label.employeesFile")}
                accept={FileType.Jpeg}
                required={t(requiredFieldMessageKey)}
                validate={validateFile(FileType.Jpeg.extensions, MAX_FILE_SIZE)}
              />
            </Sheet>
          </ContentSheet>
        )}
    </Stack>
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
      required={props.required}
      placeholder={t("stepFour.fileField.placeholder")}
      placeholderSelected={t("stepFour.fileField.placeholderSelected")}
      fileInformationTranslation={{
        file: t("stepFour.fileField.file"),
        size: t("stepFour.fileField.size"),
      }}
      helperText={t("stepFour.fileField.helperText")}
      removeFile={t("stepFour.fileField.removeFile")}
      validate={props.validate}
    />
  );
}
