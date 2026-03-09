#!/bin/bash
# Run this script to add the GitHub remote and push
# Usage: ./add-remote.sh

cd "$(dirname "$0")"

# Remove any stale lock
rm -f .git/config.lock

# Add remote
git remote add origin https://github.com/raneemousa3/Yoink-.git 2>/dev/null || {
  echo "Remote 'origin' may already exist. Updating..."
  git remote set-url origin https://github.com/raneemousa3/Yoink-.git
}

# Push
git push -u origin main

echo "Done!"
