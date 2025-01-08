/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

import { ApiGetReferenceFacilityResponse } from "@eshg/employee-portal-api/base";
import { AlertProps } from "@eshg/lib-portal/components/Alert";
import { FormAddMoreButton } from "@eshg/lib-portal/components/form/FormAddMoreButton";
import { RadioGroupField } from "@eshg/lib-portal/components/formFields/RadioGroupField";
import ArrowBackIosOutlined from "@mui/icons-material/ArrowBackIosOutlined";
import { Box, Button, Stack, Typography } from "@mui/joy";
import { Formik, FormikErrors } from "formik";
import { ReactNode, Ref } from "react";
import { isDefined } from "remeda";

import { FacilityCardContent } from "@/lib/baseModule/components/facility/FacilityCardContent";
import { NoSearchResults } from "@/lib/shared/components/NoSearchResult";
import { SelectableCard } from "@/lib/shared/components/cards/SelectableCard";
import { FacilitySearchFormValues } from "@/lib/shared/components/facilitySidebar/search/FacilitySearchForm";
import { MultiFormButtonBar } from "@/lib/shared/components/form/MultiFormButtonBar";
import {
  SidebarForm,
  SidebarFormHandle,
} from "@/lib/shared/components/form/SidebarForm";
import { SidebarActions } from "@/lib/shared/components/sidebar/SidebarActions";
import { SidebarContent } from "@/lib/shared/components/sidebar/SidebarContent";
import { fullAddress } from "@/lib/shared/helpers/facilityUtils";

interface SearchResultFormValues {
  selected: string;
}

export interface FacilitySearchResultsProps {
  title: string;

  inputs: FacilitySearchFormValues;
  facilities: ApiGetReferenceFacilityResponse[];
  header?: ReactNode;

  sidebarFormRef?: Ref<SidebarFormHandle>;
  onBack?: () => void;
  onCancel: () => void;
  onSelect: (facility: ApiGetReferenceFacilityResponse) => void;
  onCreateNew: () => void;
}

export function FacilitySearchResults(props: FacilitySearchResultsProps) {
  const initialValues: SearchResultFormValues = {
    selected: "",
  };

  function validate(
    values: SearchResultFormValues,
  ): FormikErrors<SearchResultFormValues> | undefined {
    if (values.selected === "") {
      return {
        selected: "Bitte Einrichtung auswählen oder neue Einrichtung anlegen.",
      };
    }
    return undefined;
  }

  function getAlert(
    errors: FormikErrors<SearchResultFormValues>,
  ): AlertProps | undefined {
    if (isDefined(errors.selected)) {
      return {
        title: errors.selected,
        color: "danger",
      };
    }

    return undefined;
  }

  return (
    <Formik
      initialValues={initialValues}
      onSubmit={(values) => {
        if (values.selected === "new") {
          props.onCreateNew();
        } else {
          props.onSelect(
            props.facilities.find(
              (facility) => facility.id === values.selected,
            )!,
          );
        }
        return Promise.resolve();
      }}
      validate={validate}
    >
      {({ errors }) => (
        <SidebarForm>
          <SidebarContent
            title={props.title}
            subtitle={"Einrichtung auswählen"}
            alert={getAlert(errors)}
            header={
              props.header ?? (
                <Stack gap={2}>
                  <Button
                    variant="plain"
                    startDecorator={<ArrowBackIosOutlined />}
                    sx={{ alignSelf: "start", paddingInline: 0 }}
                    onClick={props.onBack}
                  >
                    Eingabe ändern
                  </Button>
                  <Stack>
                    Bereits vorhandene Einträge zur Einrichtung:
                    <Typography level={"title-md"}>
                      {props.inputs.name}
                    </Typography>
                  </Stack>
                </Stack>
              )
            }
          >
            <Stack gap={2}>
              {props.facilities.length === 0 ? (
                <Box
                  sx={{
                    paddingTop: 10,
                  }}
                >
                  <NoSearchResults
                    info={"Keine Treffer"}
                    buttonLabel={"Neue Einrichtung anlegen"}
                    onClick={() => props.onCreateNew()}
                  />
                </Box>
              ) : (
                <>
                  <RadioGroupField name="selected">
                    <Stack gap={2}>
                      {props.facilities.map((facility) => (
                        <SelectableCard key={facility.id} value={facility.id}>
                          <FacilityCardContent
                            name={facility.name}
                            address={fullAddress(facility.contactAddress)}
                            phoneNumber={facility.phoneNumbers.at(0)}
                            emailAddress={facility.emailAddresses.at(0)}
                          />
                        </SelectableCard>
                      ))}
                    </Stack>
                  </RadioGroupField>
                  <FormAddMoreButton onClick={() => props.onCreateNew()}>
                    Neue Einrichtung anlegen
                  </FormAddMoreButton>
                </>
              )}
            </Stack>
          </SidebarContent>
          <SidebarActions>
            <MultiFormButtonBar
              submitting={false}
              submitLabel={props.facilities.length > 0 ? "Weiter" : undefined}
              onBack={props.onBack}
              onCancel={props.onCancel}
            />
          </SidebarActions>
        </SidebarForm>
      )}
    </Formik>
  );
}
