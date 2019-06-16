import { Config } from 'lexica-dialog-model/dist/Config';

// tslint:disable max-line-length trailing-comma
export const configs: Config[] = [
  {
    uni: 'GLOBAL',
    key: 'SESSION_EXPIRE_IN_MS',
    value: 900000,
  },

  {
    uni: 'GLOBAL',
    key: 'FALLBACK_COMMAND_NAME',
    value: 'FALLBACK_MESSAGE',
  },
  {
    uni: 'GLOBAL',
    key: 'SUSPEND_AUTO_REPLY',
    value: false,
  },
  {
    uni: 'GLOBAL',
    key: 'FACEBOOK_VERIFY_TOKEN',
    value: 'secret',
  },
  {
    uni: 'dev',
    key: 'FACEBOOK_ACCESS_TOKEN',
    value: 'EAAELYFotKpIBAFtwqi8CasqyuRpJQqYj44IfUXsVa7R8nyYIKRDGqmOZACW19BWxcWpv8kQ8LaeKLgPtgVVQXRrRXo8vGUPeCb0TMFxZAgMhbU0EIuHZCI39EbLzaVmcsMy0ZAi1vQziSqeUtwrgGjZBowK4Ar8PgNZBfTtLTZAdWnIfrQ8UrlF',
  },
  {
    uni: 'GLOBAL',
    key: 'TOKENS_TYPES',
    value: {
      dev: 'DEV',
    },
  },
  {
    uni: 'GLOBAL',
    key: 'TIME_GAP_IN_MS_TRIGGER_CONFIRM_CLOSE_ISSUE',
    value: 1000 * 60 * 15,
  },
  {
    uni: 'GLOBAL',
    key: 'LIBRARIAN_INDICATOR',
    value: '📖'
  },
  {
    uni: 'GLOBAL',
    key: 'RECREATE_ISSUE_KEY_WORD',
    value: 'HI Lexica',
  },
  {
    uni: 'GLOBAL',
    key: 'FACEBOOK_API_BASE_URL',
    value: 'https://graph.facebook.com/v2.10',
  },
  {
    uni: 'GLOBAL',
    key: 'PREPEND_MESSAGES_PRIOR_TO_LIBRARIAN_REPLY',
    value: [
      {
        response: 'Hey ${firstName}\n' +
          'We passed your message to the librarian and they have replied. See their ${LIBRARIAN_INDICATOR} messages below.',
        additional_time_gap_response: 'If you have further questions for the librarian, you can ask them here. I will be back online in about ${TIME_GAP} minutes. If you need me sooner, simply text ‘${RECREATE_ISSUE_KEY_WORD}’.'
      },
      {
        response: 'Hi ${firstName}\n' +
          'The librarian has replied to your question I sent over earlier. They are shown as ${LIBRARIAN_INDICATOR} messages below.',
        additional_time_gap_response: 'If you have any questions for the librarian, you can ask them here. I will be back in about ${TIME_GAP} minutes. If you need me sooner, just message ‘${RECREATE_ISSUE_KEY_WORD}’.'
      },
      {
        response: '${firstName}\n' +
          'Your earlier message to the librarian has a reply. You can view the ${LIBRARIAN_INDICATOR} messages below.',
        additional_time_gap_response: 'You can ask the librarians any follow up questions here. I will be back in about ${TIME_GAP} minutes. If you need me sooner, simply text ‘${RECREATE_ISSUE_KEY_WORD}’.',
      },
    ],
  }
];
