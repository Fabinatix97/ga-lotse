/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { Sheet, Stack, Typography } from "@mui/joy";
import { Formik } from "formik";
import { ComponentType, Ref } from "react";
import { isDefined } from "remeda";

import { ApiVCardAddress } from "@eshg/base-api";
import {
  MultiFormButtonBar,
  SelectableCard,
  SidebarActions,
  SidebarContent,
  SidebarForm,
  SidebarFormHandle,
  formatList,
} from "@eshg/lib-employee-portal";
import { RadioGroupField } from "@eshg/lib-portal";

interface ImportResponse<TMatch> {
  matches: TMatch[];
  totalNumberOfMatches: number;
  vCard: {
    fullName: string;
    addresses: ApiVCardAddress[];
  };
}

interface ImportResultFormProps<TMatch> {
  searchResults: ImportResponse<TMatch>;
  formRef: Ref<SidebarFormHandle>;
  label: string;
  cardComponent: ComponentType<{ contact: TMatch }>;
  onSubmit: (selected: string | null) => void;
}

export function ImportResultForm<TMatch extends { id: string }>({
  searchResults,
  formRef,
  label,
  cardComponent,
  onSubmit,
}: ImportResultFormProps<TMatch>) {
  const address = searchResults.vCard.addresses.at(0);

  const CardComponent = cardComponent;

  return (
    <Formik
      initialValues={{ selected: null }}
      onSubmit={(values) => onSubmit(values.selected)}
    >
      {({ isSubmitting }) => (
        <SidebarForm ref={formRef}>
          <SidebarContent title={`${label} vorhanden`}>
            <RadioGroupField name="selected">
              <Stack gap={2}>
                <Typography>
                  Für die importierte {label}{" "}
                  <Typography level="title-md">
                    {searchResults.vCard.fullName}
                  </Typography>{" "}
                  sind bereits {searchResults.totalNumberOfMatches} ähnliche
                  Einträge vorhanden.
                </Typography>
                <Sheet
                  component="label"
                  variant="outlined"
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "start",
                    gap: 1,
                    borderRadius: "8px",
                    background: "#C7F7C799",
                  }}
                >
                  <Typography level="title-md">
                    {searchResults.vCard.fullName}
                  </Typography>
                  {isDefined(address) && (
                    <Typography>
                      {formatList(
                        [
                          isDefined(address.street)
                            ? formatList(
                                [address.street, address.houseNumber],
                                " ",
                              )
                            : undefined,
                          formatList([address.postalCode, address.city], " "),
                        ],
                        ", ",
                      )}
                    </Typography>
                  )}
                </Sheet>
                {searchResults.totalNumberOfMatches > 0 && (
                  <Typography>Vorhandenen Kontakt erweitern:</Typography>
                )}
                {searchResults.matches.map((contact) => (
                  <SelectableCard key={contact.id} value={contact.id}>
                    <CardComponent contact={contact} />
                  </SelectableCard>
                ))}
                <Typography>oder</Typography>
                <SelectableCard value="new">
                  <Typography level="title-md">
                    als neue {label} anlegen
                  </Typography>
                </SelectableCard>
              </Stack>
            </RadioGroupField>
          </SidebarContent>
          <SidebarActions>
            <MultiFormButtonBar
              submitting={isSubmitting}
              submitLabel="Auswählen"
            />
          </SidebarActions>
        </SidebarForm>
      )}
    </Formik>
  );
}
