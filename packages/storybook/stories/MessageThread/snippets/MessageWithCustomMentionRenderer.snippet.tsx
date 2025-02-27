import { FluentThemeProvider, MessageStatus, MessageThread } from '@azure/communication-react';
import React from 'react';

export const MessageWithCustomMentionRenderer: () => JSX.Element = () => {
  const user1Id = 'user1';
  const user2Id = 'user2';

  return (
    <FluentThemeProvider>
      <MessageThread
        userId={user2Id}
        showMessageDate={true}
        messages={[
          {
            messageType: 'chat',
            senderId: user1Id,
            senderDisplayName: 'Kat Larsson',
            messageId: Math.random().toString(),
            content: `Hey <msft-mention id="${user2Id}" displayText="Robert Tolbert">Robert Tolbert</msft-mention>, can you help me with my internet connection?`,
            createdOn: new Date('2019-04-13T00:00:00.000+08:10'),
            mine: false,
            attached: false,
            status: 'seen' as MessageStatus,
            contentType: 'html'
          },
          {
            messageType: 'chat',
            senderId: user2Id,
            senderDisplayName: 'Robert Tolbert',
            messageId: Math.random().toString(),
            content: 'Absolutely! What seems to be the problem?',
            createdOn: new Date('2019-04-13T00:00:00.000+08:11'),
            mine: true,
            attached: false,
            contentType: 'text'
          }
        ]}
        mentionOptions={{
          displayOptions: {
            onRenderMention: (mention, defaultOnMentionRender) => {
              return <button key={Math.random().toString()}>{defaultOnMentionRender(mention)}</button>;
            }
          },
          lookupOptions: {
            onQueryUpdated: async (query) => {
              return Promise.resolve(
                [
                  {
                    id: user1Id,
                    displayText: 'Kat Larsson'
                  },
                  {
                    id: 'everyone',
                    displayText: 'Everyone'
                  }
                ].filter((suggestion) =>
                  suggestion.displayText.toLocaleLowerCase().startsWith(query.toLocaleLowerCase())
                )
              );
            }
          }
        }}
      />
    </FluentThemeProvider>
  );
};
