const puppeteer = require("puppeteer");
const logger = require('./utils/logger');

async function run(targetWebsite, { name, email, startTime, endTime }) {
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();

  logger.info(`Open ${targetWebsite}`);
  await page.goto(targetWebsite, { waitUntil: "networkidle0" });

  // Wait for Booking Window
  await page.waitForSelector(".fc-timegrid-slot");

  // Choose available Slot
  const slotBoxes = await page.$$eval(".fc-timegrid-slot", slots =>
    slots.map(slot => {
      const rect = slot.getBoundingClientRect();
      return { x: rect.x, y: rect.y };
    })
  );

  let success = false;
  while (!success && slotBoxes.length > 0) {
    const index = Math.floor(Math.random() * slotBoxes.length);
    const { x, y } = slotBoxes[index];

    await page.mouse.click(x, y);
    try {
      await page.waitForSelector("#bookingModal", { visible: true, timeout: 1000 });
      success = true;
    } catch { }
  }

  if (!success) {
    logger.error("no slot available.");
    await browser.close();
    return;
  }

  // Buchungsformular ausfüllen
  await page.type("#nameInput", name);
  await page.type("#emailInput", email);

  await page.evaluate(({ startTime, endTime }) => {
    document.getElementById("startTime").value = startTime;
    document.getElementById("endTime").value = endTime;
  }, { startTime, endTime });

  await page.click("#confirmBooking");

  logger.info("Booking success.");
  await browser.close();
}

module.exports = { run };