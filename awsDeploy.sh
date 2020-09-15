#!/bin/bash
. ./personal.sh # Load personal configuration

# Build 
npm run build

# Creat bucket and such
#aws s3 mb s3://$BUCKET_NAME
#aws s3 website s3://$BUCKET_NAME/ --index-document index.html --error-document page-data/404.html

# Sync to S3
echo "syncing website to $BUCKET_NAME"
aws s3 sync build/ s3://$BUCKET_NAME/ --delete --exclude "*.sh"
echo "done syncing"