/**
 * Copyright 2024 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

"use client";

import { ApiUserRole } from "@eshg/employee-portal-api/base";
import { ApiChecklistDefinitionVersion } from "@eshg/employee-portal-api/inspection";
import { FormPlus } from "@eshg/lib-portal/components/form/FormPlus";
import { Stack } from "@mui/joy";
import { Formik } from "formik";
import { useRouter } from "next/navigation";
import { ReactNode, useMemo } from "react";
import { isDefined } from "remeda";

import {
  FormChecklistDefinitionVersion,
  useAddChecklistDefinitionVersion,
  useCreateChecklistDefinition,
  useEditDraftChecklistDefinitionVersion,
} from "@/lib/businessModules/inspection/api/mutations/checklistDefinition";
import { ChecklistDefinitionHeaderCard } from "@/lib/businessModules/inspection/components/checklistDefinition/header/ChecklistDefinitionHeaderCard";
import {
  ChecklistDefinitionHeaderRow,
  ChecklistDefinitionSubmitButtons,
} from "@/lib/businessModules/inspection/components/checklistDefinition/header/ChecklistDefinitionHeaderRow";
import { routes } from "@/lib/businessModules/inspection/shared/routes";
import { ButtonBar } from "@/lib/shared/components/buttons/ButtonBar";
import { useHasUserRolesCheck } from "@/lib/shared/hooks/useAccessControl";

import { ChecklistDefinitionSectionsList } from "./sections/ChecklistDefinitionSectionsList";

interface EditChecklistDefinitionProps {
  headerRow?: ReactNode;
  cldVersion?: ApiChecklistDefinitionVersion; // unset when this is a completely new cld
  readonly?: boolean;
}

export function EditChecklistDefinition({
  headerRow,
  cldVersion,
  readonly,
}: Readonly<EditChecklistDefinitionProps>) {
  const router = useRouter();

  const { mutateAsync: createChecklist } = useCreateChecklistDefinition();
  const { mutateAsync: addCldVersion } = useAddChecklistDefinitionVersion();
  const { mutateAsync: editDraftCldVersion } =
    useEditDraftChecklistDefinitionVersion();
  const [canEditChecklists, canEditCoreChecklists] = useHasUserRolesCheck([
    ApiUserRole.InspectionChecklistdefinitionsWrite,
    ApiUserRole.InspectionCorechecklistdefinitionsEdit,
  ]);

  const hasDraft = cldVersion?.hasDraft ?? false;
  const isNewestVersion =
    cldVersion === undefined ||
    (cldVersion?.context.validTo === undefined &&
      cldVersion?.context.published === true);
  const readOnlyMode = readonly ?? !isNewestVersion;
  const canSeeSaveActions =
    canEditChecklists &&
    (canEditCoreChecklists || !cldVersion?.isCoreChecklist);

  const formData: FormChecklistDefinitionVersion = useMemo(
    () =>
      isDefined(cldVersion)
        ? {
            ...cldVersion,
            objectTypeId: cldVersion.objectType?.id ?? "",
          }
        : {
            context: {
              name: "",
              description: "",
              sections: [],
              expandable: true,
              deleted: false,
              published: true,
            },
            isCoreChecklist: false,
            objectTypeId: "",
          },
    [cldVersion],
  );

  let publish = true;
  async function sendToBackend(values: FormChecklistDefinitionVersion) {
    if (cldVersion) {
      if (!hasDraft) {
        await addCldVersion(
          {
            defId: cldVersion.context.defId,
            cldVersion: {
              ...values,
              context: { ...values.context, published: publish },
            },
          },
          { onSuccess: () => router.push(routes.checklists.definitions.index) },
        );
      } else {
        await editDraftCldVersion(
          {
            versionId: cldVersion.context.id,
            cldVersion: {
              ...values,
              context: { ...values.context, published: publish },
            },
          },
          { onSuccess: () => router.push(routes.checklists.definitions.index) },
        );
      }
    } else {
      await createChecklist(
        { ...values, context: { ...values.context, published: publish } },
        {
          onSuccess: () => router.push(routes.checklists.definitions.index),
        },
      );
    }
  }

  return (
    <Formik
      initialValues={formData}
      onSubmit={sendToBackend}
      enableReinitialize
    >
      {({ isSubmitting }) => (
        <FormPlus>
          <Stack spacing={2}>
            {headerRow ?? (
              <ChecklistDefinitionHeaderRow
                readOnlyMode={readOnlyMode}
                newestVersion={isNewestVersion}
                version={cldVersion?.context.version}
                modifiedBy={cldVersion?.modifiedBy}
                defId={cldVersion?.context.defId}
                versionId={cldVersion?.context.id}
                isCoreChecklist={cldVersion?.isCoreChecklist}
                isSubmitting={isSubmitting}
                hasDraft={hasDraft}
                onPublish={(shouldPublish) => (publish = shouldPublish)}
              />
            )}
            <ChecklistDefinitionHeaderCard
              readOnlyMode={readOnlyMode}
              version={cldVersion?.context.version}
            />
            <ChecklistDefinitionSectionsList readOnlyMode={readOnlyMode} />
            {canSeeSaveActions && !readOnlyMode && (
              <ButtonBar
                right={
                  <ChecklistDefinitionSubmitButtons
                    isSubmitting={isSubmitting}
                    onPublish={(shouldPublish) => (publish = shouldPublish)}
                  />
                }
              />
            )}
          </Stack>
        </FormPlus>
      )}
    </Formik>
  );
}
