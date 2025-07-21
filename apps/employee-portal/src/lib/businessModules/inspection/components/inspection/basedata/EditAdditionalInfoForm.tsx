/**
 * Copyright 2025 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { Button, DialogTitle, Divider, Stack } from "@mui/joy";
import { useSuspenseQueries } from "@tanstack/react-query";
import { Formik } from "formik";
import { Ref } from "react";

import { ApiUserRole } from "@eshg/base-api";
import { ApiInspection } from "@eshg/inspection-api";
import {
  DetailsItem,
  MultiFormButtonBar,
  SidebarActions,
  SidebarContent,
  SidebarForm,
  SidebarFormHandle,
  useHasUserRoleCheck,
} from "@eshg/lib-employee-portal";
import {
  CheckboxField,
  SetFieldValueHelper,
  formatPersonName,
} from "@eshg/lib-portal";

import { useUserApi } from "@/lib/baseModule/api/clients";
import {
  getAllAssignableUsersQuery,
  getSelfUserQuery,
} from "@/lib/businessModules/inspection/api/queries/users";
import { InspectionAssigneeSelection } from "@/lib/businessModules/inspection/components/inspection/assignee/InspectionAssigneeSelection";
import { translateInspectionType } from "@/lib/businessModules/inspection/shared/enums";

export interface EditAdditionalInfoFormValues {
  challenging?: boolean;
  assigneeId?: string;
  assigneeName: string;
}

interface EditAdditionalInfoFormProps {
  inspection: ApiInspection;
  formRef: Ref<SidebarFormHandle>;
  onCancel: () => void;
  onSubmit: (values: EditAdditionalInfoFormValues) => Promise<void>;
  onEditFileNumber: () => void;
  editFileNumberPending?: boolean;
  title: string;
}

export function EditAdditionalInfoForm({
  inspection,
  editFileNumberPending = false,
  ...props
}: Readonly<EditAdditionalInfoFormProps>) {
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

  const onlySelfAssignable = !useHasUserRoleCheck(
    ApiUserRole.InspectionProcedureAssign,
  );

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
    <Formik
      initialValues={initialValues}
      enableReinitialize
      onSubmit={props.onSubmit}
    >
      {({ isSubmitting, setFieldValue, values }) => (
        <SidebarForm ref={props.formRef}>
          <SidebarContent
            title={
              <DialogTitle level="h2" component="h1">
                {props.title}
              </DialogTitle>
            }
          >
            <Stack spacing={3}>
              {inspection.facility.fileNumber && (
                <>
                  <Stack
                    direction="row"
                    gap={1}
                    sx={{ justifyContent: "space-between" }}
                    data-testid="fileNumberSection"
                  >
                    <DetailsItem
                      label="Aktenzeichen"
                      value={inspection.facility.fileNumber}
                    />
                    <Button
                      color="neutral"
                      variant="soft"
                      sx={{ alignSelf: "center" }}
                      loading={editFileNumberPending}
                      onClick={props.onEditFileNumber}
                    >
                      Aktenzeichen bearbeiten
                    </Button>
                  </Stack>
                  <Divider />
                </>
              )}
              <DetailsItem
                label="Begehungsart"
                value={translateInspectionType(inspection.type)}
              />
              <CheckboxField
                name="challenging"
                label="Schwierige Gegebenheit"
              />
              <Divider />
              <InspectionAssigneeSelection
                selfUser={selfUser}
                currentAssigneeName={values.assigneeName}
                currentAssigneeId={values.assigneeId ?? selfUser.userId}
                onlySelfAssignable={onlySelfAssignable}
                assigneeIdFieldValueName="assigneeId"
                allAssignableUsers={allAssignableUsers}
                onSelfAssign={() => handleSelfAssign(setFieldValue)}
              />
            </Stack>
          </SidebarContent>
          <SidebarActions>
            <MultiFormButtonBar
              submitLabel="Speichern"
              submitting={isSubmitting}
              onCancel={props.onCancel}
            />
          </SidebarActions>
        </SidebarForm>
      )}
    </Formik>
  );
}
