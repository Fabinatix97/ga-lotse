/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import {
  CentralFilePersonDetails,
  DetailsSection,
  EditButton,
  SyncBarrier,
  useSyncBarrier,
} from "@eshg/lib-employee-portal";

import { routes } from "@/config/routes";
import { ChildDetails } from "@/features/children/api/models/ChildDetails";

import { useUpdateAnnualChildPersonSidebar } from "./UpdateAnnualChildPersonSidebar";

interface ChildDetailsSectionProps {
  child: ChildDetails;
}

export function ChildDetailsSection(props: ChildDetailsSectionProps) {
  const { child } = props;

  const syncRoute = routes.children
    .byId(child.id)
    .syncPerson(child.personDetails.fileStateId, child.personDetails.version);

  const { syncBarrier } = useSyncBarrier(syncRoute, child.personDetails);

  const updateAnnualChildDataSidebar = useUpdateAnnualChildPersonSidebar();

  return (
    <DetailsSection
      title="Kind"
      buttons={
        <SyncBarrier
          outdated={child.personDetails.outdated}
          syncHref={syncRoute}
        >
          {!child.isClosed && (
            <EditButton
              aria-label="Kind bearbeiten"
              onClick={syncBarrier(() =>
                updateAnnualChildDataSidebar.open({
                  childId: child.id,
                  child,
                }),
              )}
            />
          )}
        </SyncBarrier>
      }
    >
      <CentralFilePersonDetails person={{ ...child.personDetails, ...child }} />
    </DetailsSection>
  );
}
