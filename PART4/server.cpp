#include <iostream>
#include <cstring>
#include <sys/socket.h>
#include <netinet/in.h>
#include <unistd.h>
#include "functions.h"
#include <stdint.h>

#define PORT 5555

void* handleClient(void* arg) {
    // Receive and echo back the client's messages
    char in[4096];
    std::string out = "";
    // size in bits
    bool gotFirstParams = false;
    int bloomSize = 0;
    std::hash<std::string> hash;
    std::vector<bool> bloom; 
    std::vector<int> hashTimes;

    int client_sock = (uintptr_t)arg;

    bool justGotParams = false;

    while (true) {

        // // first line, bloom size, hashes
        memset(in, '\0', sizeof(in));
        out = "";

        int recvBytes = recv(client_sock, in, sizeof(in), 0);
        if (recvBytes < 0) {
            std::cerr << "Error receiving message" << std::endl;
            break;
        }
        else if (recvBytes == 0) {
            std::cout << "Client disconnected" << std::endl;
            break;
        }

        // checks if the input corresponds the first line format
        if (checkInputFormatFirstParams(in) && !gotFirstParams) {
            getFirstParams(in, bloomSize, hashTimes);
            // init bloom with bloomSize flases
            bloom.insert(bloom.end(), bloomSize, false);

            gotFirstParams = true;
            // used to skip the next loop, we don't want to both init and check
            justGotParams = true;

            out = "initialized bloomfilter";
        }

        // checks if the input corresponds the url format
        if (gotFirstParams && !justGotParams && checkIs1URLOr2URL(in)) {

            std::vector<std::string> input = splitString(in, ' ');

            if (input[0] == "1") { 
                // input[1] is our beloved URL
                addToBloom(hash, input[1], hashTimes, bloom);
                addToBlackList(input[1]);

                out = "added URL to bloomfilter"; 

            // must start with 2
            } else {
                
                bool check = checkInBloom(hash, input[1], hashTimes, bloom);
                out = (check ? "true" : "false"); 

                if (check) { 
                    out = out + " " + (checkIfInBlackList(input[1]) ? "true" : "false"); 
                }
            }

        } else if (!justGotParams) {

            if (!gotFirstParams) { out = "bloom filter is yet to be initialized"; }
            else if (out == "" && gotFirstParams) { out = "incorrect input format"; }
        }


        if (justGotParams) { justGotParams = false; }
        // Echo the message back to the client
        if (send(client_sock, out.c_str(), out.length(), 0) < 0) {
            std::cerr << "Error sending message" << std::endl;
            break;
        }
    }

    // Clean up
    close(client_sock);
    return nullptr;
}

int main() {
    int sock = socket(AF_INET, SOCK_STREAM, 0);
    if (sock < 0) {
        perror("error creating socket");
    }

    struct sockaddr_in sin;
    memset(&sin, 0, sizeof(sin));
    sin.sin_family = AF_INET;
    sin.sin_addr.s_addr = INADDR_ANY;
    sin.sin_port = htons(PORT);

    if (bind(sock, (struct sockaddr *)&sin, sizeof(sin)) < 0) {
        perror("error binding socket");
    }

    if (listen(sock, 5) < 0) {
        perror("error listening to a socket");
    }

    std::cout << "Server listening on port " << PORT << std::endl;

    // reset blacklist.txt
    remove("blacklist.txt");
    std::ofstream file("blacklist.txt", std::ios::app);
    file.close();

    std::cout << "initialized the blacklist" << std::endl;

    // Accept incoming connections and handle them in separate threads
    while (true) {
        struct sockaddr_in clientAddr;
        unsigned int addrLen = sizeof(clientAddr);
        int clientSock = accept(sock, (struct sockaddr*)&clientAddr, &addrLen);
        if (clientSock < 0) {
            std::cerr << "Error accepting connection" << std::endl;
            continue;
        }

        // std::thread t (handleClient, clientSock);
        pthread_t thread;
        pthread_attr_t a;
        pthread_attr_init(&a);
        pthread_create(&thread, &a, handleClient, (void*)(uintptr_t)clientSock);
        // t.detach();
    }

    close(sock);
    return 0;
}