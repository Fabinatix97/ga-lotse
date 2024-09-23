/**
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { formatDate } from "@eshg/lib-portal/formatters/dateTime";
import { Divider, Stack } from "@mui/joy";
import { SxProps } from "@mui/joy/styles/types";

import { PersonDetails } from "@/lib/businessModules/schoolEntry/api/models/Person";
import { ProcedureDetails } from "@/lib/businessModules/schoolEntry/api/models/ProcedureDetails";
import { useRemoveCustodian } from "@/lib/businessModules/schoolEntry/api/mutations/schoolEntryApi";
import { UpdateChildSidebar } from "@/lib/businessModules/schoolEntry/features/procedures/procedureDetails/UpdateChildSidebar";
import { UpdateCustodianSidebar } from "@/lib/businessModules/schoolEntry/features/procedures/procedureDetails/UpdateCustodianSidebar";
import { GENDER_VALUES } from "@/lib/businessModules/schoolEntry/features/procedures/translations";
import { routes } from "@/lib/businessModules/schoolEntry/shared/routes";
import { BaseAddressDetails } from "@/lib/shared/components/address/BaseAddressDetails";
import { OverlayBoundary } from "@/lib/shared/components/boundaries/OverlayBoundary";
import {
  ActionsItem,
  ActionsMenu,
} from "@/lib/shared/components/buttons/ActionsMenu";
import { EditButton } from "@/lib/shared/components/buttons/EditButton";
import {
  SyncBarrier,
  useSyncBarrier,
} from "@/lib/shared/components/centralFile/sync/SyncBarrier";
import { useConfirmationDialog } from "@/lib/shared/components/confirmationDialog/ConfirmationDialogProvider";
import { ContentPanel } from "@/lib/shared/components/contentPanel/ContentPanel";
import { DetailsCell } from "@/lib/shared/components/detailsSection/DetailsCell";
import { DetailsRow } from "@/lib/shared/components/detailsSection/DetailsRow";
import { DetailsSection } from "@/lib/shared/components/detailsSection/DetailsSection";
import {
  PERSON_FIELD_NAME,
  SALUTATION_VALUES,
  getOptionalTitle,
} from "@/lib/shared/components/personSidebar/constants";
import { translateCountry } from "@/lib/shared/helpers/i18n";
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
    await removeCustodian
      .mutateAsync({
        procedureVersion: procedure.version,
      })
      .catch();
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
        <Stack
          direction="row"
          gap={3}
          divider={<Divider orientation="vertical" />}
        >
          <Stack gap={1} sx={COLUMN_STYLE}>
            <DetailsRow>
              <DetailsCell
                name="salutation"
                label={PERSON_FIELD_NAME.salutation}
                value={SALUTATION_VALUES[person.salutation]}
              />
              {person.title && (
                <DetailsCell
                  name="title"
                  label={PERSON_FIELD_NAME.title}
                  value={getOptionalTitle(person.title)}
                />
              )}
            </DetailsRow>
            <DetailsCell
              name="firstName"
              label={PERSON_FIELD_NAME.firstName}
              value={person.firstName}
            />
            <DetailsCell
              name="lastName"
              label={PERSON_FIELD_NAME.lastName}
              value={person.lastName}
            />
            <DetailsRow>
              <DetailsCell
                name="dateOfBirth"
                label={PERSON_FIELD_NAME.dateOfBirth}
                value={formatDate(person.dateOfBirth)}
              />
              <DetailsCell
                name="gender"
                label={PERSON_FIELD_NAME.gender}
                value={GENDER_VALUES[person.gender]}
              />
            </DetailsRow>
            {person.nameAtBirth && (
              <DetailsCell
                name="nameAtBirth"
                label={PERSON_FIELD_NAME.nameAtBirth}
                value={person.nameAtBirth}
              />
            )}
            {(person.placeOfBirth ?? person.countryOfBirth) && (
              <DetailsRow>
                {person.placeOfBirth && (
                  <DetailsCell
                    name="placeOfBirth"
                    label={PERSON_FIELD_NAME.placeOfBirth}
                    value={person.placeOfBirth}
                  />
                )}
                {person.countryOfBirth && (
                  <DetailsCell
                    name="countryOfBirth"
                    label={PERSON_FIELD_NAME.countryOfBirth}
                    value={translateCountry(person.countryOfBirth)}
                  />
                )}
              </DetailsRow>
            )}
          </Stack>
          {person.contactAddress && (
            <BaseAddressDetails
              address={person.contactAddress}
              sx={COLUMN_STYLE}
            />
          )}

          {(person.emailAddresses ?? person.phoneNumbers) && (
            <Stack gap={1} sx={COLUMN_STYLE}>
              {person.emailAddresses?.map((emailAddress, index) => (
                <DetailsCell
                  name={`emailAddress-${index}`}
                  key={index}
                  label={PERSON_FIELD_NAME.emailAddresses}
                  value={emailAddress}
                />
              ))}
              {person.phoneNumbers?.map((phoneNumber, index) => (
                <DetailsCell
                  name={`phoneNumber-${index}`}
                  key={index}
                  label={PERSON_FIELD_NAME.phoneNumbers}
                  value={phoneNumber}
                />
              ))}
            </Stack>
          )}
        </Stack>
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
