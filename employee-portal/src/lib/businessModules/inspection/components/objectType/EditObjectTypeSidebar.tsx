/**
 * Copyright 2025 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { ApiObjectType } from "@eshg/employee-portal-api/inspection";
import { NumberField } from "@eshg/lib-portal/components/formFields/NumberField";
import {
  validateIntegerAnd,
  validateRange,
} from "@eshg/lib-portal/helpers/validators";
import { OptionalFieldValue } from "@eshg/lib-portal/types/form";
import { Grid } from "@mui/joy";
import { Formik } from "formik";

import { useUpdateObjectType } from "@/lib/businessModules/inspection/api/mutations/objectTypes";
import { FormButtonBar } from "@/lib/shared/components/form/FormButtonBar";
import { SidebarForm } from "@/lib/shared/components/form/SidebarForm";
import { CheckboxField } from "@/lib/shared/components/formFields/CheckboxField";
import { SidebarActions } from "@/lib/shared/components/sidebar/SidebarActions";
import { SidebarContent } from "@/lib/shared/components/sidebar/SidebarContent";
import { useConfirmationDialog } from "@/lib/shared/hooks/useConfirmationDialog";
import {
  SidebarWithFormRefProps,
  useSidebarWithFormRef,
} from "@/lib/shared/hooks/useSidebarWithFormRef";

export interface EditableObjectType {
  id: string;
  routineInterval: OptionalFieldValue<number>;
  complaintInterval: OptionalFieldValue<number>;
  standardDuration: OptionalFieldValue<number>;
  standardBufferTime: OptionalFieldValue<number>;
  emailAnnouncement: boolean;
}

interface EditObjectTypeSidebarProps extends SidebarWithFormRefProps {
  objectType: ApiObjectType;
}

export function useEditObjectTypeSidebar() {
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

  const initialValues: EditableObjectType = {
    ...objectType,
    routineInterval: objectType.routineInterval ?? 730,
    complaintInterval: objectType.complaintInterval ?? 365,
    standardDuration: objectType.standardDuration ?? 3,
    standardBufferTime: objectType.standardBufferTime ?? 120,
  };

  const { mutateAsync: saveObjectType } = useUpdateObjectType({
    onSuccess: () => onClose(true),
  });

  function saveWithConfirmation(values: EditableObjectType) {
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
        onConfirm: () => saveObjectType(values),
      });
    } else {
      openConfirmationDialog({
        onConfirm: () => saveObjectType(values),
      });
    }
    return Promise.resolve();
  }

  return (
    <Formik
      initialValues={initialValues}
      onSubmit={saveWithConfirmation}
      onReset={() => onClose(true)}
      enableReinitialize
    >
      {({ isSubmitting }) => (
        <SidebarForm ref={formRef}>
          <SidebarContent title={`${objectType.name} bearbeiten`}>
            <Grid container columnSpacing={1} rowSpacing={3}>
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
