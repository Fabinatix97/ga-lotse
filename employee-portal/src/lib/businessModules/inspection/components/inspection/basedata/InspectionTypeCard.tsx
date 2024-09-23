/**
 * Copyright 2024 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

"use client";

import { ApiUserRole } from "@eshg/employee-portal-api/base";
import { ApiInspection } from "@eshg/employee-portal-api/inspection";
import { formatPersonName } from "@eshg/lib-portal/formatters/person";
import { SetFieldValueHelper } from "@eshg/lib-portal/types/form";
import { Divider, Grid, Stack } from "@mui/joy";
import { Formik } from "formik";
import { useRef } from "react";

import { useUpdateInspection } from "@/lib/businessModules/inspection/api/mutations/inspection";
import { useGetSelfUser } from "@/lib/businessModules/inspection/api/queries/users";
import { InspectionAssigneeSelection } from "@/lib/businessModules/inspection/components/inspection/assignee/InspectionAssigneeSelection";
import { translateInspectionType } from "@/lib/businessModules/inspection/shared/enums";
import { OverlayBoundary } from "@/lib/shared/components/boundaries/OverlayBoundary";
import { DetailsCell } from "@/lib/shared/components/detailsSection/DetailsCell";
import {
  DetailsSection,
  SimplifiedModalProps,
} from "@/lib/shared/components/detailsSection/DetailsSection";
import { FormButtonBar } from "@/lib/shared/components/form/FormButtonBar";
import {
  SidebarForm,
  SidebarFormHandle,
} from "@/lib/shared/components/form/SidebarForm";
import { CheckboxField } from "@/lib/shared/components/formFields/CheckboxField";
import { InformationSheet } from "@/lib/shared/components/infoTile/InformationSheet";
import { Sidebar } from "@/lib/shared/components/sidebar/Sidebar";
import { SidebarActions } from "@/lib/shared/components/sidebar/SidebarActions";
import { SidebarContent } from "@/lib/shared/components/sidebar/SidebarContent";
import { useHasUserRoleCheck } from "@/lib/shared/hooks/useAccessControl";

export function InspectionTypeCard({
  inspection,
  readonly,
}: Readonly<{
  inspection: ApiInspection;
  readonly?: boolean;
}>) {
  return (
    <InformationSheet>
      <DetailsSection
        name="inspectionType"
        title="Begehungsart"
        renderEditModal={
          !readonly
            ? (props) => (
                <OverlayBoundary>
                  <EditInspectionTypeSidebar
                    inspection={inspection}
                    modalProps={props}
                  />
                </OverlayBoundary>
              )
            : undefined
        }
      >
        <Grid container direction="column" gap={2}>
          <DetailsCell
            name="type"
            label="Art"
            value={translateInspectionType(inspection.type)}
          />
          <DetailsCell
            name="challenging"
            label="Besonderheiten"
            value={inspection.challenging ? "Schwierige Gegebenheit" : "keine"}
          />
          <DetailsCell
            name="assignee"
            label="Zugewiesene:r Bearbeiter:in"
            value={formatPersonName({
              firstName: inspection.assignee?.firstName,
              lastName: inspection.assignee?.lastName,
            })}
          />
        </Grid>
      </DetailsSection>
    </InformationSheet>
  );
}

function EditInspectionTypeSidebar({
  inspection,
  modalProps,
}: Readonly<{
  inspection: ApiInspection;
  modalProps: SimplifiedModalProps;
}>) {
  const { data: selfUser } = useGetSelfUser();
  const initialValues: {
    challenging: boolean;
    assigneeId?: string;
    assigneeName: string;
  } = {
    challenging: inspection.challenging,
    assigneeId: inspection.assignee?.userId,
    assigneeName: formatPersonName({
      firstName: inspection.assignee?.firstName,
      lastName: inspection.assignee?.lastName,
    }),
  };
  const sidebarFormRef = useRef<SidebarFormHandle>(null);
  const { mutateAsync: updateInspection } = useUpdateInspection();
  const onlySelfAssignable = !useHasUserRoleCheck(
    ApiUserRole.InspectionProcedureAssign,
  );

  async function updateInspectionProperties(
    challenging?: boolean,
    assigneeId?: string,
    onDone?: () => void,
  ) {
    await updateInspection({
      id: inspection.externalId,
      apiUpdateInspectionRequest: {
        challenging,
        assigneeId,
      },
    });
    onDone?.();
  }

  function closeAndReset() {
    sidebarFormRef.current?.resetForm();
    modalProps.onClose();
  }

  function handleSelfAssign(setFieldValue: SetFieldValueHelper) {
    void setFieldValue("assigneeId", selfUser.userId);
    void setFieldValue(
      "assigneeName",
      formatPersonName({
        firstName: selfUser.firstName,
        lastName: selfUser.lastName,
      }),
    );
  }

  return (
    <Sidebar {...modalProps} onClose={closeAndReset}>
      <Formik
        initialValues={initialValues}
        onSubmit={({ challenging, assigneeId }) =>
          updateInspectionProperties(
            challenging,
            assigneeId,
            modalProps.onClose,
          )
        }
        enableReinitialize
      >
        {({ isSubmitting, setFieldValue, values }) => (
          <SidebarForm ref={sidebarFormRef}>
            <SidebarContent title={"Begehungsart bearbeiten"}>
              <Stack spacing={2}>
                <CheckboxField
                  name="challenging"
                  label="Schwierige Gegebenheit"
                />
                <Divider />
                <InspectionAssigneeSelection
                  selfUser={selfUser}
                  onSelfAssign={() => handleSelfAssign(setFieldValue)}
                  currentAssigneeName={values.assigneeName}
                  currentAssigneeId={values.assigneeId ?? selfUser.userId}
                  onlySelfAssignable={onlySelfAssignable}
                  assigneeIdFieldValueName="assigneeId"
                />
              </Stack>
            </SidebarContent>
            <SidebarActions>
              <FormButtonBar
                submitLabel="Speichern"
                submitting={isSubmitting}
                onCancel={closeAndReset}
              />
            </SidebarActions>
          </SidebarForm>
        )}
      </Formik>
    </Sidebar>
  );
}
