/*
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.base.address.persistence.entity;

import de.eshg.base.address.persistence.embeddable.EmbeddablePostboxAddress;

public interface DelegatingPostboxAddress
    extends DelegatingAddress<EmbeddablePostboxAddress>, PostboxAddress {

  default String getPostbox() {
    return getDelegate().getPostbox();
  }

  default void setPostbox(String postbox) {
    getDelegate().setPostbox(postbox);
  }
}
