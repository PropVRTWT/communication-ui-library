// © Microsoft Corporation. All rights reserved.
import { Stack } from '@fluentui/react';
import { useCallingContext } from '../../index';
import { IncomingCallsProvider, useIncomingCallsContext } from '../../providers';
import React from 'react';
import { IncomingCallToast } from '../../components';
import { useMicrophone, useIncomingCall } from '../../hooks';

export type IncomingCallProps = {
  onIncomingCallAccepted?: () => void;
  onIncomingCallRejected?: () => void;
};

const IncomingCallContainer = (props: IncomingCallProps): JSX.Element => {
  // todo: move to mapper:
  const { incomingCalls } = useIncomingCallsContext();
  const { accept, reject } = useIncomingCall();
  const { unmute } = useMicrophone();

  if (!(incomingCalls && incomingCalls.length > 0)) {
    return <></>;
  } else {
    return (
      <Stack>
        {incomingCalls.map((call) => (
          <div style={{ marginTop: '8px', marginBottom: '8px' }} key={call.id}>
            <IncomingCallToast
              callerName={call.remoteParticipants[0]?.displayName}
              onClickReject={async () => {
                await reject(call);
                props.onIncomingCallRejected && props.onIncomingCallRejected();
              }}
              onClickAccept={async () => {
                await accept(call);
                await unmute();
                props.onIncomingCallAccepted && props.onIncomingCallAccepted();
              }}
            />
          </div>
        ))}
      </Stack>
    );
  }
};

export const CallListener = (props: IncomingCallProps): JSX.Element => {
  const { callAgent, deviceManager } = useCallingContext();
  return callAgent && deviceManager ? (
    <IncomingCallsProvider>
      <IncomingCallContainer
        onIncomingCallAccepted={props.onIncomingCallAccepted}
        onIncomingCallRejected={props.onIncomingCallRejected}
      />
    </IncomingCallsProvider>
  ) : (
    <></>
  );
};
