/**
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

import DeleteIcon from "@mui/icons-material/DeleteOutlined";
import { Divider, IconButton, Stack, Typography } from "@mui/joy";
import { useEffect, useRef, useState } from "react";

import {
  FieldArrayWithFocus,
  FormAddMoreButton,
  NestedFormProps,
} from "@eshg/lib-portal";

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
  const [initialAmountOfContactPersons] = useState(values.length);
  useEffect(() => {
    if (contactPersonRequired && values.length === 0) {
      values.push(createEmptyContactPerson());
    }
  }, [contactPersonRequired, values]);

  const fallbackRef = useRef<HTMLElement | undefined>(undefined);
  return (
    <FieldArrayWithFocus
      valueLength={values.length}
      name={name}
      validateOnChange={false}
      fallbackFocusInputElement={fallbackRef.current}
    >
      {({ push, remove }) => (
        <>
          {values.map((_contactPerson, index) => {
            // don't include any values in the key, as this would cause the input fields to lose focus
            const key = `contactPerson.${index}`;
            return (
              <Stack key={key} component="section" gap="inherit">
                <Divider />
                <Stack
                  direction="row"
                  justifyContent="space-between"
                  alignItems="center"
                >
                  <Typography level="title-md">Kontaktperson</Typography>
                  {(values.length > 1 || !contactPersonRequired) && (
                    <IconButton
                      color="primary"
                      aria-label="Kontaktperson löschen"
                      onClick={() => remove(index)}
                    >
                      <DeleteIcon />
                    </IconButton>
                  )}
                </Stack>
                <ContactPersonForm
                  autoFocus={values.length > initialAmountOfContactPersons}
                  name={`contactPersons.${index}`}
                  allowMainContactPerson={allowMainContactPerson}
                />
              </Stack>
            );
          })}
          <FormAddMoreButton
            ref={(el) => {
              fallbackRef.current = el ?? undefined;
            }}
            onClick={() => push(createEmptyContactPerson())}
          >
            Kontaktperson hinzufügen
          </FormAddMoreButton>
        </>
      )}
    </FieldArrayWithFocus>
  );
}
