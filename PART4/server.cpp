#include <iostream>
#include <winsock2.h>
#include <ws2tcpip.h>
#include <stdio.h>
#include <unistd.h>
#include <string.h>
#include <thread>
#include <iostream>
#include "functions.h"

using namespace std;

void handleClient(SOCKET clientSock) {
    // Receive and echo back the client's messages
    char in[4096];
    std::string out;
    // size in bits
    bool gotFirstParams = false;
    int bloomSize = 0;
    std::hash<std::string> hash;
    std::vector<bool> bloom; 
    std::vector<int> hashTimes;

    while (true) {

        // // first line, bloom size, hashes
        // std::getline(std::cin, in);
        memset(in, '\0', sizeof(in));

        int recvBytes = recv(clientSock, in, sizeof(in), 0);
        if (recvBytes == SOCKET_ERROR) {
            std::cerr << "Error receiving message" << std::endl;
            break;
        }
        else if (recvBytes == 0) {
            std::cout << "Client disconnected" << std::endl;
            break;
        }

        std::cout << "Received message: " << in << std::endl;

        // checks if the input corresponds the first line format
        if (checkInputFormatFirstParams(in) && !gotFirstParams) {
            getFirstParams(in, bloomSize, hashTimes);
            // init bloom with bloomSize flases
            bloom.insert(bloom.end(), bloomSize, false);
            gotFirstParams = true;

            out = "initialised bloomfilter"; 
        }
        
        // checks if the input corresponds the url format
        if (gotFirstParams && checkIs1URLOr2URL(in)) {
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
                std::cout << out << std::endl;
            }
        }
        // Echo the message back to the client
        if (send(clientSock, out.c_str(), out.length(), 0) == SOCKET_ERROR) {
            std::cerr << "Error sending message" << std::endl;
            break;
        }
    }

    // Clean up
    closesocket(clientSock);
}

int main(){

    WSADATA wsaData;
    if (WSAStartup(MAKEWORD(2, 2), &wsaData) != 0) {
        perror("Error initializing Windows Sockets");
        return 1;
    }

    const int server_port= 5555;

    // Create a socket
    SOCKET sock = socket(AF_INET, SOCK_STREAM, 0);
    if (sock == INVALID_SOCKET) {
        perror("Error creating socket");
        WSACleanup();
        return 1;
    }
    
    // Bind the socket to a specific address and port
    sockaddr_in serverAddr;
    serverAddr.sin_family = AF_INET;
    serverAddr.sin_port = htons(server_port);
    serverAddr.sin_addr.s_addr = INADDR_ANY;

    if (bind(sock, (struct sockaddr*)&serverAddr, sizeof(serverAddr)) == SOCKET_ERROR) {
        perror("Error binding socket");
        closesocket(sock);
        WSACleanup();
        return 1;
    }

    if (listen(sock, 5) == SOCKET_ERROR) {
        perror("Error listening to a socket");
        closesocket(sock);
        WSACleanup();
        return 1;
    }

    cout << "Server listening on port " << server_port << endl;

    // reset blacklist.txt
    remove("blacklist.txt");
    std::ofstream file("blacklist.txt", std::ios::app);
    file.close();

    cout << "initialised the blacklist" << endl;

    // Accept incoming connections and handle them in separate threads
    while (true) {
        sockaddr_in clientAddr;
        int addrLen = sizeof(clientAddr);
        SOCKET clientSock = accept(sock, (struct sockaddr*)&clientAddr, &addrLen);
        if (clientSock == INVALID_SOCKET) {
            std::cerr << "Error accepting connection" << std::endl;
            continue;
        }

        std::thread t(handleClient, clientSock);
        t.detach();
    }

    closesocket(sock);
    WSACleanup();
    return 0;
}