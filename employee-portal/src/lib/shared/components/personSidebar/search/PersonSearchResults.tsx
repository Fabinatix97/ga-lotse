/**
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

import type { ApiGetReferencePersonResponse } from "@eshg/employee-portal-api/base";
import { FormAddMoreButton } from "@eshg/lib-portal/components/form/FormAddMoreButton";
import { formatDate } from "@eshg/lib-portal/formatters/dateTime";
import ArrowBackIosOutlined from "@mui/icons-material/ArrowBackIosOutlined";
import { Box, Button, Stack, Typography } from "@mui/joy";
import { Formik } from "formik";
import { Ref } from "react";

import { PersonCardContent } from "@/lib/baseModule/components/person/PersonCardContent";
import { NoSearchResults } from "@/lib/shared/components/NoSearchResult";
import { SelectableCard } from "@/lib/shared/components/cards/SelectableCard";
import { MultiFormButtonBar } from "@/lib/shared/components/form/MultiFormButtonBar";
import {
  SidebarForm,
  SidebarFormHandle,
} from "@/lib/shared/components/form/SidebarForm";
import { RadioGroupField } from "@/lib/shared/components/formFields/RadioGroupField";
import { SearchPersonFormValues } from "@/lib/shared/components/personSidebar/search/SearchPersonSidebar";
import { SidebarActions } from "@/lib/shared/components/sidebar/SidebarActions";
import { SidebarContent } from "@/lib/shared/components/sidebar/SidebarContent";

interface PersonSearchResultsProps {
  title: string;
  inputs: SearchPersonFormValues;
  persons: ApiGetReferencePersonResponse[];
  onSelectPerson: (person: ApiGetReferencePersonResponse) => void;
  onCreatePerson: () => void;
  onCancel: () => void;
  onBack: () => void;
  sidebarFormRef: Ref<SidebarFormHandle>;
}

export function PersonSearchResults(props: PersonSearchResultsProps) {
  function handleSelect({ selected }: { selected: string }) {
    if (selected === "new") {
      props.onCreatePerson();
    } else {
      props.onSelectPerson(
        props.persons.find((person) => person.id === selected)!,
      );
    }
  }

  return (
    <Formik
      key={"search"}
      initialValues={{ selected: "" }}
      onSubmit={handleSelect}
      enableReinitialize
    >
      {({ isSubmitting }) => (
        <SidebarForm ref={props.sidebarFormRef}>
          <SidebarContent
            title={props.title}
            subtitle="Person auswählen"
            header={
              <>
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
                    Bereits vorhandene Einträge zur Person:
                    <Typography level={"title-md"}>
                      {props.inputs.firstName} {props.inputs.lastName},{" "}
                      {formatDate(new Date(props.inputs.dateOfBirth))}
                    </Typography>
                  </Stack>
                </Stack>
              </>
            }
          >
            {props.persons.length === 0 ? (
              <Box
                sx={{
                  paddingTop: 10,
                }}
              >
                <NoSearchResults
                  info={"Keine Treffer"}
                  buttonLabel={"Person neu anlegen"}
                  onClick={() => handleSelect({ selected: "new" })}
                />
              </Box>
            ) : (
              <>
                <RadioGroupField
                  name="selected"
                  required={"Bitte eine Person auswählen"}
                >
                  <Stack gap={2}>
                    {props.persons.map((person) => (
                      <SelectableCard key={person.id} value={person.id}>
                        <PersonCardContent person={person} />
                      </SelectableCard>
                    ))}
                  </Stack>
                </RadioGroupField>
                <FormAddMoreButton
                  onClick={() => handleSelect({ selected: "new" })}
                >
                  Person neu anlegen
                </FormAddMoreButton>
              </>
            )}
          </SidebarContent>
          <SidebarActions>
            <MultiFormButtonBar
              submitting={isSubmitting}
              submitLabel={props.persons.length > 0 ? "Weiter" : undefined}
              onCancel={props.onCancel}
              onBack={props.onBack}
            />
          </SidebarActions>
        </SidebarForm>
      )}
    </Formik>
  );
}
