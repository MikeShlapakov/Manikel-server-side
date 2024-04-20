#include <iostream>
#include "functions.h"

int main () {

    // reset blacklist.txt
    remove("blacklist.txt");
    std::ofstream file("blacklist.txt", std::ios::app);
    file.close();

    // size in bits
    bool gotFirstParams = false;
    int bloomSize = 0;
    std::string in;
    std::hash<std::string> hash;
    std::vector<bool> bloom; 
    std::vector<int> hashTimes;
    
    while (true) {

        // first line, bloom size, hashes
        std::getline(std::cin, in);

        // checks if the input corresponds the first line format
        if (checkInputFormatFirstParams(in) && !gotFirstParams) {
            getFirstParams(in, bloomSize, hashTimes);
            // init bloom with bloomSize flases
            bloom.insert(bloom.end(), bloomSize, false);
            gotFirstParams = true;
        }
        
        // checks if the input corresponds the url format
        if (gotFirstParams && checkIs1URLOr2URL(in)) {
            std::vector<std::string> input = splitString(in, ' ');
            if (input[0] == "1") { 
                // input[1] is our beloved URL
                addToBloom(hash, input[1], hashTimes, bloom);
                addToBlackList(input[1]);

            // must start with 2
            } else {
                
                bool check = checkInBloom(hash, input[1], hashTimes, bloom);
                std::cout << (check ? "true" : "false"); 

                if (check) { 
                    std::cout << " " << (checkIfInBlackList(input[1]) ? "true" : "false");
                }
                std::cout << std::endl;
            }
        }
    }
}


