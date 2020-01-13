#!/bin/bash

set -e

# Clone base repository
rm -rf ./moodleapp-clone
git clone --depth=1 --branch=${1:-integration} https://github.com/moodlehq/moodleapp.git ./moodleapp-clone
rm -rf ./moodleapp-clone/.git

# Synchronize files
rsync -av ./moodleapp-clone/* ./
rm -rf ./moodleapp-clone

# Apply modifications
git checkout README.md
git apply customizations.diff
