/**
 * Copyright 2026 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { Grid } from "@mui/joy";
import { useSuspenseQueries } from "@tanstack/react-query";
import { Formik } from "formik";

import { ApiObjectType } from "@eshg/inspection-api";
import {
  FormButtonBar,
  SidebarActions,
  SidebarContent,
  SidebarForm,
  SidebarWithFormRefProps,
  useConfirmationDialog,
  useSidebarWithFormRef,
} from "@eshg/lib-employee-portal";
import {
  CheckboxField,
  NumberField,
  OptionalFieldValue,
  TextareaField,
  formatUserName,
  validateIntegerAnd,
  validateRange,
} from "@eshg/lib-portal";

import { useUserApi } from "@/lib/baseModule/api/clients";
import { useUpdateObjectType } from "@/lib/businessModules/inspection/api/mutations/objectTypes";
import { useIsNewFeatureEnabled } from "@/lib/businessModules/inspection/api/queries/feature";
import { getAllAssignableUsersQuery } from "@/lib/businessModules/inspection/api/queries/users";
import { AssigneeAutocompleteField } from "@/lib/businessModules/inspection/components/inspection/assignee/AssigneeAutocompleteField";

export interface EditableObjectType {
  id: string;
  routineInterval: OptionalFieldValue<number>;
  complaintInterval: OptionalFieldValue<number>;
  standardDuration: OptionalFieldValue<number>;
  standardBufferTime: OptionalFieldValue<number>;
  emailAnnouncement: boolean;
  legalBasis: OptionalFieldValue<string>;
  routineIntervalRadio: string;
  complaintIntervalRadio: string;
  designatedAssigneeId: string | null | undefined;
}

interface EditObjectTypeSidebarProps extends SidebarWithFormRefProps {
  objectType: ApiObjectType;
}

export function useEditObjectTypeSidebarOld() {
  return useSidebarWithFormRef({
    component: EditObjectTypeSidebarWithQueriesAndMutations,
  });
}

function EditObjectTypeSidebarWithQueriesAndMutations({
  onClose,
  formRef,
  objectType,
}: Readonly<EditObjectTypeSidebarProps>) {
  const { openConfirmationDialog } = useConfirmationDialog();

  const featureToggleAssigneeEnabled = useIsNewFeatureEnabled(
    "OBJECT_TYPE_ASSIGNEE",
  );

  const userApi = useUserApi();

  const [{ data: allAssignableUsers }] = useSuspenseQueries({
    queries: [getAllAssignableUsersQuery(userApi)],
  });

  const assignableUsersOptions = allAssignableUsers.map((option) => ({
    value: option.userId,
    label: formatUserName(option),
  }));

  const initialValues: EditableObjectType = {
    ...objectType,
    routineInterval: objectType.routineInterval ?? 730,
    complaintInterval: objectType.complaintInterval ?? 365,
    standardDuration: objectType.standardDuration ?? 3,
    standardBufferTime: objectType.standardBufferTime ?? 120,
    legalBasis: objectType.legalBasis ?? "",
    complaintIntervalRadio: "",
    routineIntervalRadio: "",
    designatedAssigneeId: objectType.designatedAssigneeId ?? "",
  };

  const { mutateAsync: saveObjectType } = useUpdateObjectType();

  function saveWithConfirmation(values: EditableObjectType) {
    async function confirmSave() {
      await saveObjectType(values, {
        onSuccess: () => onClose(true),
      });
    }

    if (
      initialValues.routineInterval !== values.routineInterval ||
      initialValues.complaintInterval !== values.complaintInterval
    ) {
      openConfirmationDialog({
        title: "Änderung speichern?",
        description:
          "Möchten Sie die Änderung wirklich speichern? Da mindestens ein Intervall geändert wurde, werden die Termine für anstehende Begehungen angepasst.",
        confirmLabel: "Speichern und Inspektionen anpassen",
        color: "danger",
        onConfirm: confirmSave,
      });
    } else {
      openConfirmationDialog({
        onConfirm: confirmSave,
      });
    }
    return Promise.resolve();
  }

  return (
    <Formik
      initialValues={initialValues}
      enableReinitialize
      onSubmit={saveWithConfirmation}
    >
      {({ isSubmitting }) => (
        <SidebarForm ref={formRef} aria-label={`${objectType.name} bearbeiten`}>
          <SidebarContent title={`${objectType.name} bearbeiten`}>
            <Grid container columnSpacing={1} rowSpacing={3}>
              {featureToggleAssigneeEnabled && (
                <Grid xs={12}>
                  <AssigneeAutocompleteField
                    name="designatedAssigneeId"
                    options={assignableUsersOptions}
                    label="Zuständiger Mitarbeiter::in"
                  />
                </Grid>
              )}
              <Grid xs={12}>
                <NumberField
                  name="routineInterval"
                  label="Intervall für Routinebegehungen (Tage)"
                  required="Bitte füllen Sie dieses Feld aus"
                  validate={validateIntegerAnd(validateRange(1, 9999))}
                />
              </Grid>
              <Grid xs={12}>
                <NumberField
                  name="complaintInterval"
                  label="Intervall für Begehungen nach Beanstandungen (Tage)"
                  required="Bitte füllen Sie dieses Feld aus"
                  validate={validateIntegerAnd(validateRange(1, 9999))}
                />
              </Grid>
              <Grid xs={12}>
                <NumberField
                  name="standardDuration"
                  label="Standarddauer (Stunden)"
                  required="Bitte füllen Sie dieses Feld aus"
                  validate={validateIntegerAnd(validateRange(1, 99))}
                />
              </Grid>
              <Grid xs={12}>
                <NumberField
                  name="standardBufferTime"
                  label="Standardpufferzeit für die Anfahrt (Minuten)"
                  required="Bitte füllen Sie dieses Feld aus"
                  validate={validateIntegerAnd(validateRange(0, 9999))}
                />
              </Grid>
              <Grid xs={12}>
                <CheckboxField
                  name="emailAnnouncement"
                  label="Begehungen für diesen Objekttyp müssen angekündigt werden"
                />
              </Grid>
              <Grid xs={12}>
                <TextareaField
                  name="legalBasis"
                  label="Standardtext Rechtsgrundlage"
                />
              </Grid>
            </Grid>
          </SidebarContent>
          <SidebarActions>
            <FormButtonBar
              submitLabel="Speichern"
              submitting={isSubmitting}
              onCancel={() => onClose(false)}
            />
          </SidebarActions>
        </SidebarForm>
      )}
    </Formik>
  );
}
