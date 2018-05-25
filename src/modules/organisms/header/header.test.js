
const path = require('path');
const fs = require('fs');
const shell = require('shelljs');
const puppeteer = require('puppeteer');
const tape = require('tape');

const comparisonFile = 'src/modules/organisms/header/header.test.json';

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
    console.log(`SKIP: ${path.basename(__filename)} | No comparison file found! Creating comparison file now.\n`);

    return () => {
      const comparison = {
        mobile: mobileProperties,
        tablet: tabletProperties,
        desktop: desktopProperties,
      };

      shell.touch(comparisonFile);

      fs.writeFile(
        comparisonFile,
        JSON.stringify(comparison, null, 2),
        'utf8',
        (err) => { console.log('error', err); },
      );
    };
  }

  const comparison = JSON.parse(fs.readFileSync(comparisonFile));
  const mobileComparisonObject = comparison.mobile;
  const tabletComparisonObject = comparison.tablet;
  const desktopComparisonObject = comparison.desktop;

  return () => {
    tape('header tests', (assert) => {
      assert.test('on mobile:', (t) => {
        t.deepEquals(mobileProperties.header, mobileComparisonObject.header, 'header properties should be alright');
        t.deepEquals(mobileProperties.header_searchbar, mobileComparisonObject.header_searchbar, 'header_searchbar properties should be alright');
        t.end();
      });

      assert.test('on tablet:', (t) => {
        t.deepEquals(tabletProperties.header, tabletComparisonObject.header, 'header properties should be alright');
        t.deepEquals(tabletProperties.header_searchbar, tabletComparisonObject.header_searchbar, 'header_searchbar properties should be alright');
        t.end();
      });

      assert.test('on desktop:', (t) => {
        t.deepEquals(desktopProperties.header, desktopComparisonObject.header, 'header properties should be alright');
        t.deepEquals(desktopProperties.header_searchbar, desktopComparisonObject.header_searchbar, 'header_searchbar properties should be alright');
        t.end();
      });

      assert.end();
    });
  };
}

if (require.main === module) test();

exports.test = test;
