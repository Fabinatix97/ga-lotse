/**
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

"use client";

import {
  ApiGetGdprProcedureResponse,
  ApiGetReferenceFacilityResponse,
  ApiGetReferencePersonResponse,
  ApiUserRole,
} from "@eshg/employee-portal-api/base";
import { Stack } from "@mui/joy";
import { SxProps } from "@mui/joy/styles/types";

import { isGdprPerson } from "@/lib/baseModule/components/gdpr/helpers";
import {
  LinkFacilitySidebar,
  LinkPersonSidebar,
} from "@/lib/baseModule/components/gdpr/procedure/linkCentralFileSidebar/LinkCentralFileSidebar";
import { CentralFileLinkTile } from "@/lib/baseModule/components/gdpr/procedure/tiles/CentralFileLinkTile";
import { GdprPersonDataTile } from "@/lib/baseModule/components/gdpr/procedure/tiles/GdprPersonDataTile";
import { ProcedureDetailsTile } from "@/lib/baseModule/components/gdpr/procedure/tiles/ProcedureDetailsTile";
import {
  SectionTile,
  SectionTitle,
} from "@/lib/baseModule/components/gdpr/procedure/tiles/SectionTile";
import { CentralFileFacilityDetails } from "@/lib/shared/components/centralFile/display/CentralFileFacilityDetails";
import { CentralFilePersonDetails } from "@/lib/shared/components/centralFile/display/CentralFilePersonDetails";
import { useSidebar } from "@/lib/shared/components/drawer/useSidebar";
import { useHasUserRoleCheck } from "@/lib/shared/hooks/useAccessControl";

import { GdprFacilityDataTile } from "./tiles/GdprFacilityDataTile";

interface GDPRProcedureDetailsProps {
  procedure: ApiGetGdprProcedureResponse;
  personMatches: ApiGetReferencePersonResponse[];
  facilityMatches: ApiGetReferenceFacilityResponse[];
  linkedPersons: ApiGetReferencePersonResponse[];
  linkedFacilities: ApiGetReferenceFacilityResponse[];
}

const COLUMN_STYLE: SxProps = {
  flexGrow: 1,
  maxWidth: (theme) => ({ md: `calc(100%/3 - 2 * ${theme.spacing(2)})` }),
};

export function GDPRProcedureDetails({
  procedure,
  personMatches,
  facilityMatches,
  linkedPersons,
  linkedFacilities,
}: GDPRProcedureDetailsProps) {
  const hasWritePerms = useHasUserRoleCheck(ApiUserRole.BaseGdprProcedureWrite);

  const facilitySidebar = useSidebar({
    component: LinkFacilitySidebar,
  });

  const personSidebar = useSidebar({
    component: LinkPersonSidebar,
  });

  const identity = procedure.identificationData;

  function openLinkSidebar() {
    if (isGdprPerson(identity)) {
      personSidebar.open({
        procedureId: procedure.id,
        procedureVersion: procedure.version,
        matches: personMatches,
      });
    } else {
      facilitySidebar.open({
        procedureId: procedure.id,
        procedureVersion: procedure.version,
        matches: facilityMatches,
      });
    }
  }

  return (
    <>
      <Stack direction={{ xxs: "column", md: "row" }} gap={3}>
        <Stack sx={{ flex: 5, minWidth: "fit-content" }} gap={3}>
          <ProcedureDetailsTile procedure={procedure} />
          <CentralFileLinkTile
            centralFileId={procedure.centralFileId}
            numMatches={personMatches.length + facilityMatches.length}
            onAddLink={hasWritePerms && (() => openLinkSidebar())}
          />
        </Stack>
        <Stack sx={{ flex: 20 }} gap={3}>
          {isGdprPerson(identity) ? (
            <GdprPersonDataTile identity={identity} columnSx={COLUMN_STYLE} />
          ) : (
            <GdprFacilityDataTile identity={identity} columnSx={COLUMN_STYLE} />
          )}
          {linkedPersons.map((person, index) => (
            <SectionTile key={person.id} id={person.id}>
              <SectionTitle id={person.id}>
                {index + 1}. Datensatz aus der Zentralkartei
              </SectionTitle>
              <CentralFilePersonDetails
                person={person}
                columnSx={COLUMN_STYLE}
              />
            </SectionTile>
          ))}
          {linkedFacilities.map((facility, index) => (
            <SectionTile key={facility.id} id={facility.id}>
              <SectionTitle id={facility.id}>
                {index + 1}. Datensatz aus der Zentralkartei
              </SectionTitle>
              <CentralFileFacilityDetails
                facility={facility}
                columnSx={COLUMN_STYLE}
              />
            </SectionTile>
          ))}
        </Stack>
      </Stack>
    </>
  );
}
