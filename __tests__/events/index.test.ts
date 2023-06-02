import { emitter, initEvents } from '../../src/event/';
import {
  USER_EMAIL_CONFIRMATION,
  accountEmailConfirmationEvent,
} from '../../src/event/mailer.event';

describe('initEvents', () => {
  it('should invoke on function emitter', async () => {
    const spyEmitter = jest.spyOn(emitter, 'on');
    spyEmitter.mockImplementation(jest.fn());

    initEvents();

    expect(spyEmitter).toHaveBeenCalled();
    expect(spyEmitter).toHaveBeenCalledWith(
      USER_EMAIL_CONFIRMATION,
      accountEmailConfirmationEvent,
    );
  });
});
