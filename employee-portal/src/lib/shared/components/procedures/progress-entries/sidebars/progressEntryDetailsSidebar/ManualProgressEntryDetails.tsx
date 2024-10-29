/**
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

import { ApiManualProgressEntry } from "@eshg/employee-portal-api/businessProcedures";
import { SubmitButton } from "@eshg/lib-portal/components/buttons/SubmitButton";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import WarningAmberOutlinedIcon from "@mui/icons-material/WarningAmberOutlined";
import {
  Accordion,
  AccordionDetails,
  AccordionGroup,
  AccordionSummary,
  Box,
  Button,
  Chip,
  Sheet,
  Stack,
  Typography,
} from "@mui/joy";
import { Formik } from "formik";
import { ReactNode, useContext, useState } from "react";
import { isDefined } from "remeda";

import { ButtonBar } from "@/lib/shared/components/buttons/ButtonBar";
import { SidebarForm } from "@/lib/shared/components/form/SidebarForm";
import { TextareaField } from "@/lib/shared/components/formFields/TextareaField";
import { FileCardWithActions } from "@/lib/shared/components/procedures/progress-entries/FileCardWithActions";
import {
  ProgressEntriesContext,
  useFilteredAndSortedRelatedEntries,
  useIsReadOnly,
  useProgressEntriesConfig,
} from "@/lib/shared/components/procedures/progress-entries/ProgressEntriesContext";
import {
  manualProgressEntryKeyDocumentTypes,
  manualProgressEntryTypeNames,
} from "@/lib/shared/components/procedures/progress-entries/constants";
import { extractFileDescriptionValue } from "@/lib/shared/components/procedures/progress-entries/helper";
import { useDeletionProps } from "@/lib/shared/components/procedures/progress-entries/hooks/useDeletionProps";
import { useHasEditRights } from "@/lib/shared/components/procedures/progress-entries/hooks/useHasEditRights";
import {
  mapToPatchRequest,
  mapToUpdateMetaDataRequest,
} from "@/lib/shared/components/procedures/progress-entries/mapper";
import { DetailsContentWrapper } from "@/lib/shared/components/procedures/progress-entries/sidebars/progressEntryDetailsSidebar/DetailsContentWrapper";
import { DetailsHistory } from "@/lib/shared/components/procedures/progress-entries/sidebars/progressEntryDetailsSidebar/DetailsHistory";
import { LabelValueDisplay } from "@/lib/shared/components/procedures/progress-entries/sidebars/progressEntryDetailsSidebar/LabelValueDisplay";
import { RelatedEntry } from "@/lib/shared/components/procedures/progress-entries/types";
import { SidebarActions } from "@/lib/shared/components/sidebar/SidebarActions";

type ManualProgressEntryDetailsView = "DETAILS" | "HISTORY";

export function ManualProgressEntryDetails({
  entry,
  relatedKeyDocumentProgressEntries,
  onClose,
}: {
  entry: ApiManualProgressEntry;
  relatedKeyDocumentProgressEntries: ApiManualProgressEntry[];
  onClose: () => void;
}) {
  const [currentView, setCurrentView] =
    useState<ManualProgressEntryDetailsView>("DETAILS");

  function openHistory() {
    return setCurrentView("HISTORY");
  }

  function openDetails() {
    return setCurrentView("DETAILS");
  }

  return (
    <>
      {currentView === "DETAILS" && (
        <ManualProgressEntryDetailsView
          entry={entry}
          relatedKeyDocumentProgressEntries={relatedKeyDocumentProgressEntries}
          onHistory={openHistory}
          onClose={onClose}
        />
      )}
      {currentView === "HISTORY" && (
        <DetailsHistory entry={entry} onBack={openDetails} />
      )}
    </>
  );
}

export function ManualProgressEntryDetailsView(props: {
  entry: ApiManualProgressEntry;
  relatedKeyDocumentProgressEntries: ApiManualProgressEntry[];
  onClose: () => void;
  onHistory: () => void;
}) {
  const { entry } = props;
  const isReadOnly = useIsReadOnly();
  const hasEditRights = useHasEditRights(entry);
  const editable = hasEditRights && !isReadOnly && !entry.locked;

  return editable ? (
    <EditableManualProgressEntryDetails {...props} />
  ) : (
    <ManualProgressEntryDetailsTemplate
      entry={entry}
      relatedKeyDocumentProgressEntries={
        props.relatedKeyDocumentProgressEntries
      }
      handleClose={props.onClose}
      onHistory={props.onHistory}
      elements={{
        fileDescription: (
          <LabelValueDisplay
            label="Dateibeschreibung"
            value={extractFileDescriptionValue(entry) ?? ""}
          />
        ),
        text: (
          <LabelValueDisplay
            label="Text"
            value={isDefined(entry.note) ? entry.note : ""}
          />
        ),
      }}
    />
  );
}

export interface ProgressEntryDetailsValues {
  text: string;
  documentDescription: string;
}

function EditableManualProgressEntryDetails({
  entry,
  relatedKeyDocumentProgressEntries,
  onClose,
  onHistory,
}: {
  entry: ApiManualProgressEntry;
  relatedKeyDocumentProgressEntries: ApiManualProgressEntry[];
  onClose: () => void;
  onHistory: () => void;
}) {
  const { usePatchProgressEntry } = useProgressEntriesConfig();
  const patchProgressEntry = usePatchProgressEntry();
  const fileDescription = extractFileDescriptionValue(entry);
  const INITIAL_EDIT_PROGRESS_ENTRY_VALUES: ProgressEntryDetailsValues = {
    text: entry.note ?? "",
    documentDescription: fileDescription ?? "",
  };

  async function handleSubmit(values: ProgressEntryDetailsValues) {
    await patchProgressEntry
      .mutateAsync(
        {
          entryId: entry.progressEntryId,
          patchProgressEntryRequest: mapToPatchRequest(values, entry.note),
          fileId: entry.fileReference?.fileId,
          updateFileMetaDataRequest: mapToUpdateMetaDataRequest(
            values,
            entry.fileReference,
          ),
        },
        {
          onSuccess: onClose,
        },
      )
      .catch();
  }

  return (
    <Formik
      initialValues={INITIAL_EDIT_PROGRESS_ENTRY_VALUES}
      onSubmit={handleSubmit}
      onReset={onClose}
    >
      {({ isSubmitting, handleSubmit }) => (
        <SidebarForm onSubmit={handleSubmit}>
          <ManualProgressEntryDetailsTemplate
            entry={entry}
            relatedKeyDocumentProgressEntries={
              relatedKeyDocumentProgressEntries
            }
            handleClose={onClose}
            onHistory={onHistory}
            elements={{
              fileDescription: isFileLocked(entry) ? (
                <LabelValueDisplay
                  label="Dateibeschreibung"
                  value={INITIAL_EDIT_PROGRESS_ENTRY_VALUES.documentDescription}
                />
              ) : (
                <TextareaField
                  name="documentDescription"
                  label="Dateibeschreibung"
                />
              ),
              text: <TextareaField name="text" label="Text" />,
              submit: (
                <SubmitButton submitting={isSubmitting} disabled={entry.locked}>
                  Speichern
                </SubmitButton>
              ),
            }}
          />
        </SidebarForm>
      )}
    </Formik>
  );
}

function isFileLocked(entry: ApiManualProgressEntry) {
  return (
    entry.fileReference?.type !== "GenericFileReference" &&
    entry.fileReference?.locked
  );
}

interface ManualProgressEntryDetailsTemplateProps {
  entry: ApiManualProgressEntry;
  relatedKeyDocumentProgressEntries: ApiManualProgressEntry[];
  handleClose: () => void;
  elements: {
    submit?: ReactNode;
    text: ReactNode;
    fileDescription: ReactNode;
  };
  onHistory: () => void;
}

function ManualProgressEntryDetailsTemplate({
  entry,
  relatedKeyDocumentProgressEntries,
  handleClose,
  elements,
  onHistory,
}: ManualProgressEntryDetailsTemplateProps) {
  const isReadOnly = useIsReadOnly();
  const relatedEntries = useFilteredAndSortedRelatedEntries(
    relatedKeyDocumentProgressEntries,
  );
  const deletionProps = useDeletionProps();
  const DeleteProgressEntryModal = deletionProps.EntryModal;
  const { openEntryDeletionModal } = useContext(ProgressEntriesContext).action;

  const { keyDocumentVersion } = entry;
  const showNewerVersionHint =
    isDefined(keyDocumentVersion) &&
    isDefined(relatedEntries) &&
    relatedEntries.some(
      (relatedEntry) => relatedEntry.keyDocumentVersion > keyDocumentVersion,
    );

  return (
    <>
      <DetailsContentWrapper
        entry={entry}
        title={`Details ${manualProgressEntryTypeNames[entry.manualProgressEntryType]}`}
        creatorName={`${entry.createdByUserFirstName} ${entry.createdByUserLastName}`}
        additionalFileElements={{
          start: (
            <>
              <LabelValueDisplay
                label="Dokumenttyp"
                value={
                  manualProgressEntryKeyDocumentTypes[
                    entry.keyDocumentType ?? ""
                  ] ?? ""
                }
                endDecorator={
                  entry.keyDocumentVersion ? (
                    <Chip color="primary">{`Version ${entry.keyDocumentVersion}`}</Chip>
                  ) : undefined
                }
              />
              {showNewerVersionHint && <NewerVersionHint />}
              {isDefined(relatedEntries) && relatedEntries.length > 0 && (
                <AllKeyDocumentVersions relatedEntries={relatedEntries} />
              )}
            </>
          ),
          mail: [
            <LabelValueDisplay
              key="subject"
              label="Betreff"
              value={isDefined(entry.subject) ? entry.subject : ""}
            />,
            <LabelValueDisplay
              key="email-text"
              label="Email-Text"
              value={isDefined(entry.messageText) ? entry.messageText : ""}
            />,
          ],
          end: elements.fileDescription,
        }}
        endSlot={
          <ButtonBar
            right={
              <Button
                variant="plain"
                onClick={onHistory}
                endDecorator={<ArrowForwardIcon />}
              >
                Änderungshistorie
              </Button>
            }
          />
        }
      >
        {elements.text}
      </DetailsContentWrapper>
      <SidebarActions>
        {!isReadOnly && (
          <ButtonBar
            left={
              <Button
                onClick={() => {
                  openEntryDeletionModal(entry.progressEntryId);
                }}
                variant="plain"
                color="danger"
                disabled={entry.locked}
              >
                {deletionProps.name}
              </Button>
            }
            right={elements.submit}
          />
        )}
      </SidebarActions>
      <DeleteProgressEntryModal onSuccessfulDeletion={handleClose} />
    </>
  );
}

function AllKeyDocumentVersions({
  relatedEntries,
}: {
  relatedEntries: RelatedEntry[];
}) {
  return (
    <AccordionGroup
      variant="soft"
      color="primary"
      size="sm"
      sx={{ borderRadius: "md" }}
    >
      <Accordion>
        <AccordionSummary
          color="primary"
          sx={{
            button: {
              color: "var(--joy-palette-primary-700)",
              borderRadius: "md",
            },
          }}
        >
          Alle Versionen anzeigen
        </AccordionSummary>
        <AccordionDetails>
          <Stack gap={1} padding={1}>
            {relatedEntries.map((entry) => (
              <Box key={entry.keyDocumentVersion} data-testid="relatedVersion">
                <Typography
                  level="body-sm"
                  fontWeight="500"
                >{`Version ${entry.keyDocumentVersion}`}</Typography>
                <FileCardWithActions
                  detailsProgressEntryId={entry.progressEntryId}
                  file={entry.fileReference}
                />
              </Box>
            ))}
          </Stack>
        </AccordionDetails>
      </Accordion>
    </AccordionGroup>
  );
}

function NewerVersionHint() {
  return (
    <Sheet variant="soft" color="neutral">
      <Typography
        level="body-sm"
        startDecorator={<WarningAmberOutlinedIcon color="warning" />}
      >
        Es existiert eine neuere Version dieser Datei.
      </Typography>
    </Sheet>
  );
}
