
const path = require('path');
const fs = require('fs');
const shell = require('shelljs');
const puppeteer = require('puppeteer');
const tape = require('tape');

const comparisonFile = 'src/modules/organisms/footer/footer.test.json';

async function evaluate(page, width, height) {
  await page.setViewport({ width, height });

  return page.evaluate(() => {
    const footer = document.querySelector('.footer');
    const footerStyleObject = window.getComputedStyle(footer, null);

    const result = {
      footer: footerStyleObject,
    };

    return result;
  });
}

async function test() {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.goto('http://localhost:3000/modules/organisms/footer/footer.html');

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
    tape('footer tests', (assert) => {
      assert.test('on mobile:', (t) => {
        t.deepEquals(mobileProperties.footer, mobileComparisonObject.footer, 'footer properties should be alright');
        t.end();
      });

      assert.test('on tablet:', (t) => {
        t.deepEquals(tabletProperties.footer, tabletComparisonObject.footer, 'footer properties should be alright');
        t.end();
      });

      assert.test('on desktop:', (t) => {
        t.deepEquals(desktopProperties.footer, desktopComparisonObject.footer, 'footer properties should be alright');
        t.end();
      });

      assert.end();
    });
  };
}

if (require.main === module) test();

exports.test = test;
