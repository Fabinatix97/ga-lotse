/**
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { SxProps } from "@mui/joy/styles/types";

import { PersonDetails } from "@/lib/businessModules/schoolEntry/api/models/Person";
import { ProcedureDetails } from "@/lib/businessModules/schoolEntry/api/models/ProcedureDetails";
import { useRemoveCustodian } from "@/lib/businessModules/schoolEntry/api/mutations/schoolEntryApi";
import { UpdateChildSidebar } from "@/lib/businessModules/schoolEntry/features/procedures/procedureDetails/UpdateChildSidebar";
import { UpdateCustodianSidebar } from "@/lib/businessModules/schoolEntry/features/procedures/procedureDetails/UpdateCustodianSidebar";
import { routes } from "@/lib/businessModules/schoolEntry/shared/routes";
import { OverlayBoundary } from "@/lib/shared/components/boundaries/OverlayBoundary";
import {
  ActionsItem,
  ActionsMenu,
} from "@/lib/shared/components/buttons/ActionsMenu";
import { EditButton } from "@/lib/shared/components/buttons/EditButton";
import { CentralFilePersonDetails } from "@/lib/shared/components/centralFile/display/CentralFilePersonDetails";
import {
  SyncBarrier,
  useSyncBarrier,
} from "@/lib/shared/components/centralFile/sync/SyncBarrier";
import { useConfirmationDialog } from "@/lib/shared/components/confirmationDialog/ConfirmationDialogProvider";
import { ContentPanel } from "@/lib/shared/components/contentPanel/ContentPanel";
import { DetailsSection } from "@/lib/shared/components/detailsSection/DetailsSection";
import { useToggle } from "@/lib/shared/hooks/useToggle";

interface PersonDetailsPanelProps {
  title: string;
  person: PersonDetails;
  procedure: ProcedureDetails;
  name: string;
  canDelete?: boolean;
}

const COLUMN_STYLE: SxProps = { flexGrow: 1, maxWidth: "calc(100%/3)" };

export function PersonDetailsPanel({
  title,
  person,
  procedure,
  name,
  canDelete = false,
}: PersonDetailsPanelProps) {
  const [editing, toggle] = useToggle(false);
  const syncRoute = routes.procedures
    .byId(procedure.id)
    .syncPerson(person.fileStateId, person.version);

  const { openConfirmationDialog } = useConfirmationDialog();
  const removeCustodian = useRemoveCustodian(procedure.id, person.fileStateId);
  const { syncBarrier } = useSyncBarrier(syncRoute, person);

  async function handleConfirm() {
    await removeCustodian.mutateAsync({
      procedureVersion: procedure.version,
    });
  }

  function handleDelete() {
    openConfirmationDialog({
      title: "Personensorgeberechtigte:n entfernen?",
      description: "Diese Aktion kann nicht rückgängig gemacht werden",
      confirmLabel: "Entfernen",
      color: "danger",
      onConfirm: handleConfirm,
    });
  }

  const custodianActions: ActionsItem[] = [
    {
      label: "Bearbeiten",
      onClick: syncBarrier(toggle),
    },
    {
      label: "Entfernen",
      color: "danger",
      onClick: handleDelete,
    },
  ];

  return (
    <ContentPanel testId="person-details-panel">
      <DetailsSection
        name={name}
        title={title}
        buttons={
          procedure.isClosed ? undefined : (
            <SyncBarrier outdated={person.outdated} syncHref={syncRoute}>
              {canDelete ? (
                <ActionsMenu actionItems={custodianActions} />
              ) : (
                <EditButton
                  aria-label="Person bearbeiten"
                  onClick={syncBarrier(toggle)}
                />
              )}
            </SyncBarrier>
          )
        }
      >
        <CentralFilePersonDetails person={person} columnSx={COLUMN_STYLE} />
      </DetailsSection>

      <OverlayBoundary>
        {canDelete ? (
          <UpdateCustodianSidebar
            custodian={person}
            procedureId={procedure.id}
            open={editing}
            onClose={toggle}
            onDelete={handleDelete}
          />
        ) : (
          <UpdateChildSidebar
            open={editing}
            onClose={toggle}
            child={person}
            procedureId={procedure.id}
          />
        )}
      </OverlayBoundary>
    </ContentPanel>
  );
}
