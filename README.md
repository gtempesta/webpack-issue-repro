# webpack-issue-repro

This repository contains a minimal reproduction of a Webpack issue, that happens when working with the Module Federation plugin. 

The issue didn't start when we first set up the project, so it's probably related to the update of one of the packages, but I'm not able to track down the package or the version.

### What is the issue?
When running the `watch` command, at some point the `runtime-app` chunk referenced in the `app` chunk is different from the one referenced in the `asset-manifest.json`. 

Since we load this code in a PHP app, we use the manifest to load the chunks dynamically. 

Having the manifest reference a different chunk than the one referenced in the `app` chunk means that the browser loads two different `runtime-app` chunks, one requested by the manifest, and the other by the `app` chunk.

Since the second one is the oldest, the end result is that the `watch` command is not doing its job, because from a certain moment, I'm not able to see the changes I make to the code reflected in the browser.

### Steps to reproduce
1. Clone the repository
2. Run `npm install` to install the dependencies
3. Run `npm run watch` to start watching for changes
4. Open the `asset-manifest.json` file in the public folder, and open the `app` chunk that is referenced in the `entry-points` field. Now look for the `runtime-app` chunk in the `app` chunk and check that it's the same that is referenced in the `asset-manifest.json` file: it should be the same (with the same hash)
5. Make a change to the code in `app.js` and save it
6. The issue is still not there
7. Now make a change to the `design-area.js` file and save it
8. The issue should be there now: the `runtime-app` chunk in the `asset-manifest.json` file and in the `app` chunk should have different hashes

This is probably related to the fact that in `design-area.js` we are importing a module that is loaded using the Module Federation plugin, because if we remove the Module Federation configuration, the issue disappears.

The issue happens only when using the `watch` command, and not when using the `build` command (which is not implemented in this repo).

It happens even if the bucket we reference in the Module Federation plugin is not reachable, so I imagine that the technology of the remote application doesn't matter.

### What is the expected behavior?
I would espect that the `runtime-app` chunk referenced in the `asset-manifest.json` file and in the `app` chunk are always the same, so that I can use the manifest to load the chunks dynamically without having to worry about which one is loaded.
