/**
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { Stack } from "@mui/joy";
import { Formik, FormikHelpers } from "formik";
import { useState } from "react";

import { ApiPromoteGroupsBulkRequest } from "@eshg/dental-api";
import {
  FormButtonBar,
  SidebarActions,
  SidebarContent,
  SidebarForm,
  SidebarWithFormRefProps,
  UseSidebarWithFormRefResult,
  useSidebarWithFormRef,
} from "@eshg/lib-employee-portal";
import { Alert, TextareaField, mapOptionalValue } from "@eshg/lib-portal";

import { calculateGroupNameForNextSchoolYear } from "../../../schoolYearTransition/calculateGroupNameForNextSchoolYear";
import { usePromoteGroupsInBulk } from "../../api/mutations/schoolYearTransition";

import { SchoolYearTransitionGroupList } from "./SchoolYearTransitionGroupList";
import { TargetGroupView } from "./TargetGroupView";

export function useSchoolPromotionSidebar(): UseSidebarWithFormRefResult<SchoolPromotionSidebarProps> {
  return useSidebarWithFormRef({
    component: SchoolPromotionSidebar,
  });
}

export interface OriginAndTargetGroupNames {
  originGroupName: string;
  targetGroupName: string;
}

export interface SchoolPromotionFormValues {
  groupNames: OriginAndTargetGroupNames[];
}

interface SchoolPromotionSidebarProps extends SidebarWithFormRefProps {
  institutionId: string;
  institutionName: string;
  groupNames: string[];
}

function SchoolPromotionSidebar({
  groupNames,
  institutionId,
  institutionName,
  onClose,
  formRef,
}: SchoolPromotionSidebarProps) {
  const promoteGroupsInBulk = usePromoteGroupsInBulk();
  const [confirmDataEntry, setConfirmDataEntry] = useState(false);
  const INITIAL_VALUES: SchoolPromotionFormValues = {
    groupNames: groupNames.map((groupName) => ({
      originGroupName: groupName,
      targetGroupName: calculateGroupNameForNextSchoolYear(groupName),
    })),
  };

  async function handleSchoolPromotion(values: SchoolPromotionFormValues) {
    await promoteGroupsInBulk.mutateAsync(mapToRequest(institutionId, values), {
      onSuccess: () => onClose(true),
    });
  }

  function handleSchoolPromotionMaybe(
    values: SchoolPromotionFormValues,
    { setSubmitting }: FormikHelpers<SchoolPromotionFormValues>,
  ) {
    const deleteNamedGroup = values.groupNames.some(
      ({ originGroupName, targetGroupName }) =>
        originGroupName && !targetGroupName,
    );
    if (!deleteNamedGroup || confirmDataEntry) {
      return handleSchoolPromotion(values);
    }
    setConfirmDataEntry(true);
    setSubmitting(false);
  }

  return (
    <Formik
      initialValues={INITIAL_VALUES}
      onSubmit={handleSchoolPromotionMaybe}
    >
      {({ isSubmitting, values }) => (
        <SidebarForm ref={formRef}>
          {confirmDataEntry ? (
            <>
              <SidebarContent title="Schuljahreswechsel">
                <Stack gap={2}>
                  <Alert
                    color="primary"
                    title="Angaben überprüfen"
                    message='Nicht alle Klassen enthalten einen Wert für das kommende Schuljahr. Sollten die Angaben so korrekt sein, drücken Sie bitte erneut "Hochstufen durchführen".'
                  />
                  <SchoolYearTransitionGroupList
                    institutionName={institutionName}
                    info="Folgende Gruppen werden hochgestuft aber enthalten keine Klasse"
                    infoColor="warning"
                    rows={groupNames.filter(
                      (_, i) => !values.groupNames[i]?.targetGroupName,
                    )}
                    targetGroupComponent={TargetGroupView}
                  />
                  <SchoolYearTransitionGroupList
                    info="Folgende Gruppen werden hochgestuft"
                    infoColor="primary"
                    rows={groupNames.filter(
                      (_, i) => !!values.groupNames[i]?.targetGroupName,
                    )}
                    targetGroupComponent={TargetGroupView}
                  />
                </Stack>
              </SidebarContent>
              <SidebarActions>
                <FormButtonBar
                  submitLabel="Hochstufen durchführen"
                  submitting={isSubmitting}
                  cancelLabel="Angaben korrigieren"
                  cancelVariant="plain"
                  cancelColor="primary"
                  onCancel={() => setConfirmDataEntry(false)}
                />
              </SidebarActions>
            </>
          ) : (
            <>
              <SidebarContent title="Schuljahreswechsel">
                <SchoolYearTransitionGroupList
                  institutionName={institutionName}
                  info="Folgende Gruppen werden hochgestuft"
                  infoColor="primary"
                  rows={groupNames}
                  targetGroupComponent={({ rowIndex }) => (
                    <TextareaField
                      name={`groupNames.${rowIndex}.targetGroupName`}
                      label="Nächstes Schuljahr"
                      minRows={1}
                      sxTextarea={{ width: 150 }}
                    />
                  )}
                />
              </SidebarContent>
              <SidebarActions>
                <FormButtonBar
                  submitLabel="Hochstufen durchführen"
                  submitting={isSubmitting}
                  onCancel={onClose}
                />
              </SidebarActions>
            </>
          )}
        </SidebarForm>
      )}
    </Formik>
  );
}

function mapToRequest(
  institutionId: string,
  values: SchoolPromotionFormValues,
): ApiPromoteGroupsBulkRequest {
  return {
    institutionId,
    groupPromotions: values.groupNames.map(
      ({ originGroupName, targetGroupName }) => ({
        originGroupName: mapOptionalValue(originGroupName),
        targetGroupName: mapOptionalValue(targetGroupName),
      }),
    ),
  };
}
