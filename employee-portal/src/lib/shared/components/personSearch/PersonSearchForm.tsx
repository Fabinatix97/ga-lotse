/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

import { DateField } from "@eshg/lib-portal/components/formFields/DateField";
import { InputField } from "@eshg/lib-portal/components/formFields/InputField";
import { formatPersonName } from "@eshg/lib-portal/formatters/person";
import { toUtcDate } from "@eshg/lib-portal/helpers/dateTime";
import { validateDateOfBirth } from "@eshg/lib-portal/helpers/validators";
import {
  Close,
  InsertLinkOutlined,
  PersonSearchOutlined,
  SearchOutlined,
} from "@mui/icons-material";
import { Button, styled } from "@mui/joy";
import { Formik } from "formik";
import { useId, useState } from "react";
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
}

export function PersonSearchForm(props: PersonSearchFormProps) {
  return (
    <Formik
      enableReinitialize
      initialValues={props.initialValues}
      onSubmit={(formValues) => props.onChange(formValues)}
    >
      {({ resetForm }) => (
        <SearchFormSheet id={props.id} data-testid="personSearch">
          <InputField
            label="Vorname"
            name="firstName"
            required="Bitte Vornamen eingeben"
          />
          <InsertLinkOutlined />
          <InputField
            name="lastName"
            label="Nachname"
            required="Bitte Nachnamen eingeben"
          />
          <InsertLinkOutlined />
          <DateField
            name="dateOfBirth"
            label="Geburtsdatum"
            required="Bitte Geburtsdatum eingeben"
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
              props.onReset();
            }}
          >
            Suche zurücksetzen
          </Button>
        </SearchFormSheet>
      )}
    </Formik>
  );
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
  searchDateOfBirth: Date;
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
      searchDateOfBirth: toUtcDate(newFormValues.dateOfBirth),
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
