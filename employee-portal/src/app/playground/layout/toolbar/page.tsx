/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

"use client";

import { Sheet, Slider, Switch, Typography } from "@mui/joy";
import { useState } from "react";

import {
  BottomToolbar,
  MainContentLayout,
  StickyToolbarLayout,
  Toolbar,
} from "@eshg/lib-employee-portal";

export default function PlaygroundStickyToolbarLayoutPage() {
  const [fullViewportHeight, setFullViewportHeight] = useState(true);
  const [itemCount, setItemCount] = useState(15);

  const data = Array.from({ length: itemCount }, (_, i) => ({
    name: `test ${i}`,
  }));

  // Controls only for the demo. These will never be part of a real page.
  const controls = (
    <Sheet>
      <Typography
        component="label"
        endDecorator={
          <Switch
            checked={fullViewportHeight}
            onChange={(event) => setFullViewportHeight(event.target.checked)}
          />
        }
      >
        fullViewportHeight
      </Typography>
      <Slider
        value={itemCount}
        step={5}
        marks
        min={0}
        max={100}
        valueLabelDisplay="auto"
        onChange={(_event, value) => setItemCount(value as number)}
      />
    </Sheet>
  );

  return (
    <StickyToolbarLayout
      toolbar={<Toolbar title="Playground - Layout with sticky toolbar" />}
      bottomToolbar={<BottomToolbar>An optional bottom toolbar</BottomToolbar>}
    >
      <MainContentLayout fullViewportHeight={fullViewportHeight} gap={2}>
        {controls}
        <Sheet
          sx={{
            // Let this component take all the available height.
            flex: 1,
            // Make this Sheet a scroll container.
            overflowY: "auto",
          }}
        >
          <ul>
            {data.map(({ name }) => (
              <li key={name}>{name}</li>
            ))}
          </ul>
        </Sheet>
      </MainContentLayout>
    </StickyToolbarLayout>
  );
}
