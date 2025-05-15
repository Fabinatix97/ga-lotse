/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { Add, DeleteOutlined } from "@mui/icons-material";
import { Button, Grid, IconButton, Stack, Typography } from "@mui/joy";
import { FieldArray, useFormikContext } from "formik";
import { Fragment } from "react";

import { ApiCountryCode } from "@eshg/base-api";
import { FileField, useGetPublicConfig } from "@eshg/lib-employee-portal";
import {
  MedicalRegistryCreateProcedureFormValues,
  RequiredDocumentsFormValues,
} from "@eshg/lib-portal/businessModules/medicalRegistry/medicalRegistryCreateProcedureFormValues";
import { FileType } from "@eshg/lib-portal/components/formFields/file/types";
import { createFieldNameMapper } from "@eshg/lib-portal/helpers/form";
import { NestedFormProps } from "@eshg/lib-portal/types/form";
import { ApiTypeOfChange } from "@eshg/medical-registry-api";

import { requiredFieldMessage } from "@/lib/businessModules/medicalRegistry/components/procedures/create/MedicalRegistryCreateProcedureForm";

const MAX_OTHER_RELEVANT_DOCUMENTS = 3;

interface RequiredDocumentsFormProps extends NestedFormProps {
  enableOptionalDocuments: boolean;
}

export function RequiredDocumentsForm(props: RequiredDocumentsFormProps) {
  const values =
    useFormikContext<MedicalRegistryCreateProcedureFormValues>().values;

  const { data: config } = useGetPublicConfig();

  const fieldName = createFieldNameMapper<RequiredDocumentsFormValues>(
    props.name,
  );

  const otherRelevantDocuments =
    values.requiredDocumentsForm.otherRelevantDocuments;
  const nationality = values.personalInformationForm.nationality;
  const changeType = values.generalInformationForm.changeType;

  return (
    <>
      <Grid xxs={12}>
        <Typography level="h3" component="h2">
          Erforderliche Unterlagen
        </Typography>
      </Grid>

      {props.enableOptionalDocuments && (
        <>
          <Grid xxs={6}>
            <FileField
              name={fieldName("license")}
              label="Berufserlaubnisurkunde / Approbationsurkunde als JPG hochladen"
              accept={FileType.Jpeg}
              maxFileSize={config.maxFileSize}
              required={
                changeType === ApiTypeOfChange.NewRegistration ||
                changeType === ApiTypeOfChange.ReRegistration
                  ? requiredFieldMessage
                  : undefined
              }
            />
          </Grid>
          <Grid xxl={6} />
        </>
      )}

      <Grid xxs={6}>
        <FileField
          name={fieldName("identificationDocument")}
          label="Ausweis / Reisepass als JPG hochladen"
          accept={FileType.Jpeg}
          maxFileSize={config.maxFileSize}
          required={requiredFieldMessage}
        />
      </Grid>
      <Grid xxl={6} />

      {props.enableOptionalDocuments && nationality !== ApiCountryCode.De && (
        <>
          <Grid xxs={6}>
            <FileField
              name={fieldName("workPermit")}
              label="Arbeitserlaubnis als JPG hochladen"
              accept={FileType.Jpeg}
              maxFileSize={config.maxFileSize}
              required={requiredFieldMessage}
            />
          </Grid>
          <Grid xxl={6} />
        </>
      )}

      <FieldArray name={fieldName("otherRelevantDocuments")}>
        {({ push, remove }) => (
          <>
            {otherRelevantDocuments.map((values, index) => (
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
                      label="Sonstiges Dokument als JPG hochladen"
                      accept={FileType.Jpeg}
                      required={requiredFieldMessage}
                      maxFileSize={config.maxFileSize}
                    />
                    <IconButton
                      aria-label="Dokument löschen"
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
                </Grid>
                <Grid xxl={6} />
              </Fragment>
            ))}
            <Grid xxs={6}>
              {otherRelevantDocuments.length < MAX_OTHER_RELEVANT_DOCUMENTS && (
                <Button startDecorator={<Add />} onClick={() => push(null)}>
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
