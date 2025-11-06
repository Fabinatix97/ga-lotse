/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { SxProps } from "@mui/joy/styles/types";
import { isNullish } from "remeda";

import {
  ActionsItem,
  ActionsMenu,
  CentralFilePersonDetails,
  ContentPanel,
  DetailsSection,
  EditButton,
  SyncBarrier,
  useSidebarWithFormRef,
  useSyncBarrier,
} from "@eshg/lib-employee-portal";

import { CustodianDetails } from "@/lib/businessModules/schoolEntry/api/models/CustodianDetails";
import { PersonDetails } from "@/lib/businessModules/schoolEntry/api/models/Person";
import { ProcedureDetails } from "@/lib/businessModules/schoolEntry/api/models/ProcedureDetails";
import { useUpdateChildSidebar } from "@/lib/businessModules/schoolEntry/features/procedures/procedureDetails/UpdateChildSidebar";
import {
  UpdateCustodianSidebar,
  useDeleteCustodianWithConfirmation,
} from "@/lib/businessModules/schoolEntry/features/procedures/procedureDetails/UpdateCustodianSidebar";
import { routes } from "@/lib/businessModules/schoolEntry/shared/routes";

interface PersonDetailsPanelProps {
  title: string;
  person: PersonDetails | CustodianDetails;
  procedure: ProcedureDetails;
  name: string;
  isCustodian?: boolean;
}

const COLUMN_STYLE: SxProps = {
  flexGrow: 1,
  maxWidth: (theme) => ({ md: `calc(100%/3 - 2 * ${theme.spacing(2)})` }),
};

function isCustodianDetails(
  person: PersonDetails | CustodianDetails,
  isCustodian: boolean,
): person is CustodianDetails {
  return isCustodian;
}

export function PersonDetailsPanel({
  title,
  person,
  procedure,
  name,
  isCustodian = false,
}: PersonDetailsPanelProps) {
  const syncRoute = routes.procedures
    .byId(procedure.id)
    .syncPerson(person.fileStateId, person.version);

  const { syncBarrier } = useSyncBarrier(syncRoute, person);

  const updateChildSidebar = useUpdateChildSidebar();
  const updateCustodianSidebar = useSidebarWithFormRef({
    component: UpdateCustodianSidebar,
  });

  const { deleteCustodian } = useDeleteCustodianWithConfirmation(
    procedure.id,
    person.fileStateId,
    isNullish(person.dateOfBirth),
  );
  const custodianActions: ActionsItem[] = [
    {
      label: "Bearbeiten",
      onClick: syncBarrier(() =>
        updateCustodianSidebar.open({
          custodian: person,
          procedureId: procedure.id,
          procedureVersion: procedure.version,
        }),
      ),
    },
    {
      label: "Entfernen",
      color: "danger",
      onClick: () => deleteCustodian({ procedureVersion: procedure.version }),
    },
  ];

  return (
    <ContentPanel testId="person-details-panel">
      <DetailsSection
        data-testid={name}
        title={title}
        buttons={
          procedure.isClosed ? undefined : (
            <SyncBarrier outdated={person.outdated} syncHref={syncRoute}>
              {isCustodianDetails(person, isCustodian) ? (
                <ActionsMenu actionItems={custodianActions} />
              ) : (
                <EditButton
                  aria-label="Kind bearbeiten"
                  onClick={syncBarrier(() =>
                    updateChildSidebar.open({
                      procedureId: procedure.id,
                      child: person,
                    }),
                  )}
                />
              )}
            </SyncBarrier>
          )
        }
      >
        <CentralFilePersonDetails
          person={person}
          columnSx={COLUMN_STYLE}
          showHumanReadableId={!isCustodian}
        />
      </DetailsSection>
    </ContentPanel>
  );
}
