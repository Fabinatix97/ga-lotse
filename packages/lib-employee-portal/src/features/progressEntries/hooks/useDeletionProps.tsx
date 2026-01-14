/**
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

import { ComponentType } from "react";

import { EntryDeletionRequestModal } from "../components/modals/EntryDeletionRequestModal";
import { EntryDirectDeletionModal } from "../components/modals/EntryDirectDeletionModal";
import { FileDeletionRequestModal } from "../components/modals/FileDeletionRequestModal";
import { FileDirectDeletionModal } from "../components/modals/FileDirectDeletionModal";
import { useHasDeletionRights } from "../contexts/progressEntries";
import { EntryDeletionModalProps } from "../types/common";

interface DeletionProps {
  name: string;
  FileModal: ComponentType;
  EntryModal: ComponentType<EntryDeletionModalProps>;
}

const directDeletionProps: DeletionProps = {
  name: "Löschen",
  FileModal: FileDirectDeletionModal,
  EntryModal: EntryDirectDeletionModal,
};

const deletionRequestProps: DeletionProps = {
  name: "Löschung beantragen",
  FileModal: FileDeletionRequestModal,
  EntryModal: EntryDeletionRequestModal,
};

export function useDeletionProps(): DeletionProps {
  const hasDeletionRights = useHasDeletionRights();

  return hasDeletionRights ? directDeletionProps : deletionRequestProps;
}
