/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

import { SidebarActions, SidebarContent } from "@eshg/lib-employee-portal";
import { SubmitButton } from "@eshg/lib-portal/components/buttons/SubmitButton";
import { FormPlus } from "@eshg/lib-portal/components/form/FormPlus";
import { InputField } from "@eshg/lib-portal/components/formFields/InputField";
import SearchIcon from "@mui/icons-material/Search";
import { Stack } from "@mui/joy";
import { Formik } from "formik";
import { ReactNode } from "react";

export interface LegacyFacilitySearchFormType {
  search: string;
}

interface LegacyFacilitySearchFormProps {
  search: string;
  onSubmit: (values: LegacyFacilitySearchFormType) => void;
  cancelButton: ReactNode;
}

export function LegacyFacilitySearchForm({
  search,
  onSubmit,
  cancelButton,
}: LegacyFacilitySearchFormProps) {
  const formObject: LegacyFacilitySearchFormType = { search };

  function handleSubmit(values: LegacyFacilitySearchFormType) {
    onSubmit(values);
  }
  const formTitle = "Nach Einrichtung suchen";

  return (
    <>
      <SidebarContent title="Neue Einrichtung anlegen">
        <Formik
          initialValues={formObject}
          onSubmit={handleSubmit}
          enableReinitialize
        >
          {({ isSubmitting }) => (
            <FormPlus aria-label={formTitle}>
              <Stack gap={4}>
                <InputField
                  name="search"
                  label={formTitle}
                  placeholder="Suche"
                  endDecorator={<SearchIcon />}
                  required="Bitte geben Sie einen Namen oder eine Adresse ein"
                />
                <SubmitButton
                  submitting={isSubmitting}
                  startDecorator={<SearchIcon />}
                  sx={{ alignSelf: "end" }}
                >
                  Suche
                </SubmitButton>
              </Stack>
            </FormPlus>
          )}
        </Formik>
      </SidebarContent>

      <SidebarActions>{cancelButton}</SidebarActions>
    </>
  );
}
