/**
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import {
  Delete,
  FullscreenOutlined,
  ModeEditOutlineOutlined,
  VisibilityOutlined,
} from "@mui/icons-material";
import { Chip } from "@mui/joy";
import { ColumnHelper, createColumnHelper } from "@tanstack/react-table";

import { ActionsMenu, useConfirmationDialog } from "@eshg/lib-employee-portal";
import { formatDate } from "@eshg/lib-portal";
import {
  ApiOmsAssessment,
  ApiOmsAssessmentStatus,
} from "@eshg/official-medical-service-api";

import {
  formatAssessmentResult,
  formatUser,
  useIsAssessmentEditable,
} from "@/lib/businessModules/officialMedicalService/components/procedures/details/assessments/helpers";
import { statusColorsAssessmentStatus } from "@/lib/businessModules/officialMedicalService/shared/constants";
import {
  NAMES_ASSESSMENT_STATUS,
  NAMES_ASSESSMENT_TYPE,
} from "@/lib/businessModules/officialMedicalService/shared/translations";

const columnHelper: ColumnHelper<ApiOmsAssessment> =
  createColumnHelper<ApiOmsAssessment>();

interface ColumnsProps {
  onDisplaySummary: (assessment: ApiOmsAssessment) => void;
  onEdit: (assessment: ApiOmsAssessment) => void;
  onDelete: (assessment: ApiOmsAssessment) => Promise<void>;
}

export function Columns({
  onDisplaySummary,
  onEdit,
  onDelete,
}: Readonly<ColumnsProps>) {
  const { openConfirmationDialog } = useConfirmationDialog();

  const isAssessmentEditable = useIsAssessmentEditable();

  return [
    columnHelper.accessor("title", {
      header: "Bezeichnung",
      cell: (props) => props.getValue(),
      meta: { canNavigate: { parentRow: true } },
    }),
    columnHelper.accessor("assessmentType", {
      header: "Dokumentenart",
      cell: (props) => NAMES_ASSESSMENT_TYPE[props.getValue()],
      meta: { canNavigate: { parentRow: true } },
    }),
    columnHelper.accessor("editor", {
      header: "Bearbeiter",
      cell: (props) => formatUser(props.getValue()),
      meta: { canNavigate: { parentRow: true } },
    }),
    columnHelper.accessor("created", {
      header: "Erstelldatum",
      cell: (props) => formatDate(props.getValue()),
      meta: { canNavigate: { parentRow: true } },
    }),
    columnHelper.accessor("assessmentResult", {
      header: "Ergebnis",
      cell: (props) => formatAssessmentResult(props.getValue()),
      meta: { canNavigate: { parentRow: true } },
    }),
    columnHelper.accessor("finished", {
      header: "Fertigstelldatum",
      cell: (props) => formatDate(props.getValue()),
      meta: { canNavigate: { parentRow: true } },
    }),
    columnHelper.accessor("assessmentStatus", {
      header: "Status",
      cell: (props) => {
        const status: ApiOmsAssessmentStatus = props.getValue();
        return (
          <Chip color={statusColorsAssessmentStatus[status]} size="md">
            {NAMES_ASSESSMENT_STATUS[status]}
          </Chip>
        );
      },
      meta: { canNavigate: { parentRow: true } },
    }),
    columnHelper.display({
      header: "Aktion",
      cell: (props) => (
        <ActionsMenu
          actionItems={[
            ...(props.row.original.assessmentStatus !==
            ApiOmsAssessmentStatus.Open
              ? [
                  {
                    label: "Zusammenfassung anzeigen",
                    onClick: () => onDisplaySummary(props.row.original),
                    startDecorator: <FullscreenOutlined />,
                  },
                ]
              : []),
            ...(props.row.original.assessmentStatus !==
            ApiOmsAssessmentStatus.Open
              ? [
                  {
                    label: "Schriftgut ansehen",
                    onClick: () => onEdit(props.row.original),
                    startDecorator: <VisibilityOutlined />,
                  },
                ]
              : []),
            ...(isAssessmentEditable(props.row.original)
              ? [
                  {
                    label: "Zusammenfassung",
                    onClick: () => onDisplaySummary(props.row.original),
                    startDecorator: <FullscreenOutlined />,
                  },
                  {
                    label: "Schriftgut bearbeiten",
                    onClick: () => onEdit(props.row.original),
                    startDecorator: <ModeEditOutlineOutlined />,
                  },
                  {
                    label: "Löschen",
                    onClick: () => {
                      openConfirmationDialog({
                        title: "Schriftgut löschen?",
                        description:
                          "Möchten Sie das Schriftgut wirklich löschen? Die Aktion lässt sich nicht widerrufen.",
                        confirmLabel: "Löschen",
                        onConfirm: async () => {
                          await onDelete(props.row.original);
                        },
                        color: "danger",
                      });
                    },
                    startDecorator: <Delete color="danger" />,
                  },
                ]
              : []),
            // {
            //   label: "Entwurf Leseberechtigte anzeigen",
            //   onClick: () => onDisplayDraftReaders(props.row.original),
            //   startDecorator: <PersonOutlined />,
            // },
          ]}
        />
      ),
      meta: {
        width: 96,
      },
    }),
  ];
}
