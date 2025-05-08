/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { Divider, Stack, Typography } from "@mui/joy";
import { FormikProvider, useFormik } from "formik";
import { isDefined } from "remeda";

import { UpdateChildRequest } from "@eshg/dental-api";
import {
  FormButtonBar,
  ProcedureLabel,
  ProcedureLabelSelection,
  SelectMultipleContactsField,
  SidebarActions,
  SidebarContent,
  SidebarForm,
  SidebarWithFormRefProps,
  UseSidebarWithFormRefResult,
  useSidebarWithFormRef,
} from "@eshg/lib-employee-portal";
import { BooleanSelectField } from "@eshg/lib-portal/components/formFields/BooleanSelectField";
import { DateField } from "@eshg/lib-portal/components/formFields/DateField";
import { useSnackbar } from "@eshg/lib-portal/components/snackbar/SnackbarProvider";
import { toDateString, toUtcDate } from "@eshg/lib-portal/helpers/dateTime";
import {
  mapOptionalValue,
  parseOptionalValue,
} from "@eshg/lib-portal/helpers/form";
import { isEmptyString } from "@eshg/lib-portal/helpers/guards";
import { useValidatePastOrTodayDate } from "@eshg/lib-portal/hooks/useValidators";
import { OptionalFieldValue } from "@eshg/lib-portal/types/form";

import { Institution } from "../../../../api/models/Institution";
import { SearchGroupField } from "../../../../components/group/SearchGroupField";
import { childApiQueryKey } from "../../../../config/apiQueryKeys";
import { SCHOOL_OR_DAYCARE_CONTACT } from "../../../../config/contacts";
import { useDentalApi } from "../../../../contexts/dental";
import { ChildDetails } from "../../api/models/ChildDetails";
import { useUpdateAnnualChild } from "../../api/mutations/details";

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

interface UpdateAnnualChildValues {
  institution: Institution;
  groupName?: string;
  fluoridationConsent?: FluoridationConsent;
  procedureLabels: ProcedureLabel[];
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
      procedureLabels: annualChild.procedureLabels,
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
      groupName: mapOptionalValue(values.groupName),
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
      procedureLabels: values.procedureLabels.map((label) => label.id),
      version: annualChild.version,
    },
  };
}

function UpdateAnnualChildSidebar(props: UpdateAnnualChildSidebarProps) {
  const validatePastOrTodayDate = useValidatePastOrTodayDate();
  const { procedureLabelApi } = useDentalApi();
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
    <FormikProvider value={form}>
      <SidebarForm ref={props.formRef}>
        <SidebarContent title="Zusatzinfos">
          <Stack gap={2}>
            <SelectMultipleContactsField
              name="institution"
              label="Einrichtung"
              categories={SCHOOL_OR_DAYCARE_CONTACT}
            />
            <Divider />
            <SearchGroupField
              name="groupName"
              label="Gruppe"
              institution={annualChild.institution}
              freeSolo
            />
            <ProcedureLabelSelection
              procedureLabelApi={procedureLabelApi}
              procedureLabelApiQueryKey={childApiQueryKey}
            />
            <Divider />
            <Typography>Einverständnis zur Fluoridierung</Typography>
            <Stack direction="row" gap={2} flexWrap="wrap">
              <BooleanSelectField
                name="fluoridationConsent.consented"
                label="Einverständnis"
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
                label="Datum"
                validate={(value) =>
                  isDefined(value) ? validatePastOrTodayDate(value) : undefined
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
  );
}
