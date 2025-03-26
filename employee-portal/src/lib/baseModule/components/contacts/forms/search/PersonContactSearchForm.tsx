/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { SidebarContent, SidebarForm } from "@eshg/lib-employee-portal";
import { LoadingIndicator } from "@eshg/lib-portal/components/LoadingIndicator";
import { InputField } from "@eshg/lib-portal/components/formFields/InputField";
import { isNonEmptyString } from "@eshg/lib-portal/helpers/guards";
import { Stack } from "@mui/joy";
import { Formik } from "formik";
import { useState } from "react";
import { useDebounce } from "use-debounce";

import { useSearchContactsQuery } from "@/lib/baseModule/api/queries/contacts";
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
        <SidebarContent title={"Neue Person anlegen"}>
          <Stack gap={2}>
            <InputField
              label={"Vorname"}
              name={"firstName"}
              onChange={setFirstName}
            />
            <InputField
              name={"lastName"}
              label={"Name"}
              onChange={setLastName}
            />
            {enabled &&
              (query.isLoading || query.isPlaceholderData ? (
                <LoadingIndicator marginBlock={"auto"} fullHeight />
              ) : (
                query.isSuccess && (
                  <ContactSearchFormResults
                    searchTerm={[request.firstName, request.name]
                      .join(" ")
                      .trim()}
                    label={"Person"}
                    elements={query.data.elements}
                    totalNumberOfElements={query.data.totalNumberOfElements}
                    onCreateNew={() =>
                      onCreate(request.firstName, request.name)
                    }
                    renderCard={(contact) => (
                      <PersonContactCard contact={contact} />
                    )}
                  />
                )
              ))}
          </Stack>
        </SidebarContent>
      </SidebarForm>
    </Formik>
  );
}
