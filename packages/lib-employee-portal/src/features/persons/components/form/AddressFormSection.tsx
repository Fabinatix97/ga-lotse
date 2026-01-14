/**
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

import { DeleteOutlined } from "@mui/icons-material";
import { Box, Grid, IconButton, Stack, Typography } from "@mui/joy";
import { useEffect, useRef, useState } from "react";
import { isNonNullish } from "remeda";

import { FormAddMoreButton, createFieldNameMapper } from "@eshg/lib-portal";

import { ContactAddressForm } from "../../../../components/address/addressForms";
import { createEmptyAddress } from "../../../../components/address/helpers";
import { PersonFormProps } from "../../types/personForm";

import { DefaultPersonFormValues } from "./DefaultPersonForm";

export function AddressFormSection<TValues extends DefaultPersonFormValues>(
  props: PersonFormProps<TValues>,
) {
  const fieldName = createFieldNameMapper<DefaultPersonFormValues>();
  const contactAddressFormRef = useRef<HTMLElement>(null);
  const addContactAddressRef = useRef<HTMLElement>(null);
  const [focusContactAddressForm, setFocusContactAddressForm] = useState(false);
  const [focusAddContactAddressForm, setFocusAddContactAddressForm] =
    useState(false);

  useEffect(() => {
    if (focusContactAddressForm && contactAddressFormRef.current) {
      contactAddressFormRef.current.focus();
      setFocusContactAddressForm(false);
    }
  }, [focusContactAddressForm]);

  useEffect(() => {
    if (focusAddContactAddressForm && addContactAddressRef.current) {
      addContactAddressRef.current.focus();
      setFocusAddContactAddressForm(false);
    }
  }, [focusAddContactAddressForm]);

  return isNonNullish(props.values.contactAddress) ? (
    <Box
      role="group"
      aria-labelledby="contact-address-section-title"
      sx={{ display: "contents" }}
    >
      <Stack direction="row" justifyContent="space-between" alignItems="center">
        <Typography
          level="title-md"
          sx={{ flex: 1 }}
          id="contact-address-section-title"
          component="h2"
        >
          Kontaktadresse
        </Typography>
        {props.addressRequired !== true && (
          <IconButton
            aria-label="Kontaktadresse entfernen"
            sx={{ alignSelf: "flex-end" }}
            color="danger"
            onClick={() => {
              void props.setFieldValue(
                fieldName("contactAddress"),
                undefined,
                false,
              );
              setFocusAddContactAddressForm(true);
            }}
          >
            <DeleteOutlined />
          </IconButton>
        )}
      </Stack>
      <Grid container spacing={2}>
        <ContactAddressForm
          ref={(el) => (contactAddressFormRef.current = el)}
          name={fieldName("contactAddress")}
          type={props.values.contactAddress.type}
          canChooseType={props.canChooseAddressType}
        />
      </Grid>
    </Box>
  ) : (
    <FormAddMoreButton
      ref={(el) => (addContactAddressRef.current = el)}
      onClick={() => {
        void props.setFieldValue(
          fieldName("contactAddress"),
          createEmptyAddress(),
          false,
        );
        setFocusContactAddressForm(true);
      }}
    >
      Kontaktadresse hinzufügen
    </FormAddMoreButton>
  );
}
