Custom Moodle Mobile
====================

After cloning this repository, prepare the working directory calling the script at `/scripts/synchronize-files.sh`. This script will clone the [moodleapp](https://github.com/moodlehq/moodleapp) repository and merge it with the customizations. An optional first argument can be passed to specify which branch to synchronize with.

When the files are synchronized, development can be done in the same way that the base repository. But keep in mind that most files are ignored, and only the code within `/src/custom` is tracked in this repository.
