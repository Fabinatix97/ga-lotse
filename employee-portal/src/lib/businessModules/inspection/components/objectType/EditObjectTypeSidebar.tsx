/**
 * Copyright 2024 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { ApiObjectType } from "@eshg/employee-portal-api/inspection";
import { FormPlus } from "@eshg/lib-portal/components/form/FormPlus";
import { NumberField } from "@eshg/lib-portal/components/formFields/NumberField";
import {
  validateIntegerAnd,
  validateRange,
} from "@eshg/lib-portal/helpers/validators";
import { OptionalFieldValue } from "@eshg/lib-portal/types/form";
import { Grid } from "@mui/joy";
import { Formik } from "formik";

import { useUpdateObjectType } from "@/lib/businessModules/inspection/api/mutations/objectTypes";
import { OverlayBoundary } from "@/lib/shared/components/boundaries/OverlayBoundary";
import { useConfirmationDialog } from "@/lib/shared/components/confirmationDialog/ConfirmationDialogProvider";
import { FormButtonBar } from "@/lib/shared/components/form/FormButtonBar";
import { CheckboxField } from "@/lib/shared/components/formFields/CheckboxField";
import { Sidebar } from "@/lib/shared/components/sidebar/Sidebar";
import { SidebarActions } from "@/lib/shared/components/sidebar/SidebarActions";
import { SidebarContent } from "@/lib/shared/components/sidebar/SidebarContent";

export interface EditableObjectType {
  id: string;
  routineInterval: OptionalFieldValue<number>;
  complaintInterval: OptionalFieldValue<number>;
  standardDuration: OptionalFieldValue<number>;
  standardBufferTime: OptionalFieldValue<number>;
  emailAnnouncement: boolean;
}

interface EditObjectTypeSidebarProps {
  open: boolean;
  onClose: () => void;
  objectType: ApiObjectType;
}

export function EditObjectTypeSidebar(props: EditObjectTypeSidebarProps) {
  return (
    <OverlayBoundary>
      <EditObjectTypeSidebarWithQueriesAndMutations {...props} />
    </OverlayBoundary>
  );
}

function EditObjectTypeSidebarWithQueriesAndMutations({
  open,
  onClose,
  objectType,
}: Readonly<EditObjectTypeSidebarProps>) {
  const { openConfirmationDialog, openCancelDialog } = useConfirmationDialog();

  const initialValues: EditableObjectType = {
    ...objectType,
    routineInterval: objectType.routineInterval ?? 730,
    complaintInterval: objectType.complaintInterval ?? 365,
    standardDuration: objectType.standardDuration ?? 3,
    standardBufferTime: objectType.standardBufferTime ?? 120,
  };

  const { mutateAsync: saveObjectType } = useUpdateObjectType();

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
        onConfirm: () => saveObjectType(values, { onSuccess: onClose }),
      });
    } else {
      openConfirmationDialog({
        onConfirm: () => saveObjectType(values, { onSuccess: onClose }),
      });
    }
    return Promise.resolve();
  }

  function handleClose(dirty: boolean, handleReset: () => void) {
    if (!dirty) {
      handleReset();
      onClose();
      return;
    }
    openCancelDialog({
      onConfirm: () => {
        handleReset();
        onClose();
      },
    });
  }

  return (
    <Formik
      initialValues={initialValues}
      onSubmit={(values: EditableObjectType) => saveWithConfirmation(values)}
      onReset={onClose}
      enableReinitialize
    >
      {({ isSubmitting, dirty, handleReset }) => (
        <Sidebar open={open} onClose={() => handleClose(dirty, handleReset)}>
          <FormPlus style={{ display: "contents" }}>
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
                onCancel={() => handleClose(dirty, handleReset)}
              />
            </SidebarActions>
          </FormPlus>
        </Sidebar>
      )}
    </Formik>
  );
}
