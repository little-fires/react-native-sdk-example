# react-native-sdk-example

This repository contains a React Native example application that integrates with littlefires' React Native SDK module hosted [here](https://github.com/little-fires/react-native-sdk).

## Test on Physical Device

Please take note that testing can be done on a real physical device only.

This is because a physical Bluetooth connection has to be established.

## Instructions to Run Example Application

This section provides instructions to run the example application.

### Android

Inside [android](android) folder, please create a file called `local.properties` and enter the following line to specify your Android SDK directory:

```
sdk.dir=<sdk_dir>
```

Then, open a terminal in the root project directory and run the following commands:

```bash
# Initialize and update littlefires SDK via git submodule
git submodule init
git submodule update

# Install module dependencies
yarn install

# Install example application dependencies
cd plugins/littlefires
yarn install

# Go back to root directory
cd ../..

# Deploy on Android device
# This will automatically start metro
npx react-native run-android
```

### iOS

Open a terminal in the root project directory and run the following commands:

```bash
# Initialize and update littlefires SDK via git submodule
git submodule init
git submodule update

# Install module dependencies
yarn install

# Install example application dependencies
cd plugins/littlefires
yarn install

# Install CocoaPods
cd ios
pod install

# Go back to root directory
cd ../..
```

Finally, open [ios/ReactNativeSdkExample.xcworkspace](ios/ReactNativeSdkExample.xcworkspace) and deploy on your iOS device.

> Note: Remember to configure your Provisioning Profile!

## Instructions to Integrate SDK into Existing Application from Scratch

This section provides instructions to integrate littlefires React Native SDK module into existing React Native application.

If you prefer to visualize the changes made to configurations in order to integrate the SDK locally, please see [this commit](https://github.com/little-fires/react-native-sdk-example/commit/7ad5a7ecd68ab3a1dd6cfc0350ac96082e5aec56).

Otherwise, please see below on the steps taken to create this application.

> Note: For this example application, littlefires SDK is placed inside [plugins/littlefires](plugins/littlefires) folder!

### 1. Initialize example application
```bash
npx react-native init ReactNativeSdkExample
```

### 2. Add littlefires react-native-sdk as git submodule
```bash
# Initialize Git
git init

# Add react-native-sdk as git submodule
git submodule add https://github.com/little-fires/react-native-sdk.git plugins/littlefires/
```

### 3. Install dependencies
```bash
# To integrate custom module codes which is configured in babel.config.js
yarn add babel-plugin-module-resolver

# UI library for example application
yarn add react-native-paper react-native-safe-area-context
```

### 4. Update [babel.config.js](babel.config.js) file
```js
// --- new start
const path = require('path');
const pak = require('./plugins/littlefires/package.json');
// --- new end

module.exports = {
  // --- new start
  plugins: [
    [
      'module-resolver',
      {
        extensions: ['.tsx', '.ts', '.js', '.json'],
        alias: {
          [pak.name]: path.join(__dirname, 'plugins', 'littlefires', pak.source),
        },
      },
    ],
  ],
  // --- new end

  presets: ['module:metro-react-native-babel-preset'],

};
```
### 5. Update [metro.config.js](metro.config.js) file
```js
/**
 * Metro configuration for React Native
 * https://github.com/facebook/react-native
 *
 * @format
 */
// --- new start
const path = require('path');
const escape = require('escape-string-regexp');
const exclusionList = require('metro-config/src/defaults/exclusionList');
const pak = require('./plugins/littlefires/package.json');

const root = path.resolve(__dirname, 'plugins', 'littlefires');

const modules = Object.keys({
  ...pak.peerDependencies,
});
// --- new end

module.exports = {
  // --- new start
  projectRoot: __dirname,
  watchFolders: [root],

  // We need to make sure that only one version is loaded for peerDependencies
  // So we block them at the root, and alias them to the versions in example's node_modules
  resolver: {
    blacklistRE: exclusionList(
      modules.map(
        (m) =>
          new RegExp(`^${escape(path.join(root, 'node_modules', m))}\\/.*$`)
      )
    ),

    extraNodeModules: modules.reduce((acc, name) => {
      acc[name] = path.join(__dirname, 'node_modules', name);
      return acc;
    }, {}),
  },
  // --- new end

  transformer: {
    getTransformOptions: async () => ({
      transform: {
        experimentalImportSupport: false,
        inlineRequires: true,
      },
    }),
  },
};
```

### 6. Create [react-native.config.js](react-native.config.js) file
```js
const path = require('path');
const pak = require('./plugins/littlefires/package.json');

module.exports = {
  dependencies: {
    [pak.name]: {
      root: path.join(__dirname, 'plugins', 'littlefires'),
    },
  },
};
```

As you can see from the configurations above, there are paths to [plugins/littlefires](plugins/littlefires) folder such as:
```js
require('./plugins/littlefires/package.json');
```
or,
```js
path.join(__dirname, 'plugins', 'littlefires')
```


Please remember to edit them accordingly to where you want to place the SDK!
