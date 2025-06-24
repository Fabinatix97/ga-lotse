/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

import { Close, InsertLinkOutlined, SearchOutlined } from "@mui/icons-material";
import { Button, List, ListItem, Stack, Typography, styled } from "@mui/joy";
import { Formik, FormikState } from "formik";
import {
  AriaRole,
  SetStateAction,
  useEffect,
  useId,
  useMemo,
  useState,
} from "react";

import {
  Alert,
  DateField,
  InputField,
  isDateString,
  isNonEmptyString,
  toUtcDate,
  validateDateOfBirth,
} from "@eshg/lib-portal";

import { useManySearchParams } from "../../hooks/useSearchParam";
import { FormSheet } from "../form/FormSheet";

import { TogglePersonSearchButtonProps } from "./TogglePersonSearchButton";

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
  disablePartialSearchAlert?: boolean;
  allowPersonIdSearch?: boolean;
  isHidden?: boolean;
  role?: AriaRole;
}

interface ValidationResult {
  valid: boolean;
  message?: string;
}

export function PersonSearchForm(props: PersonSearchFormProps) {
  const [alertMessage, setAlertMessage] = useState<string | undefined>();

  useEffect(() => {
    setAlertMessage(
      validateSearchParameters(
        props.initialValues,
        props.disablePartialSearchAlert,
      ).message,
    );
  }, [props.initialValues, props.disablePartialSearchAlert]);

  function handleChange(formValues: PersonSearchFormValues) {
    const validationResult = validateSearchParameters(
      formValues,
      props.disablePartialSearchAlert,
    );
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
      onSubmit={(formValues) => handleChange(formValues)}
    >
      {({ resetForm }) => (
        <Stack
          gap={2}
          role={props.role}
          sx={{ display: props.isHidden ? "none" : undefined }}
        >
          {props.allowPersonIdSearch && (
            <Alert
              color="primary"
              message={
                <Typography>
                  Möchten Sie auch geschlossene Vorgänge durchsuchen, benötigen
                  Sie
                  <List marker="disc" component="ul">
                    <ListItem>Vorname + Nachname + Geburtsdatum</ListItem>
                    <ListItem>oder Personen-ID.</ListItem>
                  </List>
                </Typography>
              }
            />
          )}
          <SearchFormSheet id={props.id} data-testid="personSearch">
            {props.allowPersonIdSearch ? (
              <Stack gap={2} marginBottom={2}>
                <Stack direction="row" gap={3}>
                  <ThreeFactorsFields {...props} />
                </Stack>
                <PersonIdField />
                <Stack direction="row" gap={4}>
                  <Buttons
                    setAlertMessage={setAlertMessage}
                    resetForm={resetForm}
                    onReset={props.onReset}
                  />
                </Stack>
              </Stack>
            ) : (
              <>
                <ThreeFactorsFields {...props} />
                <Buttons
                  setAlertMessage={setAlertMessage}
                  resetForm={resetForm}
                  onReset={props.onReset}
                />
              </>
            )}
          </SearchFormSheet>
          {isNonEmptyString(alertMessage) && (
            <Alert color="primary" message={alertMessage} />
          )}
        </Stack>
      )}
    </Formik>
  );
}

function ThreeFactorsFields(props: PersonSearchFormProps) {
  return (
    <>
      <InputField
        name="firstName"
        label="Vorname"
        required={
          !props.allowPartialSearch ? "Bitte Vornamen eingeben" : undefined
        }
      />
      {!props.allowPersonIdSearch && <InsertLinkOutlined />}
      <InputField
        name="lastName"
        label="Nachname"
        required={
          !props.allowPartialSearch ? "Bitte Nachnamen eingeben" : undefined
        }
      />
      {!props.allowPartialSearch && <InsertLinkOutlined />}
      <DateField
        name="dateOfBirth"
        label="Geburtsdatum"
        required={
          !props.allowPartialSearch ? "Bitte Geburtsdatum eingeben" : undefined
        }
        validate={validateDateOfBirth}
      />
    </>
  );
}

