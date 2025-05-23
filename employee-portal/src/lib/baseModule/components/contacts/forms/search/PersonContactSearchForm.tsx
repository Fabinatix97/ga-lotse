/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { Stack } from "@mui/joy";
import { Formik } from "formik";
import { useState } from "react";
import { useDebounce } from "use-debounce";

import {
  SidebarContent,
  SidebarForm,
  useSearchContactsQuery,
} from "@eshg/lib-employee-portal";
import {
  InputField,
  LoadingIndicator,
  isNonEmptyString,
} from "@eshg/lib-portal";

import { PersonContactCard } from "@/lib/baseModule/components/contacts/forms/card/PersonContactCard";
import { ContactSearchFormResults } from "@/lib/baseModule/components/contacts/forms/search/ContactSearchFormResults";

export function PersonContactSearchForm({
  onCreate,
}: {
  onCreate: (firstName: string, lastName: string) => void;
}) {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");

  const [request] = useDebounce(
    {
      firstName: firstName,
      name: lastName,
      type: "PERSON",
      pageSize: 5,
      sortKey: "RELEVANCE",
      sortDirection: "DESC",
    } as const,
    250,
  );

  const enabled =
    isNonEmptyString(request.firstName) || isNonEmptyString(request.name);

  const query = useSearchContactsQuery(request, {
    enabled,
  });

  return (
    <Formik
      initialValues={{ firstName: "", lastName: "" }}
      onSubmit={() => {
        /* do nothing */
      }}
    >
      <SidebarForm>
        <SidebarContent title="Neue Person anlegen">
          <Stack gap={2}>
            <InputField
              label="Vorname"
              name="firstName"
              onChange={setFirstName}
            />
            <InputField name="lastName" label="Name" onChange={setLastName} />
            {enabled &&
              (query.isLoading || query.isPlaceholderData ? (
                <LoadingIndicator marginBlock="auto" fullHeight />
              ) : (
                query.isSuccess && (
                  <ContactSearchFormResults
                    searchTerm={[request.firstName, request.name]
                      .join(" ")
                      .trim()}
                    label="Person"
                    elements={query.data.elements}
                    totalNumberOfElements={query.data.totalNumberOfElements}
                    renderCard={(contact) => (
                      <PersonContactCard contact={contact} />
                    )}
                    onCreateNew={() =>
                      onCreate(request.firstName, request.name)
                    }
                  />
                )
              ))}
          </Stack>
        </SidebarContent>
      </SidebarForm>
    </Formik>
  );
}
