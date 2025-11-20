/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { Close, SearchOutlined } from "@mui/icons-material";
import { Button, ButtonProps, Sheet, Stack } from "@mui/joy";
import { Formik } from "formik";
import { AriaRole, ReactNode, useId, useState } from "react";

import {
  Alert,
  FormPlus,
  InputField,
  LiveAnnouncer,
  isNonEmptyString,
} from "@eshg/lib-portal";

export interface ToggleExpandButtonProps
  extends Omit<ButtonProps, "variant" | "color"> {
  expanded: boolean;
  "aria-controls"?: string;
  activeStateText?: ReactNode;
}

export interface TogglePersonSearchButtonProps extends ToggleExpandButtonProps {
  searchParams: PersonSearchParams | undefined;
}

interface PersonSearchFormProps {
  id: string;
  initialValues: PersonSearchFormValues;
  onChange: (searchParams: PersonSearchFormValues) => void;
  onReset: () => void;
  isHidden?: boolean;
  role?: AriaRole;
}

interface ValidationResult {
  valid: boolean;
  message?: string;
}

export function PersonSearchForm(props: PersonSearchFormProps) {
  const [alertMessage, setAlertMessage] = useState<string | undefined>();

  function handleSubmit(formValues: PersonSearchFormValues) {
    const validationResult = validateSearchParameters(formValues);
    if (validationResult.valid) {
      if (hasAtLeastOneValue(formValues)) {
        props.onChange(formValues);
      } else {
        props.onReset();
      }
    }
    setAlertMessage(validationResult.message);
  }

  return (
    <Formik
      enableReinitialize
      initialValues={props.initialValues}
      aria-hidden={props.isHidden}
      onSubmit={handleSubmit}
    >
      {({ resetForm }) => (
        <Stack gap={2} sx={{ display: props.isHidden ? "none" : undefined }}>
          <FormPlus>
            <Sheet>
              <Stack direction={{ md: "row" }} gap={2}>
                <InputField name="firstName" label="Vorname" />
                <InputField name="lastName" label="Nachname" />
                <InputField name="alias" label="Alias" />
              </Stack>

              <Stack direction={{ md: "row" }} gap={4} marginTop={2}>
                <Button
                  type="submit"
                  color="primary"
                  variant="solid"
                  startDecorator={<SearchOutlined />}
                >
                  Suchen
                </Button>
                <Button
                  color="primary"
                  variant="plain"
                  startDecorator={<Close />}
                  onClick={() => {
                    resetForm();
                    setAlertMessage(undefined);
                    props.onReset();
                  }}
                >
                  Suche zurücksetzen
                </Button>
              </Stack>
            </Sheet>
            {isNonEmptyString(alertMessage) && (
              <Alert color="primary" message={alertMessage} />
            )}
            <LiveAnnouncer
              message={alertMessage ?? ""}
              active={!!alertMessage}
            />
          </FormPlus>
        </Stack>
      )}
    </Formik>
  );
}

function validateSearchParameters(
  values: PersonSearchFormValues,
): ValidationResult {
  if (hasAtLeastOneValue(values)) {
    return { valid: true };
  } else {
    return {
      valid: false,
      message: "",
    };
  }
}

function hasAtLeastOneValue(values: PersonSearchFormValues) {
  return !!(values.firstName || values.lastName || values.alias);
}

export interface PersonSearchParams {
  searchFirstName?: string;
  searchLastName?: string;
  searchAlias?: string;
}

export interface PersonSearchFormValues {
  firstName: string;
  lastName: string;
  alias: string;
}

const INITIAL_FORM_VALUES: PersonSearchFormValues = {
  firstName: "",
  lastName: "",
  alias: "",
};

export function usePersonSearch() {
  const id = useId();
  const [searchParams, setSearchParams] = useState<
    PersonSearchParams | undefined
  >(undefined);
  const [formValues, setFormValues] =
    useState<PersonSearchFormValues>(INITIAL_FORM_VALUES);

  function setValues(newFormValues: PersonSearchFormValues): void {
    setFormValues(newFormValues);
    setSearchParams({
      searchFirstName:
        newFormValues.firstName.trim().length === 0
          ? undefined
          : newFormValues.firstName,
      searchLastName:
        newFormValues.lastName.trim().length === 0
          ? undefined
          : newFormValues.lastName,
      searchAlias:
        newFormValues.lastName.trim().length === 0
          ? undefined
          : newFormValues.lastName,
    });
  }

  function reset(): void {
    setFormValues(INITIAL_FORM_VALUES);
    setSearchParams(undefined);
  }

  const buttonProps = {
    searchParams,
    "aria-controls": id,
  } as const satisfies Partial<TogglePersonSearchButtonProps>;

  const formProps = {
    id,
    initialValues: formValues,
    onReset: reset,
  } as const satisfies Partial<PersonSearchFormProps>;

  return { formValues, searchParams, buttonProps, formProps, setValues, reset };
}
