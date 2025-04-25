/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { Divider, Stack } from "@mui/joy";

import {
  ChipWithTooltip,
  DetailsItem,
  DetailsSection,
} from "@eshg/lib-employee-portal";

import { FluoridationConsentInformationSection } from "@/components/fluoridationConsent/FluoridationConsentInformationSection";
import { ChildDetails } from "@/features/children/api/models/ChildDetails";

import { useUpdateAnnualChildSidebar } from "./UpdateAnnualChildSidebar";

interface AdditionalInformationDetailsSectionProps {
  child: ChildDetails;
}

export function AdditionalInformationDetailsSection(
  props: AdditionalInformationDetailsSectionProps,
) {
  const { child } = props;

  const updateAnnualChildSidebar = useUpdateAnnualChildSidebar();

  return (
    <DetailsSection
      title="Zusatzinfos"
      onEdit={() => updateAnnualChildSidebar.open({ child })}
      canEdit={!child.isClosed}
    >
      <Stack gap={1}>
        <DetailsItem label="Einrichtung" value={child.institution.name} />
        <DetailsItem label="Gruppe" value={child.groupName} />
        {child.procedureLabels.length > 0 && (
          <DetailsItem
            label="Kennungen"
            value={
              <Stack direction="row" gap={1} flexWrap="wrap">
                {child.procedureLabels.map((label) => (
                  <ChipWithTooltip
                    key={label.id}
                    name={label.name}
                    hexColor={label.hexColor}
                    modalTitle="Kennung"
                  />
                ))}
              </Stack>
            }
          />
        )}
        <Divider orientation="horizontal" />
        <FluoridationConsentInformationSection
          allFluoridationConsents={child.allFluoridationConsents}
        />
      </Stack>
    </DetailsSection>
  );
}
