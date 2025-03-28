/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import {
  SidebarContent,
  SidebarForm,
  useSearchContactsQuery,
} from "@eshg/lib-employee-portal";
import { LoadingIndicator } from "@eshg/lib-portal/components/LoadingIndicator";
import { InputField } from "@eshg/lib-portal/components/formFields/InputField";
import { isNonEmptyString } from "@eshg/lib-portal/helpers/guards";
import { Stack } from "@mui/joy";
import { Formik } from "formik";
import { useState } from "react";
import { useDebounce } from "use-debounce";

import { InstitutionContactCard } from "@/lib/baseModule/components/contacts/forms/card/InstitutionContactCard";
import { ContactSearchFormResults } from "@/lib/baseModule/components/contacts/forms/search/ContactSearchFormResults";

export function InstitutionContactSearchForm({
  onCreate,
}: {
  onCreate: (name: string, street: string) => void;
}) {
  const [name, setName] = useState("");
  const [street, setStreet] = useState("");

  const [request] = useDebounce(
    {
      name: name,
      street: street,
      type: "INSTITUTION",
      pageSize: 5,
      sortKey: "RELEVANCE",
      sortDirection: "DESC",
    } as const,
    250,
  );

  const enabled =
    isNonEmptyString(request.name) || isNonEmptyString(request.street);

  const query = useSearchContactsQuery(request, {
    enabled,
  });

  return (
    <Formik
      initialValues={{ name: "", street: "" }}
      onSubmit={() => {
        /* do nothing */
      }}
    >
      <SidebarForm>
        <SidebarContent title={"Neue Institution anlegen"}>
          <Stack gap={2}>
            <InputField label={"Name"} name={"name"} onChange={setName} />
            <InputField name={"street"} label={"Straße"} onChange={setStreet} />
            {enabled &&
              (query.isLoading || query.isPlaceholderData ? (
                <LoadingIndicator marginBlock={"auto"} fullHeight />
              ) : (
                query.isSuccess && (
                  <ContactSearchFormResults
                    searchTerm={request.name}
                    label={"Institution"}
                    elements={query.data.elements}
                    totalNumberOfElements={query.data.totalNumberOfElements}
                    onCreateNew={() => onCreate(request.name, request.street)}
                    renderCard={(contact) => (
                      <InstitutionContactCard contact={contact} />
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
