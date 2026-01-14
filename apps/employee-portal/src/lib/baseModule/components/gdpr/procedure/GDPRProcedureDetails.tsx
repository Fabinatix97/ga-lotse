/**
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

"use client";

import { Stack } from "@mui/joy";
import { SxProps } from "@mui/joy/styles/types";
import { isDefined } from "remeda";

import {
  ApiGdprProcedureStatus,
  ApiGdprProcedureType,
  ApiGetGdprProcedureResponse,
  ApiGetReferenceFacilityResponse,
  ApiGetReferencePersonResponse,
  ApiUserRole,
} from "@eshg/base-api";
import {
  CentralFilePersonDetails,
  mapReferencePersonToForm,
  useEditReferencePersonSidebar,
  useHasUserRoleCheck,
  useSidebar,
} from "@eshg/lib-employee-portal";
import { QueryBoundary } from "@eshg/lib-portal";

import {
  isGdprFacility,
  isGdprPerson,
} from "@/lib/baseModule/components/gdpr/helpers";
import {
  LinkFacilitySidebar,
  LinkPersonSidebar,
} from "@/lib/baseModule/components/gdpr/procedure/linkCentralFileSidebar/LinkCentralFileSidebar";
import { CentralFileLinkTile } from "@/lib/baseModule/components/gdpr/procedure/tiles/CentralFileLinkTile";
import { GdprDownloadPackagesTile } from "@/lib/baseModule/components/gdpr/procedure/tiles/GdprDownloadPackagesTile";
import { GdprPersonDataTile } from "@/lib/baseModule/components/gdpr/procedure/tiles/GdprPersonDataTile";
import { ProcedureDetailsTile } from "@/lib/baseModule/components/gdpr/procedure/tiles/ProcedureDetailsTile";
import {
  SectionTile,
  SectionTitle,
} from "@/lib/baseModule/components/gdpr/procedure/tiles/SectionTile";
import { SheetQueryBoundary } from "@/lib/shared/components/boundaries/SheetQueryBoundary";
import { CentralFileFacilityDetails } from "@/lib/shared/components/centralFile/display/CentralFileFacilityDetails";
import { useEditReferenceFacilitySidebar } from "@/lib/shared/components/facilitySidebar/EditReferenceFacilitySidebar";

import { GdprFacilityDataTile } from "./tiles/GdprFacilityDataTile";

interface GDPRProcedureDetailsProps {
  procedure: ApiGetGdprProcedureResponse;
  hasDownload: boolean;
  personMatches: ApiGetReferencePersonResponse[];
  facilityMatches: ApiGetReferenceFacilityResponse[];
  linkedPersons: ApiGetReferencePersonResponse[];
  linkedFacilities: ApiGetReferenceFacilityResponse[];
}

const COLUMN_STYLE: SxProps = {
  flexGrow: 1,
  maxWidth: (theme) => ({ md: `calc(100%/3 - 2 * ${theme.spacing(2)})` }),
};

function isExternalIdentity(
  identity: ApiGetGdprProcedureResponse["identificationData"],
) {
  return (
    (isGdprPerson(identity) && isDefined(identity.bpk2)) ||
    (isGdprFacility(identity) && isDefined(identity.dataTransmitterPseudonymId))
  );
}

export function GDPRProcedureDetails({
  procedure,
  hasDownload,
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

  const showDownloads =
    procedure.status === ApiGdprProcedureStatus.Closed &&
    procedure.type === ApiGdprProcedureType.OfAccess;

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
          <GdprPersonDataTile identity={identity} />
        ) : (
          <GdprFacilityDataTile identity={identity} />
        )}
        {linkedPersons.map((person, index) => (
          <SectionTile key={person.id} id={person.id}>
            <SectionTitle
              id={person.id}
              canEdit={canEditCentralFile}
              onEdit={() => editPerson(person)}
            >
              {index + 1}. Stammdatensatz
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
              {index + 1}. Stammdatensatz
            </SectionTitle>
            <CentralFileFacilityDetails
              facility={facility}
              columnSx={COLUMN_STYLE}
            />
          </SectionTile>
        ))}
      </Stack>
      <Stack gap={3} flexBasis="50ch">
        <QueryBoundary>
          <ProcedureDetailsTile procedure={procedure} />
        </QueryBoundary>
        <SheetQueryBoundary
          title="Datenpakete"
          loadingText="Datenpakete werden geladen..."
        >
          {showDownloads && (
            <GdprDownloadPackagesTile
              gdprProcedure={procedure}
              hasDownload={hasDownload}
              isExternal={isExternalIdentity(procedure.identificationData)}
            />
          )}
        </SheetQueryBoundary>
        {procedure.status === ApiGdprProcedureStatus.Draft && (
          <CentralFileLinkTile
            hasLinkedMatches={
              linkedFacilities.length + linkedPersons.length > 0
            }
            numMatches={personMatches.length + facilityMatches.length}
            onAddLink={hasWritePerms && (() => openLinkSidebar())}
          />
        )}
      </Stack>
    </Stack>
  );
}
