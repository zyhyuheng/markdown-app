const { app, BrowserWindow, Menu, ipcMain, dialog } = require('electron');
const path = require('path');
const fs = require('fs');

// run this as early in the main process as possible
if (require('electron-squirrel-startup')) app.quit();
let currentFilePath = null;



function createWindow() {
  const mainWindow = new BrowserWindow({
    width: 1280,
    height: 900,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
      webSecurity: false
    }
  });

  // 添加快捷键事件监听器
  mainWindow.webContents.on('before-input-event', (event, input) => {
    if (input.control && input.key.toLowerCase() === 's') {
      event.preventDefault();
      if (currentFilePath) {
        mainWindow.webContents.send('save-markdown');
      } else {
        dialog.showSaveDialog({
          filters: [{ name: 'Markdown', extensions: ['md'] }]
        }).then(({ filePath }) => {
          if (filePath) {
            currentFilePath = filePath;
            mainWindow.webContents.send('save-markdown');
          }
        });
      }
    }
  });

  // 读取markdown文件内容
  const markdownPath = path.join(__dirname, 'markdown', 'basic.md');
  try {
    const content = fs.readFileSync(markdownPath, 'utf-8');
    mainWindow.webContents.on('did-finish-load', () => {
      mainWindow.webContents.send('markdown-content', content);
    });
  } catch (error) {
    console.error('Error reading markdown file:', error);
  }

  mainWindow.loadFile('./index.html');

  const template = [
    {
      label: '文件',
      submenu: [
        {
          label: '新建',
          click: async () => {
            const { filePath } = await dialog.showSaveDialog({
              filters: [{ name: 'Markdown', extensions: ['md'] }]
            });
            if (filePath) {
              currentFilePath = filePath;
              fs.writeFileSync(currentFilePath, '');
              mainWindow.webContents.send('markdown-content', '');
            }
          }
        },
        {
          label: '打开',
          click: async () => {
            const { filePaths } = await dialog.showOpenDialog({
              properties: ['openFile'],
              filters: [{ name: 'Markdown', extensions: ['md'] }]
            });
            if (filePaths.length > 0) {
              currentFilePath = filePaths[0];
              const content = fs.readFileSync(currentFilePath, 'utf-8');
              mainWindow.webContents.send('markdown-content', content);
            }
          }
        },
        {
          label: '保存',
          click: async () => {
            if (currentFilePath) {
              mainWindow.webContents.send('save-markdown');
            } else {
              const { filePath } = await dialog.showSaveDialog({
                filters: [{ name: 'Markdown', extensions: ['md'] }]
              });
              if (filePath) {
                currentFilePath = filePath;
                mainWindow.webContents.send('save-markdown');
              }
            }
          }
        },
        {
          label: '另存为',
          click: async () => {
            const { filePath } = await dialog.showSaveDialog({
              filters: [{ name: 'Markdown', extensions: ['md'] }]
            });
            if (filePath) {
              currentFilePath = filePath;
              mainWindow.webContents.send('save-markdown');
            }
          }
        },
        { type: 'separator' },
        { role: 'quit', label: '退出' }
      ]
    },
    {
      label: '编辑',
      submenu: [
        { role: 'undo', label: '撤销' },
        { role: 'redo', label: '重做' },
        { type: 'separator' },
        { role: 'cut', label: '剪切' },
        { role: 'copy', label: '复制' },
        { role: 'paste', label: '粘贴' },
        { role: 'selectAll', label: '全选' }
      ]
    },
    {
      label: '视图',
      submenu: [
        { role: 'reload', label: '重新加载' },
        { role: 'toggleDevTools', label: '开发者工具' },
        { type: 'separator' },
        { role: 'resetZoom', label: '重置缩放' },
        { role: 'zoomIn', label: '放大' },
        { role: 'zoomOut', label: '缩小' },
        { type: 'separator' },
        { role: 'togglefullscreen', label: '全屏' }
      ]
    }
  ];

  const menu = Menu.buildFromTemplate(template);
  Menu.setApplicationMenu(menu);
}

app.whenReady().then(() => {
  createWindow();

  app.on('activate', function () {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') app.quit();
});