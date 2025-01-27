/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { UpdateChildRequest } from "@eshg/dental-api";
import { ChildDetails } from "@eshg/dental/api/models/ChildDetails";
import { Institution } from "@eshg/dental/api/models/Institution";
import { useUpdateAnnualChild } from "@eshg/dental/api/mutations/childApi";
import { BooleanSelectField } from "@eshg/lib-portal/components/formFields/BooleanSelectField";
import { DateField } from "@eshg/lib-portal/components/formFields/DateField";
import { useSnackbar } from "@eshg/lib-portal/components/snackbar/SnackbarProvider";
import { toDateString, toUtcDate } from "@eshg/lib-portal/helpers/dateTime";
import {
  mapOptionalValue,
  parseOptionalValue,
} from "@eshg/lib-portal/helpers/form";
import { isEmptyString } from "@eshg/lib-portal/helpers/guards";
import { validatePastOrTodayDate } from "@eshg/lib-portal/helpers/validators";
import { OptionalFieldValue } from "@eshg/lib-portal/types/form";
import { Divider, Stack, Typography } from "@mui/joy";
import { FormikProvider, useFormik } from "formik";
import { isDefined } from "remeda";

import { SCHOOL_OR_DAYCARE } from "@/lib/baseModule/api/queries/contacts";
import { SearchGroupField } from "@/lib/businessModules/dental/features/prophylaxisSessions/SearchGroupField";
import { FormButtonBar } from "@/lib/shared/components/form/FormButtonBar";
import { SidebarForm } from "@/lib/shared/components/form/SidebarForm";
import { SelectMultipleContactsField } from "@/lib/shared/components/formFields/SelectMultipleContactsField";
import { SidebarActions } from "@/lib/shared/components/sidebar/SidebarActions";
import { SidebarContent } from "@/lib/shared/components/sidebar/SidebarContent";
import {
  SidebarWithFormRefProps,
  UseSidebarWithFormRefResult,
  useSidebarWithFormRef,
} from "@/lib/shared/hooks/useSidebarWithFormRef";

interface FluoridationConsent {
  consented: boolean;
  dateOfConsent: OptionalFieldValue<string>;
  hasAllergy: OptionalFieldValue<boolean>;
}

export function useUpdateAnnualChildSidebar(): UseSidebarWithFormRefResult<UpdateAnnualChildSidebarProps> {
  return useSidebarWithFormRef({
    component: UpdateAnnualChildSidebar,
  });
}

export interface UpdateAnnualChildValues {
  institution: Institution;
  groupName: string;
  fluoridationConsent?: FluoridationConsent;
}

interface UpdateAnnualChildSidebarProps extends SidebarWithFormRefProps {
  child: ChildDetails;
}

function useUpdateAnnualChildForm(
  annualChild: ChildDetails,
  onSuccess: () => void,
) {
  const updateAnnualChild = useUpdateAnnualChild(annualChild.id);
  const snackbar = useSnackbar();
  return useFormik<UpdateAnnualChildValues>({
    initialValues: {
      institution: annualChild.institution,
      groupName: annualChild.groupName,
      fluoridationConsent: annualChild.currentFluoridationConsent
        ? {
            consented: annualChild.currentFluoridationConsent.consented,
            dateOfConsent: toDateString(
              annualChild.currentFluoridationConsent.dateOfConsent,
            ),
            hasAllergy: parseOptionalValue(
              annualChild.currentFluoridationConsent.hasAllergy,
            ),
          }
        : undefined,
    },
    onSubmit: (values) => {
      updateAnnualChild
        .mutateAsync(mapValues(values, annualChild), {
          onSuccess,
        })
        .catch(() =>
          snackbar.error("Die Daten konnten nicht geändert werden."),
        );
    },
  });
}

function mapValues(
  values: UpdateAnnualChildValues,
  annualChild: ChildDetails,
): UpdateChildRequest {
  return {
    childId: annualChild.id,
    apiUpdateChildRequest: {
      groupName: values.groupName,
      institutionId: values.institution.id,
      fluoridationConsent:
        values.fluoridationConsent &&
        !isEmptyString(values.fluoridationConsent.consented) &&
        !isEmptyString(values.fluoridationConsent.dateOfConsent)
          ? {
              consented: values.fluoridationConsent.consented,
              dateOfConsent: toUtcDate(
                values.fluoridationConsent.dateOfConsent,
              ),
              hasAllergy: mapOptionalValue(
                values.fluoridationConsent.hasAllergy,
              ),
            }
          : undefined,
      version: annualChild.version,
    },
  };
}

function UpdateAnnualChildSidebar(props: UpdateAnnualChildSidebarProps) {
  const annualChild = props.child;
  const form = useUpdateAnnualChildForm(annualChild, () => props.onClose(true));
  const { isSubmitting, values } = form;

  function validateAllergy(
    value: OptionalFieldValue<boolean>,
  ): string | undefined {
    if (form.values.fluoridationConsent?.consented && value) {
      return "Es darf keine Erlaubnis erteilt sein, wenn eine Allergie vorliegt.";
    }
  }

  return (
    <>
      <FormikProvider value={form}>
        <SidebarForm ref={props.formRef}>
          <SidebarContent title="Zusatzinfos">
            <Stack gap={2}>
              <SelectMultipleContactsField
                name="institution"
                label="Einrichtung"
                categories={SCHOOL_OR_DAYCARE}
              />
              <Divider />
              <SearchGroupField
                name="groupName"
                label="Gruppe"
                institutionId={annualChild.institution.id}
                freeSolo
              />
              <Divider />
              <Typography>Einverständnis zur Fluoridierung</Typography>
              <Stack direction="row" gap={2} flexWrap="wrap">
                <BooleanSelectField
                  name="fluoridationConsent.consented"
                  label="Einverständnis gegeben"
                  required={
                    isDefined(values.fluoridationConsent?.dateOfConsent) &&
                    !isEmptyString(values.fluoridationConsent.dateOfConsent)
                      ? 'Bitte "Ja" oder "Nein" auswählen.'
                      : undefined
                  }
                  allowDeselection
                />
                <DateField
                  name="fluoridationConsent.dateOfConsent"
                  label="Datum der Einverständniserklärung"
                  validate={(value) =>
                    isDefined(value)
                      ? validatePastOrTodayDate(value)
                      : undefined
                  }
                  required={
                    isDefined(values.fluoridationConsent?.consented) &&
                    !isEmptyString(values.fluoridationConsent.consented)
                      ? "Bitte das Datum der Einverständniserklärung angeben."
                      : undefined
                  }
                />
                <BooleanSelectField
                  name="fluoridationConsent.hasAllergy"
                  label="Allergie"
                  allowDeselection
                  sx={{ width: "120px" }}
                  validate={(value) => validateAllergy(value)}
                />
              </Stack>
            </Stack>
          </SidebarContent>
          <SidebarActions>
            <FormButtonBar
              submitting={isSubmitting}
              submitLabel="Speichern"
              onCancel={props.onClose}
            />
          </SidebarActions>
        </SidebarForm>
      </FormikProvider>
    </>
  );
}
