
const path = require('path');
const fs = require('fs');
const puppeteer = require('puppeteer');
const tape = require('tape');

const comparisonFile = 'src/organisms/header/header.test.json';

async function evaluate(page, width, height) {
  await page.setViewport({ width, height });

  return page.evaluate(() => {
    const header = document.querySelector('.header');
    const headerStyleObject = window.getComputedStyle(header, null);

    const searchbar = document.querySelector('.header > .header_searchbar');
    const searchbarStyleObject = window.getComputedStyle(searchbar, null);

    const result = {
      header: headerStyleObject,
      header_searchbar: searchbarStyleObject,
    };

    return result;
  });
}

async function test() {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.goto('http://localhost:3000/modules/organisms/header/header.html');

  const mobileProperties = await evaluate(page, 320, 568);
  const tabletProperties = await evaluate(page, 768, 1024);
  const desktopProperties = await evaluate(page, 1440, 840);
  await browser.close();

  if (!fs.existsSync(comparisonFile)) {
    console.error(`SKIP: ${path.basename(__filename)} | No comparison file found!\n`);
    return () => {};
  }

  const comparison = JSON.parse(fs.readFileSync(comparisonFile));
  const mobileComparisonObject = comparison.mobile;
  const tabletComparisonObject = comparison.tablet;
  const desktopComparisonObject = comparison.desktop;

  return () => {
    tape('header', (assert) => {
      assert.test('mobile tests:', (t) => {
        t.deepEquals(mobileProperties.header, mobileComparisonObject.header);
        t.deepEquals(mobileProperties.header_searchbar, mobileComparisonObject.header_searchbar);
        t.end();
      });

      assert.test('tablet tests:', (t) => {
        t.deepEquals(tabletProperties.header, tabletComparisonObject.header);
        t.deepEquals(tabletProperties.header_searchbar, tabletComparisonObject.header_searchbar);
        t.end();
      });

      assert.test('desktop tests:', (t) => {
        t.deepEquals(desktopProperties.header, desktopComparisonObject.header);
        t.deepEquals(desktopProperties.header_searchbar, desktopComparisonObject.header_searchbar);
        t.end();
      });

      assert.end();
    });
  };
}

if (require.main === module) test();

exports.test = test;
