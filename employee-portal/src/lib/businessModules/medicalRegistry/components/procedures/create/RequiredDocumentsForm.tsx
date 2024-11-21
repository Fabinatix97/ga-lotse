/**
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { ApiCountryCode } from "@eshg/employee-portal-api/base";
import { createFieldNameMapper } from "@eshg/lib-portal/helpers/form";
import { NestedFormProps } from "@eshg/lib-portal/types/form";
import { Grid, Typography } from "@mui/joy";
import { useField } from "formik";

import { useServerConfig } from "@/lib/baseModule/api/queries/config";
import { requiredFieldMessage } from "@/lib/businessModules/medicalRegistry/components/procedures/create/MedicalRegistryCreateProcedureForm";
import { PersonalInformationFormValues } from "@/lib/businessModules/medicalRegistry/components/procedures/create/PersonalInformationForm";
import { FileField } from "@/lib/shared/components/formFields/file/FileField";
import { FileType } from "@/lib/shared/components/formFields/file/FileType";
import { validateFile } from "@/lib/shared/helpers/validators";

export interface RequiredDocumentsFormValues {
  license: File | null;
  identificationDocument: File | null;
  workPermit: File | null;
}

export function RequiredDocumentsForm(props: NestedFormProps) {
  const { data: config } = useServerConfig();

  const fieldName = createFieldNameMapper<RequiredDocumentsFormValues>(
    props.name,
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
    </>
  );
}
