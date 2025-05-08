/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import { Button, Chip } from "@mui/joy";
import { Formik } from "formik";
import { ReactNode, useContext, useState } from "react";
import { isDefined } from "remeda";

import {
  ButtonBar,
  SidebarActions,
  SidebarForm,
} from "@eshg/lib-employee-portal";
import { SubmitButton } from "@eshg/lib-portal/components/buttons/SubmitButton";
import { TextareaField } from "@eshg/lib-portal/components/formFields/TextareaField";
import { formatUserName } from "@eshg/lib-portal/formatters/person";
import {
  ApiGetProgressEntryResponseRelatedKeyDocumentProgressEntriesInner,
  ApiManualProgressEntry,
  ApiUser,
} from "@eshg/lib-procedures-api";

import {
  ProgressEntriesContext,
  useIsReadOnly,
  useProgressEntriesConfig,
} from "@/lib/shared/components/procedures/progress-entries/ProgressEntriesContext";
import { manualProgressEntryTypeNames } from "@/lib/shared/components/procedures/progress-entries/constants";
import { extractFileDescriptionValue } from "@/lib/shared/components/procedures/progress-entries/helper";
import { useDeletionProps } from "@/lib/shared/components/procedures/progress-entries/hooks/useDeletionProps";
import { useHasEditRights } from "@/lib/shared/components/procedures/progress-entries/hooks/useHasEditRights";
import {
  mapToPatchRequest,
  mapToUpdateMetaDataRequest,
} from "@/lib/shared/components/procedures/progress-entries/mapper";
import { usePatchProgressEntry } from "@/lib/shared/components/procedures/progress-entries/mutations/progressEntryApi";
import {
  AllKeyDocumentVersions,
  DetailsContentWrapper,
  NewerVersionHint,
} from "@/lib/shared/components/procedures/progress-entries/sidebars/progressEntryDetailsSidebar/DetailsContentWrapper";
import { DetailsHistory } from "@/lib/shared/components/procedures/progress-entries/sidebars/progressEntryDetailsSidebar/DetailsHistory";
import { LabelValueDisplay } from "@/lib/shared/components/procedures/progress-entries/sidebars/progressEntryDetailsSidebar/LabelValueDisplay";

type ManualProgressEntryDetailsView = "DETAILS" | "HISTORY";

export function ManualProgressEntryDetails({
  entry,
  resolvedUsers,
  relatedKeyDocumentProgressEntries,
  onClose,
}: {
  entry: ApiManualProgressEntry;
  resolvedUsers: Record<string, ApiUser>;
  relatedKeyDocumentProgressEntries: ApiGetProgressEntryResponseRelatedKeyDocumentProgressEntriesInner[];
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
          resolvedUsers={resolvedUsers}
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
  relatedKeyDocumentProgressEntries: ApiGetProgressEntryResponseRelatedKeyDocumentProgressEntriesInner[];
  resolvedUsers: Record<string, ApiUser>;
  onClose: () => void;
  onHistory: () => void;
}) {
  const { entry, resolvedUsers } = props;
  const isReadOnly = useIsReadOnly();
  const hasEditRights = useHasEditRights(entry);
  const editable = hasEditRights && !isReadOnly && !entry.locked;

  return editable ? (
    <EditableManualProgressEntryDetails {...props} />
  ) : (
    <ManualProgressEntryDetailsTemplate
      entry={entry}
      resolvedUsers={resolvedUsers}
      relatedKeyDocumentProgressEntries={
        props.relatedKeyDocumentProgressEntries
      }
      handleClose={props.onClose}
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
      onHistory={props.onHistory}
    />
  );
}

export interface ProgressEntryDetailsValues {
  text: string;
  documentDescription: string;
}

function EditableManualProgressEntryDetails({
  entry,
  resolvedUsers,
  relatedKeyDocumentProgressEntries,
  onClose,
  onHistory,
}: {
  entry: ApiManualProgressEntry;
  resolvedUsers: Record<string, ApiUser>;
  relatedKeyDocumentProgressEntries: ApiGetProgressEntryResponseRelatedKeyDocumentProgressEntriesInner[];
  onClose: () => void;
  onHistory: () => void;
}) {
  const { progressEntryApi, fileApi } = useProgressEntriesConfig();
  const patchProgressEntry = usePatchProgressEntry(progressEntryApi, fileApi);
  const fileDescription = extractFileDescriptionValue(entry);
  const INITIAL_EDIT_PROGRESS_ENTRY_VALUES: ProgressEntryDetailsValues = {
    text: entry.note ?? "",
    documentDescription: fileDescription ?? "",
  };

  async function handleSubmit(values: ProgressEntryDetailsValues) {
    await patchProgressEntry.mutateAsync(
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
    );
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
            resolvedUsers={resolvedUsers}
            relatedKeyDocumentProgressEntries={
              relatedKeyDocumentProgressEntries
            }
            handleClose={onClose}
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
            onHistory={onHistory}
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
  resolvedUsers: Record<string, ApiUser>;
  relatedKeyDocumentProgressEntries: ApiGetProgressEntryResponseRelatedKeyDocumentProgressEntriesInner[];
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
  resolvedUsers,
  relatedKeyDocumentProgressEntries,
  handleClose,
  elements,
  onHistory,
}: ManualProgressEntryDetailsTemplateProps) {
  const { keyDocumentTypes } = useProgressEntriesConfig();

  const isReadOnly = useIsReadOnly();
  const deletionProps = useDeletionProps();
  const DeleteProgressEntryModal = deletionProps.EntryModal;
  const { openEntryDeletionModal } = useContext(ProgressEntriesContext).action;

  const { keyDocumentVersion } = entry;
  const showNewerVersionHint =
    isDefined(keyDocumentVersion) &&
    isDefined(relatedKeyDocumentProgressEntries) &&
    relatedKeyDocumentProgressEntries.some(
      (relatedEntry) =>
        isDefined(relatedEntry.keyDocumentVersion) &&
        relatedEntry.keyDocumentVersion > keyDocumentVersion,
    );

  return (
    <>
      <DetailsContentWrapper
        entry={entry}
        title={`Details ${manualProgressEntryTypeNames[entry.manualProgressEntryType]}`}
        creatorName={formatUserName(resolvedUsers[entry.createdBy])}
        additionalFileElements={{
          start: (
            <>
              <LabelValueDisplay
                label="Dokumenttyp"
                value={keyDocumentTypes[entry.keyDocumentType ?? ""] ?? ""}
                endDecorator={
                  entry.keyDocumentVersion ? (
                    <Chip color="primary">{`Version ${entry.keyDocumentVersion}`}</Chip>
                  ) : undefined
                }
              />
              {showNewerVersionHint && <NewerVersionHint />}
              {isDefined(relatedKeyDocumentProgressEntries) &&
                relatedKeyDocumentProgressEntries.length > 0 && (
                  <AllKeyDocumentVersions
                    relatedEntries={relatedKeyDocumentProgressEntries}
                  />
                )}
            </>
          ),
          end: elements.fileDescription,
        }}
        endSlot={
          <ButtonBar
            right={
              <Button
                variant="plain"
                endDecorator={<ArrowForwardIcon />}
                onClick={onHistory}
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
                variant="plain"
                color="danger"
                disabled={entry.locked}
                onClick={() => {
                  openEntryDeletionModal(entry.progressEntryId);
                }}
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
