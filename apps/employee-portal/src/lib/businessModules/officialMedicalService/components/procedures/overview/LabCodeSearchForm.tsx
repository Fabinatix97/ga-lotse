/**
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { Close, SearchOutlined } from "@mui/icons-material";
import { Button, styled } from "@mui/joy";
import { Formik } from "formik";
import { ReactNode, useId, useState } from "react";

import {
  FormSheet,
  ToggleExpandButton,
  ToggleExpandButtonProps,
} from "@eshg/lib-employee-portal";
import { InputField } from "@eshg/lib-portal";

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
    maxWidth: "210px",
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

interface LabCodeSearchFormProps {
  id: string;
  initialValues: LabCodeSearchFormValues;
  onChange: (searchParams: LabCodeSearchFormValues) => void;
  onReset: () => void;
  children?: ReactNode;
}

export function LabCodeSearchForm(props: LabCodeSearchFormProps) {
  return (
    <Formik
      enableReinitialize
      initialValues={props.initialValues}
      onSubmit={(formValues) => props.onChange(formValues)}
    >
      {({ resetForm }) => (
        <>
          <SearchFormSheet
            id={props.id}
            isSearchForm
            aria-label="Laborcode"
            data-testid="labCodeSearchSearch"
          >
            <InputField
              label="Laborcode"
              name="labCode"
              required="Bitte Laborcode eingeben"
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
          {props.children}
        </>
      )}
    </Formik>
  );
}

interface ToggleLabCodeSearchButtonProps extends ToggleExpandButtonProps {
  searchParams: LabCodeSearchParams | undefined;
}

export function ToggleLabCodeSearchButton(
  props: ToggleLabCodeSearchButtonProps,
) {
  const { searchParams, ...buttonProps } = props;
  return (
    <ToggleExpandButton
      startDecorator={<SearchOutlined />}
      activeStateText={searchParams?.searchLabCode}
      {...buttonProps}
    >
      Laborcodesuche
    </ToggleExpandButton>
  );
}

interface LabCodeSearchParams {
  searchLabCode: string;
}

export interface LabCodeSearchFormValues {
  labCode: string;
}

const INITIAL_FORM_VALUES: LabCodeSearchFormValues = {
  labCode: "",
};

export function useLabCodeSearch() {
  const id = useId();
  const [searchParams, setSearchParams] = useState<
    LabCodeSearchParams | undefined
  >(undefined);
  const [formValues, setFormValues] =
    useState<LabCodeSearchFormValues>(INITIAL_FORM_VALUES);

  function setValues(newFormValues: LabCodeSearchFormValues): void {
    setFormValues(newFormValues);
    setSearchParams({
      searchLabCode: newFormValues.labCode,
    });
  }

  function reset(): void {
    setFormValues(INITIAL_FORM_VALUES);
    setSearchParams(undefined);
  }

  const buttonProps = {
    searchParams,
    "aria-controls": id,
  } as const satisfies Partial<ToggleLabCodeSearchButtonProps>;

  const formProps = {
    id,
    initialValues: formValues,
    onReset: reset,
  } as const satisfies Partial<LabCodeSearchFormProps>;

  return { formValues, searchParams, buttonProps, formProps, setValues, reset };
}
