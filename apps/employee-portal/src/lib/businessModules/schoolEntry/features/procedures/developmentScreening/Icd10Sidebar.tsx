/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

"use client";

import { Close, SearchOutlined } from "@mui/icons-material";
import {
  Box,
  Button,
  Checkbox,
  FormControl,
  FormLabel,
  IconButton,
  Input,
  Stack,
  Table,
  styled,
} from "@mui/joy";
import { SxProps } from "@mui/joy/styles/types";
import { visuallyHidden } from "@mui/utils";
import { ChangeEvent, TdHTMLAttributes, useRef, useState } from "react";
import { useDebounce } from "use-debounce";

import { ApiIcd10Code } from "@eshg/base-api";
import {
  ButtonBar,
  DrawerProps,
  SidebarActions,
  SidebarContent,
  UseSidebarResult,
  useConfirmationDialog,
  useSidebar,
} from "@eshg/lib-employee-portal";
import { LiveAnnouncer } from "@eshg/lib-portal";
import { ApiIcd10CodeWithOriginalCode } from "@eshg/school-entry-api";

import { useSearchIcd10Codes } from "@/lib/baseModule/api/queries/icd10Codes";

export function useIcd10Sidebar(): UseSidebarResult<
  Omit<Icd10SidebarProps, "onChangeSelectedCodes">
> {
  const isDirty = useRef(false);
  const { openCancelDialog } = useConfirmationDialog();

  return useSidebar({
    component: (props) => (
      <Icd10Sidebar
        {...props}
        onChangeSelectedCodes={() => {
          isDirty.current = true;
        }}
        onSubmit={(selectedCodes) => {
          isDirty.current = false;
          props.onSubmit(selectedCodes);
        }}
      />
    ),
    onBeforeClose: (confirmClose) => {
      if (isDirty.current) {
        openCancelDialog({
          onConfirm: () => confirmClose(true),
          onCancel: () => confirmClose(false),
        });
      } else {
        confirmClose(true);
      }
    },
    onClose: () => {
      isDirty.current = false;
    },
  });
}

interface Icd10SidebarProps extends DrawerProps {
  onChangeSelectedCodes: () => void;
  onSubmit: (selectedCodes: ApiIcd10CodeWithOriginalCode[]) => void;
  initiallySelectedCodes: ApiIcd10CodeWithOriginalCode[];
}

const StyledTable = styled(Table)({
  td: {
    verticalAlign: "top",
  },
  tr: {
    cursor: "pointer",
  },
});

function StyledTd({
  children,
  ...props
}: Omit<TdHTMLAttributes<HTMLTableDataCellElement>, "style"> & {
  sx?: SxProps;
}) {
  return (
    <Box component="td" {...props}>
      {children}
    </Box>
  );
}

function Icd10Sidebar(props: Icd10SidebarProps) {
  const [selectedCodes, setSelectedCodes] = useState<
    ApiIcd10CodeWithOriginalCode[]
  >(props.initiallySelectedCodes);
  const selectionResult = useSearchIcd10Codes({
    codes: selectedCodes.map(({ code }) => code),
  });
  const [searchString, setSearchString] = useState<string>("");
  const [debouncedSearchString] = useDebounce(searchString, 250, {
    trailing: true,
  });
  const searchResult = useSearchIcd10Codes({
    searchString: debouncedSearchString,
  });

  const isSearchMode = debouncedSearchString.length >= 1;
  const displayedCodes =
    isSearchMode && searchResult.isSuccess
      ? searchResult.data.codes
      : selectionResult.isSuccess
        ? selectionResult.data.codes
        : [];

  function isSelected(otherCode: ApiIcd10Code): boolean {
    return selectedCodes.some(({ code }) => code === otherCode.code);
  }

  function addToSelection(addCode: ApiIcd10Code) {
    setSelectedCodes([...selectedCodes, addCode]);
    props.onChangeSelectedCodes();
  }

  function removeFromSelection(removeCode: ApiIcd10Code) {
    setSelectedCodes(
      selectedCodes.filter(({ code }) => code !== removeCode.code),
    );
    props.onChangeSelectedCodes();
  }

  function handleChangeSearchInput(event: ChangeEvent<HTMLInputElement>) {
    setSearchString(event.target.value);
  }

  function handleClearSearchInput() {
    setSearchString("");
  }

  function handleSubmit() {
    props.onSubmit(selectedCodes);
    props.onClose();
  }

  return (
    <>
      <LiveAnnouncer
        message="Keine ICD-10 Codes gefunden"
        active={displayedCodes.length === 0}
      />
      <LiveAnnouncer
        message={`${displayedCodes.length} ICD-10 Codes gefunden`}
        active={displayedCodes.length > 0}
      />
      <SidebarContent title="ICD-10 Katalog">
        <Stack gap={3}>
          <FormControl size="md" role="search" aria-label="ICD-10 Katalog">
            <FormLabel>Suche</FormLabel>
            <Input
              value={searchString}
              startDecorator={<SearchOutlined />}
              endDecorator={
                searchString.length > 0 && (
                  <IconButton
                    aria-label="Suche zurücksetzen"
                    onClick={handleClearSearchInput}
                  >
                    <Close />
                  </IconButton>
                )
              }
              onChange={handleChangeSearchInput}
            />
          </FormControl>
          <StyledTable>
            <Box component="thead" sx={visuallyHidden}>
              <tr>
                <th>An- und Abwählen</th>
                <th>ICD-10 Code</th>
                <th>Beschreibung</th>
              </tr>
            </Box>
            <tbody>
              {displayedCodes.map((currentRowCode) => (
                <tr
                  key={currentRowCode.code}
                  onClick={() => {
                    if (isSelected(currentRowCode)) {
                      removeFromSelection(currentRowCode);
                    } else {
                      addToSelection(currentRowCode);
                    }
                  }}
                >
                  <StyledTd sx={{ width: "40px", paddingLeft: 0 }}>
                    <Checkbox
                      checked={isSelected(currentRowCode)}
                      size="sm"
                      variant="outlined"
                      slotProps={{
                        input: {
                          "aria-label": currentRowCode.originalCode,
                          "aria-describedby": `${currentRowCode.code}-title`,
                        },
                      }}
                    />
                  </StyledTd>
                  <StyledTd
                    id={`${currentRowCode.code}-code`}
                    sx={{
                      width: "72px",
                      fontWeight: currentRowCode.isGroup ? "500" : "normal",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {currentRowCode.originalCode}
                  </StyledTd>
                  <StyledTd
                    id={`${currentRowCode.code}-title`}
                    sx={{
                      paddingRight: 0,
                      fontWeight: currentRowCode.isGroup ? "500" : "normal",
                    }}
                  >
                    {currentRowCode.title}
                  </StyledTd>
                </tr>
              ))}
            </tbody>
          </StyledTable>
        </Stack>
      </SidebarContent>
      <SidebarActions>
        <ButtonBar
          right={[
            <Button
              key="cancel"
              color="neutral"
              variant="soft"
              onClick={() => props.onClose()}
            >
              Abbrechen
            </Button>,
            <Button key="submit" color="primary" onClick={handleSubmit}>
              Übernehmen
            </Button>,
          ]}
        />
      </SidebarActions>
    </>
  );
}
