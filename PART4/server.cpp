#include <iostream>
#include <winsock2.h>
#include <ws2tcpip.h>
#include <stdio.h>
#include <unistd.h>
#include <string.h>
#include <thread>

using namespace std;

void handleClient(SOCKET clientSock) {
    // Receive and echo back the client's messages
    char buffer[4096];
    while (true) {
        int recvBytes = recv(clientSock, buffer, sizeof(buffer), 0);
        if (recvBytes == SOCKET_ERROR) {
            std::cerr << "Error receiving message" << std::endl;
            break;
        }
        else if (recvBytes == 0) {
            std::cout << "Client disconnected" << std::endl;
            break;
        }

        std::cout << "Received message: " << buffer << std::endl;

        // Echo the message back to the client
        if (send(clientSock, buffer, recvBytes, 0) == SOCKET_ERROR) {
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

    cout << "Server listening on port" << server_port << endl;


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