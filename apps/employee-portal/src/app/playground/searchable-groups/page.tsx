/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

"use client";

import { Sheet, Stack, Typography } from "@mui/joy";
import { Formik } from "formik";

import {
  MainContentLayout,
  SearchableGroup,
  SearchableGroups,
} from "@eshg/lib-employee-portal";
import { CheckboxField, FormPlus, SubmitButton } from "@eshg/lib-portal";

export default function PlaygroundSearchableGroupsPage() {
  const groups = [
    {
      name: "Team 1",
      inAccordion: true,
      items: [
        { key: "Richie", searchableValue: "Richie" },
        { key: "Kerri", searchableValue: "Kerri" },
        { key: "Joy", searchableValue: "Joy" },
        { key: "Hollie", searchableValue: "Hollie" },
        { key: "Caprice", searchableValue: "Caprice" },
      ],
    },
    {
      name: "Team 2",
      inAccordion: false,
      items: [
        { key: "Richie", searchableValue: "Richie" },
        { key: "Linette", searchableValue: "Linette" },
        { key: "Alyson", searchableValue: "Alyson" },
        { key: "Jeni", searchableValue: "Jeni" },
        { key: "Oli", searchableValue: "Oli" },
        { key: "Caleb", searchableValue: "Caleb" },
      ],
    },
  ] satisfies SearchableGroup[];

  const initialValues = { userNames: [] };

  return (
    <MainContentLayout>
      <Sheet>
        <Formik
          initialValues={initialValues}
          onSubmit={(values) => {
            // eslint-disable-next-line no-console
            console.log("Submitted:", values.userNames.join(", "));
          }}
        >
          {({ isSubmitting }) => (
            <FormPlus>
              <Stack spacing={2}>
                <SearchableGroups
                  groups={groups}
                  label="Nutzer"
                  placeholder="Suche in Teams"
                  renderItem={(item) => (
                    <CheckboxField
                      name="userNames"
                      representingValue={item.key}
                      label={item.searchableValue}
                    />
                  )}
                  renderGroup={(group, renderItems) => (
                    <Stack gap={1}>
                      <Typography level="title-md">
                        Hier könnte Ihre Werbung stehen!
                      </Typography>
                      {renderItems(group.items)}
                    </Stack>
                  )}
                />
                <SubmitButton submitting={isSubmitting}>Submit</SubmitButton>
              </Stack>
            </FormPlus>
          )}
        </Formik>
      </Sheet>
    </MainContentLayout>
  );
}
