/**
 * Copyright 2025 SCOOP Software GmbH, cronn GmbH
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
  ApiInspection,
  ApiInspectionType,
  ApiObjectType,
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
import { InspectionAssigneeSelection } from "@/lib/businessModules/inspection/components/inspection/assignee/InspectionAssigneeSelection";
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
  objectTypes: ApiObjectType[];
  facility: ApiInspFacility;
  selfUser: ApiUser;
  allAssignableUsers: ApiUser[];
}

export function AdditionalInfoTile({
  procedureId,
  objectTypes,
  facility,
  selfUser,
  allAssignableUsers,
}: Readonly<AdditionalInfoTileProps>) {
  const onlySelfAssignable = !useHasUserRoleCheck(
    ApiUserRole.InspectionProcedureAssign,
  );
  const router = useRouter();

  const TYPE_OPTIONS = buildEnumOptions(inspectionTypeNames);

  const initialValues: FormData = {
    objectTypeId: facility.objectType?.id ?? "",
    type: ApiInspectionType.Initial,
    progressEntryText: "",
    assigneeId: onlySelfAssignable ? selfUser.userId : null,
    assigneeName: onlySelfAssignable ? formatUserName(selfUser) : null,
  };

  const objectTypeOptions = objectTypes.map((o) => ({
    value: o.id,
    label: o.name,
  }));

  const { mutateAsync: startInspection } = useStartInspection();

  function handleSuccess(response: ApiInspection) {
    router.push(routes.procedures.basedata(response.externalId));
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
        onSuccess: handleSuccess,
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
