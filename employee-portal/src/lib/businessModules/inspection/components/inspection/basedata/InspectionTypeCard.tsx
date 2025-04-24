/**
 * Copyright 2025 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

"use client";

import { ApiUserRole } from "@eshg/base-api";
import { ApiInspection } from "@eshg/inspection-api";
import {
  CheckboxField,
  DetailsItem,
  DetailsSection,
  FormButtonBar,
  InformationSheet,
  OverlayBoundary,
  Sidebar,
  SidebarActions,
  SidebarContent,
  SidebarForm,
  SidebarFormHandle,
  SimplifiedModalProps,
  useHasUserRoleCheck,
} from "@eshg/lib-employee-portal";
import { Alert } from "@eshg/lib-portal/components/Alert";
import { formatPersonName } from "@eshg/lib-portal/formatters/person";
import { SetFieldValueHelper } from "@eshg/lib-portal/types/form";
import { Divider, Grid, Stack } from "@mui/joy";
import { useSuspenseQueries } from "@tanstack/react-query";
import { Formik } from "formik";
import { useRef } from "react";

import { useUserApi } from "@/lib/baseModule/api/clients";
import { useUpdateInspection } from "@/lib/businessModules/inspection/api/mutations/inspection";
import {
  getAllAssignableUsersQuery,
  getSelfUserQuery,
} from "@/lib/businessModules/inspection/api/queries/users";
import { InspectionAssigneeSelection } from "@/lib/businessModules/inspection/components/inspection/assignee/InspectionAssigneeSelection";
import { translateInspectionType } from "@/lib/businessModules/inspection/shared/enums";

export function InspectionTypeCard({
  inspection,
  readonly,
}: Readonly<{
  inspection: ApiInspection;
  readonly?: boolean;
}>) {
  return (
    <InformationSheet>
      {!inspection.assignee && (
        <Alert
          color="primary"
          message="Die Begehung muss eine:r Bearbeiter:in zugewiesen sein."
        />
      )}
      <DetailsSection
        data-testid="inspectionType"
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
          <DetailsItem
            label="Art"
            value={translateInspectionType(inspection.type)}
          />
          <DetailsItem
            label="Besonderheiten"
            value={inspection.challenging ? "Schwierige Gegebenheit" : "keine"}
          />
          <DetailsItem
            label="Zugewiesene:r Bearbeiter:in"
            value={
              inspection.assignee
                ? formatPersonName({
                    firstName: inspection.assignee?.firstName,
                    lastName: inspection.assignee?.lastName,
                  })
                : "-"
            }
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
  const userApi = useUserApi();

  const [{ data: selfUser }, { data: allAssignableUsers }] = useSuspenseQueries(
    {
      queries: [getSelfUserQuery(userApi), getAllAssignableUsersQuery(userApi)],
    },
  );

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
                  allAssignableUsers={allAssignableUsers}
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
