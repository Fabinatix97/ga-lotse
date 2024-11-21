/**
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

declare module "*.svg" {
  /**
   * This declaration overrides the one of Next.js which exports `any` for SVG imports.
   * However, as long as no SVG loader plugin is used like `@svgr/webpack` or `babel-plugin-inline-react-svg`,
   * SVG files are imported statically by Next.js just like other image files.
   * Statically imported SVGs can easily be used in <img> and <Image> components.
   */
  const content: import("next/image").StaticImageData;

  // eslint-disable-next-line import/no-default-export
  export default content;
}
