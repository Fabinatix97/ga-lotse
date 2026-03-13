/**
 * Copyright 2026 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

"use client";

import { Divider, Stack } from "@mui/joy";
import { Formik } from "formik";
import { useRouter } from "next/navigation";
import { isNonNullish, isNullish } from "remeda";

import { ApiUser, ApiUserRole } from "@eshg/base-api";
import {
  ApiInspFacility,
  ApiInspectionType,
  ApiObjectType,
  ApiObjectTypeHierarchyTreeNode,
} from "@eshg/inspection-api";
import { useHasUserRoleCheck } from "@eshg/lib-employee-portal";
import {
  Alert,
  FormPlus,
  InternalLinkButton,
  SelectField,
  SetFieldValueHelper,
  SubmitButton,
  TextareaField,
  buildEnumOptions,
  formatPersonName,
  formatUserName,
} from "@eshg/lib-portal";

import { useStartInspection } from "@/lib/businessModules/inspection/api/mutations/inspection";
import { useIsNewFeatureEnabled } from "@/lib/businessModules/inspection/api/queries/feature";
import { ObjectTypesSelectField } from "@/lib/businessModules/inspection/components/checklistDefinition/editor/header/ObjectTypesSelectField";
import { InspectionAssigneeSelection } from "@/lib/businessModules/inspection/components/inspection/assignee/InspectionAssigneeSelection";
import { useEditFileNumberSidebar } from "@/lib/businessModules/inspection/components/inspection/basedata/EditFileNumberSidebar";
import { inspectionTypeNames } from "@/lib/businessModules/inspection/shared/enums";
import { routes } from "@/lib/businessModules/inspection/shared/routes";
import { InfoTile } from "@/lib/shared/components/infoTile/InfoTile";

export interface AdditionalInfoTileFormData {
  objectTypeId: string;
  type: ApiInspectionType;
  progressEntryText: string;
  assigneeId: string | null;
  assigneeName: string | null;
}

interface AdditionalInfoTileProps {
  procedureId: string;
  objectTypes: ApiObjectTypeHierarchyTreeNode[] | ApiObjectType[];
  facility: ApiInspFacility;
  selfUser: ApiUser;
  allAssignableUsers: ApiUser[];
  assignee?: ApiUser;
}

export function AdditionalInfoTile({
  procedureId,
  objectTypes,
  facility,
  selfUser,
  allAssignableUsers,
  assignee,
}: Readonly<AdditionalInfoTileProps>) {
  const { mutateAsync: startInspection } = useStartInspection();

  const editFileNumberSidebar = useEditFileNumberSidebar(() => handleSuccess());
  const onlySelfAssignable = !useHasUserRoleCheck(
    ApiUserRole.InspectionProcedureAssign,
  );

  const router = useRouter();

  const TYPE_OPTIONS = buildEnumOptions(inspectionTypeNames);

  const initialValues: AdditionalInfoTileFormData = {
    objectTypeId: facility.objectType?.id ?? "",
    type: ApiInspectionType.Initial,
    progressEntryText: "",
    assigneeId: onlySelfAssignable
      ? selfUser.userId
      : getAssigneeUserId(assignee),
    assigneeName: onlySelfAssignable
      ? formatUserName(selfUser)
      : getAssigneeName(assignee),
  };

  function getAssigneeUserId(assignee?: ApiUser) {
    return assignee ? assignee.userId : null;
  }

  function getAssigneeName(assignee?: ApiUser) {
    return assignee ? formatUserName(assignee) : null;
  }

  function handleSuccess() {
    router.push(routes.procedures.basedata(procedureId));
  }

  async function handleSubmit(data: AdditionalInfoTileFormData) {
    await startInspection(
      {
        id: procedureId,
        apiStartInspectionRequest: {
          objectTypeId: isNullish(facility.objectType)
            ? data.objectTypeId
            : undefined,
          type: data.type,
          progressEntryText: data.progressEntryText.trim() ?? undefined,
          assigneeId: data.assigneeId ?? selfUser.userId,
        },
      },
      {
        onSuccess: (data) => {
          if (
            isNonNullish(data.inspection.facility.fileNumber) &&
            data.fileNumberCollisionsResponse &&
            Object.keys(data.fileNumberCollisionsResponse.collisions).length > 0
          ) {
            editFileNumberSidebar.open({
              inspectionId: procedureId,
              fileNumber: data.inspection.facility.fileNumber,
              fileNumberCollisions: data.fileNumberCollisionsResponse,
            });
          } else {
            handleSuccess();
          }
        },
      },
    );
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

  const featureToggleEnabled = useIsNewFeatureEnabled("OBJECT_TYPE_HIERARCHY");

  function getSelectObjectType(
    objectTypeId: string,
    objectTypes: ApiObjectTypeHierarchyTreeNode[] | ApiObjectType[],
  ): ApiObjectType | undefined {
    if (featureToggleEnabled) {
      const objectTypesArray = objectTypes as ApiObjectTypeHierarchyTreeNode[];
      for (const object of objectTypesArray) {
        const directMatch = object.objectTypes?.find(
          (ot) => ot.id === objectTypeId,
        );
        if (directMatch) {
          return directMatch;
        }

        if (object.subNodes?.length) {
          const found = getSelectObjectType(objectTypeId, object.subNodes);
          if (found) {
            return found;
          }
        }
      }
      return undefined;
    } else {
      const objectTypesArray = objectTypes as ApiObjectType[];
      return objectTypesArray.find((oT) => oT.id === objectTypeId);
    }
  }

  return (
    <InfoTile name="additional-infos" title="Zusatzinfos">
      <Formik initialValues={initialValues} onSubmit={handleSubmit}>
        {({ isSubmitting, setFieldValue, values }) => (
          <FormPlus sx={{ display: "contents" }}>
            {isNonNullish(facility.objectType) ? (
              <Alert
                color="primary"
                title="Objekttyp"
                message="bereits vorhanden"
              />
            ) : (
              <ObjectTypesSelectField
                name="objectTypeId"
                objectTypes={objectTypes}
                onChange={async (value) => {
                  if (
                    isNullish(values.assigneeId) ||
                    values.assigneeId === ""
                  ) {
                    const objectTypeResult = getSelectObjectType(
                      value,
                      objectTypes,
                    );
                    if (objectTypeResult !== undefined) {
                      await setFieldValue(
                        "assigneeId",
                        objectTypeResult?.designatedAssigneeId,
                      );
                      await setFieldValue(
                        "assigneeName",
                        objectTypeResult?.designatedAssigneeName,
                      );
                    }
                  }
                }}
              />
            )}
            <SelectField
              name="type"
              label="Begehungsart"
              required="Bitte eine Begehungsart auswählen"
              options={TYPE_OPTIONS}
            />
            <Divider />
            <TextareaField
              label="Verlaufseintrag hinzufügen"
              name="progressEntryText"
            />
            <Divider />
            <InspectionAssigneeSelection
              selfUser={selfUser}
              currentAssigneeName={values.assigneeName}
              currentAssigneeId={values.assigneeId}
              onlySelfAssignable={onlySelfAssignable}
              assigneeIdFieldValueName="assigneeId"
              allAssignableUsers={allAssignableUsers}
              onSelfAssign={() => handleSelfAssign(setFieldValue)}
            />
            <Divider sx={{ marginBottom: 2 }} />
            <ButtonBar isSubmitting={isSubmitting} />
          </FormPlus>
        )}
      </Formik>
    </InfoTile>
  );
}

function ButtonBar({ isSubmitting }: Readonly<{ isSubmitting: boolean }>) {
  // we are not using the normal FormButtonBar because that has slightly different styling
  return (
    <Stack direction="row" alignItems="center" gap={2} width="100%">
      <InternalLinkButton
        href={routes.procedures.index}
        color="neutral"
        variant="soft"
        sx={{ textAlign: "center", flex: 1 }}
      >
        Zurück zur Übersicht
      </InternalLinkButton>
      <SubmitButton submitting={isSubmitting} sx={{ flex: 1 }}>
        Vorgang jetzt starten
      </SubmitButton>
    </Stack>
  );
}
