/**
 * Copyright 2024 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

"use client";

import { ApiChecklistDefinitionVersion } from "@eshg/employee-portal-api/inspection";
import { FormPlus } from "@eshg/lib-portal/components/form/FormPlus";
import { Stack } from "@mui/joy";
import { Formik } from "formik";
import { useRouter } from "next/navigation";
import { ReactNode, useMemo } from "react";
import { isDefined } from "remeda";

import {
  FormChecklistDefinitionVersion,
  useCreateChecklistDefinition,
  useUpdateChecklistDefinition,
} from "@/lib/businessModules/inspection/api/mutations/checklistDefinition";
import { ChecklistDefinitionHeaderCard } from "@/lib/businessModules/inspection/components/checklistDefinition/header/ChecklistDefinitionHeaderCard";
import { ChecklistDefinitionHeaderRow } from "@/lib/businessModules/inspection/components/checklistDefinition/header/ChecklistDefinitionHeaderRow";
import { routes } from "@/lib/businessModules/inspection/shared/routes";

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
  const { mutateAsync: updateChecklist } = useUpdateChecklistDefinition();

  const isNewestVersion = cldVersion?.context.validTo === undefined;
  const readOnlyMode = readonly ?? !isNewestVersion;

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
            },
            isCoreChecklist: false,
            objectTypeId: "",
          },
    [cldVersion],
  );

  async function sendToBackend(values: FormChecklistDefinitionVersion) {
    if (cldVersion) {
      await updateChecklist(
        { defId: cldVersion.context.defId, cldVersion: values },
        { onSuccess: () => router.push(routes.checklists.definitions.index) },
      );
    } else {
      await createChecklist(values, {
        onSuccess: () => router.push(routes.checklists.definitions.index),
      });
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
              />
            )}
            <ChecklistDefinitionHeaderCard
              readOnlyMode={readOnlyMode}
              version={cldVersion?.context.version}
            />
            <ChecklistDefinitionSectionsList readOnlyMode={readOnlyMode} />
          </Stack>
        </FormPlus>
      )}
    </Formik>
  );
}
