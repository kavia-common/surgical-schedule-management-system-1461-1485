#!/bin/bash
cd /home/kavia/workspace/code-generation/surgical-schedule-management-system-1461-1485/schedule_manager_frontend
npm run build
EXIT_CODE=$?
if [ $EXIT_CODE -ne 0 ]; then
   exit 1
fi

