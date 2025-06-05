/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

import { ArrowBackIosOutlined } from "@mui/icons-material";
import { Box, Button, Sheet, Stack, Typography } from "@mui/joy";
import { Formik } from "formik";
import { Ref } from "react";
import { isDefined } from "remeda";

import {
  ApiDataOrigin,
  ApiGender,
  type ApiGetReferencePersonResponse,
  ApiSalutation,
} from "@eshg/base-api";
import {
  FormAddMoreButton,
  RadioGroupField,
  formatDate,
  formatPersonName,
} from "@eshg/lib-portal";

import { NoSearchResults } from "../../../../components/NoSearchResults";
import { SelectableCard } from "../../../../components/cards/SelectableCard";
import { MultiFormButtonBar } from "../../../../components/form/MultiFormButtonBar";
import { SidebarActions } from "../../../drawer/components/SidebarActions";
import { SidebarContent } from "../../../drawer/components/SidebarContent";
import { SidebarForm } from "../../../drawer/components/SidebarForm";
import { SIDEBAR_PADDING } from "../../../drawer/config/sidebar";
import { SidebarFormHandle } from "../../../drawer/types/sidebar";
import { PersonCardContent } from "../PersonCardContent";

import { SearchPersonFormValues } from "./SearchPersonSidebar";

interface PersonSearchResultsProps {
  title: string;
  inputs: SearchPersonFormValues;
  persons: ApiGetReferencePersonResponse[];
  loadingAssociatedProcedures?: boolean;
  onSelectPerson: (person: ApiGetReferencePersonResponse) => void;
  onCreatePerson?: () => void;
  onCancel: () => void;
  onBack?: () => void;
  sidebarFormRef: Ref<SidebarFormHandle>;
  externalPerson?: boolean;
  extendExistingContactText?: string;
}

export function PersonSearchResults(props: PersonSearchResultsProps) {
  function handleSelect({ selected }: { selected: string }) {
    if (selected === "new") {
      if (props.onCreatePerson) {
        props.onCreatePerson();
      }
    } else {
      props.onSelectPerson(
        props.persons.find((person) => person.id === selected)!,
      );
    }
  }

  return (
    <Formik
      key="search"
      initialValues={{ selected: "" }}
      enableReinitialize
      onSubmit={handleSelect}
    >
      {({ isSubmitting }) => (
        <SidebarForm ref={props.sidebarFormRef}>
          <SidebarContent
            title={props.title}
            subtitle={props.externalPerson ? undefined : "Person auswählen"}
            header={
              <Stack gap={2} marginRight={SIDEBAR_PADDING}>
                {isDefined(props.onBack) && (
                  <Button
                    variant="plain"
                    startDecorator={<ArrowBackIosOutlined />}
                    sx={{ alignSelf: "start", paddingInline: 0 }}
                    onClick={props.onBack}
                  >
                    Eingabe ändern
                  </Button>
                )}
                {props.externalPerson ? (
                  <Stack gap={2}>
                    {props.persons.length === 1 ? (
                      <Typography>
                        Für die gemeldete Person{" "}
                        <Typography sx={{ fontWeight: "bold" }}>
                          {formatPersonName(props.inputs)}
                        </Typography>{" "}
                        ist bereits{" "}
                        <Typography sx={{ fontWeight: "bold" }}>
                          {props.persons.length}
                        </Typography>{" "}
                        ähnlicher Eintrag vorhanden.
                      </Typography>
                    ) : (
                      <Typography>
                        Für die gemeldete Person{" "}
                        <Typography sx={{ fontWeight: "bold" }}>
                          {formatPersonName(props.inputs)}
                        </Typography>{" "}
                        sind bereits{" "}
                        <Typography sx={{ fontWeight: "bold" }}>
                          {props.persons.length}
                        </Typography>{" "}
                        ähnliche Einträge vorhanden.
                      </Typography>
                    )}
                    <Sheet
                      component="label"
                      variant="outlined"
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: 2,
                        borderRadius: "8px",
                        backgroundColor: "#C7F7C799",
                        borderColor: "#A1E8A1",
                      }}
                    >
                      <PersonCardContent
                        person={{
                          firstName: props.inputs.firstName,
                          lastName: props.inputs.lastName,
                          dateOfBirth: new Date(props.inputs.dateOfBirth),
                          dataOrigin: ApiDataOrigin.Manual,
                          emailAddresses: [],
                          gender: ApiGender.NotSpecified,
                          id: "dummy-id",
                          phoneNumbers: [],
                          salutation: ApiSalutation.NotSpecified,
                          version: 0,
                          humanReadableId: "dummy-id",
                        }}
                      />
                    </Sheet>
                  </Stack>
                ) : (
                  <Stack>
                    <Typography level="title-md">
                      {formatPersonName(props.inputs)},{" "}
                      {formatDate(new Date(props.inputs.dateOfBirth))}
                    </Typography>
                  </Stack>
                )}
              </Stack>
            }
          >
            {props.persons.length === 0 ? (
              <Box
                sx={{
                  paddingTop: 10,
                }}
              >
                <NoSearchResults
                  info="Keine Treffer"
                  buttonLabel="Person neu anlegen"
                  onClick={() => handleSelect({ selected: "new" })}
                />
              </Box>
            ) : (
              <>
                <RadioGroupField
                  name="selected"
                  required="Bitte eine Person auswählen"
                >
                  <Stack gap={2} sx={{ marginTop: -1 }}>
                    {props.extendExistingContactText ? (
                      <Typography>{props.extendExistingContactText}</Typography>
                    ) : (
                      <Typography>Vorhandenen Kontakt erweitern:</Typography>
                    )}
                    {props.persons.map((person) => (
                      <SelectableCard key={person.id} value={person.id}>
                        <PersonCardContent person={person} />
                      </SelectableCard>
                    ))}
                    {props.externalPerson && (
                      <>
                        oder
                        <SelectableCard key="NEW_PERSON" value="NEW_PERSON">
                          <Typography level="title-md">
                            als neue Person anlegen
                          </Typography>
                        </SelectableCard>
                      </>
                    )}
                  </Stack>
                </RadioGroupField>
                {!props.externalPerson && (
                  <FormAddMoreButton
                    onClick={() => handleSelect({ selected: "new" })}
                  >
                    Person neu anlegen
                  </FormAddMoreButton>
                )}
              </>
            )}
          </SidebarContent>
          <SidebarActions>
            <MultiFormButtonBar
              submitting={
                isSubmitting || (props.loadingAssociatedProcedures ?? false)
              }
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
