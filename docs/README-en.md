# MoMo Vocabulary Cloud Wordbook Bob Plugin

[中文文档](../README.md)

## Introduction

This plugin allows you to add words or phrases queried in Bob to the MoMo Vocabulary cloud wordbook. You can then add these words from the cloud wordbook to your daily learning plan in the MoMo Vocabulary app for convenient review.

This plugin is inspired by [chriscurrycc/bob-plugin-maimemo-notebook](https://github.com/chriscurrycc/bob-plugin-maimemo-notebook).

Compared to the `bob-plugin-maimemo-notebook` plugin, this version additionally supports asynchronous word addition for improved efficiency. The code also better adheres to Bob plugin standards, making it easier to add new features and maintain the plugin.

Currently, only words or phrases are supported; sentences cannot be added.

## Features

- Add English words or phrases to MoMo Vocabulary cloud wordbook
- Support for specifying existing cloud wordbooks or creating new ones
- Asynchronous word addition without waiting for completion
- Automatic caching of words pending addition, with retry support for failed attempts

## Usage Instructions

1. Install [Bob](https://bobtranslate.com/)

2. Download this plugin and install it (click the plugin icon > Install Plugin > Select the downloaded plugin file)

3. Open the MoMo Vocabulary app, go to "Me > More Settings > Experimental Features > Open API" to apply for and copy the Token

4. Enter the Token in Bob preferences > Services > Click "+" in the bottom left corner > Select "MoMo Vocabulary Token" input field after adding this plugin

5. In the plugin configuration interface, fill in the "MoMo Cloud Wordbook Name" which will be used as the default wordbook for adding words. If you leave it blank, a wordbook named "Bob-Plugin" will be used by default. If the wordbook doesn't exist, it will be created automatically.

6. Save the configuration

## Development

### Build

Modify the project code and execute the following command to automatically generate the plugin zip file based on the latest code:

```bash
./build-plugin.sh
```

### Debug

The log of this project will be output to the `~/Library/Containers/com.hezongyidev.Bob/Data/Documents/InstalledPluginSandbox/bobplugin.momo-voc/momo-voc.log` file (possibly needs to be adjusted according to actual conditions).

And supports inputting `!debug` in the translation page to adjust some information:

![!debug](./images/debug.png)

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
