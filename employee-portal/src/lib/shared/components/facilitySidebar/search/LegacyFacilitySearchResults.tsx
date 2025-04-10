/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

import type { ApiGetReferenceFacilityResponse } from "@eshg/base-api";
import {
  SelectableCard,
  SidebarActions,
  SidebarContent,
  SidebarForm,
} from "@eshg/lib-employee-portal";
import { AlertProps } from "@eshg/lib-portal/components/Alert";
import { SubmitButton } from "@eshg/lib-portal/components/buttons/SubmitButton";
import { RadioGroupField } from "@eshg/lib-portal/components/formFields/RadioGroupField";
import AddOutlined from "@mui/icons-material/AddOutlined";
import SearchOutlined from "@mui/icons-material/SearchOutlined";
import { Button, Stack, Typography } from "@mui/joy";
import { Formik, FormikErrors } from "formik";
import { ReactNode } from "react";

import { FacilityCardContent } from "@/lib/baseModule/components/facility/FacilityCardContent";
import { fullAddress } from "@/lib/shared/helpers/facilityUtils";

interface LegacyFacilitySearchResultsProps {
  facilities: ApiGetReferenceFacilityResponse[];
  header: ReactNode;
  footer: ReactNode;
  cancelButton: ReactNode;
  onSelectFacility: (
    facility: ApiGetReferenceFacilityResponse,
  ) => Promise<void>;
  onCreateFacility: () => void;
}

export function LegacyFacilitySearchResults({
  facilities,
  header,
  footer,
  cancelButton,
  onSelectFacility,
  onCreateFacility,
}: LegacyFacilitySearchResultsProps) {
  async function handleSubmit({ selected }: { selected: string | null }) {
    const idx = Number(selected);
    if (idx >= 0 && idx < facilities.length) {
      await onSelectFacility(facilities[idx]!);
    }
  }

  function validate(values: { selected: string | null }) {
    const errors: Record<string, string> = {};
    if (values.selected === null) {
      errors.selected =
        "Bitte Einrichtung auswählen oder neue Einrichtung anlegen.";
    }
    return errors;
  }

  function getAlert(
    errors: FormikErrors<{ selected: null }>,
  ): AlertProps | undefined {
    if (errors.selected) {
      return {
        title: errors.selected,
        color: "danger",
      };
    }

    return undefined;
  }
  const formTitle = "Neue Einrichtung anlegen";

  return (
    <Formik
      initialValues={{ selected: null }}
      onSubmit={handleSubmit}
      validate={validate}
    >
      {({ isSubmitting, errors }) => (
        <SidebarForm aria-label={formTitle}>
          <SidebarContent
            title={formTitle}
            header={header}
            footer={facilities.length > 0 && footer}
            alert={getAlert(errors)}
          >
            {facilities.length === 0 ? (
              <FacilityNoSearchResults onCreateFacility={onCreateFacility} />
            ) : (
              <RadioGroupField name="selected">
                {facilities.map((facility, idx) => (
                  <SelectableCard
                    key={facility.name + idx}
                    value={idx}
                    sx={{ mb: 2 }}
                  >
                    <FacilityCardContent
                      address={fullAddress(facility.contactAddress)}
                      {...facility}
                    />
                  </SelectableCard>
                ))}
              </RadioGroupField>
            )}
          </SidebarContent>

          <SidebarActions>
            <Stack direction="row" gap={2} sx={{ justifyContent: "end" }}>
              {cancelButton}
              {facilities.length > 0 && (
                <SubmitButton
                  submitting={isSubmitting}
                  color="primary"
                  variant="solid"
                >
                  Weiter
                </SubmitButton>
              )}
            </Stack>
          </SidebarActions>
        </SidebarForm>
      )}
    </Formik>
  );
}

function FacilityNoSearchResults({
  onCreateFacility,
}: {
  onCreateFacility: () => void;
}) {
  return (
    <Stack alignItems="center" gap={2} marginTop={7}>
      <SearchOutlined size="lg" />
      <Typography level="body-md">Keine Treffer</Typography>
      <Button
        variant="outlined"
        startDecorator={<AddOutlined />}
        onClick={onCreateFacility}
      >
        Neue Einrichtung anlegen
      </Button>
    </Stack>
  );
}
