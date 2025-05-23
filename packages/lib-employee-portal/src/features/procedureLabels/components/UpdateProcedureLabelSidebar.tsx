/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

"use client";

import { Formik } from "formik";

import { mapOptionalValue, parseOptionalValue } from "@eshg/lib-portal";

import { FormButtonBar } from "../../../components/form/FormButtonBar";
import { SidebarActions } from "../../drawer/components/SidebarActions";
import { SidebarContent } from "../../drawer/components/SidebarContent";
import { SidebarForm } from "../../drawer/components/SidebarForm";
import { UseSidebarResult, useSidebar } from "../../drawer/hooks/useSidebar";
import { DrawerProps } from "../../drawer/types/drawer";
import { ProcedureLabel } from "../api/models/ProcedureLabel";
import { useUpdateProcedureLabel } from "../api/mutations";
import {
  ProcedureLabelClient,
  UpdateProcedureLabelRequest,
} from "../types/procedureLabelClient";

import {
  ProcedureLabelFormFields,
  ProcedureLabelValues,
} from "./ProcedureLabelFormFields";

export function useUpdateProcedureLabelSidebar(): UseSidebarResult<UpdateProcedureLabelProps> {
  return useSidebar({
    component: UpdateProcedureLabelSidebar,
  });
}

interface UpdateProcedureLabelProps extends DrawerProps {
  procedureLabel: ProcedureLabel;
  procedureLabelApi: ProcedureLabelClient;
}

function mapToProcedureLabelForm(
  procedureLabel: ProcedureLabel,
): ProcedureLabelValues {
  return {
    name: procedureLabel.name,
    description: parseOptionalValue(procedureLabel.description),
  };
}

function UpdateProcedureLabelSidebar(props: UpdateProcedureLabelProps) {
  const updateProcedureLabel = useUpdateProcedureLabel(props.procedureLabelApi);

  async function handleSubmit(procedureLabelFormValues: ProcedureLabelValues) {
    const labelId = props.procedureLabel.id;
    const labelVersion = props.procedureLabel.version;
    await updateProcedureLabel.mutateAsync(
      mapToRequest(labelId, procedureLabelFormValues, labelVersion),
      {
        onSuccess: () => props.onClose(),
      },
    );
  }

  return (
    <Formik
      initialValues={mapToProcedureLabelForm(props.procedureLabel)}
      onSubmit={handleSubmit}
    >
      {({ isSubmitting }) => (
        <SidebarForm>
          <SidebarContent title="Kennung bearbeiten">
            <ProcedureLabelFormFields />
          </SidebarContent>

          <SidebarActions>
            <FormButtonBar
              submitLabel="Speichern"
              submitting={isSubmitting}
              onCancel={props.onClose}
            />
          </SidebarActions>
        </SidebarForm>
      )}
    </Formik>
  );
}

function mapToRequest(
  labelsId: string,
  values: ProcedureLabelValues,
  version: number,
): UpdateProcedureLabelRequest {
  return {
    id: labelsId,
    apiUpdateProcedureLabelRequest: {
      name: values.name,
      description: mapOptionalValue(values.description),
      version: version,
    },
  };
}
