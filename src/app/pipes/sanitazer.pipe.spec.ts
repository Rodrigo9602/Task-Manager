import { SanitazerPipe } from './sanitazer.pipe';

describe('SanitazerPipe', () => {
  it('create an instance', () => {
    const pipe = new SanitazerPipe();
    expect(pipe).toBeTruthy();
  });
});
