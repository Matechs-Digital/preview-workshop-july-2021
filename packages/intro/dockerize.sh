#!/bin/sh
rm -rf yarn.lock
cp ../../yarn.lock yarn.lock
docker build -t $1 .