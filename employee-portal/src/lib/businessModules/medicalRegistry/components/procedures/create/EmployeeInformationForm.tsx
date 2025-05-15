/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { Grid, Typography } from "@mui/joy";
import { useFormikContext } from "formik";

import { FileField, useGetPublicConfig } from "@eshg/lib-employee-portal";
import {
  EmployeeInformationFormValues,
  MedicalRegistryCreateProcedureFormValues,
} from "@eshg/lib-portal/businessModules/medicalRegistry/medicalRegistryCreateProcedureFormValues";
import { BooleanRadioField } from "@eshg/lib-portal/components/formFields/BooleanRadioField";
import { FileType } from "@eshg/lib-portal/components/formFields/file/types";
import { createFieldNameMapper } from "@eshg/lib-portal/helpers/form";
import { NestedFormProps } from "@eshg/lib-portal/types/form";

import { requiredFieldMessage } from "@/lib/businessModules/medicalRegistry/components/procedures/create/MedicalRegistryCreateProcedureForm";

export function EmployeeInformationForm(props: NestedFormProps) {
  const values =
    useFormikContext<MedicalRegistryCreateProcedureFormValues>().values;
  const { data: config } = useGetPublicConfig();

  const fieldName = createFieldNameMapper<EmployeeInformationFormValues>(
    props.name,
  );

  const employeesEmployed = values.employeeInformationForm.employeesEmployed;

  return (
    <>
      <Grid xxs={12}>
        <Typography level="h3" component="h2">
          Angaben zu Mitarbeiter:innen
        </Typography>
      </Grid>
      <Grid xxs={12}>
        <BooleanRadioField
          name={fieldName("employeesEmployed")}
          label="Beschäftigung von Mitarbeiter:innen"
        />
      </Grid>

      {employeesEmployed && (
        <>
          <Grid xxs={6}>
            <Typography level="body-md">
              Laden Sie eine formlose Liste im JPG-Format hoch, die für jede:n
              Mitarbeiter:in folgende Information enthält: Name, Vorname,
              Geburtsdatum, Berufsbezeichnung, Beginn und Ende der Tätigkeit.
              Die Liste sollte alle Mitarbeiter:innen enthalten, auch die aus
              möglichen weiteren Praxen.
            </Typography>
          </Grid>
          <Grid xxl={6} />

          <Grid xxs={6}>
            <FileField
              name={fieldName("employeesFile")}
              label="Mitarbeiter:innen-Liste als JPG hochladen"
              accept={FileType.Jpeg}
              required={requiredFieldMessage}
              maxFileSize={config.maxFileSize}
            />
          </Grid>
        </>
      )}
    </>
  );
}
