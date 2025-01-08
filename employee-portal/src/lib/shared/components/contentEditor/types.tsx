/**
 * Copyright 2025 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

export enum PaletteItemType {
  "TEXT" = "TEXT",
  "TEXTBLOCK" = "TEXTBLOCK",
}

export type PaletteItem =
  | ({ type: PaletteItemType.TEXT } & PredefinedText)
  | ({ type: PaletteItemType.TEXTBLOCK } & PredefinedTextBlock);

interface PaletteItemBase {
  type: PaletteItemType;
  name: string;
}

export interface PredefinedText extends PaletteItemBase {
  type: PaletteItemType.TEXT;
  text: string;
}

export interface PredefinedTextBlock extends PaletteItemBase {
  type: PaletteItemType.TEXTBLOCK;
  title: string;
  text: string;
}
