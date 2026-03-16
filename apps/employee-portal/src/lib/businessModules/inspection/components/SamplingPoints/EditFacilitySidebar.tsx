/**
 * Copyright 2026 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

"use client";

import { Grid } from "@mui/joy";
import { useSuspenseQueries } from "@tanstack/react-query";
import { Formik } from "formik";

import {
  FormButtonBar,
  SidebarActions,
  SidebarContent,
  SidebarForm,
  SidebarWithFormRefProps,
  useConfirmationDialog,
  useSidebarWithFormRef,
} from "@eshg/lib-employee-portal";
import { Alert, SetFieldValueHelper, formatPersonName } from "@eshg/lib-portal";

import { useUserApi } from "@/lib/baseModule/api/clients";
import { useAssignUserToFacility } from "@/lib/businessModules/inspection/api/mutations/samplingPoints";
import {
  getAllAssignableUsersQuery,
  getSelfUserQuery,
} from "@/lib/businessModules/inspection/api/queries/users";
import { InspectionAssigneeSelection } from "@/lib/businessModules/inspection/components/inspection/assignee/InspectionAssigneeSelection";

export interface EditableFacility {
  facility: {
    name: string;
    id: string;
  };
  user: {
    label: string;
    value: string;
  };
}

interface EditFacilitySidebarProps extends SidebarWithFormRefProps {
  facilityId?: string;
  facilityName?: string;
  userName?: string;
  userId?: string;
}

export function useEditFacilitySidebar() {
  return useSidebarWithFormRef({
    component: EditFacilitySidebarWithQueriesAndMutations,
  });
}

function EditFacilitySidebarWithQueriesAndMutations({
  onClose,
  formRef,
  facilityId,
  facilityName,
  userName,
  userId,
}: Readonly<EditFacilitySidebarProps>) {
  const { openConfirmationDialog } = useConfirmationDialog();
  const { mutateAsync: assignUserToFacility } = useAssignUserToFacility();
  const userApi = useUserApi();
  const [{ data: selfUser }, { data: allAssignableUsers }] = useSuspenseQueries(
    {
      queries: [getSelfUserQuery(userApi), getAllAssignableUsersQuery(userApi)],
    },
  );

  const initialValues: EditableFacility = {
    facility: {
      name: facilityName!,
      id: facilityId!,
    },
    user: {
      label: userId === undefined ? "" : userName!,
      value: userId ?? "",
    },
  };

  function saveWithConfirmation(values: EditableFacility) {
    async function confirmSave() {
      await assignUserToFacility(
        {
          facilityExternalId: values.facility.id,
          assignUserRequest: {
            assigneeId: values.user.value,
          },
        },
        {
          onSuccess: () => onClose(true),
        },
      );
    }

    openConfirmationDialog({
      onConfirm: confirmSave,
    });
    return Promise.resolve();
  }

  function handleSelfAssign(setFieldValue: SetFieldValueHelper) {
    void setFieldValue("user.value", selfUser.userId);
    void setFieldValue(
      "user.label",
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
      onSubmit={saveWithConfirmation}
    >
      {({ values, isSubmitting, setFieldValue }) => (
        <SidebarForm ref={formRef} aria-label={`${facilityName} bearbeiten`}>
          <SidebarContent title={`${facilityName} bearbeiten`}>
            <Grid container columnSpacing={1} rowSpacing={3}>
              <Grid xxs={12}>
                <Alert
                  color="primary"
                  message="Der für die Einrichtung zuständige Mitarbeiter wird automatisch für alle Vorgänge dieser Einrichtung verwendet."
                />
              </Grid>
              <Grid xs={12}>
                <InspectionAssigneeSelection
                  selfUser={selfUser}
                  currentAssigneeName={values.user.label}
                  currentAssigneeId={values.user.value}
                  onlySelfAssignable={false}
                  assigneeIdFieldValueName="user.value"
                  allAssignableUsers={allAssignableUsers}
                  onSelfAssign={() => handleSelfAssign(setFieldValue)}
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
