# presenter_smartwatch
## Introduction
The following implementation is used as a bluetooth presenter mainly for PowerPoint-Presentations.
Via certain motions made with your arm you can jump to the next or previous slide.
The implementation was made as an exercise in the 2022 class of "Interactive Ubiquitous Systems and Intelligent User Interfaces" at TU Bergakademie Freiberg

## Setup
The implementation is using the Banglejs 2 smartwatch. 
Make sure to install the Firmware-Version 14 and enable HID "Keyboard" before connecting to your PC.
Your Browser has to support Web-Bluetooth, for more information check out [the documentation](https://www.espruino.com/Quick+Start+BLE#banglejs).

## Usage
Besides beeing used as a presenter, the smartwatch can display both notes (show in the referentview in MS PP) and a timer for time management.

### Generate Config
The config is used to send information about the presentation to your smartwatch. 
To start set up config.json in the way you like: Include path to presentation, your preferred arm to wear the watch (default is right) and the scrolldirection and the timer.
After this execute pres.py to generate the watch-settings and read the notes from the presentation. 

### Upload Stuff
To upload Config and code to the watch open the [Espurino WebIDE](https://www.espruino.com/ide/) and connect the watch. 
Then access the file-storage to upload the watch settings.
Now you can open presenter_app.js in the IDE and upload it to the watch. The code is executed automatically.

### Presenting
After selecting and confirming the correct setup you will see a starting screen. 
Whenever you see it you motion detection cant be used.
Start the presentation on your device and press start on the Bangle.

#### Slide Change
To change to the next slide via motion hold your selected (default right) arm straight forward with the watch display facing left (when natural scroll is activated) or right.
The gesture should similar to whiping across a display. 
Is the natural scrolling direction selected the move from right to left indicates change to the next slide, from left to right to the previous.
To move to the previous page the has to be held in the opposite direction to moving to the next slide.
To get this right you might need some practise.
As a fallback you can click on the right/ left side of the watch display to change the slide.
When the slide is changed a small vibration can be felt.

#### Display
The display shows the slide title and notes, the current pages, the title of the next slide and two timers.

#### Timers
an the bottom left the timer shows how much time you should use on this slide. This can be change in the uploaded json-file.
The watch will vibrate lightly when this time is up. 
On the bottom right the total timer can be seen. 
When there are only 5 Minutes to go a strong vibration makes you aware. once the time is up another strong vibration occurs. 

