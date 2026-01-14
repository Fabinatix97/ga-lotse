/**
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { Add, Delete } from "@mui/icons-material";
import { Box, Button, Grid, IconButton, Stack, Typography } from "@mui/joy";
import { useFormikContext } from "formik";
import { Fragment } from "react";

import {
  DateField,
  FieldArrayWithFocus,
  InputField,
  NestedFormProps,
  SelectField,
  buildEnumOptions,
  createFieldNameMapper,
  useValidateLength,
  useValidatePastOrTodayDate,
  validateDateOfBirth,
  validatePipe,
} from "@eshg/lib-portal";
import {
  EMPLOYEE_CHANGE_TYPE_NAMES,
  EmployeeChangeEntry,
  EmployeesFormValues,
  MedicalRegistryCreateProcedureFormValues,
  buildEmptyEmployeeChangeEntry,
} from "@eshg/medical-registry";

import { requiredFieldMessage } from "@/lib/businessModules/medicalRegistry/components/procedures/create/MedicalRegistryCreateProcedureForm";

const MAX_EMPLOYEES = 30;

export function EmployeesForm(props: NestedFormProps) {
  const values =
    useFormikContext<MedicalRegistryCreateProcedureFormValues>().values;
  const { employees } = values.employeesForm;
  const canDeleteEmployeeEntries = employees.length > 1;
  const canAddEmployeeEntries = employees.length < MAX_EMPLOYEES;

  const validateLength = useValidateLength();
  const validatePastOrTodayDate = useValidatePastOrTodayDate();

  const fieldName = createFieldNameMapper<EmployeesFormValues>(props.name);
  const employeeFieldName = createFieldNameMapper<EmployeeChangeEntry>();

  return (
    <Box display="contents" role="group" aria-labelledby="employee-info-title">
      <Grid xxs={12}>
        <Typography level="h3" component="h2" id="employee-info-title">
          Angaben zu Mitarbeiter:innen
        </Typography>
      </Grid>
      <FieldArrayWithFocus
        name={fieldName("employees")}
        valueLength={employees.length}
      >
        {({ push, remove, setInputElementRef }) => (
          <>
            {employees.map((_values, index) => (
              <Fragment key={index}>
                <Grid
                  xxs={6}
                  role="group"
                  aria-label={`Mitarbeiter:in ${index + 1}`}
                >
                  <Stack direction={{ xxs: "column", md: "row" }} gap={2}>
                    <Stack
                      direction="row"
                      flexWrap={{ xxs: "wrap", md: "nowrap" }}
                      flex={1}
                      gap="inherit"
                      alignItems="flex-start"
                    >
                      <InputField
                        ref={(el) => setInputElementRef(el, index)}
                        name={`${fieldName("employees")}.${index}.${employeeFieldName("firstName")}`}
                        label="Vorname"
                        required={requiredFieldMessage}
                        validate={validateLength(1, 80)}
                        sx={{ flex: 1, minWidth: 216, width: 0 }}
                      />
                      <InputField
                        name={`${fieldName("employees")}.${index}.${employeeFieldName("lastName")}`}
                        label="Nachname"
                        required={requiredFieldMessage}
                        validate={validateLength(1, 120)}
                        sx={{ flex: 1, minWidth: 216, width: 0 }}
                      />
                    </Stack>
                    <Stack
                      direction="row"
                      flexWrap={{ xxs: "wrap", md: "nowrap" }}
                      flex={1}
                      gap="inherit"
                      alignItems="flex-start"
                    >
                      <DateField
                        name={`${fieldName("employees")}.${index}.${employeeFieldName("dateOfBirth")}`}
                        label="Geburtsdatum"
                        required={requiredFieldMessage}
                        validate={validatePipe(
                          validatePastOrTodayDate,
                          validateDateOfBirth,
                        )}
                        sx={{ flex: 1, minWidth: 180 }}
                      />
                      <SelectField
                        name={`${fieldName("employees")}.${index}.${employeeFieldName("changeType")}`}
                        label="Aktion"
                        options={buildEnumOptions(EMPLOYEE_CHANGE_TYPE_NAMES)}
                        required={requiredFieldMessage}
                        sx={{ flex: 1, minWidth: 175 }}
                      />
                      {canDeleteEmployeeEntries && (
                        <IconButton
                          aria-label="Mitarbeiter-Eintrag löschen"
                          color="danger"
                          variant="plain"
                          sx={{ marginTop: "27px" }}
                          onClick={() => remove(index)}
                        >
                          <Delete size="xl2" />
                        </IconButton>
                      )}
                    </Stack>
                  </Stack>
                </Grid>
                <Grid xxl={6} />
              </Fragment>
            ))}
            <Grid xxs={6}>
              <Button
                variant="plain"
                startDecorator={<Add />}
                disabled={!canAddEmployeeEntries}
                onClick={() => push(buildEmptyEmployeeChangeEntry())}
              >
                Mitarbeiter:in hinzufügen
              </Button>
            </Grid>
            <Grid xxl={6} />
          </>
        )}
      </FieldArrayWithFocus>
    </Box>
  );
}
