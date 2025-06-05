/**
 * Copyright 2025 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

"use client";

import { Typography } from "@mui/joy";
import { useState } from "react";
import { isNonNullish, isNullish } from "remeda";

import { ApiInspectionAnnouncement } from "@eshg/inspection-api";
import { DetailsItem } from "@eshg/lib-employee-portal";
import { formatDate } from "@eshg/lib-portal";

import { AnnouncementSidebar } from "@/lib/businessModules/inspection/components/inspection/planning/announcement/AnnouncementSidebar";
import { translateInspectionAnnouncement } from "@/lib/businessModules/inspection/shared/enums";
import { InfoTile } from "@/lib/shared/components/infoTile/InfoTile";
import { InfoTileAddButton } from "@/lib/shared/components/infoTile/InfoTileAddButton";

interface AnnouncementTileProps {
  readonly?: boolean;
  procedureId: string;
  announcement?: ApiInspectionAnnouncement;
}

export function AnnouncementTile({
  readonly,
  procedureId,
  announcement,
}: Readonly<AnnouncementTileProps>) {
  const [open, setOpen] = useState(false);
  const date = isNonNullish(announcement?.date)
    ? formatDate(announcement.date)
    : undefined;
  const showEdit = isNonNullish(announcement) && !readonly;
  const showAddButton = isNullish(announcement) && !readonly;

  function handleAddButtonClick() {
    setOpen(true);
  }

  const handleEdit = showEdit
    ? () => {
        setOpen(true);
      }
    : undefined;

  function handleClose() {
    setOpen(false);
  }

  return (
    <InfoTile
      name="announcement"
      title="Ankündigungen"
      footer={
        <>
          {showAddButton && (
            <InfoTileAddButton onClick={handleAddButtonClick}>
              Ankündigung eintragen
            </InfoTileAddButton>
          )}
          <AnnouncementSidebar
            open={open}
            procedureId={procedureId}
            announcement={announcement}
            onClose={handleClose}
          />
        </>
      }
      onEdit={handleEdit}
    >
      <DetailsItem label="Datum" value={date} />
      <DetailsItem
        label="Kommunikationsmittel"
        value={
          isNonNullish(announcement?.type)
            ? translateInspectionAnnouncement(announcement.type)
            : undefined
        }
      />
      {readonly && isNullish(date) && isNullish(announcement?.type) && (
        <Typography
          data-testid="empty"
          component="i"
          color="neutral"
          level="title-md"
        >
          Keine
        </Typography>
      )}
    </InfoTile>
  );
}
