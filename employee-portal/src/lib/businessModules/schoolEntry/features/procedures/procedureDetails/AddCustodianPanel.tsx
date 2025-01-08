/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { ApiGetReferencePersonResponse } from "@eshg/employee-portal-api/base";
import { ApiAddCustodianRequest } from "@eshg/employee-portal-api/schoolEntry";
import AddIcon from "@mui/icons-material/Add";
import { Button } from "@mui/joy";
import { useRef, useState } from "react";

import { ProcedureDetails } from "@/lib/businessModules/schoolEntry/api/models/ProcedureDetails";
import { useAddPersonAsCustodian } from "@/lib/businessModules/schoolEntry/api/mutations/schoolEntryApi";
import { OverlayBoundary } from "@/lib/shared/components/boundaries/OverlayBoundary";
import { ContentPanel } from "@/lib/shared/components/contentPanel/ContentPanel";
import { DetailsSection } from "@/lib/shared/components/detailsSection/DetailsSection";
import { SidebarFormHandle } from "@/lib/shared/components/form/SidebarForm";
import { PersonSidebar } from "@/lib/shared/components/personSidebar/PersonSidebar";
import { DefaultPersonFormValues } from "@/lib/shared/components/personSidebar/form/DefaultPersonForm";
import { mapToPersonAddRequest } from "@/lib/shared/components/personSidebar/helpers";
import { Sidebar } from "@/lib/shared/components/sidebar/Sidebar";
import { useConfirmationDialog } from "@/lib/shared/hooks/useConfirmationDialog";

export function AddCustodianPanel(props: { procedure: ProcedureDetails }) {
  const [sidebarMode, setSidebarMode] = useState("none");
  const sidebarFormRef = useRef<SidebarFormHandle>(null);
  const { openCancelDialog } = useConfirmationDialog();
  const addPersonAsCustodian = useAddPersonAsCustodian(props.procedure.id);

  function closeSidebar() {
    setSidebarMode("none");
  }

  function handleClose() {
    if (sidebarFormRef.current?.dirty) {
      openCancelDialog({
        onConfirm: closeSidebar,
      });
    } else {
      closeSidebar();
    }
  }

  async function handleCreate(values: DefaultPersonFormValues) {
    await addPersonAsCustodian.mutateAsync(
      mapToRequest(values, props.procedure.version),
      {
        onSuccess: closeSidebar,
      },
    );
  }

  async function handleSelect(person: ApiGetReferencePersonResponse) {
    await addPersonAsCustodian.mutateAsync(
      {
        custodian: {
          ...person,
          referenceId: person.id,
        },
        procedureVersion: props.procedure.version,
      },
      {
        onSuccess: closeSidebar,
      },
    );
  }

  return (
    <>
      <ContentPanel>
        <DetailsSection
          data-testid="add-custodian"
          title="PSB - Personensorgeberechtigte:r"
        >
          <Button
            color={"primary"}
            variant={"plain"}
            size={"sm"}
            sx={{ justifyContent: "flex-start" }}
            startDecorator={<AddIcon />}
            onClick={() => setSidebarMode("add")}
          >
            Hinzufügen
          </Button>
        </DetailsSection>
      </ContentPanel>
      <OverlayBoundary>
        <Sidebar
          open={sidebarMode !== "none"}
          onClose={() => setSidebarMode("none")}
        >
          {sidebarMode !== "none" && (
            <PersonSidebar
              onCancel={handleClose}
              onCreate={({ createInputs }) => handleCreate(createInputs)}
              onSelect={({ person }) => handleSelect(person)}
              sidebarFormRef={sidebarFormRef}
              title="PSB hinzufügen"
              submitLabel="Hinzufügen"
            />
          )}
        </Sidebar>
      </OverlayBoundary>
    </>
  );
}

function mapToRequest(
  values: DefaultPersonFormValues,
  procedureVersion: number,
): ApiAddCustodianRequest {
  return {
    custodian: mapToPersonAddRequest(values),
    procedureVersion: procedureVersion,
  };
}
