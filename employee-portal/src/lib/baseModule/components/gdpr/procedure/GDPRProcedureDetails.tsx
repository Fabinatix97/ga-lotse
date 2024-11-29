/**
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

"use client";

import {
  ApiGdprProcedureStatus,
  ApiGdprProcedureType,
  ApiGetGdprProcedureResponse,
  ApiGetReferenceFacilityResponse,
  ApiGetReferencePersonResponse,
  ApiUserRole,
} from "@eshg/employee-portal-api/base";
import { QueryBoundary } from "@eshg/lib-portal/components/boundaries/QueryBoundary";
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
import { useEditReferenceFacilitySidebar } from "@/lib/shared/components/facilitySidebar/EditReferenceFacilitySidebar";
import { useEditReferencePersonSidebar } from "@/lib/shared/components/personSidebar/PersonEditSidebar";
import { mapReferencePersonToForm } from "@/lib/shared/components/personSidebar/helpers";
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

  const linkFacilitySidebar = useSidebar({
    component: LinkFacilitySidebar,
  });

  const linkPersonSidebar = useSidebar({
    component: LinkPersonSidebar,
  });

  const editPersonSidebar = useEditReferencePersonSidebar();
  const editFacilitySidebar = useEditReferenceFacilitySidebar();

  const identity = procedure.identificationData;
  const canEditCentralFile =
    procedure.status === ApiGdprProcedureStatus.InProgress &&
    procedure.type === ApiGdprProcedureType.ToRectification;

  function openLinkSidebar() {
    if (isGdprPerson(identity)) {
      linkPersonSidebar.open({
        procedureId: procedure.id,
        procedureVersion: procedure.version,
        matches: personMatches,
      });
    } else {
      linkFacilitySidebar.open({
        procedureId: procedure.id,
        procedureVersion: procedure.version,
        matches: facilityMatches,
      });
    }
  }

  function editPerson(person: ApiGetReferencePersonResponse) {
    editPersonSidebar.open({
      addressRequired: false,
      initialValues: {
        ...mapReferencePersonToForm(person),
        id: person.id,
        version: person.version,
      },
      submitLabel: "Speichern",
      title: "Person bearbeiten",
    });
  }

  function editFacility(facility: ApiGetReferenceFacilityResponse) {
    editFacilitySidebar.open({ facility });
  }

  return (
    <Stack
      direction={{ xxs: "column", md: "row" }}
      gap={3}
      sx={{
        alignItems: {
          md: "start",
        },
      }}
    >
      <Stack gap={3} flex={1}>
        {isGdprPerson(identity) ? (
          <GdprPersonDataTile identity={identity} columnSx={COLUMN_STYLE} />
        ) : (
          <GdprFacilityDataTile identity={identity} columnSx={COLUMN_STYLE} />
        )}
        {linkedPersons.map((person, index) => (
          <SectionTile key={person.id} id={person.id}>
            <SectionTitle
              id={person.id}
              canEdit={canEditCentralFile}
              onEdit={() => editPerson(person)}
            >
              {index + 1}. Datensatz aus dem Stammdaten-Konverter
            </SectionTitle>
            <CentralFilePersonDetails person={person} columnSx={COLUMN_STYLE} />
          </SectionTile>
        ))}
        {linkedFacilities.map((facility, index) => (
          <SectionTile key={facility.id} id={facility.id}>
            <SectionTitle
              id={facility.id}
              canEdit={canEditCentralFile}
              onEdit={() => editFacility(facility)}
            >
              {index + 1}. Datensatz aus dem Stammdaten-Konverter
            </SectionTitle>
            <CentralFileFacilityDetails
              facility={facility}
              columnSx={COLUMN_STYLE}
            />
          </SectionTile>
        ))}
      </Stack>
      <Stack gap={3} flexBasis={"50ch"}>
        <QueryBoundary>
          <ProcedureDetailsTile procedure={procedure} />
        </QueryBoundary>
        {procedure.status === ApiGdprProcedureStatus.Draft && (
          <CentralFileLinkTile
            centralFileId={procedure.centralFileId}
            numMatches={personMatches.length + facilityMatches.length}
            onAddLink={hasWritePerms && (() => openLinkSidebar())}
          />
        )}
      </Stack>
    </Stack>
  );
}
