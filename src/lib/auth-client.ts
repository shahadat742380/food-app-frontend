// ** import third party package
import { createAuthClient } from 'better-auth/react';
import {
  adminClient,
  organizationClient,
  inferAdditionalFields,
  phoneNumberClient,
} from 'better-auth/client/plugins';

// ** import config
import { env } from '@/config/env';

export const authClient = createAuthClient({
  baseURL: `${env.NEXT_PUBLIC_BACKEND_BASE_URL}/api/auth`,
  plugins: [
    organizationClient(),
    adminClient(),
    phoneNumberClient(),
    inferAdditionalFields({
      user: {
        bio: {
          type: 'string',
          required: false,
        },
        email_notification: {
          type: 'boolean',
          required: false,
        },
        two_factor: {
          type: 'boolean',
          required: false,
        },
      },
    }),
  ],
  disableCSRFTokenCheck: true,
});
