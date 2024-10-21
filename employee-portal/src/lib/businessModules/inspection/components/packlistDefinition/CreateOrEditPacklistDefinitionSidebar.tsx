/**
 * Copyright 2024 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

"use client";

import {
  ApiObjectType,
  ApiPacklistDefinitionRevision,
} from "@eshg/employee-portal-api/inspection";
import { useSnackbar } from "@eshg/lib-portal/components/snackbar/SnackbarProvider";
import { Stack } from "@mui/joy";
import { Formik } from "formik";
import { useRouter } from "next/navigation";
import { useMemo, useRef } from "react";
import { isDefined } from "remeda";

import {
  FormPacklistDefinitionRevision,
  useCreatePacklistDefinition,
  useUpdatePacklistDefinition,
} from "@/lib/businessModules/inspection/api/mutations/packlistDefinition";
import { PacklistDefinitionElementsList } from "@/lib/businessModules/inspection/components/packlistDefinition/elements/PacklistDefinitionElementsList";
import { PacklistDefinitionHeaderCard } from "@/lib/businessModules/inspection/components/packlistDefinition/header/PacklistDefinitionHeaderCard";
import { PacklistDefinitionHeaderRow } from "@/lib/businessModules/inspection/components/packlistDefinition/header/PacklistDefinitionHeaderRow";
import { routes } from "@/lib/businessModules/inspection/shared/routes";
import { OverlayBoundary } from "@/lib/shared/components/boundaries/OverlayBoundary";
import { FormButtonBar } from "@/lib/shared/components/form/FormButtonBar";
import {
  SidebarForm,
  SidebarFormHandle,
} from "@/lib/shared/components/form/SidebarForm";
import { Sidebar } from "@/lib/shared/components/sidebar/Sidebar";
import { SidebarActions } from "@/lib/shared/components/sidebar/SidebarActions";
import { SidebarContent } from "@/lib/shared/components/sidebar/SidebarContent";

interface CreateOrEditPacklistDefinitionSidebarProps {
  open: boolean;
  onClose: () => void;
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

export function CreateOrEditPacklistDefinitionSidebar(
  props: Readonly<CreateOrEditPacklistDefinitionSidebarProps>,
) {
  return (
    <OverlayBoundary>
      <CreateOrEditPacklistDefinitionSidebarWithQueriesAndMutations
        {...props}
      />
    </OverlayBoundary>
  );
}

export function CreateOrEditPacklistDefinitionSidebarWithQueriesAndMutations({
  open,
  onClose,
  pldRevision,
  version,
  readonly,
  title,
  onClickNewRevision,
  objectTypes,
}: Readonly<CreateOrEditPacklistDefinitionSidebarProps>) {
  const router = useRouter();
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
          { onSuccess: () => router.push(routes.packlists.definitions.index) },
        );
      } else {
        await createPacklist(values, {
          onSuccess: () => router.push(routes.packlists.definitions.index),
        });
      }
      onClose();
    }
  }

  return (
    <Sidebar open={open} onClose={handleClose}>
      <Formik
        initialValues={formData}
        onSubmit={handleSubmit}
        enableReinitialize
      >
        {({ isSubmitting, handleSubmit }) => (
          <SidebarForm onSubmit={handleSubmit} ref={sidebarFormRef}>
            <SidebarContent title={title}>
              <Stack spacing={2}>
                <PacklistDefinitionHeaderRow
                  readOnlyMode={readOnlyMode}
                  newestRevision={isNewestRevision}
                  revision={pldRevision?.revision}
                  modifiedBy={pldRevision?.modifiedBy}
                  defId={pldRevision?.defId}
                  revisionId={pldRevision?.id}
                  onClickNewRevision={onClickNewRevision}
                  version={version}
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
                  onCancel={handleClose}
                  submitLabel="Speichern"
                  onFinish={handleClose}
                />
              ) : (
                <FormButtonBar
                  submitting={isSubmitting}
                  onCancel={handleClose}
                  submitLabel="Speichern"
                />
              )}
            </SidebarActions>
          </SidebarForm>
        )}
      </Formik>
    </Sidebar>
  );
}
