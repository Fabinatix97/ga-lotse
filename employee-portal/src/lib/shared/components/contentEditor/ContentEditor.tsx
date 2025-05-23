/**
 * Copyright 2025 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

"use client";

import { Box } from "@mui/joy";
import { useEffect, useRef, useState } from "react";

import {
  ApiEditor,
  ApiEditorBodyElementsInner,
  ApiUpdateEditorRequest,
  EditorApiInterface,
} from "@eshg/lib-editor-api";
import { useSnackbar } from "@eshg/lib-portal";

import {
  useDeleteEditorElement,
  useInsertEditorElement,
  useUpdateEditorElement,
} from "@/lib/shared/api/mutations/libEditor";
import { ContentDisplay } from "@/lib/shared/components/contentEditor/ContentDisplay";
import { ContentElementPalette } from "@/lib/shared/components/contentEditor/ContentElementPalette";
import { ContentElementPropertySheet } from "@/lib/shared/components/contentEditor/ContentElementPropertySheet";
import { PaletteItem } from "@/lib/shared/components/contentEditor/types";

interface ContentEditorProps {
  editorData: ApiEditor;
  palette: PaletteItem[];
  editorApi: EditorApiInterface;

  /**
   * Called when a palette item should be added to the editor. This callback
   * must return the editor API element to insert into the editor.
   *
   * @param item the chosen palette item to insert
   * @return the real editor API element to insert
   */
  onAddItem: (item: PaletteItem) => ApiEditorBodyElementsInner;

  imagesBasePath?: string;
}

