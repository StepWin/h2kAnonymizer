StepWin's
# H2K Anonymizer

This contains an small XML modifier that reads all the HOT2000 files in the `input` folder and deletes their address field before writing them in an `output` folder.

## ⚠️⚠️ Caution: Never use this on original files — instead, always copy the files and keep the original versions safe. ⚠️⚠️

It can be used in three ways:

1. [Running Pre-built .EXE (easy, windows only)](#prebuilt)
2. [Using Node.js (intermediate, all platforms)](#node)
3. [Building EXE (intermediate, windows only)](#build)

## <a name="prebuilt"></a>Method 1: Pre-Built
Simply locate the **clone or download** button on this page, download the repository as zip, unzip the files, put your HOT2000 files in the `input` folder after deleting the existing files. Double-click on `h2kAnonymizer.exe`, and find the anonymized files in the `output` folder. Done!

You can delete all other files except for the `.exe` file and the input folder. This method does not need them.

 > .exe file SHA256: 07e0b0387097fe16301a57f563efe552bf3c65487f74b3d72e63b258cc211496


## <a name="node"></a>Method 2: Use Node.js
With this method, you won't need the exe file and you can see/modify the code before running it. To that, first [install latest Node.js](https://nodejs.org)

Download or clone the repository, and place your input files, like Method 1. Simply double click on `index.js` or open the command prompt in the location of the files and run:

``` shell
    λ npm start
```

## <a name="build"></a>Method 3: Build EXE
Build the `.exe` file of method 1 yourself. You can see/modify the files like Method 2 before building.

Like previous method, first [install latest Node.js](https://nodejs.org)

Download or clone the repository like Method 1. Open the command prompt in the location of the files and run:

``` shell
    λ npm install
    λ npm run build
```

For windows machines, if `npm build` did not work, try:

``` shell
    λ npm run buildWindows
```

Proceed with the rest as per Method 1.

## License
Published under MIT license, you are free to use or modify it for anything. More info is available in the license file.