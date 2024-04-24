#include <iostream>
#include <sys/socket.h>
#include <stdio.h>
#include <netinet/in.h>
#include <arpa/inet.h>
#include <unistd.h>
#include <string.h>

#define PORT 5555

int main() {
    const char* ip_address = "127.0.0.1";
    int sock = socket(AF_INET, SOCK_STREAM, 0);
    if (sock < 0) {
        perror("error creating socket");
        return -1;
    }

    struct sockaddr_in sin;
    memset(&sin, 0, sizeof(sin));
    sin.sin_family = AF_INET;
    sin.sin_addr.s_addr = inet_addr(ip_address);
    sin.sin_port = htons(PORT);

    if (connect(sock, (struct sockaddr *)&sin, sizeof(sin)) < 0) {
        perror("error connecting to server");
        // do we need to close the socket here?
        close(sock);
        return -1;
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
        if (send(sock, msg.c_str(), msg.length(), 0) < 0) {
            std::cout << "Error sending message" << std::endl;
            break;
        }

        // Receive the server's response
        char buffer[4096];
        // Fill the array with null characters
        memset(buffer, '\0', sizeof(buffer));
        
        int recvBytes = recv(sock, buffer, sizeof(buffer), 0);
        if (recvBytes < 0) {
            std::cerr << "Error receiving message" << std::endl;
            break;
        }
        else if (recvBytes == 0) {
            std::cout << "Server disconnected" << std::endl;
            break;
        }


        std::cout << "Server sent: " << buffer << std::endl;
    }

    close(sock);
    return 0;
}
