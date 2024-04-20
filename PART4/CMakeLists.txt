cmake_minimum_required(VERSION 3.14)
project("Manikel")

set(CMAKE_CXX_STANDARD 14)
set(CMAKE_CXX_STANDARD_REQUIRED ON)

include(FetchContent)
FetchContent_Declare(
	    	googletest
	        URL https://github.com/google/googletest/archive/03597a01ee50ed33e9dfd640b249b4be3799d395.zip
		)

# set (gtest_force_shared_crt ON CACHE BOOL "" FORCE)
FetchContent_MakeAvailable(googletest)

enable_testing()

set (SOURCE_MAIN
		src/main.cpp # this is where the code we want to test
		src/functions.cpp # this is the main for tests
		src/functions.h # this is the main for tests
	)

# set (TEST_FILES
# 		tests/test_main.cpp # this is the main for tests
# 		tests/input_test.cpp # this file contain the tests
# 	)
	
set (SOURCE_FOR_TESTS
		src/functions.cpp # this is the main for tests
		src/functions.h # this is the main for tests
	)


add_executable(Main ${SOURCE_MAIN})
# add_executable(InputTests ${TEST_FILES}  ${SOURCE_FOR_TESTS})

# Link Google Test to the test executable
# target_link_libraries(InputTests PRIVATE gtest gtest_main)

# Include the source directory for tests
# target_include_directories(InputTests PRIVATE src)

# include(GoogleTest)
# gtest_discover_tests(InputTests)