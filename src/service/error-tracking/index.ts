import config from '@/core/config';
import * as Sentry from '@sentry/node';
import * as Tracing from '@sentry/tracing';

export default class ErrorTracking {
  private constructor() { }

  public static init() {
    if(!config.sentryDsn){
      console.log('Provide a Sentry Dsn in config file in order initialize monitoring')
      return
    }
    Sentry.init({
      dsn: config.sentryDsn,
      tracesSampleRate: 1.0,
    });
  }
}

/*
const transaction = Sentry.startTransaction({
  op: "test",
  name: "My First Test Transaction",
});

Sentry.captureException(e);
transaction.finish();
*/
