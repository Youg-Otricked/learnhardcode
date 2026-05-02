#!/bin/bash

# Define the array
options=("QuantumC" "learngit" "cppdsa/stl" "TS" "fortran" "rust" "web" "c" "cs" "go" "haskell" "zig")

# Get a random index based on the array length
random_index=$(( RANDOM % ${#options[@]} ))

# Output the result
echo "${options[$random_index]}"
