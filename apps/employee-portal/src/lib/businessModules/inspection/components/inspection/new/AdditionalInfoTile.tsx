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
import { InspectionAssigneeSelection } from "@/lib/businessModules/inspection/components/inspection/assignee/InspectionAssigneeSelection";
import { useEditFileNumberSidebar } from "@/lib/businessModules/inspection/components/inspection/basedata/EditFileNumberSidebar";
import { inspectionTypeNames } from "@/lib/businessModules/inspection/shared/enums";
import { routes } from "@/lib/businessModules/inspection/shared/routes";
import { InfoTile } from "@/lib/shared/components/infoTile/InfoTile";

interface FormData {
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
}

export interface GroupedOption {
  id: string;
  name: string;
}

export function AdditionalInfoTile({
  procedureId,
  objectTypes,
  facility,
  selfUser,
  allAssignableUsers,
}: Readonly<AdditionalInfoTileProps>) {
  const { mutateAsync: startInspection } = useStartInspection();

  const editFileNumberSidebar = useEditFileNumberSidebar(() => handleSuccess());
  const onlySelfAssignable = !useHasUserRoleCheck(
    ApiUserRole.InspectionProcedureAssign,
  );
  const featureToggleEnabled = useIsNewFeatureEnabled("OBJECT_TYPE_HIERARCHY");

  const router = useRouter();

  const TYPE_OPTIONS = buildEnumOptions(inspectionTypeNames);

  const initialValues: FormData = {
    objectTypeId: facility.objectType?.id ?? "",
    type: ApiInspectionType.Initial,
    progressEntryText: "",
    assigneeId: onlySelfAssignable ? selfUser.userId : null,
    assigneeName: onlySelfAssignable ? formatUserName(selfUser) : null,
  };

  function isApiObjectType(
    row: ApiObjectTypeHierarchyTreeNode | ApiObjectType,
  ): row is ApiObjectType {
    return !("subNodes" in row);
  }

  const objectTypeOptions = featureToggleEnabled
    ? []
    : objectTypes.filter(isApiObjectType).map((o) => ({
        value: o.id,
        label: o.name,
      }));

  function handleSuccess() {
    router.push(routes.procedures.basedata(procedureId));
  }

  async function handleSubmit(data: FormData) {
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
              <SelectField
                name="objectTypeId"
                label="Objekttyp"
                required="Bitte einen Objekttyp auswählen."
                options={objectTypeOptions}
                groupedOptions={
                  featureToggleEnabled ? transformData(objectTypes) : undefined
                }
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

interface ObjectType {
  id: string;
  name: string;
}

interface DataNode {
  name: string;
  objectTypes?: ObjectType[];
  subNodes?: DataNode[];
}

export function transformData(
  data: DataNode | DataNode[],
): Record<string, GroupedOption[]> {
  const groups: Record<string, GroupedOption[]> = {};

  function traverse(node: DataNode): void {
    if (!node) return;

    if (node.name) {
      groups[node.name] = node.objectTypes ?? [];
    }

    if (node.subNodes && node.subNodes.length > 0) {
      node.subNodes.forEach((subNode) => traverse(subNode));
    }
  }

  if (Array.isArray(data)) {
    data.forEach((item) => traverse(item));
  } else {
    traverse(data);
  }

  return groups;
}