function PersonIdField() {
  return <InputField name="humanReadableId" label="Personen-ID" />;
}

function Buttons({
  setAlertMessage,
  resetForm,
  onReset,
}: {
  setAlertMessage: (value: SetStateAction<string | undefined>) => void;
  resetForm: (nextState?: Partial<FormikState<PersonSearchFormValues>>) => void;
  onReset: () => void;
}) {
  return (
    <>
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
          onReset();
        }}
      >
        Suche zurücksetzen
      </Button>
    </>
  );
}

function validateSearchParameters(
  values: PersonSearchFormValues,
  disablePartialSearchAlert?: boolean,
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
      message: disablePartialSearchAlert
        ? undefined
        : "Es werden aus Datenschutzgründen nur offene Vorgänge angezeigt. Geben Sie alle 3 Such-Faktoren an, um auch geschlossene Vorgänge anzuzeigen.",
    };
  }
}

function hasAtLeastOneValue(values: PersonSearchFormValues) {
  return !!(
    values.firstName ||
    values.lastName ||
    values.dateOfBirth ||
    values.humanReadableId
  );
}

function isFullSearch(values: PersonSearchFormValues) {
  return !!(values.firstName && values.lastName && values.dateOfBirth);
}

function isInvalidPartialSearch(values: PersonSearchFormValues) {
  if (values.humanReadableId) {
    return false;
  }

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

export interface PersonSearchParams {
  searchFirstName: string;
  searchLastName: string;
  searchDateOfBirth?: Date;
  searchHumanReadableId: string;
}

export interface PersonSearchFormValues {
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  humanReadableId: string;
}

const INITIAL_FORM_VALUES: PersonSearchFormValues = {
  firstName: "",
  lastName: "",
  dateOfBirth: "",
  humanReadableId: "",
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
      searchHumanReadableId: newFormValues.humanReadableId,
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

export function usePersonSearchFromURL({
  panelId = "person-search-panel",
}: {
  panelId?: string;
} = {}) {
  const [rawSearchParams, setSearchParams] = useManySearchParams([
    "searchDateOfBirth",
    "searchFirstName",
    "searchLastName",
    "searchHumanReadableId",
  ]);
  const searchParams = useMemo(
    () => ({
      searchDateOfBirth: rawSearchParams.searchDateOfBirth
        ? new Date(rawSearchParams.searchDateOfBirth)
        : undefined,
      searchFirstName: rawSearchParams.searchFirstName ?? "",
      searchLastName: rawSearchParams.searchLastName ?? "",
      searchHumanReadableId: rawSearchParams.searchHumanReadableId ?? "",
    }),
    [rawSearchParams],
  );
  const formValues: PersonSearchFormValues = useMemo(
    () => ({
      dateOfBirth: rawSearchParams.searchDateOfBirth ?? "",
      firstName: rawSearchParams.searchFirstName ?? "",
      lastName: rawSearchParams.searchLastName ?? "",
      humanReadableId: rawSearchParams.searchHumanReadableId ?? "",
    }),
    [rawSearchParams],
  );

  function setValues(newFormValues: PersonSearchFormValues): void {
    setSearchParams({
      searchFirstName: newFormValues.firstName,
      searchLastName: newFormValues.lastName,
      searchDateOfBirth: isDateString(newFormValues.dateOfBirth)
        ? newFormValues.dateOfBirth
        : undefined,
      searchHumanReadableId: newFormValues.humanReadableId,
    });
  }

  function reset(): void {
    setSearchParams(undefined);
  }

  const buttonProps = {
    searchParams,
    "aria-controls": panelId,
  } as const satisfies Partial<TogglePersonSearchButtonProps>;

  const formProps = {
    initialValues: formValues,
    onReset: reset,
    id: panelId,
  } as const satisfies Partial<PersonSearchFormProps>;

  return {
    formValues,
    searchParams,
    buttonProps,
    formProps,
    setValues,
    reset,
  };
}
