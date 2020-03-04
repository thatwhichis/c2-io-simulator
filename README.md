# c2-io-simulator

This 2017 JavaScript sample (src/runtime.js) is part of a modified version of a plugin for use in the [Construct 2](https://www.scirra.com/store/construct-2) game engine, generated for the 3x IGF nominated game [Hypnospace Outlaw](http://www.hypnospace.net/) ([Steam](https://store.steampowered.com/app/844590/Hypnospace_Outlaw/)). 

This plugin was developed to perform two functions:

1. To allow C2 editor event control over simulating user inputs; this was useful for "in-game viruses" which could hijack input from the user without having to create an in-editor abstraction layer to override user input.

2. To address the minor issue of not being able to detect if the user had Caps Lock enabled.

An important design consideration was the ability for the plugin to survive minification.
