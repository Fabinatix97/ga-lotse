/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { ApiBaseFeature, ApiUserRole } from "@eshg/base-api";
import { useHasUserRoleCheck } from "@eshg/lib-employee-portal";
import {
  GENDER_VALUES,
  SALUTATION_VALUES,
  getOptionalTitle,
} from "@eshg/lib-portal/components/formFields/constants";
import { InternalLinkButton } from "@eshg/lib-portal/components/navigation/InternalLinkButton";
import ChatOutlinedIcon from "@mui/icons-material/ChatOutlined";
import { Divider, Stack, Typography } from "@mui/joy";
import { isDefined, isNonNullish } from "remeda";

import { useIsNewFeatureEnabled } from "@/lib/baseModule/api/queries/feature";
import { useUpdateContactSidebar } from "@/lib/baseModule/components/contacts/modals/UpdateContactSidebar";
import {
  Contact,
  isInstitutionContact,
  isPersonContact,
} from "@/lib/baseModule/components/contacts/types";
import { contactCategoryNames } from "@/lib/baseModule/shared/translations";
import { ChatUserId } from "@/lib/businessModules/chat/components/ChatUserId";
import { routes } from "@/lib/businessModules/chat/shared/routes";
import { ResponsiveDivider } from "@/lib/shared/components/ResponsiveDivider";
import { BaseAddressDetails } from "@/lib/shared/components/address/BaseAddressDetails";
import { EditButton } from "@/lib/shared/components/buttons/EditButton";
import { ContentPanel } from "@/lib/shared/components/contentPanel/ContentPanel";
import { DetailsCell } from "@/lib/shared/components/detailsSection/DetailsCell";
import { DetailsColumn } from "@/lib/shared/components/detailsSection/DetailsColumn";
import { DetailsRow } from "@/lib/shared/components/detailsSection/DetailsRow";
import {
  ExternalLinkDetailsCell,
  emailHref,
  phoneHref,
} from "@/lib/shared/components/detailsSection/ExternalLinkDetailsCell";

export function ContactDetails({ contact }: { contact: Contact }) {
  const showChatUsername = useIsNewFeatureEnabled(ApiBaseFeature.ChatUsername);
  const hasWritePerms = useHasUserRoleCheck(ApiUserRole.BaseContactsWrite);
  const updateSidebar = useUpdateContactSidebar();

  const showEmailPhoneSection =
    (contact.emailAddresses?.length ?? 0) +
      (contact.phoneNumbers?.length ?? 0) >
    0;

  return (
    <ContentPanel dense={false} testId={"contact-details-panel"}>
      {hasWritePerms && (
        <EditButton
          onClick={() => updateSidebar.open({ contact })}
          sx={{ maxWidth: "fit-content", flex: 0, alignSelf: "flex-end" }}
        />
      )}
      <Stack
        gap={3}
        direction={{
          xxs: "column",
          md: "row",
        }}
        divider={<ResponsiveDivider />}
      >
        <DetailsColumn>
          {isPersonContact(contact) && (
            <>
              <DetailsRow>
                {isDefined(contact.salutation) && (
                  <DetailsCell
                    name={"salutation"}
                    label={"Anrede"}
                    value={
                      contact.salutation !== "NOT_SPECIFIED"
                        ? SALUTATION_VALUES[contact.salutation]
                        : undefined
                    }
                  />
                )}
                <DetailsCell
                  name={"title"}
                  label={"Titel"}
                  value={getOptionalTitle(contact.title)}
                />
              </DetailsRow>
              <DetailsCell
                name={"firstName"}
                label={"Vorname"}
                value={contact.firstName}
              />
              <DetailsCell name={"name"} label={"Name"} value={contact.name} />

              {isDefined(contact.gender) && (
                <DetailsCell
                  name={"gender"}
                  label={"Geschlecht"}
                  value={GENDER_VALUES[contact.gender]}
                />
              )}

              {showChatUsername && contact.externalChatUsername && (
                <>
                  <DetailsCell
                    name={"externalChatUsername"}
                    label={"Chat-ID"}
                    valueIsDiv
                    value={
                      <ChatUserId
                        userId={contact.externalChatUsername}
                        noLabel
                        isParagraph
                      />
                    }
                  />
                  <InternalLinkButton
                    href={routes.userRoom(contact.externalChatUsername)}
                    startDecorator={<ChatOutlinedIcon />}
                    variant="outlined"
                    sx={{
                      alignSelf: "flex-start",
                      maxWidth: "100%",
                      mt: 1,
                    }}
                  >
                    Direktnachricht
                  </InternalLinkButton>
                </>
              )}
            </>
          )}
          {isInstitutionContact(contact) && (
            <>
              <DetailsCell name={"name"} label={"Name"} value={contact.name} />
              <DetailsCell
                name={"category"}
                label={"Objekttyp"}
                value={
                  isNonNullish(contact.category)
                    ? contactCategoryNames[contact.category]
                    : undefined
                }
              />
            </>
          )}
        </DetailsColumn>

        {isDefined(contact.contactAddress) && (
          <DetailsColumn>
            <BaseAddressDetails
              address={contact.contactAddress}
              sx={{ flex: 1 }}
            />
            {isDefined(contact.differentBillingAddress) && (
              <>
                <Divider />
                <Typography level={"title-md"}>Rechnungsadresse</Typography>
                <BaseAddressDetails address={contact.differentBillingAddress} />
              </>
            )}
          </DetailsColumn>
        )}

        {showEmailPhoneSection && (
          <DetailsColumn>
            {contact.emailAddresses?.map((emailAddress, index) => (
              <ExternalLinkDetailsCell
                key={[emailAddress, index].join("-")}
                name={`emailAddresses.${index}`}
                label={"E-Mail-Adresse"}
                value={emailAddress}
                href={emailHref}
              />
            ))}
            {contact.phoneNumbers?.map((phoneNumber, index) => (
              <ExternalLinkDetailsCell
                key={[phoneNumber, index].join("-")}
                name={`phoneNumbers.${index}`}
                label={"Telefonnummer"}
                value={phoneNumber}
                href={phoneHref}
              />
            ))}
          </DetailsColumn>
        )}
      </Stack>
    </ContentPanel>
  );
}
