cmake_minimum_required(VERSION 3.14)
project(PART4)

set(CMAKE_CXX_STANDARD 11)
set(CMAKE_CXX_STANDARD_REQUIRED ON)

set (SOURCE_MAIN
    server.cpp
    functions.cpp
    functions.h
)

set (SOURCE_CLIENT
    client.cpp
)

include_directories(${CMAKE_CURRENT_SOURCE_DIR})

add_executable(server ${SOURCE_MAIN})
add_executable(client ${SOURCE_CLIENT})
