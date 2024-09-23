/**
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

import { ComponentType } from "react";

import { useHasDeletionRights } from "@/lib/shared/components/procedures/progress-entries/ProgressEntriesContext";
import { EntryDeletionRequestModal } from "@/lib/shared/components/procedures/progress-entries/modals/EntryDeletionRequestModal";
import { EntryDirectDeletionModal } from "@/lib/shared/components/procedures/progress-entries/modals/EntryDirectDeletionModal";
import { FileDeletionRequestModal } from "@/lib/shared/components/procedures/progress-entries/modals/FileDeletionRequestModal";
import { FileDirectDeletionModal } from "@/lib/shared/components/procedures/progress-entries/modals/FileDirectDeletionModal";
import { EntryDeletionModalProps } from "@/lib/shared/components/procedures/progress-entries/types";

export interface DeletionProps {
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
