MyDay Extension
Your Personal Productivity Companion for Chrome

MyDay is a sleek and modern Chrome extension designed to boost your daily productivity. It provides two essential tools in one intuitive popup: a Daily Tasks manager to keep track of your to-dos, and a customizable Timer to help you focus and manage your time effectively. Tasks automatically refresh every 24 hours, giving you a fresh start each day. Built with React and Vite, MyDay offers a smooth, responsive, and aesthetically pleasing user experience right in your browser.

Features
Daily Task Management: Add, view, and delete tasks for your day.

24-Hour Task Refresh: Your task list automatically clears every 24 hours, preparing you for a new day.

Customizable Timer: Set a timer for focused work sessions or breaks.

Intuitive Tabbed Interface: Easily switch between tasks and timer.

Modern UI: Clean, responsive, and user-friendly design built with React.

Technologies Used
React: For building the user interface.

Vite: As a fast build tool for development and production bundling.

HTML, CSS, JavaScript: Core web technologies.

Chrome Extension APIs: chrome.storage for data persistence and chrome.alarms for scheduling task refreshes.

Installation and Usage
To use this extension from the source code, follow these steps:

Clone this repository to your local machine or download the code as a ZIP file and extract it.

git clone <your-repo-url>
cd my-react-extension # Navigate into the project directory

Install dependencies:

npm install

Build the extension:
This command will compile your React application and create the necessary files for the Chrome extension in a dist folder.

npm run build

Load the extension in Chrome:

Open your Chrome browser.

Navigate to chrome://extensions.

In the top right corner, enable "Developer mode".

In the top left corner, click "Load unpacked".

Browse to your project directory (my-react-extension) and select the dist folder.

The "MyDay Extension" should now appear in your list of extensions, and its icon will be visible in your browser's toolbar.

You are now ready to use the MyDay extension! Click on the extension icon to open the popup and start managing your tasks and time.

Contributing
Contributions are welcome! If you have ideas for new features, improvements, or bug fixes, please open an issue or submit a pull request.
