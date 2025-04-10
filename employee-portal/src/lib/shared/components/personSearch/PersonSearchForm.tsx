/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

import { Alert } from "@eshg/lib-portal/components/Alert";
import { DateField } from "@eshg/lib-portal/components/formFields/DateField";
import { InputField } from "@eshg/lib-portal/components/formFields/InputField";
import { formatPersonName } from "@eshg/lib-portal/formatters/person";
import { isDateString, toUtcDate } from "@eshg/lib-portal/helpers/dateTime";
import { isNonEmptyString } from "@eshg/lib-portal/helpers/guards";
import { validateDateOfBirth } from "@eshg/lib-portal/helpers/validators";
import {
  Close,
  InsertLinkOutlined,
  PersonSearchOutlined,
  SearchOutlined,
} from "@mui/icons-material";
import { Button, styled } from "@mui/joy";
import { Formik } from "formik";
import { useEffect, useId, useState } from "react";
import { isDefined } from "remeda";

import {
  ToggleExpandButton,
  ToggleExpandButtonProps,
} from "@/lib/shared/components/buttons/ToggleExpandButton";
import { FormSheet } from "@/lib/shared/components/form/FormSheet";

const SearchFormSheet = styled(FormSheet)(({ theme }) => ({
  padding: theme.spacing(3),
  paddingBottom: 0,
  flexDirection: "row",
  alignItems: "center",
  flexWrap: "wrap",
  "& > .MuiFormControl-root": {
    flexGrow: 1,
    minWidth: "180px",
    maxWidth: "220px",
    height: "90px", // ensure stable height even without validation errors
  },
  "& > .MuiSvgIcon-root": {
    flexShrink: 0,
    height: "34px",
    margin: theme.spacing(0, -1), // achieve lower gap between fields and icons
  },
  "& > .MuiButton-root": {
    flexGrow: 1,
    maxWidth: "200px",
    margin: theme.spacing(3, 0),
  },
  [theme.breakpoints.down("md")]: {
    flexDirection: "column",
    gap: theme.spacing(1),
    "& > .MuiFormControl-root, .MuiButton-root": {
      minWidth: "100%",
      maxWidth: "100%",
    },
    "& > .MuiSvgIcon-root": {
      transform: "rotate(90deg)",
      margin: theme.spacing(-1, 0), // achieve lower gap between fields and icons
    },
    "& > .MuiButton-root": { margin: theme.spacing(0, 0, 3, 0) },
  },
}));

interface PersonSearchFormProps {
  id: string;
  initialValues: PersonSearchFormValues;
  onChange: (searchParams: PersonSearchFormValues) => void;
  onReset: () => void;
  allowPartialSearch?: boolean;
}

interface ValidationResult {
  valid: boolean;
  message?: string;
}

export function PersonSearchForm(props: PersonSearchFormProps) {
  const [alertMessage, setAlertMessage] = useState<string | undefined>();

  useEffect(() => {
    setAlertMessage(validateSearchParameters(props.initialValues).message);
  }, [props.initialValues]);

  function handleChange(formValues: PersonSearchFormValues) {
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
      onSubmit={(formValues) => handleChange(formValues)}
    >
      {({ resetForm }) => (
        <>
          <SearchFormSheet id={props.id} data-testid="personSearch">
            <InputField
              name="firstName"
              label="Vorname"
              required={
                !props.allowPartialSearch
                  ? "Bitte Vornamen eingeben"
                  : undefined
              }
            />
            <InsertLinkOutlined />
            <InputField
              name="lastName"
              label="Nachname"
              required={
                !props.allowPartialSearch
                  ? "Bitte Nachnamen eingeben"
                  : undefined
              }
            />
            {!props.allowPartialSearch && <InsertLinkOutlined />}
            <DateField
              name="dateOfBirth"
              label="Geburtsdatum"
              required={
                !props.allowPartialSearch
                  ? "Bitte Geburtsdatum eingeben"
                  : undefined
              }
              validate={validateDateOfBirth}
            />

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
          </SearchFormSheet>
          {isNonEmptyString(alertMessage) && (
            <Alert color="primary" message={alertMessage} />
          )}
        </>
      )}
    </Formik>
  );
}

function validateSearchParameters(
  values: PersonSearchFormValues,
): ValidationResult {
  if (!hasAtLeastOneValue(values)) {
    return { valid: true };
  }

  if (isFullSearch(values)) {
    return { valid: true };
  }

  if (isInvalidPartialSearch(values)) {
    return {
      valid: false,
      message:
        "Die Suche ausschließlich nach Vor- oder Nachname ist nicht erlaubt.",
    };
  } else {
    return {
      valid: true,
      message:
        "Es werden aus Datenschutzgründen nur offene Vorgänge angezeigt. Geben Sie alle 3 Such-Faktoren an, um auch geschlossene Vorgänge anzuzeigen.",
    };
  }
}

function hasAtLeastOneValue(values: PersonSearchFormValues) {
  return !!(values.firstName || values.lastName || values.dateOfBirth);
}

function isFullSearch(values: PersonSearchFormValues) {
  return !!(values.firstName && values.lastName && values.dateOfBirth);
}

function isInvalidPartialSearch(values: PersonSearchFormValues) {
  const hasOnlyFirstNameFilled = !!(
    values.firstName &&
    !values.lastName &&
    !values.dateOfBirth
  );
  const hasOnlyLastNameFilled = !!(
    !values.firstName &&
    values.lastName &&
    !values.dateOfBirth
  );

  return hasOnlyFirstNameFilled || hasOnlyLastNameFilled;
}

interface TogglePersonSearchButtonProps extends ToggleExpandButtonProps {
  searchParams: PersonSearchParams | undefined;
}

export function TogglePersonSearchButton(props: TogglePersonSearchButtonProps) {
  const { searchParams, ...buttonProps } = props;
  const searchedPersonName = isDefined(searchParams)
    ? formatPersonName({
        firstName: searchParams.searchFirstName,
        lastName: searchParams.searchLastName,
      })
    : undefined;

  return (
    <ToggleExpandButton
      startDecorator={<PersonSearchOutlined />}
      activeStateText={searchedPersonName}
      {...buttonProps}
    >
      Personensuche
    </ToggleExpandButton>
  );
}

export interface PersonSearchParams {
  searchFirstName: string;
  searchLastName: string;
  searchDateOfBirth?: Date;
}

export interface PersonSearchFormValues {
  firstName: string;
  lastName: string;
  dateOfBirth: string;
}

const INITIAL_FORM_VALUES: PersonSearchFormValues = {
  firstName: "",
  lastName: "",
  dateOfBirth: "",
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
      searchFirstName: newFormValues.firstName,
      searchLastName: newFormValues.lastName,
      searchDateOfBirth: isDateString(newFormValues.dateOfBirth)
        ? toUtcDate(newFormValues.dateOfBirth)
        : undefined,
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
