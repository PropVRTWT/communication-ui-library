// © Microsoft Corporation. All rights reserved.

import {
  ErrorBar as ErrorBarComponent,
  SendBox,
  TypingIndicator,
  MessageThread,
  connectFuncsToContext,
  MapToErrorBarProps,
  useThreadId
} from '@azure/communication-ui';
import { useHandlers } from './hooks/useHandlers';
import { chatThreadSelector, sendBoxSelector, typingIndicatorSelector } from '@azure/acs-chat-selector';
import { Stack } from '@fluentui/react';
import React, { useEffect, useMemo } from 'react';
import { chatAreaContainerStyle, sendBoxParentStyle } from './styles/ChatArea.styles';
import { useSelector } from './hooks/useSelector';

export interface ChatAreaProps {
  onRenderAvatar?: (userId: string) => JSX.Element;
}

export const ChatArea = (props: ChatAreaProps): JSX.Element => {
  const ErrorBar = useMemo(() => {
    return connectFuncsToContext(ErrorBarComponent, MapToErrorBarProps);
  }, []);

  // onRenderAvatar is a contoso callback. We need it to support emoji in Sample App. Sample App is currently on
  // components v0 so we're passing the callback at the component level. This might need further refactoring if this
  // ChatArea is to become a component or if Sample App is to move to composite
  const threadId = useThreadId();

  const selectorConfig = useMemo(() => {
    return { threadId };
  }, [threadId]);

  const chatThreadProps = useSelector(chatThreadSelector, selectorConfig);
  const chatThreadHandlers = useHandlers(MessageThread);
  const sendBoxProps = useSelector(sendBoxSelector, selectorConfig);
  const sendBoxHandlers = useHandlers(SendBox);
  const typingIndicatorProps = useSelector(typingIndicatorSelector, selectorConfig);

  // Initialize the Chat thread with history messages
  useEffect(() => {
    (async () => {
      await chatThreadHandlers.onLoadPreviousChatMessages(5);
    })();
  }, [chatThreadHandlers]);

  return (
    <Stack className={chatAreaContainerStyle}>
      <MessageThread
        {...chatThreadProps}
        {...chatThreadHandlers}
        onRenderAvatar={props.onRenderAvatar}
        numberOfChatMessagesToReload={5}
      />
      <Stack.Item align="center" className={sendBoxParentStyle}>
        <div style={{ paddingLeft: '0.5rem', paddingRight: '0.5rem' }}>
          <TypingIndicator {...typingIndicatorProps} />
        </div>
        <ErrorBar />
        <SendBox {...sendBoxProps} {...sendBoxHandlers} />
      </Stack.Item>
    </Stack>
  );
};
