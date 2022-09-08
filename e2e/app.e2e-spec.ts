import { CProjectPage } from './app.po';

describe('cproject App', () => {
  let page: CProjectPage;

  beforeEach(() => {
    page = new CProjectPage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
