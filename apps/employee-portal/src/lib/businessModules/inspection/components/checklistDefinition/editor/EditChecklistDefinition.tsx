/**
 * Copyright 2025 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

"use client";

import { InfoOutlined } from "@mui/icons-material";
import { Alert, Stack } from "@mui/joy";
import { Formik, FormikHelpers } from "formik";
import { useRouter } from "next/navigation";
import { ReactNode, useMemo } from "react";
import { isDefined } from "remeda";

import {
  ApiChecklistDefinitionVersion,
  ApiObjectType,
} from "@eshg/inspection-api";
import { ButtonBar } from "@eshg/lib-employee-portal";
import { FormPlus, InternalLinkButton } from "@eshg/lib-portal";

import {
  FormChecklistDefinitionVersion,
  useAddChecklistDefinitionVersion,
  useCreateChecklistDefinition,
  useEditDraftChecklistDefinitionVersion,
} from "@/lib/businessModules/inspection/api/mutations/checklistDefinition";
import { ChecklistDefinitionHeaderCard } from "@/lib/businessModules/inspection/components/checklistDefinition/editor/header/ChecklistDefinitionHeaderCard";
import {
  ChecklistDefinitionHeaderRow,
  ChecklistDefinitionSubmitButtons,
} from "@/lib/businessModules/inspection/components/checklistDefinition/editor/header/ChecklistDefinitionHeaderRow";
import { ChecklistDefinitionSectionsList } from "@/lib/businessModules/inspection/components/checklistDefinition/editor/sections/ChecklistDefinitionSectionsList";
import { useUserCanSaveChecklistDefinition } from "@/lib/businessModules/inspection/components/checklistDefinition/helpers/helpers";
import { routes } from "@/lib/businessModules/inspection/shared/routes";
import { ConfirmLeaveDirtyFormEffect } from "@/lib/shared/components/form/ConfirmLeaveDirtyFormEffect";

interface EditChecklistDefinitionProps {
  headerRow?: ReactNode;
  cldVersion?: ApiChecklistDefinitionVersion; // unset when this is a completely new cld
  objectTypes: ApiObjectType[];
}

export function EditChecklistDefinition({
  headerRow,
  cldVersion,
  objectTypes,
}: Readonly<EditChecklistDefinitionProps>) {
  const router = useRouter();

  const { mutateAsync: createChecklist } = useCreateChecklistDefinition();
  const { mutateAsync: addCldVersion } = useAddChecklistDefinitionVersion();
  const { mutateAsync: editDraftCldVersion } =
    useEditDraftChecklistDefinitionVersion();

  const formData = useChecklistDefinitionFormData(cldVersion);

  const canSave = useUserCanSaveChecklistDefinition(cldVersion);

  if (!canSave) {
    return <CantEditAlert cldVersion={cldVersion} />;
  }

  const hasDraft = cldVersion?.hasDraft ?? false;

  let publish = true;
  async function sendToBackend(
    values: FormChecklistDefinitionVersion,
    formikHelpers: FormikHelpers<FormChecklistDefinitionVersion>,
  ) {
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

    formikHelpers.resetForm();
  }

  return (
    <Formik
      initialValues={formData}
      enableReinitialize
      validateOnChange={false}
      onSubmit={sendToBackend}
    >
      {({ isSubmitting }) => (
        <FormPlus>
          <ConfirmLeaveDirtyFormEffect />
          <Stack spacing={2}>
            {headerRow ?? (
              <ChecklistDefinitionHeaderRow
                version={cldVersion?.context.version}
                modifiedBy={cldVersion?.modifiedBy}
                isSubmitting={isSubmitting}
                hasDraft={hasDraft}
                onPublish={(shouldPublish) => (publish = shouldPublish)}
              />
            )}
            <ChecklistDefinitionHeaderCard
              version={cldVersion?.context.version}
              objectTypes={objectTypes}
            />
            <ChecklistDefinitionSectionsList />
            <ButtonBar
              right={
                <ChecklistDefinitionSubmitButtons
                  isSubmitting={isSubmitting}
                  onPublish={(shouldPublish) => (publish = shouldPublish)}
                />
              }
            />
          </Stack>
        </FormPlus>
      )}
    </Formik>
  );
}

function CantEditAlert({
  cldVersion,
}: Readonly<{
  cldVersion?: ApiChecklistDefinitionVersion;
}>) {
  return (
    <Alert
      color="primary"
      startDecorator={<InfoOutlined />}
      endDecorator={
        isDefined(cldVersion) && (
          <InternalLinkButton
            href={routes.checklists.definitions.viewVersion(
              cldVersion.context.defId,
              cldVersion.context.id,
            )}
            size="sm"
            variant="solid"
            color="primary"
          >
            Zur Leseansicht
          </InternalLinkButton>
        )
      }
      role="note"
      data-testid="alert"
    >
      Sie können diese Checklisten-Definitionen nicht bearbeiten.
    </Alert>
  );
}

function useChecklistDefinitionFormData(
  cldVersion?: ApiChecklistDefinitionVersion,
): FormChecklistDefinitionVersion {
  return useMemo(() => {
    if (isDefined(cldVersion)) {
      return {
        ...cldVersion,
        objectTypeId: cldVersion.objectType?.id ?? "",
      };
    }

    return {
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
    };
  }, [cldVersion]);
}
