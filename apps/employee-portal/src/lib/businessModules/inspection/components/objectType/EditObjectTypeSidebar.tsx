/**
 * Copyright 2025 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { Grid } from "@mui/joy";
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
  RadioButtonsField,
  TextareaField,
  validateIntegerAnd,
  validateRange,
} from "@eshg/lib-portal";

import { useUpdateObjectType } from "@/lib/businessModules/inspection/api/mutations/objectTypes";

export interface EditableObjectType {
  id: string;
  routineInterval?: OptionalFieldValue<number> | null;
  complaintInterval?: OptionalFieldValue<number> | null;
  standardDuration: OptionalFieldValue<number>;
  standardBufferTime: OptionalFieldValue<number>;
  emailAnnouncement: boolean;
  legalBasis: OptionalFieldValue<string>;
  routineIntervalRadio: string;
  complaintIntervalRadio: string;
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
    routineInterval: objectType.routineInterval ?? null,
    complaintInterval: objectType.complaintInterval ?? null,
    standardDuration: objectType.standardDuration ?? 3,
    standardBufferTime: objectType.standardBufferTime ?? 120,
    legalBasis: objectType.legalBasis ?? "",
    routineIntervalRadio: objectType.routineInterval
      ? "Intervall festlegen"
      : "Kein Intervall",
    complaintIntervalRadio: objectType.complaintInterval
      ? "Intervall festlegen"
      : "Kein Intervall",
  };

  const { mutateAsync: saveObjectType } = useUpdateObjectType();

  function saveWithConfirmation(values: EditableObjectType) {
    const updatedValues: EditableObjectType = {
      ...values,
      routineInterval:
        values.routineIntervalRadio === "Kein Intervall"
          ? null
          : values.routineInterval,
      complaintInterval:
        values.complaintIntervalRadio === "Kein Intervall"
          ? null
          : values.complaintInterval,
    };
    async function confirmSave() {
      await saveObjectType(updatedValues, {
        onSuccess: () => onClose(true),
      });
    }

    if (
      initialValues.routineInterval !== values.routineInterval ||
      initialValues.complaintInterval !== values.complaintInterval ||
      initialValues.routineIntervalRadio !== values.routineIntervalRadio ||
      initialValues.complaintIntervalRadio !== values.complaintIntervalRadio
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

  const intervalOptions = [
    { label: "Kein Intervall", value: "Kein Intervall" },
    { label: "Intervall festlegen", value: "Intervall festlegen" },
  ];

  return (
    <Formik
      initialValues={initialValues}
      enableReinitialize
      onSubmit={saveWithConfirmation}
    >
      {({ isSubmitting, values }) => {
        return (
          <SidebarForm ref={formRef} aria-label={`${objectType.name}`}>
            <SidebarContent title={objectType.name}>
              <Grid container columnSpacing={1} rowSpacing={3}>
                <Grid xs={12}>
                  <RadioButtonsField
                    data-testid="routineIntervalRadio"
                    label="Intervall für Routinebegehungen"
                    name="routineIntervalRadio"
                    options={intervalOptions}
                    orientation="vertical"
                  />
                  <Grid paddingLeft={4}>
                    <NumberField
                      data-testid="routineIntervalInput"
                      name="routineInterval"
                      label="Tage"
                      disabled={
                        values.routineIntervalRadio === "Kein Intervall"
                      }
                      required={
                        values.routineIntervalRadio === "Kein Intervall"
                          ? undefined
                          : "Bitte füllen Sie dieses Feld aus"
                      }
                      validate={
                        values.routineIntervalRadio === "Intervall festlegen"
                          ? validateIntegerAnd(validateRange(1, 9999))
                          : undefined
                      }
                    />
                  </Grid>
                </Grid>
                <Grid xs={12}>
                  <RadioButtonsField
                    data-testid="complaintIntervalRadio"
                    label="Intervall für Routinebegehungen nach Beanstandungen"
                    name="complaintIntervalRadio"
                    options={intervalOptions}
                    orientation="vertical"
                  />
                  <Grid paddingLeft={4}>
                    <NumberField
                      data-testid="complaintIntervalInput"
                      name="complaintInterval"
                      label="Tage"
                      disabled={
                        values.complaintIntervalRadio === "Kein Intervall"
                      }
                      required={
                        values.complaintIntervalRadio === "Kein Intervall"
                          ? undefined
                          : "Bitte füllen Sie dieses Feld aus"
                      }
                      validate={
                        values.complaintIntervalRadio === "Intervall festlegen"
                          ? validateIntegerAnd(validateRange(1, 9999))
                          : undefined
                      }
                    />
                  </Grid>
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
        );
      }}
    </Formik>
  );
}
