var fs = require('fs');
var path = require('path');
const child = require('child_process');

/** Folder name to search */
var folderSearch = '';

/** Folders name to skip */
const invalid = ['node_modules', '.git', '$', 'vendor', 'Library\metadata']


var walk = function (directoryName) {

    // Get directory files
    fs.readdir(directoryName, function (e, files) {

        // Print actual searching directory
        // console.log(directoryName);

        if (e) {
            // Maybe some read error
            // console.log('Error: ', e);
            return;
        }

        // Check all files readded
        files.forEach(function (file, i) {

            // Check if i have to skip this folder
            if (isInvalid(file)) {
                return
            }

            // fill path + directory/file
            var fullPath = path.join(directoryName, file);

            // Get directory/file info
            fs.stat(fullPath, function (e, f) {
                
                if (e) {
                    // Maybe some read error
                    // console.log('Error: ', e);
                    return;
                }

                // Check if element is a directory
                if (f.isDirectory()) {

                    //Check if directory is like the name to search
                    if(file.toLowerCase() == folderSearch){       
                        // Print directory path
                        console.log(fullPath);
                    }

                    // Continue searching
                    walk(fullPath);
                }
            });
        });
    });
};

/**
 * Check if folder is valid, used for exclude some folders like node_modules or temp_folders
 * @param {*} dir folder/directory
 */
function isInvalid(dir) {
    // Get invalid directory
    for (let i = 0; i < invalid.length; i++) {
        /** Get invalid directory v2  */
        const element = invalid[i];

        // Check if received directory is invalid
        if (dir.includes(element)) {
            return true;
        }
    }

    // All is ok
    return false;
}

/** Get important args after node buscar.js */
var args = process.argv.slice(2);

// Check if 1 arg was received
if (args.length != 1) {
    console.error('◘◘ Solo es permitido y requerido 1 parametro ◘◘\n---Ingrese el nombre de la carpeta a buscar---');
    return;
}

// Get argument on init as node file
folderSearch = args[0].toLowerCase();

// Init get drive
child.exec('wmic logicaldisk get name', (error, stdout) => {
    // Get system drives [Windows]
    const sys_drives = stdout.split('\r\r\n')
            .filter(value => /[A-Za-z]:/.test(value))
            .map(value => value.trim());

    // Show drives
    console.log('Drives: ', sys_drives);
    
    // Check by every drive
    sys_drives.forEach(async drive => {
        await walk(`${drive}\\`)
    });
});