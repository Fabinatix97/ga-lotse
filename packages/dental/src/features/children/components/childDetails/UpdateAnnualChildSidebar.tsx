/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { Divider, Stack, Typography } from "@mui/joy";
import { FormikProvider, useFormik } from "formik";
import { isDefined } from "remeda";

import { ApiBooleanWithUnknown, UpdateChildRequest } from "@eshg/dental-api";
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
import {
  BooleanSelectField,
  DateField,
  SelectField,
  isEmptyString,
  mapOptionalValue,
  toDateString,
  useSnackbar,
  useValidatePastOrTodayDate,
} from "@eshg/lib-portal";

import { Institution } from "../../../../api/models/Institution";
import { SearchGroupField } from "../../../../components/group/SearchGroupField";
import { childApiQueryKey } from "../../../../config/apiQueryKeys";
import { FLUORIDATION_CONSENTED_OPTIONS } from "../../../../config/child";
import { SCHOOL_OR_DAYCARE_CONTACT } from "../../../../config/contacts";
import { useDentalApi } from "../../../../contexts/dental";
import {
  FluoridationConsent,
  mapFluoridationConsentToFormValues,
  mapFluoridationConsentToRequest,
} from "../../../../utils/childDetails/FluoridationConsent";
import { validateAllergy } from "../../../../utils/childDetails/validateAllergy";
import { ChildDetails } from "../../api/models/ChildDetails";
import { useUpdateAnnualChild } from "../../api/mutations/details";

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
      fluoridationConsent: mapFluoridationConsentToFormValues(
        annualChild.currentFluoridationConsent,
      ),
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
      fluoridationConsent: mapFluoridationConsentToRequest(
        values.fluoridationConsent,
      ),
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
  const { isSubmitting, values, setFieldValue } = form;

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
              institution={values.institution}
              freeSolo
            />
            <ProcedureLabelSelection
              procedureLabelApi={procedureLabelApi}
              procedureLabelApiQueryKey={childApiQueryKey}
            />
            <Divider />
            <Typography component="h2">
              Einverständnis zur Fluoridierung
            </Typography>
            <Stack direction="row" gap={2} flexWrap="wrap">
              <SelectField
                name="fluoridationConsent.consented"
                label="Einverständnis"
                options={FLUORIDATION_CONSENTED_OPTIONS}
                required={
                  isDefined(values.fluoridationConsent?.dateOfConsent) &&
                  !isEmptyString(values.fluoridationConsent.dateOfConsent)
                    ? "Bitte Einverständnis auswählen."
                    : undefined
                }
                onChange={(value) => {
                  if (value === ApiBooleanWithUnknown.Unknown) {
                    void setFieldValue(
                      "fluoridationConsent.dateOfConsent",
                      toDateString(new Date()),
                    );
                    void setFieldValue("fluoridationConsent.hasAllergy", "");
                  }
                  if (isEmptyString(value)) {
                    void setFieldValue("fluoridationConsent.dateOfConsent", "");
                    void setFieldValue("fluoridationConsent.hasAllergy", "");
                  }
                }}
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
                disabled={
                  values.fluoridationConsent?.consented ===
                  ApiBooleanWithUnknown.Unknown
                }
              />
              {(values.fluoridationConsent?.consented ===
                ApiBooleanWithUnknown.True ||
                values.fluoridationConsent?.consented ===
                  ApiBooleanWithUnknown.False) && (
                <BooleanSelectField
                  name="fluoridationConsent.hasAllergy"
                  label="Allergie"
                  allowDeselection
                  sx={{ width: "120px" }}
                  validate={(value) =>
                    validateAllergy(value, form.values.fluoridationConsent)
                  }
                />
              )}
            </Stack>
          </Stack>
        </SidebarContent>
        <SidebarActions>
          <FormButtonBar
            submitting={isSubmitting}
            submitLabel="Speichern"
            onCancel={() => props.onClose()}
          />
        </SidebarActions>
      </SidebarForm>
    </FormikProvider>
  );
}
