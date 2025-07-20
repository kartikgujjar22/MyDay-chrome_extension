// This is a service worker, it doesn't have direct access to the DOM of web pages.
// It listens for events and can send messages to other parts of your extension.

const TASK_STORAGE_KEY = "dailyTasks";
const LAST_REFRESH_KEY = "lastTaskRefresh";
const REFRESH_INTERVAL_MS = 24 * 60 * 60 * 1000; // 24 hours in milliseconds
``;
// Function to clear tasks and set the last refresh time
async function clearAndRefreshTasks() {
  console.log("Clearing daily tasks...");
  await chrome.storage.local.set({ [TASK_STORAGE_KEY]: [] });
  await chrome.storage.local.set({ [LAST_REFRESH_KEY]: Date.now() });
  console.log("Daily tasks cleared and refresh timestamp updated.");
}

// Set up an alarm to clear tasks every 24 hours
async function setupDailyTaskRefreshAlarm() {
  const { [LAST_REFRESH_KEY]: lastRefreshTime } =
    await chrome.storage.local.get(LAST_REFRESH_KEY);
  const now = Date.now();

  if (!lastRefreshTime) {
    // If no last refresh time, set it now and clear tasks
    console.log(
      "No last refresh time found. Initializing tasks and setting first refresh."
    );
    await clearAndRefreshTasks();
  } else {
    const timeSinceLastRefresh = now - lastRefreshTime;
    if (timeSinceLastRefresh >= REFRESH_INTERVAL_MS) {
      // If 24 hours have passed, clear tasks immediately
      console.log("24 hours passed since last refresh. Clearing tasks now.");
      await clearAndRefreshTasks();
    } else {
      // Otherwise, schedule the next clear for the remaining time
      const delayInMinutes = Math.ceil(
        (REFRESH_INTERVAL_MS - timeSinceLastRefresh) / (60 * 1000)
      );
      console.log(`Scheduling next task clear in ${delayInMinutes} minutes.`);
      chrome.alarms.create("dailyTaskRefresh", {
        delayInMinutes: delayInMinutes,
      });
    }
  }

  // Ensure the alarm is created/updated for subsequent intervals
  chrome.alarms.create("dailyTaskRefresh", {
    periodInMinutes: REFRESH_INTERVAL_MS / (60 * 1000),
  });
  console.log("Daily task refresh alarm set up.");
}

// Fired when the extension is first installed, updated, or Chrome is updated.
chrome.runtime.onInstalled.addListener(() => {
  console.log("MyDay Extension installed!");
  setupDailyTaskRefreshAlarm();
});

// Listen for the alarm to trigger
if (typeof chrome !== "undefined" && chrome.alarms) {
  chrome.alarms.onAlarm.addListener(async (alarm) => {
    if (alarm.name === "dailyTaskRefresh") {
      await clearAndRefreshTasks();
    }
  });
}

// Listen for messages from the popup (your React app) or content scripts.
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  // Return true to indicate that you want to send a response asynchronously
  (async () => {
    if (request.action === "getTasks") {
      const { [TASK_STORAGE_KEY]: tasks } = await chrome.storage.local.get(
        TASK_STORAGE_KEY
      );
      sendResponse({ tasks: tasks || [] });
    } else if (request.action === "addTask") {
      const { [TASK_STORAGE_KEY]: tasks } = await chrome.storage.local.get(
        TASK_STORAGE_KEY
      );
      const newTasks = [...(tasks || []), request.task];
      await chrome.storage.local.set({ [TASK_STORAGE_KEY]: newTasks });
      sendResponse({ status: "success", tasks: newTasks });
    } else if (request.action === "deleteTask") {
      const { [TASK_STORAGE_KEY]: tasks } = await chrome.storage.local.get(
        TASK_STORAGE_KEY
      );
      const updatedTasks = (tasks || []).filter(
        (task) => task.id !== request.taskId
      );
      await chrome.storage.local.set({ [TASK_STORAGE_KEY]: updatedTasks });
      sendResponse({ status: "success", tasks: updatedTasks });
    } else if (request.action === "clearAllTasks") {
      await clearAndRefreshTasks();
      sendResponse({ status: "success", tasks: [] });
    } else if (request.action === "openNewTab") {
      chrome.tabs.create({ url: request.url });
      sendResponse({ status: "success", message: "New tab opened." });
    }
  })();
  return true;
});
