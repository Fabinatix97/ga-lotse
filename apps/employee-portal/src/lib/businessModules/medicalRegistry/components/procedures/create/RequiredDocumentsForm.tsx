/**
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { Add, Delete } from "@mui/icons-material";
import { Box, Button, Grid, IconButton, Stack, Typography } from "@mui/joy";
import { useFormikContext } from "formik";
import { Fragment, useRef } from "react";

import { ApiCountryCode } from "@eshg/base-api";
import { FileField, useGetPublicConfig } from "@eshg/lib-employee-portal";
import {
  FieldArrayWithFocus,
  FileType,
  NestedFormProps,
  createFieldNameMapper,
} from "@eshg/lib-portal";
import {
  MedicalRegistryCreateProcedureFormValues,
  RequiredDocumentsFormValues,
} from "@eshg/medical-registry";
import { ApiTypeOfChange } from "@eshg/medical-registry-api";

import { requiredFieldMessage } from "@/lib/businessModules/medicalRegistry/components/procedures/create/MedicalRegistryCreateProcedureForm";

const MAX_OTHER_RELEVANT_DOCUMENTS = 3;

interface RequiredDocumentsFormProps extends NestedFormProps {
  enableOptionalDocuments: boolean;
}

export function RequiredDocumentsForm(props: RequiredDocumentsFormProps) {
  const fallbackInputElement = useRef<HTMLElement>(null);
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
    <Box display="contents" role="group" aria-labelledby="required-docs-title">
      <Grid xxs={12}>
        <Typography level="h3" component="h2" id="required-docs-title">
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
          ref={(el) => {
            fallbackInputElement.current = el;
          }}
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

      <FieldArrayWithFocus
        valueLength={otherRelevantDocuments.length}
        name={fieldName("otherRelevantDocuments")}
        fallbackFocusInputElement={fallbackInputElement.current ?? undefined}
      >
        {({ push, remove, setInputElementRef }) => (
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
                    role="group"
                    aria-label={`Weiteres Dokument ${index + 1}`}
                  >
                    <FileField
                      ref={(el) => {
                        if (el) {
                          setInputElementRef(el, index);
                        }
                      }}
                      name={`requiredDocumentsForm.otherRelevantDocuments.${index}`}
                      label="Sonstiges Dokument als JPG hochladen"
                      accept={FileType.Jpeg}
                      required={requiredFieldMessage}
                      maxFileSize={config.maxFileSize}
                    />
                    <IconButton
                      aria-label="Dokument löschen"
                      color="danger"
                      variant="plain"
                      sx={{ alignSelf: "flex-end" }}
                      onClick={() => remove(index)}
                    >
                      <Delete size="xl2" />
                    </IconButton>
                  </Stack>
                </Grid>
                <Grid xxl={6} />
              </Fragment>
            ))}
            <Grid xxs={6}>
              {otherRelevantDocuments.length < MAX_OTHER_RELEVANT_DOCUMENTS && (
                <Button
                  variant="plain"
                  startDecorator={<Add />}
                  onClick={() => push(null)}
                >
                  Weiteres Dokument hinzufügen
                </Button>
              )}
            </Grid>
            <Grid xxl={6} />
          </>
        )}
      </FieldArrayWithFocus>
    </Box>
  );
}
