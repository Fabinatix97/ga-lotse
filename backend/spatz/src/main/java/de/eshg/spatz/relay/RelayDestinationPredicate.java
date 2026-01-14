/*
 * Copyright 2026 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.spatz.relay;

import de.eshg.lib.servicedirectory.api.ActorResponseDto;
import java.util.function.BiPredicate;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

public class RelayDestinationPredicate implements BiPredicate<ActorResponseDto, ActorResponseDto> {
  private static final Logger logger = LoggerFactory.getLogger(RelayDestinationPredicate.class);

  @Override
  public boolean test(ActorResponseDto remoteActor, ActorResponseDto selfActor) {
    if (selfActor == null) {
      logger.debug("selfActor is null - assuming not a relay destination");
      return false;
    }
    if (remoteActor == null) {
      logger.debug("remoteActor is null - assuming not a relay destination");
      return false;
    } else {
      String remoteId = remoteActor.networkId();
      String selfId = selfActor.networkId();
      if (remoteId.equals(selfId)) {
        logger.debug(
            "remote actor has same networkId {} - assuming not a relay destination", remoteId);
        return false;
      } else {
        logger.debug(
            "remote actor has networkId {} differing from our networkId {} - is a relay destination",
            remoteId,
            selfId);
        return true;
      }
    }
  }
}
