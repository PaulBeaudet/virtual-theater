#!/bin/bash
. ./personal.sh # Load personal configuration

# Remove s3 bucket
# echo "Removing s3 bucket $BUCKET_NAME"
# aws s3 rm s3://$BUCKET_NAME/ --recursive
# aws s3 rb s3://$BUCKET_NAME

# Deactivate Cloud front distribution
# echo "Deactivating Cloud front distribution"
# Copy ETag from relevant distribution
# aws cloudfront get-distribution-config --id $DIST_ID > disableDist.json
# Before deleting a distribution it needs to be decativated with an update
# aws cloudfront update-distribution --id $DIST_ID --if-match $ETAG --distribution-config file://disableDist.json
# aws cloudfront wait distribution-deployed --id $DIST_ID
# echo "Disabled distribution"
# aws cloudfront get-distribution-config --id $DIST_ID
# Delete Distribution
# aws cloudfront delete-distribution --id $DIST_ID --if-match $ETAG

# Remove DNS record assosiated with static site
echo "Removing DNS record assosiated with static site"
# aws route53 list-resource-record-sets --hosted-zone-id $HOSTED_ZONE_ID
aws route53 change-resource-record-sets --hosted-zone-id $HOSTED_ZONE_ID --change-batch file://deleteDnsRecord.json