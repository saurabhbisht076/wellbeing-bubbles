#!/bin/bash

# Define weekend commit messages
messages=("Refactor UI" "Fix critical bug" "Add new feature" "Improve performance" "Update docs" "Enhance UX")

# Set start and end dates
start_date="2025-02-01"
end_date="2025-05-31"

# Initialize counter for messages
msg_index=0

# Loop over dates
current_date=$start_date
while [ "$current_date" != "$(date -I -d "$end_date + 1 day")" ]; do
    day_of_week=$(date -d "$current_date" +%u)  # 6 = Saturday, 7 = Sunday

    if [ "$day_of_week" -eq 6 ] || [ "$day_of_week" -eq 7 ]; then
        # Select message, cycle if needed
        msg="${messages[$msg_index]}"
        echo "Committing on $current_date with message: $msg"

        GIT_AUTHOR_DATE="${current_date}T12:00:00" GIT_COMMITTER_DATE="${current_date}T12:00:00" git commit --allow-empty -m "$msg"

        # Update message index
        msg_index=$(( (msg_index + 1) % ${#messages[@]} ))
    fi

    # Move to next day
    current_date=$(date -I -d "$current_date + 1 day")
done
