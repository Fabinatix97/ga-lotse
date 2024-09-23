/**
 * Copyright 2024 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

"use client";

import { ApiFacilityContactPerson } from "@eshg/employee-portal-api/base";
import { Grid } from "@mui/joy";
import { isNonNullish } from "remeda";

import { EmailSection } from "@/lib/businessModules/inspection/components/inspection/common/EmailSection";
import { PhoneNumberSection } from "@/lib/businessModules/inspection/components/inspection/common/PhoneNumberSection";
import { TileDivider } from "@/lib/businessModules/inspection/components/inspection/common/TileDivider";
import { DetailsCell } from "@/lib/shared/components/detailsSection/DetailsCell";
import { InfoTile } from "@/lib/shared/components/infoTile/InfoTile";
import { InfoTileAddButton } from "@/lib/shared/components/infoTile/InfoTileAddButton";
import {
  SALUTATION_VALUES,
  TITLE_VALUES,
} from "@/lib/shared/components/personSidebar/constants";

export interface ContactPersonTileProps {
  contactPerson?: ApiFacilityContactPerson;
  readonly?: boolean;
  setOpen: (initialState: boolean) => void;
  index?: number;
}

export function ContactPersonTile({
  contactPerson,
  readonly,
  setOpen,
  index,
}: Readonly<ContactPersonTileProps>) {
  function handleEdit() {
    setOpen(true);
  }

  function handleAddButton() {
    setOpen(true);
  }

  return (
    <InfoTile
      name={isNonNullish(index) ? `contactPerson-${index}` : "contactPerson"}
      title="Kontaktperson"
      onEdit={isNonNullish(contactPerson) && !readonly ? handleEdit : undefined}
    >
      <Grid container spacing={1}>
        {!isNonNullish(contactPerson) && (
          <InfoTileAddButton onClick={handleAddButton}>
            Hinzufügen
          </InfoTileAddButton>
        )}
        <Grid xs={6}>
          <Grid container direction="column" sx={{ gap: 2 }}>
            <Grid container direction="row" sx={{ gap: 3 }}>
              {contactPerson?.gender !== "NOT_SPECIFIED" && (
                <DetailsCell
                  name="salutation"
                  label="Anrede"
                  value={
                    isNonNullish(contactPerson?.salutation)
                      ? SALUTATION_VALUES[contactPerson.salutation]
                      : undefined
                  }
                />
              )}
              {contactPerson?.title !== "NOT_SPECIFIED" && (
                <DetailsCell
                  name="title"
                  label="Titel"
                  value={
                    isNonNullish(contactPerson?.title)
                      ? TITLE_VALUES[contactPerson.title]
                      : undefined
                  }
                />
              )}
            </Grid>
            <DetailsCell
              name="name"
              label="Vorname"
              value={contactPerson?.firstName}
            />
            <DetailsCell
              name="surname"
              label="Name"
              value={contactPerson?.lastName}
            />
          </Grid>
        </Grid>
        {(isNonNullish(contactPerson?.emailAddress) ||
          isNonNullish(contactPerson?.phoneNumber)) && <TileDivider />}
        <Grid xs={6}>
          {isNonNullish(contactPerson?.emailAddress) && (
            <EmailSection emailAddress={contactPerson?.emailAddress} />
          )}
          {isNonNullish(contactPerson?.phoneNumber) && (
            <PhoneNumberSection phoneNumber={contactPerson?.phoneNumber} />
          )}
        </Grid>
      </Grid>
    </InfoTile>
  );
}
