#include <iostream>
#include <winsock2.h>
#include <ws2tcpip.h>
#include <stdio.h>
#include <string.h>

using namespace std;

int main() {
    WSADATA wsaData;
    if (WSAStartup(MAKEWORD(2, 2), &wsaData) != 0) {
        perror("Error initializing Windows Sockets");
        return 1;
    }

    const char* ip_address = "127.0.0.1";
    const int port_no = 5555;

    SOCKET sock = WSASocket(AF_INET, SOCK_STREAM, 0, NULL, 0, 0);
    if (sock == INVALID_SOCKET) {
        perror("Error creating socket");
        WSACleanup();
        return 1;
    }

    // memset(&sin, 0, sizeof(sin));
    sockaddr_in serverAddr;
    serverAddr.sin_family = AF_INET;
    serverAddr.sin_port = htons(port_no);  // Replace with the server's port number
    serverAddr.sin_addr.s_addr = inet_addr(ip_address);  // Replace with the server's IP address

    if (connect(sock, (struct sockaddr*)&serverAddr, sizeof(serverAddr)) == SOCKET_ERROR) {
        perror("Error connecting to server");
        closesocket(sock);
        WSACleanup();
        return 1;
    }

    std::string msg;
    while (true) {
        std::cout << "Message to send: ";
        std::getline(std::cin, msg);

        if (msg == "quit") {
            break;
        }

        // std::cout << msg.c_str() << " " << msg.length();
        // Send the message
        if (send(sock, msg.c_str(), msg.length(), 0) == SOCKET_ERROR) {
            std::cout << "Error sending message" << std::endl;
            break;
        }

        // Receive the server's response
        char buffer[4096];
        int recvBytes = recv(sock, buffer, sizeof(buffer), 0);
        if (recvBytes == SOCKET_ERROR) {
            std::cerr << "Error receiving message" << std::endl;
            break;
        }

        // std::cout << "Server sent: " << buffer << std::endl;
    }

    closesocket(sock);
    WSACleanup();
    return 0;
}