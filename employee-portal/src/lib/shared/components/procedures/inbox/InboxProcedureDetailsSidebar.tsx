/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

import {
  ApiGetInboxProcedureResponse,
  ApiInboxProcedureAddress,
  ApiInboxProcedureStatus,
} from "@eshg/employee-portal-api/businessProcedures";
import { SALUTATION_VALUES } from "@eshg/lib-portal/components/formFields/constants";
import { formatDate } from "@eshg/lib-portal/formatters/dateTime";
import { Button, Divider, Stack, Typography } from "@mui/joy";
import { ReactElement, useState } from "react";

import { UseFetchInboxProcedure } from "@/lib/shared/api/queries/inboxProcedures";
import { FileCard } from "@/lib/shared/components/FileCard";
import { OverlayBoundary } from "@/lib/shared/components/boundaries/OverlayBoundary";
import { ButtonBar } from "@/lib/shared/components/buttons/ButtonBar";
import { EmployeePortalConfirmationDialog } from "@/lib/shared/components/confirmationDialog/EmployeePortalConfirmationDialog";
import { DetailsCell } from "@/lib/shared/components/detailsSection/DetailsCell";
import { DrawerProps } from "@/lib/shared/components/drawer/drawerContext";
import { procedureTypeNames } from "@/lib/shared/components/procedures/constants";
import { InboxProcedureStatusChip } from "@/lib/shared/components/procedures/inbox/InboxProcedureStatusChip";
import { UseCloseInboxProcedure } from "@/lib/shared/components/procedures/inbox/mutations/useCloseInboxProcedureStatusTemplate";
import { SidebarActions } from "@/lib/shared/components/sidebar/SidebarActions";
import { SidebarContent } from "@/lib/shared/components/sidebar/SidebarContent";
import { fullName } from "@/lib/shared/components/users/userFormatter";
import {
  postalCodeAndCity,
  streetAndHouseNumber,
} from "@/lib/shared/helpers/facilityUtils";
import { join } from "@/lib/shared/helpers/strings";

import {
  contactTypeNames,
  inboxProgressEntryTypeNames,
  titleNames,
} from "./constants";
import {
  UseCreateInboxProcedure,
  useCreateInboxProcedureDisabled,
} from "./hooks/useCreateInboxProcedureStatusTemplate";

interface InboxProcedureDetailsSidebarProps extends DrawerProps {
  inboxProcedureId: string;
  useFetchInboxProcedure: UseFetchInboxProcedure;
  useCloseInboxProcedure: UseCloseInboxProcedure;
  useCreateInboxProcedure?: UseCreateInboxProcedure;
}

