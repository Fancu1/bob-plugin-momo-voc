#!/bin/bash

rm -f momo-voc.zip momo-voc.bobplugin

zip -r momo-voc.zip . -x ".*" -x "*/\.*" -x "dist/*" -x "momo-voc.zip" -x "build-plugin.sh"

mv momo-voc.zip momo-voc.bobplugin

echo "Plugin built successfully! momo-voc.bobplugin file created"
