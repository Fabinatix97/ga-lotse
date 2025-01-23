/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { ApiCountryCode } from "@eshg/base-api";
import {
  PersonalInformationFormValues,
  RequiredDocumentsFormValues,
} from "@eshg/lib-portal/businessModules/medicalRegistry/medicalRegistryCreateProcedureFormValues";
import { FileType } from "@eshg/lib-portal/components/formFields/file/FileType";
import { createFieldNameMapper } from "@eshg/lib-portal/helpers/form";
import { validateFile } from "@eshg/lib-portal/helpers/validators";
import { NestedFormProps } from "@eshg/lib-portal/types/form";
import { Add, DeleteOutlined } from "@mui/icons-material";
import { Button, Grid, IconButton, Stack, Typography } from "@mui/joy";
import { FieldArray, useField } from "formik";
import { Fragment } from "react";

import { useServerConfig } from "@/lib/baseModule/api/queries/config";
import { requiredFieldMessage } from "@/lib/businessModules/medicalRegistry/components/procedures/create/MedicalRegistryCreateProcedureForm";
import { FileField } from "@/lib/shared/components/formFields/file/FileField";

const MAX_OTHER_RELEVANT_DOCUMENTS = 3;

interface RequiredDocumentsFormProps extends NestedFormProps {
  enableOptionalDocuments: boolean;
}

export function RequiredDocumentsForm(props: RequiredDocumentsFormProps) {
  const { data: config } = useServerConfig();

  const fieldName = createFieldNameMapper<RequiredDocumentsFormValues>(
    props.name,
  );

  const [otherRelevantDocuments] = useField<File[]>(
    fieldName("otherRelevantDocuments"),
  );

  const personalInformationFormFieldName =
    createFieldNameMapper<PersonalInformationFormValues>(
      "personalInformationForm",
    );

  const [nationality] = useField<ApiCountryCode>(
    personalInformationFormFieldName("nationality"),
  );

  return (
    <>
      <Grid xxs={12}>
        <Typography level="h3">Erforderliche Unterlagen</Typography>
      </Grid>

      {props.enableOptionalDocuments && (
        <>
          <Grid xxs={6}>
            <FileField
              name={fieldName("license")}
              label={
                "Berufserlaubnisurkunde / Approbationsurkunde als JPG hochladen"
              }
              accept={FileType.Jpeg}
              validate={validateFile(
                FileType.Jpeg.extensions,
                config.maxFileSize,
              )}
            />
          </Grid>
          <Grid xxl={6} />
        </>
      )}

      <Grid xxs={6}>
        <FileField
          name={fieldName("identificationDocument")}
          label={"Ausweis / Reisepass als JPG hochladen"}
          accept={FileType.Jpeg}
          required={requiredFieldMessage}
          validate={validateFile(FileType.Jpeg.extensions, config.maxFileSize)}
        />
      </Grid>
      <Grid xxl={6} />

      {props.enableOptionalDocuments &&
        nationality.value !== ApiCountryCode.De && (
          <>
            <Grid xxs={6}>
              <FileField
                name={fieldName("workPermit")}
                label={"Arbeitserlaubnis als JPG hochladen"}
                accept={FileType.Jpeg}
                required={requiredFieldMessage}
                validate={validateFile(
                  FileType.Jpeg.extensions,
                  config.maxFileSize,
                )}
              />
            </Grid>
            <Grid xxl={6} />
          </>
        )}

      {props.enableOptionalDocuments && (
        <FieldArray name={fieldName("otherRelevantDocuments")}>
          {({ push, remove }) => (
            <>
              {otherRelevantDocuments.value.map((values, index) => (
                <Fragment key={index}>
                  <Grid xxs={6}>
                    <Stack
                      direction="row"
                      gap={2}
                      alignItems="flex-start"
                      sx={{
                        ">:first-child": { flexGrow: 1 },
                      }}
                    >
                      <FileField
                        name={`requiredDocumentsForm.otherRelevantDocuments.${index}`}
                        label={"Sonstiges Dokument als JPG hochladen"}
                        accept={FileType.Jpeg}
                        required={requiredFieldMessage}
                        validate={validateFile(
                          FileType.Jpeg.extensions,
                          config.maxFileSize,
                        )}
                      />
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
                  </Grid>
                  <Grid xxl={6} />
                </Fragment>
              ))}
              <Grid xxs={6}>
                {otherRelevantDocuments.value.length <
                  MAX_OTHER_RELEVANT_DOCUMENTS && (
                  <Button onClick={() => push(null)} startDecorator={<Add />}>
                    Weiteres Dokument hinzufügen
                  </Button>
                )}
              </Grid>
              <Grid xxl={6} />
            </>
          )}
        </FieldArray>
      )}
    </>
  );
}
