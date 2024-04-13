#include <iostream>
#include <winsock2.h>
#include <ws2tcpip.h>
#include <string.h>

int main() {
    // Initialize Winsock
    WSADATA wsaData;
    if (WSAStartup(MAKEWORD(2, 2), &wsaData) != 0) {
        std::cerr << "Error initializing Winsock" << std::endl;
        return 1;
    }

    // Create a socket
    SOCKET sock = socket(AF_INET, SOCK_STREAM, 0);
    if (sock == INVALID_SOCKET) {
        std::cerr << "Error creating socket" << std::endl;
        WSACleanup();
        return 1;
    }

    // Bind the socket to a specific address and port
    sockaddr_in serverAddr;
    serverAddr.sin_family = AF_INET;
    serverAddr.sin_port = htons(5555);
    serverAddr.sin_addr.s_addr = INADDR_ANY;

    if (bind(sock, (struct sockaddr*)&serverAddr, sizeof(serverAddr)) == SOCKET_ERROR) {
        std::cerr << "Error binding socket" << std::endl;
        closesocket(sock);
        WSACleanup();
        return 1;
    }

    // Listen for incoming connections
    if (listen(sock, 5) == SOCKET_ERROR) {
        std::cerr << "Error listening on socket" << std::endl;
        closesocket(sock);
        WSACleanup();
        return 1;
    }

    std::cout << "Server listening on port 5555..." << std::endl;

    // Accept incoming connections
    sockaddr_in clientAddr;
    int addrLen = sizeof(clientAddr);
    SOCKET clientSock = accept(sock, (struct sockaddr*)&clientAddr, &addrLen);
    if (clientSock == INVALID_SOCKET) {
        std::cerr << "Error accepting connection" << std::endl;
        closesocket(sock);
        WSACleanup();
        return 1;
    }

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
    closesocket(sock);
    WSACleanup();

    return 0;
}