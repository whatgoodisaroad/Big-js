#! /bin/bash
calc "$1" | sed -e 's/^\t//'
