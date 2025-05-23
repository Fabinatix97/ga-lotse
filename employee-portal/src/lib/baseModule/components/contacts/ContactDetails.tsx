/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import ChatOutlinedIcon from "@mui/icons-material/ChatOutlined";
import { Divider, Stack, Typography } from "@mui/joy";
import { isDefined, isNonNullish } from "remeda";

import { ApiBaseFeature, ApiUserRole } from "@eshg/base-api";
import {
  BaseAddressDetailsColumn,
  CONTACT_CATEGORY_NAMES,
  Contact,
  ContentPanel,
  DetailsColumn,
  DetailsRow,
  EditButton,
  ResponsiveDivider,
  isInstitutionContact,
  isPersonContact,
  useHasUserRoleCheck,
} from "@eshg/lib-employee-portal";
import {
  GENDER_VALUES,
  InternalLinkButton,
  SALUTATION_VALUES,
  getOptionalTitle,
} from "@eshg/lib-portal";

import { useIsNewFeatureEnabled } from "@/lib/baseModule/api/queries/feature";
import { useUpdateContactSidebar } from "@/lib/baseModule/components/contacts/modals/UpdateContactSidebar";
import { ChatUserId } from "@/lib/businessModules/chat/components/ChatUserId";
import { routes } from "@/lib/businessModules/chat/shared/routes";
import { DetailsCell } from "@/lib/shared/components/detailsSection/DetailsCell";
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
    <ContentPanel dense={false} testId="contact-details-panel">
      {hasWritePerms && (
        <EditButton
          sx={{ maxWidth: "fit-content", flex: 0, alignSelf: "flex-end" }}
          onClick={() => updateSidebar.open({ contact })}
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
                    name="salutation"
                    label="Anrede"
                    value={
                      contact.salutation !== "NOT_SPECIFIED"
                        ? SALUTATION_VALUES[contact.salutation]
                        : undefined
                    }
                  />
                )}
                <DetailsCell
                  name="title"
                  label="Titel"
                  value={getOptionalTitle(contact.title)}
                />
              </DetailsRow>
              <DetailsCell
                name="firstName"
                label="Vorname"
                value={contact.firstName}
              />
              <DetailsCell name="name" label="Name" value={contact.name} />

              {isDefined(contact.gender) && (
                <DetailsCell
                  name="gender"
                  label="Geschlecht"
                  value={GENDER_VALUES[contact.gender]}
                />
              )}

              {showChatUsername && contact.externalChatUsername && (
                <>
                  <DetailsCell
                    name="externalChatUsername"
                    label="Chat-ID"
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
              <DetailsCell name="name" label="Name" value={contact.name} />
              <DetailsCell
                name="category"
                label="Objekttyp"
                value={
                  isNonNullish(contact.category)
                    ? CONTACT_CATEGORY_NAMES[contact.category]
                    : undefined
                }
              />
            </>
          )}
        </DetailsColumn>

        {isDefined(contact.contactAddress) && (
          <DetailsColumn>
            <BaseAddressDetailsColumn
              address={contact.contactAddress}
              sx={{ flex: 1 }}
            />
            {isDefined(contact.differentBillingAddress) && (
              <>
                <Divider />
                <Typography level="title-md">Rechnungsadresse</Typography>
                <BaseAddressDetailsColumn
                  address={contact.differentBillingAddress}
                />
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
                label="E-Mail-Adresse"
                value={emailAddress}
                href={emailHref}
              />
            ))}
            {contact.phoneNumbers?.map((phoneNumber, index) => (
              <ExternalLinkDetailsCell
                key={[phoneNumber, index].join("-")}
                name={`phoneNumbers.${index}`}
                label="Telefonnummer"
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
