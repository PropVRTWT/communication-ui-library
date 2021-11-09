// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { ErrorBar, OnRenderAvatarCallback, ParticipantMenuItemsCallback } from '@internal/react-components';
import React from 'react';
import { AvatarPersonaDataCallback } from '../../common/AvatarPersona';
import { CallCompositeOptions } from '../CallComposite';
import { useHandlers } from '../hooks/useHandlers';
import { usePropsFor } from '../hooks/usePropsFor';
import { useSelector } from '../hooks/useSelector';
import { MediaGallery } from '../components/MediaGallery';
import { callStatusSelector } from '../selectors/callStatusSelector';
import { complianceBannerSelector } from '../selectors/complianceBannerSelector';
import { mediaGallerySelector } from '../selectors/mediaGallerySelector';
import { CallArrangement } from '../components/CallArrangement';
import { reduceCallControlsForMobile } from '../utils';
import { mutedNotificationSelector } from '../selectors/mutedNotificationSelector';
import { networkReconnectTileSelector } from '../selectors/networkReconnectTileSelector';
import { DiagnosticQuality } from '@azure/communication-calling';
import { NetworkReconnectTile } from '../components/NetworkReconnectTile';

/**
 * @private
 */
export interface CallPageProps {
  callInvitationURL?: string;
  onRenderAvatar?: OnRenderAvatarCallback;
  onFetchAvatarPersonaData?: AvatarPersonaDataCallback;
  onFetchParticipantMenuItems?: ParticipantMenuItemsCallback;
  options?: CallCompositeOptions;
}

/**
 * @private
 */
export const CallPage = (props: CallPageProps): JSX.Element => {
  const { callInvitationURL, onRenderAvatar, onFetchAvatarPersonaData, onFetchParticipantMenuItems, options } = props;

  // To use useProps to get these states, we need to create another file wrapping Call,
  // It seems unnecessary in this case, so we get the updated states using this approach.
  const { callStatus } = useSelector(callStatusSelector);
  const mediaGalleryProps = useSelector(mediaGallerySelector);
  const mediaGalleryHandlers = useHandlers(MediaGallery);
  const complianceBannerProps = useSelector(complianceBannerSelector);
  const errorBarProps = usePropsFor(ErrorBar);
  const mutedNotificationProps = useSelector(mutedNotificationSelector);
  const networkReconnectTileProps = useSelector(networkReconnectTileSelector);

  // Reduce the controls shown when mobile view is enabled.
  const callControlOptions = options?.mobileView
    ? reduceCallControlsForMobile(options?.callControls)
    : options?.callControls;

  return (
    <CallArrangement
      complianceBannerProps={{ ...complianceBannerProps }}
      errorBarProps={options?.errorBar !== false && { ...errorBarProps }}
      mutedNotificationProps={mutedNotificationProps}
      callControlProps={
        callControlOptions !== false && {
          callInvitationURL: callInvitationURL,
          onFetchParticipantMenuItems: onFetchParticipantMenuItems,
          options: callControlOptions,
          increaseFlyoutItemSize: props.options?.mobileView
        }
      }
      mobileView={options?.mobileView ?? false}
      onRenderGalleryContent={() =>
        callStatus === 'Connected' ? (
          isNetworkHealthy(networkReconnectTileProps.networkReconnectValue) ? (
            <MediaGallery
              {...mediaGalleryProps}
              {...mediaGalleryHandlers}
              onRenderAvatar={onRenderAvatar}
              onFetchAvatarPersonaData={onFetchAvatarPersonaData}
            />
          ) : (
            <NetworkReconnectTile {...networkReconnectTileProps} />
          )
        ) : (
          <></>
        )
      }
      dataUiId={'call-page'}
    />
  );
};

/**
 * @private
 */
export const isNetworkHealthy = (value: DiagnosticQuality | boolean | undefined): boolean => {
  // We know that the value is actually of type DiagnosticQuality for this diagnostic.
  // We ignore any boolen values, considering the network to still be healthy.
  // Thus, only DiagnosticQuality.Poor or .Bad indicate network problems.
  return value === true || value === false || value === undefined || value === DiagnosticQuality.Good;
};
