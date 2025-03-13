/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

import { FormAddMoreButton } from "@eshg/lib-portal/components/form/FormAddMoreButton";
import { NestedFormProps } from "@eshg/lib-portal/types/form";
import DeleteIcon from "@mui/icons-material/DeleteOutlined";
import { Divider, IconButton, Stack, Typography } from "@mui/joy";
import { FieldArray } from "formik";

import { ContactPersonForm } from "@/lib/shared/components/facilitySidebar/ContactPersonForm";
import { BaseFacilityContactPerson } from "@/lib/shared/components/facilitySidebar/types";
import { createEmptyContactPerson } from "@/lib/shared/helpers/facilityUtils";

interface FacilityContactPersonArrayFormProps extends NestedFormProps {
  values: BaseFacilityContactPerson[];
  contactPersonRequired?: boolean;
  allowMainContactPerson?: boolean;
}

export function FacilityContactPersonArrayForm({
  name,
  values,
  contactPersonRequired,
  allowMainContactPerson,
}: FacilityContactPersonArrayFormProps) {
  return (
    <FieldArray name={name} validateOnChange={false}>
      {({ push, remove }) => (
        <>
          {values.map((_contactPerson, index) => {
            // don't include any values in the key, as this would cause the input fields to lose focus
            const key = `contactPerson.${index}`;
            return (
              <Stack component={"section"} key={key} gap={"inherit"}>
                <Divider />
                <Stack
                  direction={"row"}
                  justifyContent="space-between"
                  alignItems={"center"}
                >
                  <Typography level="title-md">Kontaktperson</Typography>
                  {(values.length > 1 || !contactPersonRequired) && (
                    <IconButton
                      color="primary"
                      onClick={() => remove(index)}
                      aria-label={"Kontaktperson löschen"}
                    >
                      <DeleteIcon />
                    </IconButton>
                  )}
                </Stack>
                <ContactPersonForm
                  name={`contactPersons.${index}`}
                  allowMainContactPerson={allowMainContactPerson}
                />
              </Stack>
            );
          })}
          <FormAddMoreButton onClick={() => push(createEmptyContactPerson())}>
            Kontaktperson hinzufügen
          </FormAddMoreButton>
        </>
      )}
    </FieldArray>
  );
}
