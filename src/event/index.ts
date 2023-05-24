import { EventEmitter2 } from 'eventemitter2';
import {
  USER_EMAIL_CONFIRMATION,
  accountEmailConfirmationEvent,
} from './mailer.event';

export const emitter = new EventEmitter2({
  wildcard: false,
  delimiter: '.',
  newListener: false,
  removeListener: false,
  maxListeners: 10,
  verboseMemoryLeak: false,
  ignoreErrors: false,
});

export function initEvents(): void {
  emitter.on(USER_EMAIL_CONFIRMATION, accountEmailConfirmationEvent);
}