export function InboxProcedureDetailsSidebar({
  inboxProcedureId,
  useFetchInboxProcedure,
  useCloseInboxProcedure,
  useCreateInboxProcedure = useCreateInboxProcedureDisabled,
}: InboxProcedureDetailsSidebarProps) {
  const response = useFetchInboxProcedure(inboxProcedureId).data;
  const { inboxProcedure } = response;

  const [showClosureModal, setShowClosureModal] = useState(false);
  const createInboxProcedure = useCreateInboxProcedure(inboxProcedureId);

  return (
    <>
      <InboxProcedureDetailsSidebarContent {...response} />
      <SidebarActions>
        <ButtonBar
          left={
            createInboxProcedure && (
              <Button
                variant="plain"
                onClick={createInboxProcedure}
                disabled={
                  inboxProcedure.inboxProcedureStatus ===
                  ApiInboxProcedureStatus.Closed
                }
              >
                Vorgang anlegen
              </Button>
            )
          }
          right={
            <Button
              onClick={() => {
                setShowClosureModal(true);
              }}
              color="danger"
              disabled={
                inboxProcedure.inboxProcedureStatus ===
                ApiInboxProcedureStatus.Closed
              }
            >
              Vorgang schließen
            </Button>
          }
        />
      </SidebarActions>
      {showClosureModal && (
        <InboxProcedureClosureModal
          inboxProcedureId={inboxProcedure.inboxProcedureId}
          onClose={() => setShowClosureModal(false)}
          useCloseInboxProcedure={useCloseInboxProcedure}
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
  const creatorName = fullName(creatorUser);
  const procedureTypeName =
    inboxProcedureType !== undefined
      ? procedureTypeNames[inboxProcedureType]
      : undefined;

  return (
    <>
      <DetailsGroup
        labeledValues={[
          {
            name: "status",
            label: "Status",
            value: <InboxProcedureStatusChip status={inboxProcedureStatus} />,
          },
          {
            name: "procedureType",
            label: "Vorgangstyp",
            value: procedureTypeName,
          },
        ]}
      />
      <DetailsGroup
        labeledValues={[
          {
            name: "createdAt",
            label: "Erstellt am",
            value: formatDate(createdAt),
          },
          {
            name: "creator",
            label: "Ersteller",
            value: creatorName,
          },
        ]}
      />
    </>
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
      <DetailsGroup
        labeledValues={[
          {
            name: "progressEntryType",
            label: "Typ",
            value: progressEntryTypeName,
          },
        ]}
      />
      <DetailsGroup
        labeledValues={[
          {
            name: "subject",
            label: "Betreff",
            value: inboxProgressEntry.subject,
          },
        ]}
      />
      <DetailsGroup
        labeledValues={[
          {
            name: "messageText",
            label: "Nachricht",
            value: inboxProgressEntry.messageText,
          },
        ]}
      />
      {hasFileReference && (
        <>
          <DetailsGroup
            labeledValues={[
              {
                name: "file",
                label: "Datei",
                value: (
                  <FileCard
                    name={fileReference.fileName}
                    type={fileReference.fileType}
                    creationDate={fileReference.createdAt}
                    size={fileReference.fileSizeBytes}
                    actions={[]}
                  />
                ),
              },
            ]}
          />
          {fileReference.type === "Mail" && (
            <DetailsGroup
              labeledValues={[
                {
                  name: "mailFrom",
                  label: "Absender",
                  value: fileReference.metaData?.mailFrom,
                },
                {
                  name: "mailTo",
                  label: "Empfänger",
                  value: fileReference.metaData?.mailTo,
                },
              ]}
            />
          )}
          <DetailsGroup
            labeledValues={[
              {
                name: "fileDescription",
                label: "Beschreibung",
                value: fileReference.metaData?.description,
              },
            ]}
          />
        </>
      )}
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
      <DetailsGroup
        labeledValues={[
          {
            name: "contactType",
            label: "Typ",
            value: contactTypeName,
          },
        ]}
      />
      <DetailsGroup
        labeledValues={[
          {
            name: "facilityName",
            label: "Name der Einrichtung",
            value: contactDetails.facilityName,
          },
        ]}
      />
      <DetailsGroup
        labeledValues={[
          {
            name: "title",
            label: "Titel",
            value: titleName,
          },
          {
            name: "dateOfBirth",
            label: "Geburtstag",
            value: formatDate(contactDetails.dateOfBirth),
          },
        ]}
      />
      <DetailsGroup
        labeledValues={[
          {
            name: "salutation",
            label: "Anrede",
            value: salutationName,
          },
        ]}
      />
      <DetailsGroup
        labeledValues={[
          {
            name: "firstName",
            label: "Vorname",
            value: contactDetails.firstName,
          },
          {
            name: "lastName",
            label: "Name",
            value: contactDetails.lastName,
          },
        ]}
      />
      <DetailsGroup
        labeledValues={[
          {
            name: "address",
            label: "Adresse",
            value: fullAddressAndCountry(contactDetails.address),
          },
        ]}
      />
      <DetailsGroup
        labeledValues={[
          {
            name: "addressAddition",
            label: "Adresszusatz",
            value: contactDetails.address?.addressAddition,
          },
        ]}
      />
      <DetailsGroup
        labeledValues={[
          {
            name: "postboxNumber",
            label: "Postfachnummer",
            value: contactDetails.address?.postboxNumber?.toString(),
          },
        ]}
      />
      <DetailsGroup
        labeledValues={[
          {
            name: "emailAddress",
            label: "E-Mail",
            value: contactDetails.emailAddress,
          },
          {
            name: "phoneNumber",
            label: "Telefon",
            value: contactDetails.phoneNumber,
          },
        ]}
      />
    </>
  );
}

function InboxProcedureClosureModal({
  inboxProcedureId,
  onClose,
  useCloseInboxProcedure,
}: {
  inboxProcedureId: string;
  onClose: () => void;
  useCloseInboxProcedure: UseCloseInboxProcedure;
}) {
  const closeInboxProcedure = useCloseInboxProcedure();

  function handleSubmit() {
    closeInboxProcedure.mutate(inboxProcedureId);
  }

  return (
    <OverlayBoundary>
      <EmployeePortalConfirmationDialog
        open
        onClose={onClose}
        onConfirm={handleSubmit}
        title="Posteingangsvorgang schließen?"
        description="Diese Aktion kann nicht rückgängig gemacht werden."
        color="danger"
        confirmLabel="Ja, schließen"
        cancelLabel="Abbrechen"
      />
    </OverlayBoundary>
  );
}

interface LabelValuePair {
  name: string;
  label: string;
  value: ReactElement | string | undefined;
}

function DetailsGroup({ labeledValues }: { labeledValues: LabelValuePair[] }) {
  const nonEmptyLabeledValues = labeledValues.filter(({ value }) => !!value);
  if (nonEmptyLabeledValues.length === 0) {
    return null;
  }

  return (
    <Stack direction="row" spacing={2}>
      {nonEmptyLabeledValues.map(({ name, label, value }) => (
        <DetailsCell
          key={name}
          name={name}
          label={label}
          value={value}
          sx={{ flex: "1 0 0", minWidth: 0 }}
          valueSx={{ paddingY: 0.75 }}
          valueIsDiv
        />
      ))}
    </Stack>
  );
}

function fullAddressAndCountry(address: ApiInboxProcedureAddress | undefined) {
  return join(
    [
      streetAndHouseNumber(address),
      postalCodeAndCity(address),
      address?.country,
    ],
    ", ",
  );
}
