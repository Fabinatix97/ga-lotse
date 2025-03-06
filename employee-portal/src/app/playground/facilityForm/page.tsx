/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

"use client";

import { ApiGetReferenceFacilityResponse } from "@eshg/base-api";
import {
  MainContentLayout,
  StickyToolbarLayout,
  Toolbar,
} from "@eshg/lib-employee-portal";
import { Button, Stack, Typography } from "@mui/joy";
import { useState } from "react";

import {
  LegacyFacilitySidebar,
  Mode,
} from "@/lib/shared/components/facilitySidebar/LegacyFacilitySidebar";
import { BaseFacility } from "@/lib/shared/components/facilitySidebar/types";

enum Sidebar {
  none,
  search,
  edit,
}

export default function PlaygroundFacilityFormPage() {
  const [open, setOpen] = useState<Sidebar>(Sidebar.none);
  const [editedData, setEditedData] = useState<BaseFacility | null>(null);
  const [saveResponse, setSaveResponse] = useState<unknown>(null);
  const [selectedFacility, setSelectedFacility] =
    useState<ApiGetReferenceFacilityResponse | null>(null);

  function handleClose() {
    setOpen(Sidebar.none);
  }

  return (
    <StickyToolbarLayout
      toolbar={<Toolbar title="Playground - Legacy-Facility Sidebar & Form" />}
    >
      <MainContentLayout>
        <Stack alignItems="flex-start" gap={3}>
          <Button onClick={() => setOpen(Sidebar.search)}>
            Search-Sidebar öffnen
          </Button>
          <Button onClick={() => setOpen(Sidebar.edit)}>
            Edit-Sidebar öffnen
          </Button>

          <LegacyFacilitySidebar
            open={open === Sidebar.search}
            onClose={handleClose}
            onSaveSuccess={(data, response) => {
              setEditedData(data);
              setSaveResponse(response);
            }}
            onSelectFacility={(facility) => setSelectedFacility(facility)}
          />

          <LegacyFacilitySidebar
            mode={Mode.edit}
            facility={testFacility}
            open={open === Sidebar.edit}
            onClose={handleClose}
            onSaveSuccess={(data, response) => {
              setEditedData(data);
              setSaveResponse(response);
            }}
          />

          <DisplayData title="Selected Facility" data={selectedFacility} />
          <DisplayData title="Response" data={saveResponse} />
          <DisplayData title="Edited Data" data={editedData} />
        </Stack>
      </MainContentLayout>
    </StickyToolbarLayout>
  );
}

function DisplayData({ data, title }: { data?: unknown; title: string }) {
  if (!data) return undefined;
  return (
    <>
      <Typography level="h3">{title}</Typography>
      <Typography sx={{ fontFamily: "monospace", wordBreak: "break-all" }}>
        {JSON.stringify(data)}
      </Typography>
    </>
  );
}

const testFacility: BaseFacility = {
  name: "Test Firma",
  phoneNumbers: ["0123-45678901"],
  emailAddresses: ["foo@bar.com"],
  contactAddress: {
    type: "DomesticAddress",
    street: "Teststraße",
    houseNumber: "4711",
    addressAddition: "2. Stock links",
    postalCode: "12345",
    city: "Teststadt",
    country: "DE",
    differentName: "",
    postbox: "",
  },
  contactPersons: [],
};
