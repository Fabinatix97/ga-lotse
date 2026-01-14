/**
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

import { Button, Divider, Stack, Typography } from "@mui/joy";
import { useState } from "react";
import { isDefined } from "remeda";

import {
  DetailsColumn,
  DetailsList,
  SALUTATION_VALUES,
  formatDate,
  formatList,
  formatPostalCodeAndCity,
  formatStreetAndHouseNumber,
  formatUserName,
} from "@eshg/lib-portal";
import {
  ApiBusinessModule,
  ApiGetInboxProcedureResponse,
  ApiInboxProcedureAddress,
  ApiInboxProcedureStatus,
} from "@eshg/lib-procedures-api";

import { OverlayBoundary } from "../../../components/boundaries/OverlayBoundary";
import { ButtonBar } from "../../../components/buttons/ButtonBar";
import { FileCard } from "../../../components/cards/FileCard";
import { ConfirmationDialog } from "../../../components/confirmationDialog/ConfirmationDialog";
import { DetailsRow } from "../../../components/detailsSection/DetailsRow";
import { DetailsItem } from "../../../components/detailsSection/items/DetailsItem";
import { PROCEDURE_TYPE_NAMES } from "../../../translations/procedures";
import { SidebarActions } from "../../drawer/components/SidebarActions";
import { SidebarContent } from "../../drawer/components/SidebarContent";
import { DrawerProps } from "../../drawer/types/drawer";
import { InboxProcedureClient } from "../api/client";
import { useCloseInboxProcedure } from "../api/mutations";
import { useFetchInboxProcedure } from "../api/queries";
import {
  contactTypeNames,
  inboxProgressEntryTypeNames,
  titleNames,
} from "../config/translations";

import { InboxProcedureStatusChip } from "./InboxProcedureStatusChip";
import { CreateProcedureHandler } from "./InboxProceduresPage";

interface InboxProcedureDetailsSidebarProps extends DrawerProps {
  inboxProcedureApi: InboxProcedureClient;
  businessModule: ApiBusinessModule;
  inboxProcedureId: string;
  onCreateProcedure?: CreateProcedureHandler;
}

export function InboxProcedureDetailsSidebar({
  inboxProcedureApi,
  businessModule,
  inboxProcedureId,
  onCreateProcedure,
}: InboxProcedureDetailsSidebarProps) {
  const response = useFetchInboxProcedure(
    inboxProcedureApi,
    businessModule,
    inboxProcedureId,
  ).data;
  const { inboxProcedure } = response;

  const [showClosureModal, setShowClosureModal] = useState(false);

  return (
    <>
      <InboxProcedureDetailsSidebarContent {...response} />
      <SidebarActions>
        <ButtonBar
          left={
            isDefined(onCreateProcedure) && (
              <Button
                variant="plain"
                disabled={
                  inboxProcedure.inboxProcedureStatus ===
                  ApiInboxProcedureStatus.Closed
                }
                onClick={() => onCreateProcedure(inboxProcedureId)}
              >
                Vorgang anlegen
              </Button>
            )
          }
          right={
            <Button
              color="danger"
              disabled={
                inboxProcedure.inboxProcedureStatus ===
                ApiInboxProcedureStatus.Closed
              }
              onClick={() => {
                setShowClosureModal(true);
              }}
            >
              Vorgang schließen
            </Button>
          }
        />
      </SidebarActions>
      {showClosureModal && (
        <InboxProcedureClosureModal
          inboxProcedureApi={inboxProcedureApi}
          inboxProcedureId={inboxProcedure.inboxProcedureId}
          onClose={() => setShowClosureModal(false)}
        />
      )}
    </>
  );
}

function InboxProcedureDetailsSidebarContent(
  props: ApiGetInboxProcedureResponse,
) {
  return (
    <SidebarContent title="Details">
      <Stack spacing={2}>
        <InboxProcedureSection {...props} />
        <Divider />
        <ProgressEntrySection {...props} />
        <Divider />
        <ContactSection {...props} />
      </Stack>
    </SidebarContent>
  );
}

function InboxProcedureSection({
  inboxProcedure,
  resolvedUsers,
}: ApiGetInboxProcedureResponse) {
  const { inboxProcedureStatus, inboxProcedureType, createdAt, createdBy } =
    inboxProcedure;

  const creatorUser = resolvedUsers[createdBy];
  const creatorName = formatUserName(creatorUser);
  const procedureTypeName =
    inboxProcedureType !== undefined
      ? PROCEDURE_TYPE_NAMES[inboxProcedureType]
      : undefined;

  return (
    <DetailsList>
      <DetailsColumn>
        <DetailsRow>
          <DetailsItem
            label="Status"
            value={<InboxProcedureStatusChip status={inboxProcedureStatus} />}
          />
          <DetailsItem label="Vorgangstyp" value={procedureTypeName} />
        </DetailsRow>
        <DetailsRow>
          <DetailsItem label="Erstellt am" value={formatDate(createdAt)} />
          <DetailsItem label="Ersteller" value={creatorName} />
        </DetailsRow>
      </DetailsColumn>
    </DetailsList>
  );
}

function ProgressEntrySection({
  inboxProcedure,
}: ApiGetInboxProcedureResponse) {
  const { inboxProgressEntry } = inboxProcedure;
  const progressEntryTypeName =
    inboxProgressEntryTypeNames[inboxProgressEntry.inboxProgressEntryType];

  const { fileReference } = inboxProgressEntry;
  const hasFileReference =
    !!fileReference && fileReference.type !== "GenericFileReference";

  return (
    <>
      <Typography level="title-md">Posteingangsverlaufeintrag</Typography>
      <DetailsList>
        <DetailsColumn>
          <DetailsItem label="Typ" value={progressEntryTypeName} />
          <DetailsItem label="Betreff" value={inboxProgressEntry.subject} />
          <DetailsItem
            label="Nachricht"
            value={inboxProgressEntry.messageText}
          />
          {hasFileReference && (
            <>
              <DetailsItem
                label="Datei"
                value={
                  <FileCard
                    name={fileReference.fileName}
                    type={fileReference.fileType}
                    creationDate={fileReference.createdAt}
                    size={fileReference.fileSizeBytes}
                    actions={[]}
                  />
                }
              />
              {fileReference.type === "Mail" && (
                <DetailsRow>
                  <DetailsItem
                    label="Absender"
                    value={fileReference.metaData?.mailFrom}
                  />
                  <DetailsItem
                    label="Empfänger"
                    value={fileReference.metaData?.mailTo}
                  />
                </DetailsRow>
              )}
              <DetailsItem
                label="Beschreibung"
                value={fileReference.metaData?.description}
              />
            </>
          )}
        </DetailsColumn>
      </DetailsList>
    </>
  );
}

function ContactSection({ inboxProcedure }: ApiGetInboxProcedureResponse) {
  const { contactDetails } = inboxProcedure;
  const contactTypeName = contactTypeNames[contactDetails.contactType];
  const titleName =
    contactDetails.title !== undefined
      ? titleNames[contactDetails.title]
      : undefined;
  const salutationName = SALUTATION_VALUES[contactDetails.salutation];

  return (
    <>
      <Typography level="title-md">Kontakt</Typography>
      <DetailsList>
        <DetailsColumn>
          <DetailsItem label="Typ" value={contactTypeName} />
          <DetailsItem
            label="Name der Einrichtung"
            value={contactDetails.facilityName}
          />
          <DetailsRow>
            <DetailsItem label="Titel" value={titleName} />
            <DetailsItem
              label="Geburtstag"
              value={formatDate(contactDetails.dateOfBirth)}
            />
          </DetailsRow>
          <DetailsItem label="Anrede" value={salutationName} />
          <DetailsRow>
            <DetailsItem label="Vorname" value={contactDetails.firstName} />
            <DetailsItem label="Name" value={contactDetails.lastName} />
          </DetailsRow>
          <DetailsItem
            label="Adresse"
            value={fullAddressAndCountry(contactDetails.address)}
          />
          <DetailsItem
            label="Adresszusatz"
            value={contactDetails.address?.addressAddition}
          />
          <DetailsItem
            label="Postfachnummer"
            value={contactDetails.address?.postboxNumber?.toString()}
          />
          <DetailsRow>
            <DetailsItem label="E-Mail" value={contactDetails.emailAddress} />
            <DetailsItem label="Telefon" value={contactDetails.phoneNumber} />
          </DetailsRow>
        </DetailsColumn>
      </DetailsList>
    </>
  );
}

function InboxProcedureClosureModal({
  inboxProcedureApi,
  inboxProcedureId,
  onClose,
}: {
  inboxProcedureApi: InboxProcedureClient;
  inboxProcedureId: string;
  onClose: () => void;
}) {
  const closeInboxProcedure = useCloseInboxProcedure(inboxProcedureApi);

  function handleSubmit() {
    closeInboxProcedure.mutate(inboxProcedureId);
  }

  return (
    <OverlayBoundary>
      <ConfirmationDialog
        open
        title="Posteingangsvorgang schließen?"
        description="Diese Aktion kann nicht rückgängig gemacht werden."
        color="danger"
        confirmLabel="Ja, schließen"
        cancelLabel="Abbrechen"
        onClose={onClose}
        onConfirm={handleSubmit}
      />
    </OverlayBoundary>
  );
}

function fullAddressAndCountry(address: ApiInboxProcedureAddress | undefined) {
  return formatList(
    [
      formatStreetAndHouseNumber(address),
      formatPostalCodeAndCity(address),
      address?.country,
    ],
    ", ",
  );
}
