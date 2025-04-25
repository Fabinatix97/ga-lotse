/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import {
  MainContentLayout,
  StickyToolbarLayout,
  Toolbar,
} from "@eshg/lib-employee-portal";
import { InternalLink } from "@eshg/lib-portal/components/navigation/InternalLink";

export default function PlaygroundIndexPage() {
  return (
    <StickyToolbarLayout toolbar={<Toolbar title="Playground" />}>
      <MainContentLayout>
        <ul>
          <li>
            <InternalLink href={"/playground/error"}>Test Error</InternalLink>
          </li>
          <li>
            <InternalLink href={"/playground/loading"}>
              Loading indicator
            </InternalLink>
          </li>
          <li>
            <InternalLink href={"/playground/layout/regular"}>
              Regular layout with title
            </InternalLink>
          </li>
          <li>
            <InternalLink href={"/playground/layout/toolbar"}>
              Layout with sticky toolbar
            </InternalLink>
          </li>
          <li>
            <InternalLink href="/playground/personSidebar">
              Person Sidebar
            </InternalLink>
          </li>
          <li>
            <InternalLink href="/playground/facilitySidebar">
              Facility Sidebar
            </InternalLink>
          </li>
          <li>
            <InternalLink href="/playground/centralFile">
              Central File Flows
            </InternalLink>
          </li>
          <li>
            <InternalLink href={"/playground/addressForm"}>
              Address Form Sidebars
            </InternalLink>
          </li>
          <li>
            <InternalLink href={"/playground/formPlus"}>FormPlus</InternalLink>
          </li>
          <li>
            <InternalLink href={"/playground/searchable-groups"}>
              SearchableGroups
            </InternalLink>
          </li>
          <li>
            <InternalLink href={"/playground/filter-settings"}>
              FilterSettings
            </InternalLink>
          </li>
          <li>
            <InternalLink href={"/playground/filter-settings/unmanaged"}>
              FilterSettings (unmanaged)
            </InternalLink>
          </li>
          <li>
            <InternalLink href="/playground/boundaries">
              Boundaries
            </InternalLink>
          </li>
          <li>
            <InternalLink href="/playground/charts">Charts</InternalLink>
          </li>
          <li>
            <InternalLink href="/playground/designShowcase">
              Design Showcase
            </InternalLink>
          </li>
          <li>
            <InternalLink href="/playground/image-compressor">
              Image Compression
            </InternalLink>
          </li>
          <li>
            <InternalLink href="/playground/offline-password">
              Offline Password Dialogs
            </InternalLink>
          </li>
          <li>
            <InternalLink href="/playground/snackbar">Snackbar</InternalLink>
          </li>
          <li>
            <InternalLink href="/playground/chat">Chat</InternalLink>
          </li>
          <li>
            <InternalLink href="/playground/sidebar">Sidebar</InternalLink>
          </li>
          <li>
            <InternalLink href="/playground/sideNavigation">
              SideNavigation
            </InternalLink>
          </li>
          <li>
            <InternalLink href="/playground/alert">Alert</InternalLink>
          </li>
          <li>
            <InternalLink href="/playground/appointment-picker">
              Appointment Picker Field
            </InternalLink>
          </li>
          <li>
            <InternalLink href="/playground/teeth">Zahn-Icons</InternalLink>
          </li>
          <li>
            <InternalLink href="/playground/configurator">
              Konfigurator
            </InternalLink>
          </li>
        </ul>
      </MainContentLayout>
    </StickyToolbarLayout>
  );
}
