import * as Sentry from '@sentry/node';

const dsn = process.env.SENTRY_DSN || '';
if (dsn) {
  Sentry.init({ dsn });
  // eslint-disable-next-line no-console
  console.log('Sentry initialized');
}

export default Sentry;
