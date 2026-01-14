/**
 * Copyright 2026 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

"use client";

import { Stack } from "@mui/joy";
import { Formik } from "formik";
import { useMemo, useRef } from "react";
import { isDefined } from "remeda";

import {
  ApiObjectType,
  ApiPacklistDefinitionRevision,
} from "@eshg/inspection-api";
import {
  FormButtonBar,
  SidebarActions,
  SidebarContent,
  SidebarForm,
  SidebarFormHandle,
  SidebarWithFormRefProps,
} from "@eshg/lib-employee-portal";
import { useSnackbar } from "@eshg/lib-portal";

import {
  FormPacklistDefinitionRevision,
  useCreatePacklistDefinition,
  useUpdatePacklistDefinition,
} from "@/lib/businessModules/inspection/api/mutations/packlistDefinition";
import { PacklistDefinitionElementsList } from "@/lib/businessModules/inspection/components/packlistDefinition/elements/PacklistDefinitionElementsList";
import { PacklistDefinitionHeaderCard } from "@/lib/businessModules/inspection/components/packlistDefinition/header/PacklistDefinitionHeaderCard";
import { PacklistDefinitionHeaderRow } from "@/lib/businessModules/inspection/components/packlistDefinition/header/PacklistDefinitionHeaderRow";

interface CreateOrEditPacklistDefinitionSidebarProps
  extends SidebarWithFormRefProps {
  pldRevision?: ApiPacklistDefinitionRevision; // unset when this is a completely new pld
  version?: number;
  readonly?: boolean;
  title: string;
  onClickNewRevision?: (
    defId: string,
    version: number,
    revisionId: string,
  ) => void;
  objectTypes: ApiObjectType[];
}

export function EmbeddedCreateOrEditPacklistDefinitionSidebar({
  onClose,
  formRef,
  pldRevision,
  version,
  readonly,
  title,
  onClickNewRevision,
  objectTypes,
}: Readonly<CreateOrEditPacklistDefinitionSidebarProps>) {
  const sidebarFormRef = useRef<SidebarFormHandle>(null);
  const snackbar = useSnackbar();

  const { mutateAsync: createPacklist } = useCreatePacklistDefinition();
  const { mutateAsync: updatePacklist } = useUpdatePacklistDefinition();

  function handleClose() {
    sidebarFormRef.current?.resetForm();
    onClose();
  }

  const isNewestRevision = pldRevision?.validTo === undefined;
  const readOnlyMode = readonly ?? !isNewestRevision;

  const formData: FormPacklistDefinitionRevision = useMemo(
    () =>
      isDefined(pldRevision)
        ? {
            name: pldRevision.name,
            description: pldRevision.description,
            elements: pldRevision.elements,
            objectTypeId: pldRevision.objectType?.id ?? "",
          }
        : {
            name: "",
            description: "",
            elements: [],
            objectTypeId: "",
          },
    [pldRevision],
  );

  async function handleSubmit(values: FormPacklistDefinitionRevision) {
    if (values.elements.some((element) => !element.text)) {
      snackbar.error("Packlistenelemente dürfen nicht leer sein.");
    } else {
      if (pldRevision) {
        await updatePacklist(
          {
            defId: pldRevision.defId,
            version: version ?? -1,
            pldRevision: values,
          },
          {
            onSuccess: () => onClose(true),
          },
        );
      } else {
        await createPacklist(values, {
          onSuccess: () => onClose(true),
        });
      }
    }
  }

  return (
    <Formik
      ref={formRef}
      initialValues={formData}
      enableReinitialize
      onSubmit={handleSubmit}
    >
      {({ isSubmitting, handleSubmit }) => (
        <SidebarForm
          ref={sidebarFormRef}
          aria-label={title}
          onSubmit={handleSubmit}
        >
          <SidebarContent title={title}>
            <Stack spacing={2}>
              <PacklistDefinitionHeaderRow
                readOnlyMode={readOnlyMode}
                newestRevision={isNewestRevision}
                revision={pldRevision?.revision}
                modifiedBy={pldRevision?.modifiedBy}
                defId={pldRevision?.defId}
                revisionId={pldRevision?.id}
                version={version}
                onClickNewRevision={onClickNewRevision}
              />
              <PacklistDefinitionHeaderCard
                readOnlyMode={readOnlyMode}
                revision={pldRevision?.revision}
                objectTypes={objectTypes}
              />
              <PacklistDefinitionElementsList readOnlyMode={readOnlyMode} />
            </Stack>
          </SidebarContent>
          <SidebarActions>
            {readOnlyMode ? (
              <FormButtonBar
                submitting={isSubmitting}
                submitLabel="Speichern"
                onCancel={handleClose}
                onFinish={handleClose}
              />
            ) : (
              <FormButtonBar
                submitting={isSubmitting}
                submitLabel="Speichern"
                onCancel={handleClose}
              />
            )}
          </SidebarActions>
        </SidebarForm>
      )}
    </Formik>
  );
}
