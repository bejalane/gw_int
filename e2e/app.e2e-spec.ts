import { GetweddPage } from './app.po';

describe('getwedd App', function() {
  let page: GetweddPage;

  beforeEach(() => {
    page = new GetweddPage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
