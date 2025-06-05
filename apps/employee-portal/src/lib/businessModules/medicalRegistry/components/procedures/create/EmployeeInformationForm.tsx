/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { Grid, Typography } from "@mui/joy";
import { useFormikContext } from "formik";

import {
  BooleanRadioField,
  NestedFormProps,
  createFieldNameMapper,
} from "@eshg/lib-portal";
import {
  CHANGE_TYPE_NAMES,
  EmployeeInformationFormValues,
  MedicalRegistryCreateProcedureFormValues,
} from "@eshg/medical-registry";
import { ApiTypeOfChange } from "@eshg/medical-registry-api";

export function EmployeeInformationForm(props: NestedFormProps) {
  const values =
    useFormikContext<MedicalRegistryCreateProcedureFormValues>().values;
  const { employeesEmployed } = values.employeeInformationForm;

  const fieldName = createFieldNameMapper<EmployeeInformationFormValues>(
    props.name,
  );

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
            <Typography level="body-md" fontStyle="italic">
              Wenn Sie dieses Formular ausgefüllt und abgesendet haben, bitten
              wir Sie darum das Formular erneut zu öffnen und die Änderungsart „
              {CHANGE_TYPE_NAMES[ApiTypeOfChange.ChangeOfEmployees]}”
              auszuwählen. Dort tragen Sie bitte die notwendigen Angaben zu
              Ihren Mitarbeitern ein und senden das Formular ebenfalls ab.
            </Typography>
          </Grid>
          <Grid xxl={6} />
        </>
      )}
    </>
  );
}
