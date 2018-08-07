#!/usr/bin/env bash

REMOTE=178.128.202.14

cd ./apidocs

scp -r . root@$REMOTE:~/backup/binary-store/apidocs