export function ContentEditor({
  editorData,
  palette,
  editorApi,
  onAddItem,
  imagesBasePath,
}: Readonly<ContentEditorProps>) {
  const snackbar = useSnackbar();
  const [elements, setElements] = useState(editorData.editorBody.elements);
  const [selectedElement, setSelectedElement] =
    useState<ApiEditorBodyElementsInner | null>(null);
  const [scrollToElement, setScrollToElement] =
    useState<ApiEditorBodyElementsInner | null>(null);

  const contentDisplay = useRef<HTMLDivElement>(null);

  const { mutateAsync: insertEditorElement } =
    useInsertEditorElement(editorApi);
  const { mutateAsync: updateEditorElement } =
    useUpdateEditorElement(editorApi);
  const { mutateAsync: deleteEditorElement } =
    useDeleteEditorElement(editorApi);

  /** add a palette item to the editor */
  async function handleAddPaletteItem(item: PaletteItem) {
    const pos = selectedElement ? elements.indexOf(selectedElement) : -1;
    const insertAfter = pos >= 0 ? pos : elements.length - 1;
    // convert palette item to element
    const editorElement = onAddItem(item);
    // update on server first
    const newElement = await addElementOnServer(editorElement, insertAfter);
    if (newElement === null) return; // error happened; handled outside
    const updatedElements = addElementLocally(newElement, insertAfter);
    updateElementsAndSelectedElement(updatedElements, newElement);
  }

  async function addElementOnServer(
    editorElement: ApiEditorBodyElementsInner,
    insertAfter?: number,
  ): Promise<ApiEditorBodyElementsInner | null> {
    const response = await insertEditorElement({
      editorId: editorData.id,
      apiInsertEditorRequest: {
        editorElement,
        insertAfter,
      },
    });
    return response.element;
  }

  function addElementLocally(
    newElement: ApiEditorBodyElementsInner,
    after: number,
  ) {
    return [
      ...elements.slice(0, after + 1),
      newElement,
      ...elements.slice(after + 1),
    ];
  }

  /** move selected element up */
  async function handleMoveUp() {
    if (selectedElement === null) return;
    const pos = elements.indexOf(selectedElement);
    if (pos <= 0) return;
    // update on server first
    const updatedElement = await updateElementOnServer({ moveOperation: "UP" });
    if (updatedElement === null) return; // error happened; handled outside
    // swap positions of the selected element and the preceding element
    const updatedElements = [...elements];
    updatedElements[pos] = updatedElements[pos - 1]!;
    updatedElements[pos - 1] = updatedElement;
    updateElementsAndSelectedElement(updatedElements, updatedElement);
  }

  /** move selected element down */
  async function handleMoveDown() {
    if (selectedElement === null) return;
    const pos = elements.indexOf(selectedElement);
    if (pos < 0 || pos >= elements.length - 1) return;
    // update on server first
    const updatedElement = await updateElementOnServer({
      moveOperation: "DOWN",
    });
    if (updatedElement === null) return; // error happened; handled outside
    // swap positions of the selected element and the following element
    const updatedElements = [...elements];
    updatedElements[pos] = updatedElements[pos + 1]!;
    updatedElements[pos + 1] = updatedElement;
    updateElementsAndSelectedElement(updatedElements, updatedElement);
  }

  /** delete selected element */
  async function handleDelete() {
    if (selectedElement === null) return;
    if (elements.length === 1) {
      snackbar.notification("Das letzte Element kann nicht entfernt werden");
      return;
    }
    // delete on server
    await deleteEditorElement({
      editorId: editorData.id,
      elementId: selectedElement.id,
    });
    // update local elements
    const updatedElements = elements.filter(
      (el) => el.id !== selectedElement.id,
    );
    updateElementsAndSelectedElement(updatedElements, null);
  }

  /** update element properties */
  async function handleUpdate(request: ApiUpdateEditorRequest) {
    if (selectedElement === null) return false;
    const updatedElement = await updateElementOnServer(request);
    if (updatedElement === null) return false; // error happened; handled outside
    const updatedElements = elements.map((el) =>
      el.id === updatedElement.id ? updatedElement : el,
    );
    updateElementsAndSelectedElement(updatedElements, updatedElement);
    return true;
  }

  async function updateElementOnServer(request: ApiUpdateEditorRequest) {
    if (selectedElement === null) return null;
    const response = await updateEditorElement({
      editorId: editorData.id,
      elementId: selectedElement.id,
      apiUpdateEditorRequest: request,
    });
    return response.element;
  }

  function updateElementsAndSelectedElement(
    elements: ApiEditorBodyElementsInner[],
    selectedElement: ApiEditorBodyElementsInner | null,
  ) {
    setElements(elements);
    setSelectedElement(selectedElement);
    setScrollToElement(selectedElement);
  }

  /** scrolls to the element `scrollToElement` when set and not visible */
  useEffect(() => {
    if (scrollToElement === null) return;
    if (contentDisplay.current === null) return;
    const domElement = contentDisplay.current.querySelector(
      `#element-${scrollToElement.id}`,
    );
    if (domElement && !isElementVisible(domElement, contentDisplay.current)) {
      domElement?.scrollIntoView({ behavior: "smooth" });
    }
  }, [scrollToElement]);

  return (
    <Box
      sx={{
        maxHeight: "100%",
        overflow: "hidden",
        display: "grid",
        gridTemplateColumns: {
          xxs: "1fr 1fr",
          sm: "3fr 1fr",
          md: "3fr 2fr",
          lg: "1fr 2fr 1fr",
        },
        gridTemplateRows: {
          xxs: "1fr 2fr",
          lg: "1fr",
        },
        gridTemplateAreas: {
          xxs: '"display palette" "display property" "display property"',
          lg: '"palette display property"',
        },
      }}
      padding={2}
      gap={3}
    >
      <Box
        sx={{
          maxHeight: "100%",
          overflow: "hidden",
          gridArea: "palette",
        }}
      >
        <ContentElementPalette
          palette={palette}
          sx={{
            maxHeight: "100%",
            overflow: "auto",
            padding: { xxs: 2, lg: 3 },
          }}
          onItemAdd={handleAddPaletteItem}
        />
      </Box>
      <Box
        ref={contentDisplay}
        sx={{
          maxHeight: "100%",
          overflow: "hidden",
          gridArea: "display",
        }}
      >
        <ContentDisplay
          elements={elements}
          selectedElement={selectedElement}
          sx={{
            maxHeight: "100%",
            overflow: "auto",
            padding: { xxs: 2, lg: 3 },
          }}
          imagesBasePath={imagesBasePath}
          onElementSelected={setSelectedElement}
        />
      </Box>
      <Box
        sx={{
          maxHeight: "100%",
          overflow: "hidden",
          gridArea: "property",
        }}
      >
        <ContentElementPropertySheet
          element={selectedElement}
          sx={{
            maxHeight: "100%",
            overflow: "auto",
            padding: { xxs: 2, lg: 3 },
          }}
          onMoveUp={handleMoveUp}
          onMoveDown={handleMoveDown}
          onDelete={handleDelete}
          onUpdate={handleUpdate}
        />
      </Box>
    </Box>
  );
}

function isElementVisible(element: Element, scrollable: Element) {
  const { top, bottom, height } = element.getBoundingClientRect();
  const scrollRect = scrollable.getBoundingClientRect();
  return top <= scrollRect.top
    ? scrollRect.top - top <= height
    : bottom - scrollRect.bottom <= height;
}
