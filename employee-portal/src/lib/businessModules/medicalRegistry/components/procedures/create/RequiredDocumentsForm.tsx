/**
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { ApiCountryCode } from "@eshg/employee-portal-api/base";
import { createFieldNameMapper } from "@eshg/lib-portal/helpers/form";
import {
  NestedFormProps,
  NullableFieldValue,
} from "@eshg/lib-portal/types/form";
import { Add, DeleteOutlined } from "@mui/icons-material";
import { Button, Grid, IconButton, Stack, Typography } from "@mui/joy";
import { FieldArray, useField } from "formik";
import { Fragment } from "react";

import { useServerConfig } from "@/lib/baseModule/api/queries/config";
import { requiredFieldMessage } from "@/lib/businessModules/medicalRegistry/components/procedures/create/MedicalRegistryCreateProcedureForm";
import { PersonalInformationFormValues } from "@/lib/businessModules/medicalRegistry/components/procedures/create/PersonalInformationForm";
import { FileField } from "@/lib/shared/components/formFields/file/FileField";
import { FileType } from "@/lib/shared/components/formFields/file/FileType";
import { validateFile } from "@/lib/shared/helpers/validators";

const MAX_OTHER_RELEVANT_DOCUMENTS = 3;

export interface RequiredDocumentsFormValues {
  license: NullableFieldValue<File>;
  identificationDocument: NullableFieldValue<File>;
  workPermit: NullableFieldValue<File>;
  otherRelevantDocuments: File[];
}

export function RequiredDocumentsForm(props: NestedFormProps) {
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

      <Grid xxs={6}>
        <FileField
          name={fieldName("license")}
          label={
            "Berufserlaubnisurkunde / Approbationsurkunde als JPG hochladen"
          }
          accept={FileType.Jpeg}
          validate={validateFile(FileType.Jpeg.extensions, config.maxFileSize)}
        />
      </Grid>
      <Grid xxl={6} />

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

      {nationality.value !== ApiCountryCode.De && (
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
    </>
  );
}
